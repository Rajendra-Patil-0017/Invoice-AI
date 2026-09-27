import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '../components/layout/Header';
import { WelcomeScreen } from '../components/welcome/WelcomeScreen';
import { AuthModal } from '../components/auth/AuthModal';
import { WorkspaceModeSelector } from '../components/workspace/WorkspaceModeSelector';
import { ChatPanel } from '../components/chat/ChatPanel';
import { InvoicePreview } from '../components/invoice/InvoicePreview';
import { DocumentAnalysisPanel } from '../components/analyze/DocumentAnalysisPanel';
import { AnalysisChatPanel } from '../components/analyze/AnalysisChatPanel';
import { ServiceCatalogModal } from '../components/catalog/ServiceCatalogModal';
import { EditCustomerModal } from '../components/invoice/EditCustomerModal';
import { INITIAL_MOCK_MESSAGES } from '../data/mockConversation';
import { INITIAL_MOCK_INVOICE } from '../data/mockServices';
import {
  loadServiceCatalog,
  findMatchingService,
  calculateInvoiceTotals,
} from '../utils/serviceCatalog';
import {
  SAMPLE_INVOICE_DOCUMENT,
  parseUploadedDocument,
  answerDocumentQuery,
} from '../utils/documentParser';
import { analyzeCustomerRequirements } from '../utils/geminiClient';
import { formatCurrency } from '../utils/formatCurrency';

const INITIAL_ANALYSIS_MESSAGES = [
  {
    id: 'amsg-1',
    sender: 'assistant',
    timestamp: '12:00 PM',
    text: "Welcome to **Document Analysis Mode**! 📄\n\nUpload an existing invoice or quotation (PDF or CSV) to inspect its line items, recalculate tax and grand totals, or ask questions like *'What is the total amount?'* or *'Summarize this document'*.",
    isSystem: true,
  },
];

