import React from 'react';
import {
  Sparkles,
  ArrowRight,
  FileText,
  FileSearch,
  Database,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Layers,
  Zap,
} from 'lucide-react';
import { Button } from '../ui/Button';

export const WelcomeScreen = ({ onStartDemo, onOpenAuth }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100/60 flex flex-col font-sans text-slate-800">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src="/invoicelens-logo.png"
              alt="InvoiceLens AI Logo"
              className="h-9 w-9 object-contain rounded-xl border border-slate-100 shadow-2xs bg-white p-0.5"
            />
            <div>
              <span className="font-extrabold text-slate-900 text-lg tracking-tight">
                InvoiceLens <span className="text-blue-600">AI</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={onOpenAuth}
              icon={Lock}
              className="text-xs font-semibold text-slate-700"
            >
              Sign In
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={onStartDemo}
              icon={ArrowRight}
              className="text-xs font-semibold shadow-xs"
            >
              Launch Demo
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16 flex flex-col items-center justify-center text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold mb-6 shadow-2xs">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
          </span>
          <span>Google Gemini Flash • Authoritative Catalog Pricing • Vector PDF</span>
        </div>

        {/* Heading & Subtitle */}
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight max-w-3xl leading-tight sm:leading-tight">
          Create and Analyze Invoices with <span className="text-blue-600">AI</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mt-4 leading-relaxed">
          Turn customer requirements into professional invoices and quotations, or upload existing documents to understand them faster.
        </p>

        {/* Primary Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-3xl mt-10 text-left">
          {/* Option 1: Try Demo (Primary) */}
          <div className="group relative bg-white border-2 border-blue-500 rounded-2xl p-6 sm:p-7 shadow-md hover:shadow-lg transition-all flex flex-col justify-between">
            <div className="absolute -top-3 left-6 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
              Recommended Entry
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                  No Account Required
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Try Demo
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                Explore InvoiceLens AI with preloaded sample business data. Test natural-language extraction, CSV catalog pricing, document editing, and PDF export instantly.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Live Hackathon Preview</span>
              <Button
                variant="primary"
                size="md"
                onClick={onStartDemo}
                icon={ArrowRight}
                className="font-bold text-xs"
              >
                Open Demo Workspace
              </Button>
            </div>
          </div>

          {/* Option 2: Sign In / Create Account (Secondary / Coming Soon) */}
          <div className="group bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700">
                  <Lock className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                  Coming Soon
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Sign In / Create Account
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                Persistent workspaces, client address books, cloud storage, and team service catalogs are in active development for the next major release.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">Cloud Sync & Teams</span>
              <Button
                variant="secondary"
                size="md"
                onClick={onOpenAuth}
                className="text-xs font-semibold text-slate-700 border-slate-200"
              >
                View Account Details
              </Button>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl mt-12 text-left">
          <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-2.5">
              <Zap className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">Natural Language Chat</h4>
            <p className="text-[11px] text-slate-500 mt-1">Describe client requests in plain English for instant entity extraction.</p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2.5">
              <Database className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">Authoritative Catalog</h4>
            <p className="text-[11px] text-slate-500 mt-1">Exact rate matching with CSV service catalogs and custom catalog uploads.</p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-2.5">
              <FileSearch className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">Document Analysis</h4>
            <p className="text-[11px] text-slate-500 mt-1">Upload existing invoices (PDF/CSV) to summarize line items and ask questions.</p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2.5">
              <Printer className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">Vector PDF Export</h4>
            <p className="text-[11px] text-slate-500 mt-1">Print-ready, pixel-perfect quotation and invoice documents with one click.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            <strong>InvoiceLens AI</strong> — Built by Rajendra Patil for Kodnexus AI Build Battle
          </span>
          <span className="text-slate-400 text-[11px]">
            Demo Mode • Deterministic Pricing • PDF Export • Gemini 2.0 Flash
          </span>
        </div>
      </footer>
    </div>
  );
};
