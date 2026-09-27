/**
 * InvoiceLens AI — Service Catalog Data Access & Pricing Utilities
 * Handles CSV fetching, parsing, validation, and alias-based fuzzy lookup.
 */

let cachedCatalog = null;

/**
 * Parses CSV text safely, handling optional quoted values and trimming whitespace.
 * @param {string} csvText
 * @returns {Array<Object>}
 */
export const parseCSV = (csvText) => {
  if (!csvText || typeof csvText !== 'string') {
    throw new Error('Invalid or empty CSV content provided.');
  }

  const lines = csvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length < 2) {
    throw new Error('Service catalog CSV must contain a header and at least one record.');
  }

  // Parse header line
  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
  const requiredHeaders = ['service_id', 'service_name', 'category', 'description', 'unit_price', 'currency', 'billing_type'];

  for (const required of requiredHeaders) {
    if (!headers.includes(required)) {
      throw new Error(`Missing required CSV column: "${required}". Found: [${headers.join(', ')}]`);
    }
  }

  const services = [];
  const seenIds = new Set();

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i];
    
    // Split taking into account possible double quotes
    const regex = /(?:,|\n|^)("(?:(?:"")*[^"]*)*"|[^",\n]*|(?:\n|$))/g;
    const values = [];
    let match;
    while ((match = regex.exec(rawLine)) !== null) {
      if (match.index === regex.lastIndex) {
        regex.lastIndex++;
      }
      let val = match[1] || '';
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1).replace(/""/g, '"');
      }
      values.push(val.trim());
      if (regex.lastIndex >= rawLine.length) break;
    }

    if (values.length < headers.length) {
      // Fallback simple comma split if regex didn't extract full row
      const fallbackValues = rawLine.split(',').map((v) => v.trim());
      if (fallbackValues.length >= headers.length) {
        values.length = 0;
        values.push(...fallbackValues);
      }
    }

    const rowObj = {};
    headers.forEach((header, idx) => {
      rowObj[header] = values[idx] !== undefined ? values[idx] : '';
    });

    const serviceId = rowObj['service_id'];
    const serviceName = rowObj['service_name'];
    const rawPrice = rowObj['unit_price'];
    const parsedPrice = parseFloat(rawPrice);

    if (!serviceId) {
      throw new Error(`Row ${i + 1} is missing a service_id.`);
    }

    if (seenIds.has(serviceId)) {
      throw new Error(`Duplicate service_id detected: "${serviceId}" at row ${i + 1}.`);
    }
    seenIds.add(serviceId);

    if (!serviceName) {
      throw new Error(`Row ${i + 1} has an empty service_name.`);
    }

    if (isNaN(parsedPrice) || parsedPrice < 0) {
      throw new Error(`Invalid unit_price "${rawPrice}" for service "${serviceName}" at row ${i + 1}. Must be a non-negative number.`);
    }

    // Process aliases (separated by pipe |)
    const aliasesRaw = rowObj['aliases'] || '';
    const aliasesList = aliasesRaw
      .split('|')
      .map((a) => a.trim().toLowerCase())
      .filter(Boolean);

    services.push({
      serviceId: serviceId,
      serviceName: serviceName,
      category: rowObj['category'] || 'General',
      description: rowObj['description'] || '',
      unitPrice: parsedPrice,
      currency: (rowObj['currency'] || 'INR').toUpperCase(),
      billingType: (rowObj['billing_type'] || 'one-time').toLowerCase(),
      aliases: aliasesList,
    });
  }

  return services;
};

/**
 * Loads and caches the service catalog from public/data/services.csv
 * @param {boolean} forceReload
 * @returns {Promise<Array<Object>>}
 */
