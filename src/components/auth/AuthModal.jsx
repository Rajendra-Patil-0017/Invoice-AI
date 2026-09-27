import React from 'react';
import { X, Lock, Sparkles, ShieldCheck, ArrowRight, UserCheck, Cloud } from 'lucide-react';
import { Button } from '../ui/Button';

export const AuthModal = ({ isOpen, onClose, onContinueDemo }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Sign In / Create Account</h3>
              <p className="text-xs text-slate-500">Account authentication & cloud sync</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="p-3.5 bg-blue-50/80 border border-blue-200/80 rounded-xl text-xs text-blue-900 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-blue-950 block mb-0.5">Authentication Coming Soon</span>
              <p className="text-blue-800 leading-relaxed">
                User accounts, cloud document persistence, and team permissions are planned for our next release.
              </p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-600">
            <div className="font-semibold text-slate-800 text-[11px] uppercase tracking-wider">
              Upcoming Account Features:
            </div>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Cloud className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                <span>Persistent cloud storage for generated invoices & quotations</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Custom team service catalogs and multi-user collaboration</span>
              </li>
              <li className="flex items-center gap-2">
                <UserCheck className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
                <span>Client address book and historical document search</span>
              </li>
            </ul>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                onClose();
                if (onContinueDemo) onContinueDemo();
              }}
              icon={ArrowRight}
              className="w-full justify-center font-semibold"
            >
              Explore in Live Demo Mode
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={onClose}
              className="w-full justify-center text-slate-600"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