export const HomePage = () => {
  // Top-level Navigation & View States
  const [viewState, setViewState] = useState('welcome'); // 'welcome' | 'workspace'
  const [workspaceMode, setWorkspaceMode] = useState('create'); // 'create' | 'analyze'
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Invoice Creator State
  const [messages, setMessages] = useState(INITIAL_MOCK_MESSAGES);
  const [invoice, setInvoice] = useState(INITIAL_MOCK_INVOICE);
  const [isProcessing, setIsProcessing] = useState(false);

  // Document Analysis State
  const [uploadedDocumentFile, setUploadedDocumentFile] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [analysisMessages, setAnalysisMessages] = useState(INITIAL_ANALYSIS_MESSAGES);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Catalog State
  const [catalog, setCatalog] = useState([]);
  const [isCatalogLoading, setIsCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState(null);
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);

  // Edit Customer Modal State
  const [isEditCustomerModalOpen, setIsEditCustomerModalOpen] = useState(false);

  // Load CSV service catalog on component mount
  const fetchCatalog = useCallback(async (force = false) => {
    setIsCatalogLoading(true);
    setCatalogError(null);
    try {
      const data = await loadServiceCatalog(force);
      setCatalog(data);
    } catch (err) {
      setCatalogError(err);
    } finally {
      setIsCatalogLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  // Handler: Start Demo from Welcome screen
  const handleStartDemo = () => {
    setViewState('workspace');
  };

  // Handler: Reset all Demo data to original state
  const handleResetDemo = () => {
    setMessages(INITIAL_MOCK_MESSAGES);
    setInvoice(INITIAL_MOCK_INVOICE);
    setUploadedDocumentFile(null);
    setAnalysisData(null);
    setAnalysisMessages(INITIAL_ANALYSIS_MESSAGES);
    setIsProcessing(false);
    setIsAnalyzing(false);
  };

  // Handler: Add a service from the catalog directly into active invoice
  const handleAddService = (service) => {
    if (!service) return;

    setInvoice((prev) => {
      const existingItems = prev.lineItems || [];
      const itemIndex = existingItems.findIndex(
        (item) => (item.serviceId || item.id) === service.serviceId
      );

      let updatedItems;
      if (itemIndex > -1) {
        updatedItems = existingItems.map((item, idx) =>
          idx === itemIndex ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        const newItem = {
          serviceId: service.serviceId,
          serviceName: service.serviceName,
          description: service.description,
          quantity: 1,
          unitPrice: service.unitPrice,
          currency: service.currency || 'INR',
          billingType: service.billingType || 'one-time',
          total: service.unitPrice,
          isCatalogMatch: true,
        };
        updatedItems = [...existingItems, newItem];
      }

      return {
        ...prev,
        currency: service.currency || prev.currency || 'INR',
        lineItems: updatedItems,
      };
    });
  };

  // Handler: Update quantity for line item
  const handleUpdateQuantity = (serviceId, newQuantity) => {
    const qty = Math.max(1, parseInt(newQuantity, 10) || 1);
    setInvoice((prev) => ({
      ...prev,
      lineItems: (prev.lineItems || []).map((item) =>
        (item.serviceId || item.id) === serviceId ? { ...item, quantity: qty } : item
      ),
    }));
  };

  // Handler: Remove line item
  const handleRemoveItem = (serviceId) => {
    setInvoice((prev) => ({
      ...prev,
      lineItems: (prev.lineItems || []).filter(
        (item) => (item.serviceId || item.id) !== serviceId
      ),
    }));
  };

  // Handler: Save customer details & invoice metadata
  const handleSaveCustomer = (updatedMetadata) => {
    setInvoice((prev) => ({
      ...prev,
      ...updatedMetadata,
      client: {
        ...prev.client,
        ...updatedMetadata.client,
      },
    }));
  };

  // Handler: Gemini AI extraction for invoice creation
  const handleSendMessage = async (inputText) => {
    if (!inputText || !inputText.trim() || isProcessing) return;

    const timestamp = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(new Date());

    const userMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      timestamp,
      text: inputText.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      const extractionResult = await analyzeCustomerRequirements(inputText);

      const customerData = extractionResult.customer || {};
      const requestedServices = extractionResult.requestedServices || [];
      const missingInfo = extractionResult.missingInformation || [];
      const assistantMsg = extractionResult.assistantMessage;

      const matchedLineItems = [];
      const unmatchedServices = [];

      requestedServices.forEach((req) => {
        const catalogMatch = findMatchingService(catalog, req.serviceName);

        if (catalogMatch) {
          const qty = Math.max(1, parseInt(req.quantity, 10) || 1);
          matchedLineItems.push({
            serviceId: catalogMatch.serviceId,
            serviceName: catalogMatch.serviceName,
            description: catalogMatch.description,
            quantity: qty,
            unitPrice: catalogMatch.unitPrice,
            currency: catalogMatch.currency || 'INR',
            billingType: catalogMatch.billingType || 'one-time',
            total: catalogMatch.unitPrice * qty,
            isCatalogMatch: true,
            notes: req.notes || null,
          });
        } else {
          unmatchedServices.push({
            serviceName: req.serviceName,
            quantity: req.quantity || 1,
            notes: req.notes || null,
          });
        }
      });

      let updatedLineItems;
      if (matchedLineItems.length > 0) {
        updatedLineItems = matchedLineItems;
      } else {
        updatedLineItems = invoice.lineItems;
      }

      const calculatedTotals = calculateInvoiceTotals(updatedLineItems);

      setInvoice((prev) => ({
        ...prev,
        client: {
          name: customerData.name || prev.client?.name || 'Rahul Sharma',
          company: customerData.company || prev.client?.company || 'ABC Technologies',
          email: customerData.email || prev.client?.email || 'contact@client.example.com',
          phone: customerData.phone || prev.client?.phone || '+91 98765 43210',
          address: customerData.address || prev.client?.address || 'India',
        },
        lineItems: updatedLineItems,
        currency: 'INR',
      }));

      const assistantReply = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        timestamp: new Intl.DateTimeFormat('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        }).format(new Date()),
        text: assistantMsg,
        extractedEntities: {
          clientName: customerData.name || invoice.client?.name || 'Identified',
          company: customerData.company || invoice.client?.company || 'Identified',
          servicesFound: matchedLineItems.length,
          estimatedTotal: formatCurrency(calculatedTotals.grandTotal, 'INR'),
          unmatchedServices: unmatchedServices.length > 0 ? unmatchedServices : null,
          missingInfo: missingInfo.length > 0 ? missingInfo : null,
        },
        isGeminiLive: true,
      };

      setMessages((prev) => [...prev, assistantReply]);
    } catch (err) {
      console.error('Error during AI requirement extraction:', err);
      const errorReply = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        timestamp: new Intl.DateTimeFormat('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        }).format(new Date()),
        text: `**Extraction Notice:** ${err.message || 'Failed to communicate with Google Gemini API.'}\n\nYou can retry the prompt or add services directly using the **Service Catalog** button.`,
        isError: true,
      };
      setMessages((prev) => [...prev, errorReply]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handler: Document File Selection for Analysis
  const handleDocumentFileSelected = async (file) => {
    if (!file) return;
    setIsAnalyzing(true);
    try {
      const data = await parseUploadedDocument(file);
      setUploadedDocumentFile(file);
      setAnalysisData(data);

      const summaryMsg = {
        id: `amsg-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).format(new Date()),
        text: `✅ **Successfully analyzed ${file.name}**\n\n- **Document Ref:** ${data.invoiceNumber}\n- **Billed To:** ${data.client?.name} (${data.client?.company})\n- **Extracted Line Items:** ${data.lineItems?.length || 0} services\n- **Grand Total:** ${formatCurrency(data.totals?.grandTotal || 0, data.currency || 'INR')}\n\nYou can ask questions below or click **Create Draft from Document** in the right panel to import it into the invoice creator.`,
        extractedEntities: {
          clientName: data.client?.name,
          company: data.client?.company,
          servicesFound: data.lineItems?.length || 0,
          estimatedTotal: formatCurrency(data.totals?.grandTotal || 0, data.currency || 'INR'),
        },
      };
      setAnalysisMessages((prev) => [...prev, summaryMsg]);
    } catch (err) {
      console.error('Error parsing document:', err);
      const errReply = {
        id: `amsg-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).format(new Date()),
        text: `⚠️ **Document Parsing Notice:** ${err.message || 'Failed to read document.'}\n\nPlease check the file format and try uploading a valid PDF or CSV invoice.`,
        isError: true,
      };
      setAnalysisMessages((prev) => [...prev, errReply]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handler: Remove uploaded document
  const handleRemoveDocumentFile = () => {
    setUploadedDocumentFile(null);
    setAnalysisData(null);
  };

  // Handler: Load sample invoice for Demo testing
  const handleLoadSampleInvoice = () => {
    const sampleFile = {
      name: SAMPLE_INVOICE_DOCUMENT.fileName,
      size: SAMPLE_INVOICE_DOCUMENT.fileSize,
    };
    setUploadedDocumentFile(sampleFile);
    setAnalysisData(SAMPLE_INVOICE_DOCUMENT);

    const sampleLoadedMsg = {
      id: `amsg-${Date.now()}`,
      sender: 'assistant',
      timestamp: new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).format(new Date()),
      text: `📂 **Sample Document Loaded:** \`${SAMPLE_INVOICE_DOCUMENT.fileName}\`\n\n- **Client:** ${SAMPLE_INVOICE_DOCUMENT.client.name} (${SAMPLE_INVOICE_DOCUMENT.client.company})\n- **Extracted Line Items:** ${SAMPLE_INVOICE_DOCUMENT.lineItems.length} services\n- **Grand Total:** ${formatCurrency(SAMPLE_INVOICE_DOCUMENT.totals.grandTotal, 'INR')}\n\nYou can ask questions below, test prompt suggestions, or click **Create Draft from Document** in the right panel.`,
      extractedEntities: {
        clientName: SAMPLE_INVOICE_DOCUMENT.client.name,
        company: SAMPLE_INVOICE_DOCUMENT.client.company,
        servicesFound: SAMPLE_INVOICE_DOCUMENT.lineItems.length,
        estimatedTotal: formatCurrency(SAMPLE_INVOICE_DOCUMENT.totals.grandTotal, 'INR'),
      },
    };
    setAnalysisMessages((prev) => [...prev, sampleLoadedMsg]);
  };

  // Handler: Send question about analyzed document
  const handleSendAnalysisMessage = (inputText) => {
    if (!inputText || !inputText.trim() || isAnalyzing) return;
    const timestamp = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).format(new Date());
    const userMsg = {
      id: `amsg-${Date.now()}`,
      sender: 'user',
      timestamp,
      text: inputText.trim(),
    };
    setAnalysisMessages((prev) => [...prev, userMsg]);

    setIsAnalyzing(true);
    setTimeout(() => {
      const answer = answerDocumentQuery(inputText, analysisData);
      const botReply = {
        id: `amsg-${Date.now() + 1}`,
        sender: 'assistant',
        timestamp: new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).format(new Date()),
        text: answer,
      };
      setAnalysisMessages((prev) => [...prev, botReply]);
      setIsAnalyzing(false);
    }, 400);
  };

  // Handler: Convert analyzed document into active Invoice Creator draft
  const handleConvertToDraft = () => {
    if (!analysisData) return;
    setInvoice({
      ...INITIAL_MOCK_INVOICE,
      docType: analysisData.docType || 'Official Quotation',
      invoiceNumber: analysisData.invoiceNumber ? `DRAFT-${analysisData.invoiceNumber}` : 'INV-2026-DRAFT',
      client: {
        ...INITIAL_MOCK_INVOICE.client,
        ...analysisData.client,
      },
      lineItems: analysisData.lineItems || [],
      currency: analysisData.currency || 'INR',
    });
    setWorkspaceMode('create');
  };

  // Handler: Custom Catalog CSV upload
  const handleCustomCatalogUpload = (csvFile) => {
    if (!csvFile) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = parseCSV(e.target.result);
        setCatalog(parsed);
      } catch (err) {
        console.error('CSV Catalog Import Error:', err);
        alert(`Invalid Service Catalog CSV: ${err.message}`);
      }
    };
    reader.readAsText(csvFile);
  };

  const selectedServiceIds = (invoice?.lineItems || []).map(
    (i) => i.serviceId || i.id
  );

  // If on Welcome Screen, render Welcome view
  if (viewState === 'welcome') {
    return (
      <>
        <WelcomeScreen
          onStartDemo={handleStartDemo}
          onOpenAuth={() => setIsAuthModalOpen(true)}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onContinueDemo={() => {
            setIsAuthModalOpen(false);
            setViewState('workspace');
          }}
        />
      </>
    );
  }

  // Workspace View
  return (
    <div className="min-h-screen flex flex-col bg-slate-100/60 font-sans text-slate-800">
      <Header
        onOpenCatalog={() => setIsCatalogModalOpen(true)}
        catalogCount={catalog.length}
        onResetDemo={handleResetDemo}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onGoHome={() => setViewState('welcome')}
        isDemoMode={true}
      />

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 lg:p-6 flex flex-col gap-3.5">
        {/* Workspace Mode Selector */}
        <WorkspaceModeSelector
          activeMode={workspaceMode}
          onSelectMode={(mode) => setWorkspaceMode(mode)}
        />

        {/* Two-Panel Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 flex-1 min-h-[640px] lg:h-[calc(100vh-185px)] lg:max-h-[960px] items-stretch">
          {workspaceMode === 'create' ? (
            /* Mode 1: Create Invoice / Quotation */
            <>
              {/* Left Panel: AI Chat Assistant */}
              <section className="lg:col-span-5 h-[600px] lg:h-full min-h-0 flex flex-col" aria-label="Chat Assistant">
                <ChatPanel
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  onSelectPrompt={(prompt) => handleSendMessage(prompt)}
                  onResetConversation={() => {
                    setMessages(INITIAL_MOCK_MESSAGES);
                    setInvoice(INITIAL_MOCK_INVOICE);
                  }}
                  isProcessing={isProcessing}
                />
              </section>

              {/* Right Panel: Live Invoice / Quotation Preview */}
              <section className="lg:col-span-7 h-[680px] lg:h-full min-h-0 flex flex-col" aria-label="Invoice Preview">
                <InvoicePreview
                  invoice={invoice}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveItem={handleRemoveItem}
                  onOpenCatalog={() => setIsCatalogModalOpen(true)}
                  onOpenEditCustomer={() => setIsEditCustomerModalOpen(true)}
                />
              </section>
            </>
          ) : (
            /* Mode 2: Analyze Existing Invoice */
            <>
              {/* Left Panel: Document Analysis Chatbot */}
              <section className="lg:col-span-5 h-[640px] lg:h-full min-h-0 flex flex-col" aria-label="Document Analysis Chat">
                <AnalysisChatPanel
                  messages={analysisMessages}
                  onSendMessage={handleSendAnalysisMessage}
                  onSelectPrompt={(prompt) => handleSendAnalysisMessage(prompt)}
                  onResetConversation={() => setAnalysisMessages(INITIAL_ANALYSIS_MESSAGES)}
                  isProcessing={isAnalyzing}
                  uploadedFile={uploadedDocumentFile}
                  onFileSelected={handleDocumentFileSelected}
                  onRemoveFile={handleRemoveDocumentFile}
                />
              </section>

              {/* Right Panel: Document Analysis & Inspection */}
              <section className="lg:col-span-7 h-[680px] lg:h-full min-h-0 flex flex-col" aria-label="Document Analysis Details">
                <DocumentAnalysisPanel
                  analysisData={analysisData}
                  uploadedFile={uploadedDocumentFile}
                  onLoadSampleInvoice={handleLoadSampleInvoice}
                  onConvertToDraft={handleConvertToDraft}
                />
              </section>
            </>
          )}
        </div>
      </main>

      {/* Service Catalog Modal */}
      <ServiceCatalogModal
        isOpen={isCatalogModalOpen}
        onClose={() => setIsCatalogModalOpen(false)}
        catalog={catalog}
        isLoading={isCatalogLoading}
        error={catalogError}
        selectedServiceIds={selectedServiceIds}
        onAddService={handleAddService}
        onReloadCatalog={() => fetchCatalog(true)}
        onUploadCustomCatalog={handleCustomCatalogUpload}
      />

      {/* Edit Customer Modal */}
      <EditCustomerModal
        isOpen={isEditCustomerModalOpen}
        onClose={() => setIsEditCustomerModalOpen(false)}
        invoice={invoice}
        onSave={handleSaveCustomer}
      />

      {/* Auth Coming Soon Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onContinueDemo={() => {
          setIsAuthModalOpen(false);
          setViewState('workspace');
        }}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-3 px-4 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            <strong>InvoiceLens AI</strong> — Built by Rajendra Patil for Kodnexus AI Build Battle
          </span>
          <span className="text-slate-400 text-[11px]">
            Demo Mode • Vector PDF Export • Print-Ready Documents • Document Analysis Engine
          </span>
        </div>
      </footer>
    </div>
  );
};
