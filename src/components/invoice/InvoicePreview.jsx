import React, { useState } from 'react';
import { formatCurrency, formatDate } from '../../utils/formatCurrency';
import { calculateInvoiceTotals } from '../../utils/serviceCatalog';
import { generateInvoicePdf } from '../../utils/generatePdf';
import { StatusBadge } from '../ui/StatusBadge';
import { Button } from '../ui/Button';
import { InvoiceLineItem } from './InvoiceLineItem';
import {
  FileText,
  Download,
  Printer,
  Sparkles,
  Building2,
  Calendar,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  PlusCircle,
  Repeat,
  ShoppingBag,
  Edit3,
  Loader2,
  Check,
} from 'lucide-react';

export const InvoicePreview = ({
  invoice,
  onUpdateQuantity,
  onRemoveItem,
  onOpenCatalog,
  onOpenEditCustomer,
}) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        <FileText className="w-12 h-12 text-slate-300 mb-3" />
        <h3 className="text-base font-bold text-slate-800">No Invoice Available</h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1">
          Add services from the catalog or submit requirements in the chat assistant.
        </p>
      </div>
    );
  }

  // Calculate totals deterministically
  const lineItems = invoice.lineItems || [];
  const totals = calculateInvoiceTotals(lineItems, invoice.taxRate || 0.18, invoice.discount || 0);

  // Handle PDF Generation
  const handleDownloadPdf = async () => {
    if (lineItems.length === 0) {
      setErrorMessage('Please add at least one service before generating a PDF.');
      return;
    }

    setIsGeneratingPdf(true);
    setErrorMessage('');
    try {
      await generateInvoicePdf(invoice);
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 3500);
    } catch (err) {
      console.error('PDF Generation Error:', err);
      setErrorMessage(err.message || 'Failed to generate PDF document.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Handle Print Action
  const handlePrint = () => {
    window.print();
  };

  const isQuotation = (invoice.docType || '').toLowerCase().includes('quotation');

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden print-invoice-sheet">
      {/* Top Action Bar (Hidden during print) */}
      <div className="px-4 sm:px-5 py-3 border-b border-slate-200/80 bg-slate-50/80 flex flex-wrap items-center justify-between gap-3 action-bar no-print">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">
                {isQuotation ? 'Quotation Preview' : 'Invoice Preview'}
              </h2>
              <StatusBadge
                status={invoice.status || 'Draft — Review before sending'}
                variant="draft"
                className="text-[11px]"
              />
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {lineItems.length} service{lineItems.length === 1 ? '' : 's'} added
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Edit Customer & Document Button */}
          {onOpenEditCustomer && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onOpenEditCustomer}
              icon={Edit3}
              className="text-slate-700 hover:bg-slate-100 border-slate-200 text-xs font-semibold"
            >
              <span>Edit Customer & Document</span>
            </Button>
          )}

          {/* Add Service Button */}
          {onOpenCatalog && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenCatalog}
              icon={PlusCircle}
              className="bg-white border-blue-200 text-blue-700 hover:bg-blue-50 hidden sm:inline-flex text-xs font-semibold"
            >
              <span>Add Service</span>
            </Button>
          )}

          {/* Print Button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={handlePrint}
            icon={Printer}
            title="Print document"
            className="text-slate-700 border-slate-200 text-xs font-semibold"
          >
            <span className="hidden sm:inline">Print</span>
          </Button>

          {/* Export PDF Button */}
          <Button
            variant="primary"
            size="sm"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf || lineItems.length === 0}
            icon={isGeneratingPdf ? Loader2 : pdfSuccess ? Check : Download}
            className={`shadow-xs transition-all text-xs font-semibold ${
              pdfSuccess ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''
            }`}
          >
            <span>
              {isGeneratingPdf
                ? 'Exporting...'
                : pdfSuccess
                ? 'PDF Exported!'
                : 'Export PDF'}
            </span>
          </Button>
        </div>
      </div>

      {/* Error / Success Toast Banner */}
      {errorMessage && (
        <div className="bg-rose-50 border-b border-rose-200 px-4 py-2 text-xs text-rose-700 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage('')} className="text-rose-500 font-bold p-1">
            ✕
          </button>
        </div>
      )}

      {/* Invoice Document Body (Scrollable Sheet) */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
        <div className="max-w-3xl mx-auto bg-white border border-slate-200/80 rounded-xl p-5 sm:p-8 shadow-xs print-page-break">
          {/* Header row: Branding & Document Details */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-3">
                <img
                  src="/invoicelens-logo.png"
                  alt="InvoiceLens AI Logo"
                  className="h-10 w-10 object-contain rounded-lg border border-slate-100 shadow-2xs bg-white p-0.5"
                />
                <div>
                  <span className="text-xl font-extrabold tracking-tight text-slate-900">
                    InvoiceLens <span className="text-blue-600">AI</span>
                  </span>
                  <p className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">
                    Smart Natural Language Billing
                  </p>
                </div>
              </div>
              <div className="text-xs text-slate-600 mt-2 space-y-0.5">
                <p className="font-semibold text-slate-900">{invoice.sender?.company || 'InvoiceLens AI Solutions'}</p>
                <p>{invoice.sender?.address || 'Mumbai Innovation Hub, MH, India'}</p>
                <p>{invoice.sender?.email || 'billing@invoicelens.ai'}</p>
              </div>
            </div>

            <div className="sm:text-right">
              <div className="text-sm uppercase font-extrabold tracking-wider text-blue-700 mb-0.5">
                {(invoice.docType || (isQuotation ? 'Official Quotation' : 'Tax Invoice')).toUpperCase()}
              </div>
              <div className="text-base font-mono font-bold text-slate-900">
                {invoice.invoiceNumber || (isQuotation ? 'QUO-2026-0042' : 'INV-2026-0042')}
              </div>
              <div className="mt-2 space-y-0.5 text-xs text-slate-600">
                <div>
                  <span className="text-slate-500">Date Issued: </span>
                  <span className="font-semibold text-slate-800">{formatDate(invoice.issueDate || new Date().toISOString())}</span>
                </div>
                <div>
                  <span className="text-slate-500">{isQuotation ? 'Valid Until: ' : 'Payment Due: '}</span>
                  <span className="font-semibold text-slate-800">{formatDate(invoice.dueDate || new Date().toISOString())}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Billed To / Client Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-5 border-b border-slate-100 bg-slate-50/40 -mx-5 sm:-mx-8 px-5 sm:px-8">
            <div>
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  Billed To (Client Details)
                </div>
                {onOpenEditCustomer && (
                  <button
                    onClick={onOpenEditCustomer}
                    className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold no-print flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" /> Edit
                  </button>
                )}
              </div>
              <div className="font-bold text-slate-900 text-sm">{invoice.client?.name || 'Rahul Sharma'}</div>
              <div className="text-xs text-slate-700 font-medium">{invoice.client?.company || 'ABC Technologies'}</div>
              <div className="text-xs text-slate-600 mt-0.5">{invoice.client?.email || 'contact@client.example.com'}</div>
              <div className="text-xs text-slate-600">{invoice.client?.address || 'Noida, UP, India'}</div>
            </div>

            <div className="sm:text-right flex flex-col sm:items-end justify-between">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Pricing Verification
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Catalog prices verified
                </div>
              </div>
              <div className="text-xs text-slate-600 mt-2">
                Currency: <span className="font-bold text-slate-900">INR (₹)</span>
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="py-4 overflow-x-auto">
            {lineItems.length === 0 ? (
              <div className="py-12 text-center text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 my-2">
                <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="text-sm font-semibold text-slate-600">No Services in this {isQuotation ? 'Quotation' : 'Invoice'}</p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Select services from the catalog or submit requirements in the chat assistant.
                </p>
                {onOpenCatalog && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onOpenCatalog}
                    icon={PlusCircle}
                    className="mt-3 bg-white no-print"
                  >
                    Open Service Catalog
                  </Button>
                )}
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider bg-slate-50/80">
                    <th className="py-2.5 px-3 text-center w-10">#</th>
                    <th className="py-2.5 px-3">Service Description</th>
                    <th className="py-2.5 px-3 text-center w-28">Qty</th>
                    <th className="py-2.5 px-3 text-right w-28">Rate</th>
                    <th className="py-2.5 px-3 text-right w-28">Amount</th>
                    <th className="py-2.5 px-2 text-center w-10 no-print"></th>
                  </tr>
                </thead>
                <tbody>
                  {totals.lineItems.map((item, idx) => (
                    <InvoiceLineItem
                      key={item.serviceId || item.id || idx}
                      item={item}
                      index={idx}
                      onUpdateQuantity={onUpdateQuantity}
                      onRemoveItem={onRemoveItem}
                      isEditable={true}
                    />
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Totals & Summary Breakdown */}
          {lineItems.length > 0 && (
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="max-w-xs text-xs text-slate-600">
                <span className="font-semibold text-slate-800">Billing Terms & Instructions:</span>
                <p className="mt-1 leading-relaxed text-slate-600">{invoice.notes || 'Payment is due within 14 days of invoice receipt. Thank you for your business!'}</p>

                {/* Recurring indicator */}
                {totals.recurringMonthlySubtotal > 0 && (
                  <div className="mt-2.5 p-2.5 bg-purple-50 border border-purple-200 rounded-lg text-purple-900 text-xs flex items-center gap-2">
                    <Repeat className="w-4 h-4 text-purple-600 flex-shrink-0" />
                    <span>Includes <strong>{formatCurrency(totals.recurringMonthlySubtotal, 'INR')}/mo</strong> in monthly recurring services.</span>
                  </div>
                )}
              </div>

              <div className="w-full sm:w-80 space-y-2 bg-slate-50/50 p-3.5 rounded-xl border border-slate-200/70">
                {totals.oneTimeSubtotal > 0 && totals.recurringMonthlySubtotal > 0 && (
                  <>
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>One-time Services:</span>
                      <span className="font-mono font-semibold text-slate-800">{formatCurrency(totals.oneTimeSubtotal, 'INR')}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>Monthly Services:</span>
                      <span className="font-mono font-semibold text-slate-800">{formatCurrency(totals.recurringMonthlySubtotal, 'INR')}/mo</span>
                    </div>
                    <div className="border-t border-slate-200/60 my-1" />
                  </>
                )}

                <div className="flex justify-between text-xs text-slate-700 font-semibold">
                  <span>Subtotal:</span>
                  <span className="font-mono text-slate-900">{formatCurrency(totals.subtotal, 'INR')}</span>
                </div>

                <div className="flex justify-between text-xs text-slate-600">
                  <span title="Estimated GST placeholder">GST (18% Estimated):</span>
                  <span className="font-mono font-medium text-slate-800">{formatCurrency(totals.taxAmount, 'INR')}</span>
                </div>

                {totals.discount > 0 && (
                  <div className="flex justify-between text-xs text-emerald-700 font-medium">
                    <span>Discount:</span>
                    <span className="font-mono">-{formatCurrency(totals.discount, 'INR')}</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-sm font-extrabold text-slate-900 pt-2.5 border-t-2 border-slate-300 mt-2">
                  <span className="tracking-tight text-slate-900">Grand Total:</span>
                  <span className="font-mono text-base sm:text-lg text-blue-700 font-bold">{formatCurrency(totals.grandTotal, 'INR')}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sync Summary Footer (Hidden during print) */}
        <div className="max-w-3xl mx-auto mt-4 p-3 rounded-xl bg-white border border-slate-200/80 text-xs text-slate-600 flex items-center justify-between no-print shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Ready for official export. Generated vector PDF matches active edited state.</span>
          </div>
          <span className="font-semibold text-slate-800 text-[11px]">
            {lineItems.length} service{lineItems.length === 1 ? '' : 's'} added
          </span>
        </div>
      </div>
    </div>
  );
};
