/**
 * Formats a numeric value into currency string (INR by default, with USD/other options).
 * Uses Indian number formatting for INR (e.g. ₹25,000.00).
 * @param {number} amount
 * @param {string} currency
 * @returns {string}
 */
export const formatCurrency = (amount = 0, currency = 'INR') => {
  const curr = (currency || 'INR').toUpperCase();
  const locale = curr === 'INR' ? 'en-IN' : 'en-US';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: curr,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount || 0);
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};
