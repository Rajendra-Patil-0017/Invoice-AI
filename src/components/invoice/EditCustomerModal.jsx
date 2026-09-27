import React, { useState, useEffect } from 'react';
import { X, User, Building, Mail, Phone, MapPin, FileText, Calendar, Check, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';

export const EditCustomerModal = ({ isOpen, onClose, invoice, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    address: '',
    docType: 'Official Quotation',
    invoiceNumber: '',
    issueDate: '',
    dueDate: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (invoice) {
      setFormData({
        name: invoice.client?.name || '',
        company: invoice.client?.company || '',
        email: invoice.client?.email || '',
        phone: invoice.client?.phone || '',
        address: invoice.client?.address || '',
        docType: invoice.docType || 'Official Quotation',
        invoiceNumber: invoice.invoiceNumber || 'INV-2026-0042',
        issueDate: invoice.issueDate ? invoice.issueDate.split('T')[0] : new Date().toISOString().split('T')[0],
        dueDate: invoice.dueDate ? invoice.dueDate.split('T')[0] : new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        notes: invoice.notes || 'Payment is due within 14 days of invoice receipt. Thank you for your business!',
      });
      setErrors({});
    }
  }, [invoice, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Customer name is required';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!formData.invoiceNumber.trim()) {
      errs.invoiceNumber = 'Invoice number is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      docType: formData.docType,
      invoiceNumber: formData.invoiceNumber.trim(),
      issueDate: formData.issueDate,
      dueDate: formData.dueDate,
      notes: formData.notes,
      client: {
        ...invoice.client,
        name: formData.name.trim(),
        company: formData.company.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
      },
    });
    onClose();
  };

  const handleDocTypeChange = (newDocType) => {
    let updatedNumber = formData.invoiceNumber;
    const isNewQuotation = newDocType.toLowerCase().includes('quotation');
    if (isNewQuotation && updatedNumber.startsWith('INV-')) {
      updatedNumber = updatedNumber.replace('INV-', 'QUO-');
    } else if (!isNewQuotation && updatedNumber.startsWith('QUO-')) {
      updatedNumber = updatedNumber.replace('QUO-', 'INV-');
    }
    setFormData({
      ...formData,
      docType: newDocType,
      invoiceNumber: updatedNumber,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200/80 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Edit Customer & Document</h3>
              <p className="text-xs text-slate-500">Update recipient information and document terms</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Document Type & Invoice Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Document Type
              </label>
              <select
                value={formData.docType}
                onChange={(e) => handleDocTypeChange(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500 bg-slate-50/40 text-slate-800 font-medium"
              >
                <option value="Official Quotation">Official Quotation</option>
                <option value="Tax Invoice">Tax Invoice</option>
                <option value="Proforma Invoice">Proforma Invoice</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Document Number *
              </label>
              <input
                type="text"
                value={formData.invoiceNumber}
                onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500 bg-slate-50/40 font-mono text-slate-800"
              />
              {errors.invoiceNumber && (
                <span className="text-[11px] text-rose-600 mt-0.5 block">{errors.invoiceNumber}</span>
              )}
            </div>
          </div>

          {/* Customer Details Section */}
          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Customer Information
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Customer Name *
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500 bg-slate-50/40"
                  />
                </div>
                {errors.name && (
                  <span className="text-[11px] text-rose-600 mt-0.5 block">{errors.name}</span>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Company Name
                </label>
                <div className="relative">
                  <Building className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. ABC Technologies"
                    className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500 bg-slate-50/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. rahul@example.com"
                    className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500 bg-slate-50/40"
                  />
                </div>
                {errors.email && (
                  <span className="text-[11px] text-rose-600 mt-0.5 block">{errors.email}</span>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500 bg-slate-50/40"
                  />
                </div>
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Billing Address
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street, City, State, Country"
                  className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500 bg-slate-50/40 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Dates & Terms */}
          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Dates & Payment Terms
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Issue Date
                </label>
                <input
                  type="date"
                  value={formData.issueDate}
                  onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500 bg-slate-50/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Valid Until / Due Date
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500 bg-slate-50/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Notes & Terms
              </label>
              <textarea
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500 bg-slate-50/40 resize-none"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm" icon={Check}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
