import React from 'react';
import { Sparkles, FileSearch } from 'lucide-react';

export const WorkspaceModeSelector = ({ activeMode = 'create', onSelectMode }) => {
  return (
    <div className="flex items-center justify-between bg-white border border-slate-200/80 rounded-xl p-1.5 shadow-2xs no-print">
      <div className="flex items-center gap-1.5 w-full sm:w-auto">
        <button
          onClick={() => onSelectMode('create')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeMode === 'create'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          aria-label="Create Invoice / Quotation mode"
        >
          <Sparkles className={`w-3.5 h-3.5 ${activeMode === 'create' ? 'text-white' : 'text-blue-600'}`} />
          <span>Create Invoice / Quotation</span>
        </button>

        <button
          onClick={() => onSelectMode('analyze')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeMode === 'analyze'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          aria-label="Analyze Existing Invoice mode"
        >
          <FileSearch className={`w-3.5 h-3.5 ${activeMode === 'analyze' ? 'text-white' : 'text-purple-600'}`} />
          <span>Analyze Existing Invoice</span>
        </button>
      </div>

      <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 pr-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        <span className="text-[11px] font-medium">
          {activeMode === 'create'
            ? 'Chat requirements & itemize pricing'
            : 'Inspect & query uploaded PDF / CSV invoices'}
        </span>
      </div>
    </div>
  );
};
