import React from 'react';

export const StatusBadge = ({ status = 'Draft', variant = 'draft', className = '' }) => {
  const styles = {
    draft: 'bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-400/20',
    simulated: 'bg-blue-50 text-blue-700 border-blue-200 ring-1 ring-blue-400/20',
    verified: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-400/20',
    ready: 'bg-purple-50 text-purple-700 border-purple-200 ring-1 ring-purple-400/20',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const dots = {
    draft: 'bg-amber-500 animate-pulse',
    simulated: 'bg-blue-500',
    verified: 'bg-emerald-500',
    ready: 'bg-purple-500',
    neutral: 'bg-slate-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
        styles[variant] || styles.neutral
      } ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dots[variant] || dots.neutral}`} />
      {status}
    </span>
  );
};
