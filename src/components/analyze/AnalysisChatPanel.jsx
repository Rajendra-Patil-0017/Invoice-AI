import React, { useRef, useEffect } from 'react';
import { Sparkles, MessageSquare, Lightbulb, RefreshCw, Zap, FileSearch } from 'lucide-react';
import { MessageBubble } from '../chat/MessageBubble';
import { ChatInput } from '../chat/ChatInput';
import { FileUploadZone } from '../upload/FileUploadZone';

export const ANALYSIS_PROMPT_SUGGESTIONS = [
  {
    id: 'ap1',
    title: 'Summarize this invoice',
    prompt: 'Please provide a clear summary of this invoice, including client details, services, and total cost.',
  },
  {
    id: 'ap2',
    title: 'What is the total amount?',
    prompt: 'What is the grand total amount payable for this invoice, and what is the subtotal before tax?',
  },
  {
    id: 'ap3',
    title: 'List services & rates',
    prompt: 'Itemize all the services listed in this document along with their unit rates and quantities.',
  },
  {
    id: 'ap4',
    title: 'How much tax is included?',
    prompt: 'How much tax/GST is applied to this invoice and what is the effective tax rate?',
  },
  {
    id: 'ap5',
    title: 'Extract customer details',
    prompt: 'Extract the full customer name, company, email, and billing address found in this document.',
  },
];

export const AnalysisChatPanel = ({
  messages = [],
  onSendMessage,
  onSelectPrompt,
  onResetConversation,
  isProcessing = false,
  uploadedFile = null,
  onFileSelected,
  onRemoveFile,
}) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages.length, isProcessing]);

  return (
    <div className="flex flex-col h-full min-h-0 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Panel Header */}
      <div className="flex-shrink-0 px-5 py-3.5 border-b border-slate-200/80 bg-slate-50/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
            <FileSearch className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Document Analysis Assistant</h2>
            <p className="text-xs text-slate-500">Ask questions about your uploaded invoice</p>
          </div>
        </div>

        <button
          onClick={onResetConversation}
          title="Reset analysis conversation"
          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors text-xs flex items-center gap-1 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px] font-medium">Reset</span>
        </button>
      </div>

      {/* AI Engine Status Row */}
      <div className="flex-shrink-0 bg-slate-50/90 border-b border-slate-200/70 px-4 py-2 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
          <span className="font-semibold text-slate-700">Document Inspector</span>
          <span className="text-slate-400 hidden sm:inline">•</span>
          <span className="text-slate-500 text-[11px] hidden sm:inline">PDF & CSV Document QA Ready</span>
        </div>
        <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
          AI Analysis Engine
        </span>
      </div>

      {/* File Upload Zone (Pinned below status row) */}
      <div className="flex-shrink-0 p-3.5 border-b border-slate-100 bg-slate-50/30">
        <FileUploadZone
          purpose="document"
          selectedFile={uploadedFile}
          onFileSelected={onFileSelected}
          onRemoveFile={onRemoveFile}
          isProcessing={isProcessing}
        />
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-4 overscroll-contain">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {isProcessing && (
          <div className="flex items-center gap-2.5 text-xs text-purple-800 bg-purple-50/80 border border-purple-200 p-3.5 rounded-xl shadow-2xs animate-pulse">
            <Sparkles className="w-4 h-4 text-purple-600 animate-spin flex-shrink-0" />
            <div className="flex flex-col">
              <span className="font-semibold">Analyzing document contents with AI...</span>
              <span className="text-[11px] text-purple-600">Extracting line items, tax breakdown, and customer metadata</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} className="h-px" />
      </div>

      {/* Suggestion Chips & Input */}
      <div className="flex-shrink-0 p-4 border-t border-slate-100 bg-slate-50/50 space-y-3">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 mb-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>Document analysis prompts:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {ANALYSIS_PROMPT_SUGGESTIONS.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectPrompt(item.prompt)}
                disabled={isProcessing || !uploadedFile}
                className="text-left text-xs bg-white hover:bg-purple-50 disabled:opacity-50 text-slate-700 hover:text-purple-700 border border-slate-200 hover:border-purple-300 rounded-lg px-2.5 py-1.5 transition-all shadow-2xs truncate max-w-full cursor-pointer"
              >
                <span className="font-medium">{item.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <ChatInput
          onSendMessage={onSendMessage}
          disabled={isProcessing || !uploadedFile}
          placeholder={
            uploadedFile
              ? "Ask a question about this invoice (e.g. 'Summarize total amount and tax rate')"
              : "Please upload an invoice above to ask questions"
          }
        />
      </div>
    </div>
  );
};
