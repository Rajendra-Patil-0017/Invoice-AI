import React from 'react';
import { Database, RotateCcw, Lock, Home, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

export const Header = ({
  onOpenCatalog,
  catalogCount = 0,
  onResetDemo,
  onOpenAuth,
  onGoHome,
  isDemoMode = true,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 shadow-xs backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15 sm:h-16">
          {/* Left: Official Brand Identity & Home Nav */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onGoHome}
              className="flex items-center space-x-3 text-left group cursor-pointer focus:outline-none"
              title="Return to Welcome Screen"
            >
              <img
                src="/invoicelens-logo.png"
                alt="InvoiceLens AI Logo"
                className="h-9 w-9 sm:h-10 sm:w-10 object-contain rounded-xl border border-slate-100 shadow-xs bg-white p-0.5 group-hover:scale-105 transition-transform"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight group-hover:text-blue-600 transition-colors">
                    InvoiceLens <span className="text-blue-600">AI</span>
                  </span>
                  {isDemoMode && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                      Demo Mode
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-medium hidden sm:block">
                  Smart Natural Language Invoice Assistant
                </p>
              </div>
            </button>
          </div>

          {/* Right: Actions, Catalog, Auth & Developer Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Home Screen Button */}
            {onGoHome && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onGoHome}
                icon={Home}
                className="hidden md:inline-flex text-xs font-semibold text-slate-600 hover:text-slate-900"
                title="Return to Welcome Screen"
              >
                Welcome
              </Button>
            )}

            {/* Reset Demo State Action */}
            {onResetDemo && (
              <Button
                variant="secondary"
                size="sm"
                onClick={onResetDemo}
                icon={RotateCcw}
                className="text-xs font-semibold text-slate-700 hover:text-blue-700 bg-slate-50 hover:bg-blue-50 border-slate-200"
                title="Reset sample data and conversation to initial demo state"
              >
                <span className="hidden sm:inline">Reset Demo</span>
              </Button>
            )}

            {/* Direct Service Catalog Button */}
            {onOpenCatalog && (
              <Button
                variant="secondary"
                size="sm"
                onClick={onOpenCatalog}
                icon={Database}
                className="hidden sm:inline-flex text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border-slate-200"
              >
                Catalog ({catalogCount})
              </Button>
            )}

            {/* Sign In / Account Entry (Coming Soon Modal) */}
            {onOpenAuth && (
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenAuth}
                icon={Lock}
                className="hidden sm:inline-flex text-xs font-semibold text-slate-700 border-slate-300 hover:bg-slate-50"
              >
                Sign In
              </Button>
            )}

            {/* Developer Avatar Badge */}
            <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 text-white font-semibold text-xs flex items-center justify-center ring-2 ring-slate-100 shadow-xs">
                RP
              </div>
              <div className="hidden lg:block text-left text-xs leading-tight">
                <div className="font-semibold text-slate-800">Rajendra Patil</div>
                <div className="text-[10px] text-slate-500">Kodnexus Build Battle</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