export const loadServiceCatalog = async (forceReload = false) => {
  if (cachedCatalog && !forceReload) {
    return cachedCatalog;
  }

  try {
    const response = await fetch('/data/services.csv');
    if (!response.ok) {
      throw new Error(`Failed to fetch services.csv: HTTP ${response.status} ${response.statusText}`);
    }
    const csvContent = await response.text();
    const catalog = parseCSV(csvContent);
    cachedCatalog = catalog;
    return catalog;
  } catch (error) {
    console.error('Error loading service catalog:', error);
    throw error;
  }
};

/**
 * Searches services by text across name, category, description, and aliases.
 * @param {Array<Object>} catalog
 * @param {string} query
 * @returns {Array<Object>}
 */
export const searchServices = (catalog = [], query = '') => {
  if (!query || !query.trim()) return catalog;

  const q = query.trim().toLowerCase();
  return catalog.filter((service) => {
    if (service.serviceName.toLowerCase().includes(q)) return true;
    if (service.category.toLowerCase().includes(q)) return true;
    if (service.description.toLowerCase().includes(q)) return true;
    if (service.serviceId.toLowerCase().includes(q)) return true;
    if (service.aliases.some((alias) => alias.includes(q))) return true;
    return false;
  });
};

/**
 * Retrieves a service by exact service ID.
 * @param {Array<Object>} catalog
 * @param {string} serviceId
 * @returns {Object|null}
 */
export const getServiceById = (catalog = [], serviceId = '') => {
  if (!serviceId) return null;
  return catalog.find((s) => s.serviceId.toLowerCase() === serviceId.toLowerCase()) || null;
};

/**
 * Matches a user / AI extracted query string to a catalog service.
 * Prioritizes exact name match -> alias match -> partial phrase match.
 * @param {Array<Object>} catalog
 * @param {string} query
 * @returns {Object|null}
 */
export const findMatchingService = (catalog = [], query = '') => {
  if (!query || !query.trim() || !catalog || catalog.length === 0) return null;

  const normalized = query.trim().toLowerCase();

  // 1. Exact Name match
  const exactMatch = catalog.find((s) => s.serviceName.toLowerCase() === normalized);
  if (exactMatch) return exactMatch;

  // 2. Exact Alias match
  const aliasMatch = catalog.find((s) => s.aliases.includes(normalized));
  if (aliasMatch) return aliasMatch;

  // 3. Service ID match
  const idMatch = catalog.find((s) => s.serviceId.toLowerCase() === normalized);
  if (idMatch) return idMatch;

  // 4. Word boundary / Substring match in alias or name
  const substringMatch = catalog.find((s) => {
    if (normalized.includes(s.serviceName.toLowerCase())) return true;
    if (s.aliases.some((alias) => normalized.includes(alias) || alias.includes(normalized))) return true;
    return false;
  });

  return substringMatch || null;
};

/**
 * Calculates deterministic line item total and subtotal.
 * Separates one-time vs recurring charges.
 * @param {Array<Object>} lineItems
 * @returns {Object}
 */
export const calculateInvoiceTotals = (lineItems = [], taxRate = 0.18, discount = 0) => {
  let subtotal = 0;
  let oneTimeSubtotal = 0;
  let recurringMonthlySubtotal = 0;

  const calculatedItems = lineItems.map((item) => {
    const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
    const unitPrice = typeof item.unitPrice === 'number' ? item.unitPrice : 0;
    const lineTotal = qty * unitPrice;

    subtotal += lineTotal;
    if (item.billingType === 'monthly') {
      recurringMonthlySubtotal += lineTotal;
    } else {
      oneTimeSubtotal += lineTotal;
    }

    return {
      ...item,
      quantity: qty,
      unitPrice,
      total: lineTotal,
    };
  });

  const taxAmount = Math.round(subtotal * taxRate);
  const grandTotal = Math.max(0, subtotal + taxAmount - discount);

  return {
    lineItems: calculatedItems,
    subtotal,
    oneTimeSubtotal,
    recurringMonthlySubtotal,
    taxRate,
    taxAmount,
    discount,
    grandTotal,
  };
};
