import React from 'react';
import { Bot, User, Sparkles, AlertCircle, CheckCircle2, HelpCircle, AlertTriangle } from 'lucide-react';

export const MessageBubble = ({ message }) => {
  const isUser = message.sender === 'user';
  const isError = message.isError;

  // Helper to safely render simple bolding and newlines in text
  const renderFormattedText = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, idx) => {
      const parts = line.split(/(\*\*.*?\*\*|\*.*?\*)/g);
      return (
        <p key={idx} className={idx > 0 ? 'mt-2' : ''}>
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={pIdx} className={isError ? 'font-bold text-rose-900' : 'font-semibold text-slate-900'}>
                  {part.slice(2, -2)}
                </strong>
              );
            }
            if (part.startsWith('*') && part.endsWith('*')) {
              return (
                <span key={pIdx} className="italic text-slate-500 text-xs">
                  {part.slice(1, -1)}
                </span>
              );
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-4 group`}>
      {/* Avatar Icon */}
      {isUser ? (
        <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold shadow-xs bg-blue-600 text-white">
          <User className="w-4 h-4" />
        </div>
      ) : isError ? (
        <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold shadow-xs bg-rose-600 text-white">
          <AlertCircle className="w-4 h-4" />
        </div>
      ) : (
        <img
          src="/invoicelens-logo.png"
          alt="InvoiceLens AI Assistant"
          className="w-8 h-8 rounded-full object-contain bg-white border border-slate-200 shadow-xs flex-shrink-0 p-0.5"
        />
      )}

      {/* Bubble Content */}
      <div className={`max-w-[85%] sm:max-w-[80%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div className="flex items-center gap-2 mb-1 px-1">
          <span className="text-xs font-semibold text-slate-600">
            {isUser ? 'You (Sales/Consultant)' : 'InvoiceLens Assistant'}
          </span>
          <span className="text-[11px] text-slate-400">{message.timestamp}</span>
        </div>

        <div
          className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? 'bg-blue-600 text-white rounded-tr-xs shadow-xs'
              : isError
              ? 'bg-rose-50 border border-rose-200 text-rose-800 rounded-tl-xs shadow-xs'
              : 'bg-white border border-slate-200/90 text-slate-700 rounded-tl-xs shadow-xs'
          }`}
        >
          <div className={isUser ? 'text-white' : isError ? 'text-rose-900' : 'text-slate-800'}>
            {renderFormattedText(message.text)}
          </div>

          {/* Extracted requirement summary badge */}
          {message.extractedEntities && (
            <div className="mt-3 pt-3 border-t border-slate-100 bg-slate-50/90 -mx-3.5 -mb-3.5 p-3 rounded-b-2xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  Gemini Extraction Result
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Live AI Extraction
                </span>
              </div>

              {/* Grid Summary */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200/80">
                <div>
                  <span className="text-slate-400">Client: </span>
                  <span className="font-medium text-slate-900">
                    {message.extractedEntities.clientName || 'Not specified'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Company: </span>
                  <span className="font-medium text-slate-900">
                    {message.extractedEntities.company || 'Not specified'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Catalog Matched: </span>
                  <span className="font-semibold text-emerald-700">
                    {message.extractedEntities.servicesFound || 0} service(s)
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Est. Total: </span>
                  <span className="font-bold text-blue-700">
                    {message.extractedEntities.estimatedTotal || '₹0'}
                  </span>
                </div>
              </div>

              {/* Unmatched / Unknown Services Alert */}
              {message.extractedEntities.unmatchedServices && message.extractedEntities.unmatchedServices.length > 0 && (
                <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-[11px]">
                  <div className="font-semibold flex items-center gap-1 text-amber-800 mb-0.5">
                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                    Unmatched / Custom Services ({message.extractedEntities.unmatchedServices.length}):
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                    {message.extractedEntities.unmatchedServices.map((u, i) => (
                      <li key={i}>
                        <strong>{u.serviceName}</strong> (Qty: {u.quantity || 1}) — <em>No exact catalog rate; map manually via Catalog</em>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Missing Information Note */}
              {message.extractedEntities.missingInfo && message.extractedEntities.missingInfo.length > 0 && (
                <div className="text-[11px] text-slate-500 flex items-start gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Missing info:</strong> {message.extractedEntities.missingInfo.join(', ')}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
