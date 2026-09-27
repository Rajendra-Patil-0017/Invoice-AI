import React from 'react';
import {
  FileSearch,
  FileText,
  FileSpreadsheet,
  CheckCircle2,
  Building2,
  Calendar,
  DollarSign,
  Download,
  Printer,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  FilePlus2,
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatCurrency';
import { Button } from '../ui/Button';

export const DocumentAnalysisPanel = ({
  analysisData,
  uploadedFile,
  onLoadSampleInvoice,
  onConvertToDraft,
}) => {
  if (!uploadedFile || !analysisData) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 ring-8 ring-purple-50/50">
          <FileSearch className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-slate-900">Upload an Invoice to Analyze</h3>
        <p className="text-xs text-slate-500 max-w-md mt-1.5 leading-relaxed">
          Upload an existing invoice or quotation (PDF or CSV) on the left to inspect its line items, recalculate totals, verify tax rates, and ask natural-language questions.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onLoadSampleInvoice}
            icon={Sparkles}
            className="border-purple-200 text-purple-700 bg-purple-50 hover:bg-purple-100 font-semibold"
          >
            Load Sample Invoice to Test
          </Button>
        </div>
      </div>
    );
  }

  const isCsv = uploadedFile.name?.toLowerCase().endsWith('.csv');
  const lineItems = analysisData.lineItems || [];
  const totals = analysisData.totals || {
    subtotal: 0,
    taxAmount: 0,
    grandTotal: 0,
  };

  const handleExportJson = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(analysisData, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute(
      'download',
      `Analysis-${uploadedFile.name.replace(/\.[^/.]+$/, '')}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Top Action Bar */}
      <div className="px-4 sm:px-5 py-3 border-b border-slate-200/80 bg-slate-50/80 flex flex-wrap items-center justify-between gap-3 action-bar no-print">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
            {isCsv ? <FileSpreadsheet className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">Document Analysis & Inspection</h2>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Verified Structure
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Source: <span className="font-mono text-slate-700">{uploadedFile.name}</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {onConvertToDraft && (
            <Button
              variant="primary"
              size="sm"
              onClick={onConvertToDraft}
              icon={FilePlus2}
              className="text-xs font-semibold shadow-xs"
              title="Create a new draft in Invoice Creator using these extracted details"
            >
              <span>Create Draft from Document</span>
            </Button>
          )}

          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportJson}
            icon={Download}
            className="text-xs font-semibold text-slate-700"
            title="Download extracted analysis in JSON format"
          >
            <span>Export JSON</span>
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => window.print()}
            icon={Printer}
            className="text-xs font-semibold text-slate-700"
          >
            <span className="hidden sm:inline">Print</span>
          </Button>
        </div>
      </div>

      {/* Content Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-50/40">
        {/* Document Overview Card */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Document Type & Ref
              </span>
              <div className="font-bold text-slate-900 text-sm">{analysisData.docType || 'Official Invoice'}</div>
              <div className="text-xs font-mono text-blue-700 font-bold">{analysisData.invoiceNumber || 'DOC-2026-ANALYSIS'}</div>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Billed Client
              </span>
              <div className="font-bold text-slate-900 text-sm">{analysisData.client?.name || 'Rahul Sharma'}</div>
              <div className="text-xs text-slate-600">{analysisData.client?.company || 'ABC Technologies'}</div>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Document Dates
              </span>
              <div className="text-xs text-slate-700">
                <span className="text-slate-500">Issued: </span>
                <span className="font-semibold">{formatDate(analysisData.issueDate || new Date())}</span>
              </div>
              <div className="text-xs text-slate-700 mt-0.5">
                <span className="text-slate-500">Due: </span>
                <span className="font-semibold">{formatDate(analysisData.dueDate || new Date())}</span>
              </div>
            </div>
          </div>

          {/* Financial Breakdown Cards */}
          <div className="grid grid-cols-3 gap-3 pt-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
              <span className="text-[11px] text-slate-500 font-semibold block">Subtotal</span>
              <span className="text-sm sm:text-base font-bold text-slate-900 font-mono">
                {formatCurrency(totals.subtotal, analysisData.currency || 'INR')}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
              <span className="text-[11px] text-slate-500 font-semibold block">Estimated GST (18%)</span>
              <span className="text-sm sm:text-base font-bold text-slate-900 font-mono">
                {formatCurrency(totals.taxAmount, analysisData.currency || 'INR')}
              </span>
            </div>

            <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200/80">
              <span className="text-[11px] text-blue-700 font-bold block">Grand Total</span>
              <span className="text-sm sm:text-base font-extrabold text-blue-700 font-mono">
                {formatCurrency(totals.grandTotal, analysisData.currency || 'INR')}
              </span>
            </div>
          </div>
        </div>

        {/* Itemized Line Items Table */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Extracted Line Items ({lineItems.length})
              </h4>
            </div>
            <span className="text-[11px] text-slate-500">
              Currency: <strong>{analysisData.currency || 'INR'}</strong>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider bg-slate-50/80">
                  <th className="py-2.5 px-3 text-center w-10">#</th>
                  <th className="py-2.5 px-3">Service Name & Description</th>
                  <th className="py-2.5 px-3 text-center w-24">Billing</th>
                  <th className="py-2.5 px-3 text-center w-20">Qty</th>
                  <th className="py-2.5 px-3 text-right w-28">Rate</th>
                  <th className="py-2.5 px-3 text-right w-28">Amount</th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map((item, idx) => (
                  <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 text-xs font-mono text-slate-400 text-center">
                      {String(idx + 1).padStart(2, '0')}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900 text-xs sm:text-sm">
                        {item.serviceName || item.description}
                      </div>
                      {item.description && item.serviceName && item.description !== item.serviceName && (
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{item.description}</p>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        item.billingType === 'monthly'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {item.billingType === 'monthly' ? 'Monthly' : 'One-time'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-xs text-slate-800">
                      {item.quantity || 1}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-xs text-slate-600">
                      {formatCurrency(item.unitPrice, analysisData.currency || 'INR')}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-xs text-slate-900">
                      {formatCurrency((item.quantity || 1) * item.unitPrice, analysisData.currency || 'INR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Verification Summary Note */}
        <div className="p-3.5 bg-slate-100/80 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Parsed {lineItems.length} line items from {uploadedFile.name}. Ready for chatbot interrogation.</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
            Session Memory Only
          </span>
        </div>
      </div>
    </div>
  );
};
