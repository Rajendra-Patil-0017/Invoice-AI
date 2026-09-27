import React from 'react';
import { formatCurrency } from '../../utils/formatCurrency';
import { CheckCircle2, Plus, Minus, Trash2, Repeat } from 'lucide-react';

export const InvoiceLineItem = ({
  item,
  index,
  onUpdateQuantity,
  onRemoveItem,
  isEditable = true,
}) => {
  const isMonthly = item.billingType === 'monthly';

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors group">
      {/* Index */}
      <td className="py-3.5 px-3 text-xs font-mono text-slate-400 text-center w-10">
        {String(index + 1).padStart(2, '0')}
      </td>

      {/* Description & Metadata */}
      <td className="py-3.5 px-3">
        <div className="font-semibold text-slate-900 text-sm leading-snug">
          {item.serviceName || item.description}
        </div>
        
        {item.description && item.serviceName && item.description !== item.serviceName && (
          <p className="text-xs text-slate-600 mt-1 leading-relaxed break-words">{item.description}</p>
        )}

        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
          {item.isCatalogMatch && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
              Catalog prices verified
            </span>
          )}

          {isMonthly ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-purple-800 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
              <Repeat className="w-2.5 h-2.5 text-purple-600" />
              Monthly Recurring
            </span>
          ) : (
            <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
              One-time
            </span>
          )}
        </div>
      </td>

      {/* Quantity & Controls */}
      <td className="py-3.5 px-3 text-center w-28">
        {isEditable ? (
          <div className="inline-flex items-center border border-slate-200 rounded-lg bg-white shadow-2xs">
            <button
              onClick={() => onUpdateQuantity(item.serviceId || item.id, Math.max(1, item.quantity - 1))}
              disabled={item.quantity <= 1}
              className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
              title="Decrease quantity"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-7 text-xs font-bold text-slate-800 font-mono text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.serviceId || item.id, item.quantity + 1)}
              className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
              title="Increase quantity"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <span className="text-sm font-semibold text-slate-800 font-mono">{item.quantity}</span>
        )}
      </td>

      {/* Unit Rate */}
      <td className="py-3.5 px-3 text-right text-xs sm:text-sm text-slate-600 font-mono w-28">
        {formatCurrency(item.unitPrice, item.currency || 'INR')}
        {isMonthly && <span className="text-[10px] text-slate-400 block sm:inline"> /mo</span>}
      </td>

      {/* Total Amount */}
      <td className="py-3.5 px-3 text-right text-xs sm:text-sm font-bold text-slate-900 font-mono w-28">
        {formatCurrency(item.total || item.quantity * item.unitPrice, item.currency || 'INR')}
      </td>

      {/* Remove Action */}
      {isEditable && onRemoveItem && (
        <td className="py-3.5 px-2 text-center w-10">
          <button
            onClick={() => onRemoveItem(item.serviceId || item.id)}
            className="p-1 text-slate-300 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors cursor-pointer"
            title="Remove line item"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </td>
      )}
    </tr>
  );
};
