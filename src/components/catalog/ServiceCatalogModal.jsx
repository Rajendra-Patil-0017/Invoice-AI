import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Check,
  X,
  Database,
  Filter,
  Layers,
  Sparkles,
  Info,
  Tag,
  AlertTriangle,
  RotateCcw,
  UploadCloud,
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import { Button } from '../ui/Button';

export const ServiceCatalogModal = ({
  isOpen,
  onClose,
  catalog = [],
  isLoading = false,
  error = null,
  selectedServiceIds = [],
  onAddService,
  onReloadCatalog,
  onUploadCustomCatalog,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = ['All', ...new Set(catalog.map((s) => s.category).filter(Boolean))];
    return cats;
  }, [catalog]);

  // Filter services by category and search term
  const filteredServices = useMemo(() => {
    let list = catalog;

    if (selectedCategory !== 'All') {
      list = list.filter((s) => s.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.serviceName.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.serviceId.toLowerCase().includes(q) ||
          s.aliases.some((alias) => alias.includes(q))
      );
    }

    return list;
  }, [catalog, selectedCategory, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200/80 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Service Catalog & Price Master</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                  {catalog.length} Verified Services
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Synchronized with <code className="font-mono text-slate-600 bg-slate-200/70 px-1 py-0.5 rounded">public/data/services.csv</code>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="p-4 border-b border-slate-100 bg-white space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, alias (e.g. 'ecommerce', 'seo', 'stripe')..."
                className="w-full pl-9 pr-8 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-slate-50/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".csv,text/csv"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0] && onUploadCustomCatalog) {
                      onUploadCustomCatalog(e.target.files[0]);
                    }
                  }}
                />
                <span className="inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 select-none cursor-pointer bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm focus:ring-slate-300 rounded-lg text-xs px-2.5 py-1.5 gap-1.5 flex-shrink-0">
                  <UploadCloud className="w-3.5 h-3.5 text-blue-600" />
                  <span>Upload Catalog CSV</span>
                </span>
              </label>

              {/* Reload Catalog Button */}
              {onReloadCatalog && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onReloadCatalog}
                  icon={RotateCcw}
                  className="flex-shrink-0"
                  title="Reload default CSV catalog"
                >
                  Reload CSV
                </Button>
              )}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1 mr-1 flex-shrink-0">
              <Filter className="w-3 h-3" /> Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {isLoading && (
            <div className="py-16 text-center text-slate-500">
              <Database className="w-8 h-8 mx-auto text-blue-500 animate-bounce mb-2" />
              <p className="text-sm font-medium">Loading catalog data from services.csv...</p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold">Failed to Load Service Catalog:</strong>
                <p className="text-xs mt-1 text-rose-700">{error.message || error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onReloadCatalog}
                  className="mt-3 bg-white text-rose-700 border-rose-300 hover:bg-rose-50"
                >
                  Retry Loading
                </Button>
              </div>
            </div>
          )}

          {!isLoading && !error && filteredServices.length === 0 && (
            <div className="py-12 text-center text-slate-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-semibold text-slate-600">No matching services found</p>
              <p className="text-xs text-slate-400 mt-1">
                Try searching for keywords like "website", "design", "seo", or "maintenance".
              </p>
            </div>
          )}

          {!isLoading && !error && filteredServices.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredServices.map((service) => {
                const isSelected = selectedServiceIds.includes(service.serviceId);

                return (
                  <div
                    key={service.serviceId}
                    className={`rounded-xl border p-4 transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-300 bg-blue-50/40 ring-1 ring-blue-400/30'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    <div>
                      {/* Top Row: Category & Service ID */}
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[11px] font-semibold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-md">
                          {service.category}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 font-medium">
                          {service.serviceId}
                        </span>
                      </div>

                      {/* Service Name */}
                      <h4 className="font-bold text-slate-900 text-sm leading-snug">
                        {service.serviceName}
                      </h4>

                      {/* Description */}
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {service.description}
                      </p>

                      {/* Aliases Tags */}
                      {service.aliases && service.aliases.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2.5">
                          {service.aliases.slice(0, 3).map((alias, i) => (
                            <span
                              key={i}
                              className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded"
                            >
                              #{alias}
                            </span>
                          ))}
                          {service.aliases.length > 3 && (
                            <span className="text-[10px] text-slate-400">
                              +{service.aliases.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Bottom Row: Pricing & Add Button */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="text-base font-bold text-slate-900 font-mono">
                          {formatCurrency(service.unitPrice, service.currency)}
                        </div>
                        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          {service.billingType === 'monthly' ? 'per month (recurring)' : 'one-time service'}
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant={isSelected ? 'secondary' : 'primary'}
                        icon={isSelected ? Check : Plus}
                        onClick={() => onAddService(service)}
                        className={isSelected ? 'text-blue-700 border-blue-200 bg-blue-50' : ''}
                      >
                        {isSelected ? 'Add Another' : 'Add to Invoice'}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between text-xs text-slate-500">
          <span>
            Prices are retrieved deterministically from structured CSV.
          </span>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};
