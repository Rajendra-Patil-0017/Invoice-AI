import React, { useState } from 'react';
import { Send, CornerDownLeft } from 'lucide-react';
import { Button } from '../ui/Button';

export const ChatInput = ({ onSendMessage, disabled = false, placeholder = "Describe the services your customer needs… (e.g. Rahul Sharma from ABC Tech needs a website and SEO)" }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!text.trim() || disabled) return;
    onSendMessage(text.trim());
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative rounded-xl border border-slate-300 bg-white shadow-xs transition-all duration-150 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
        <textarea
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          className="w-full resize-none bg-transparent px-3.5 pt-3 pb-11 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none disabled:opacity-50"
          aria-label="Customer requirements input"
        />

        <div className="absolute bottom-2 left-3 right-2 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 hidden sm:inline-flex items-center gap-1">
            Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-mono text-slate-500">Enter ↵</kbd> to submit
          </span>

          <Button
            type="submit"
            size="sm"
            disabled={!text.trim() || disabled}
            icon={Send}
            className="ml-auto shadow-xs"
          >
            <span>Analyze & Extract</span>
          </Button>
        </div>
      </div>
    </form>
  );
};
