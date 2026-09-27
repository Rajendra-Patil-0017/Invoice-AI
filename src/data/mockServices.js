/**
 * Initial invoice structure and default state synchronized with public/data/services.csv
 */
export const INITIAL_MOCK_INVOICE = {
  docType: 'Official Quotation',
  invoiceNumber: 'QUO-2026-0042',
  issueDate: '2026-09-27',
  dueDate: '2026-10-11',
  status: 'Draft — Review before sending',
  currency: 'INR',
  client: {
    name: 'Rahul Sharma',
    company: 'ABC Technologies',
    email: 'rahul.sharma@abctech.example.com',
    phone: '+91 98765 43210',
    address: 'Tech Park Avenue, Sector 62, Noida, India',
  },
  sender: {
    name: 'Rajendra Patil',
    company: 'InvoiceLens AI Solutions',
    email: 'billing@invoicelens.ai',
    address: 'Mumbai Innovation Hub, MH, India',
  },
  lineItems: [
    {
      serviceId: 'WEB001',
      serviceName: 'Business Website',
      description: 'Custom responsive 5-page business website with React & modern styling',
      quantity: 1,
      unitPrice: 25000,
      currency: 'INR',
      billingType: 'one-time',
      total: 25000,
      isCatalogMatch: true,
    },
    {
      serviceId: 'SEO001',
      serviceName: 'SEO Optimization',
      description: 'Technical on-page SEO keyword research and Core Web Vitals optimization',
      quantity: 1,
      unitPrice: 8000,
      currency: 'INR',
      billingType: 'monthly',
      total: 8000,
      isCatalogMatch: true,
    },
    {
      serviceId: 'MAINT001',
      serviceName: 'Website Maintenance',
      description: 'Monthly security updates continuous uptime monitoring and bug fixes',
      quantity: 1,
      unitPrice: 3500,
      currency: 'INR',
      billingType: 'monthly',
      total: 3500,
      isCatalogMatch: true,
    },
  ],
  taxRate: 0.18, // 18% GST estimate placeholder
  discount: 0.0,
  notes: 'Payment is due within 14 days of invoice receipt. Thank you for your business!',
};
