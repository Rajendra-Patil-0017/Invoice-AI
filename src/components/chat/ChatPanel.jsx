import React, { useRef, useEffect } from 'react';
import { Sparkles, MessageSquare, Lightbulb, RefreshCw, Zap } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { EXAMPLE_PROMPT_SUGGESTIONS } from '../../data/mockConversation';

export const ChatPanel = ({
  messages = [],
  onSendMessage,
  onSelectPrompt,
  onResetConversation,
  isProcessing = false,
}) => {
  const messagesEndRef = useRef(null);

  // Auto-scroll strictly to latest message when new messages arrive or processing changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages.length, isProcessing]);

  return (
    <div className="flex flex-col h-full min-h-0 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Panel Header (Fixed at top) */}
      <div className="flex-shrink-0 px-5 py-3.5 border-b border-slate-200/80 bg-slate-50/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Natural Language Assistant</h2>
            <p className="text-xs text-slate-500">Describe your customer’s requirements</p>
          </div>
        </div>

        <button
          onClick={onResetConversation}
          title="Reset conversation"
          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors text-xs flex items-center gap-1 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px] font-medium">Reset</span>
        </button>
      </div>

      {/* Compact AI Status Row */}
      <div className="flex-shrink-0 bg-slate-50/90 border-b border-slate-200/70 px-4 py-2 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-slate-700">AI connected</span>
          <span className="text-slate-400 hidden sm:inline">•</span>
          <span className="text-slate-500 text-[11px] hidden sm:inline">Google Gemini Flash extraction ready</span>
        </div>
        <span className="text-[10px] font-semibold text-slate-600 bg-slate-200/70 px-2 py-0.5 rounded-full">
          Gemini 2.0 Flash
        </span>
      </div>

      {/* Chat Messages Body (Independently scrollable) */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-4 overscroll-contain">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {isProcessing && (
          <div className="flex items-center gap-2.5 text-xs text-blue-800 bg-blue-50/80 border border-blue-200 p-3.5 rounded-xl shadow-2xs animate-pulse">
            <Sparkles className="w-4 h-4 text-blue-600 animate-spin flex-shrink-0" />
            <div className="flex flex-col">
              <span className="font-semibold">Extracting requirements with Google Gemini AI...</span>
              <span className="text-[11px] text-blue-600">Identifying customer details & mapping catalog prices</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} className="h-px" />
      </div>

      {/* Prompt Suggestions & Input (Anchored at bottom) */}
      <div className="flex-shrink-0 p-4 border-t border-slate-100 bg-slate-50/50 space-y-3">
        {/* Suggestion Chips */}
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 mb-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>Try natural-language prompts:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {EXAMPLE_PROMPT_SUGGESTIONS.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectPrompt(item.prompt)}
                disabled={isProcessing}
                className="text-left text-xs bg-white hover:bg-blue-50 disabled:opacity-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 rounded-lg px-2.5 py-1.5 transition-all shadow-2xs truncate max-w-full cursor-pointer"
              >
                <span className="font-medium">{item.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Text Input */}
        <ChatInput onSendMessage={onSendMessage} disabled={isProcessing} />
      </div>
    </div>
  );
};
