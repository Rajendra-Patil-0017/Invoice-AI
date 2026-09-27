import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

// Load environment variables for local/serverless environments
dotenv.config({ path: '.env.local' });
dotenv.config();

/**
 * System instruction defining strict entity extraction rules for InvoiceLens AI.
 */
const SYSTEM_INSTRUCTION = `You are InvoiceLens AI's structured entity extraction engine for a digital services agency.
Your sole responsibility is to parse incoming natural-language customer quotation and invoice requirements into clean, validated JSON.

AGENCY SERVICE CATALOG DOMAINS:
- Website Development (Business Website, E-Commerce Platform, Web Application MVP, Payment Gateway Integration)
- UI/UX Design & Prototyping (UI/UX Design Package, Wireframes)
- Branding (Brand Identity & Logo, Visual Identity)
- Digital Marketing & SEO (SEO Optimization, Social Media Marketing, Google Ads Campaign)
- Maintenance & Support (Website Maintenance, Cloud & Hosting Support)
- Content Services (Content Writing & Copywriting, Monthly Blog & Article Pack)

STRICT RULES:
1. CUSTOMER DETAILS: Extract customer name, company, email, phone, and address ONLY when explicitly provided or clearly stated in the message. Never invent, guess, or hallucinate contact details. Use null for unknown or unprovided fields.
2. REQUESTED SERVICES: Identify each requested service. Extract:
   - "serviceName": Standardized name of the requested service (e.g. "Business Website", "SEO Optimization", "Website Maintenance", "UI/UX Design Package", "Payment Gateway Integration", "Google Ads Campaign", etc.)
   - "quantity": Positive integer. If a number/duration is specified (e.g. "2 months of maintenance", "3 websites"), extract that integer. If unspecified but one unit is implied, use 1.
   - "notes": Any specific scope, constraints, or duration mentioned, or null.
3. NEVER INVENT PRICES: Do NOT provide, calculate, or hallucinate service prices, totals, or tax. The pricing engine calculates prices using a verified catalog.
4. MISSING INFORMATION: List any critical missing client information (e.g. "Client email not provided", "Scope duration needed") as short string items in "missingInformation".
5. ASSISTANT MESSAGE: Provide a brief, polite, professional 1-2 sentence response confirming the identified customer details and requested service line items.
6. OUTPUT FORMAT: You MUST return strictly valid JSON conforming to the schema below. No markdown backticks or commentary outside JSON.

JSON Schema:
{
  "customer": {
    "name": string | null,
    "company": string | null,
    "email": string | null,
    "phone": string | null,
    "address": string | null
  },
  "requestedServices": [
    {
      "serviceName": string,
      "quantity": number,
      "notes": string | null
    }
  ],
  "missingInformation": string[],
  "assistantMessage": string
}`;

// Candidate models in priority order for maximum resilience
const CANDIDATE_MODELS = [
  process.env.GEMINI_MODEL,
  'gemini-flash-lite-latest',
  'gemini-flash-latest',
  'gemini-3.5-flash-lite',
  'gemini-3.5-flash',
].filter(Boolean);

/**
 * Serverless / API Route Handler for POST /api/analyze
 */
export default async function handler(req, res) {
  // 1. Enforce POST method
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({
      success: false,
      error: `Method ${req.method} Not Allowed. Please send a POST request.`,
    });
  }

  // 2. Validate API Key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_gemini_api_key_here')) {
    console.error('API Error: GEMINI_API_KEY is not configured.');
    return res.status(500).json({
      success: false,
      error: 'GEMINI_API_KEY is missing or invalid on the server. Please check .env.local configuration.',
    });
  }

  // 3. Parse and validate request body
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({
        success: false,
        error: 'Invalid JSON request payload.',
      });
    }
  }

  const message = body?.message;
  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({
      success: false,
      error: 'A non-empty customer message string is required.',
    });
  }

  // 4. Enforce reasonable message length
  const trimmedMessage = message.trim();
  if (trimmedMessage.length > 3000) {
    return res.status(400).json({
      success: false,
      error: 'Message exceeds maximum supported length of 3000 characters.',
    });
  }

  // 5. Call Google Gemini API with automatic model failover
  const ai = new GoogleGenAI({ apiKey });
  const promptText = `${SYSTEM_INSTRUCTION}\n\nUser Input to extract:\n"""\n${trimmedMessage}\n"""`;

  let lastError = null;
  let rawText = '';
  let modelUsed = '';

  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: promptText,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.1, // Low temperature for deterministic entity extraction
        },
      });

      rawText = response.text || '{}';
      modelUsed = model;
      break;
    } catch (err) {
      console.warn(`Model ${model} attempt failed:`, err.message);
      lastError = err;
    }
  }

  if (!rawText) {
    console.error('All candidate Gemini models failed:', lastError);
    const status = lastError?.status === 429 ? 429 : 500;
    return res.status(status).json({
      success: false,
      error: status === 429
        ? 'Gemini API rate limit exceeded. Please wait a moment and try again.'
        : `AI processing failed: ${lastError?.message || 'Unable to connect to Google GenAI'}`,
    });
  }

  // 6. Parse and validate JSON structure
  let parsedData;
  try {
    const cleanJson = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    parsedData = JSON.parse(cleanJson);
  } catch (parseError) {
    console.error('Model JSON Parse Error:', parseError, 'Raw response:', rawText);
    return res.status(502).json({
      success: false,
      error: 'AI model returned an unparseable response structure.',
    });
  }

  // 7. Validate & Normalize Extracted Schema
  const validatedData = {
    customer: {
      name: typeof parsedData.customer?.name === 'string' && parsedData.customer.name.trim() ? parsedData.customer.name.trim() : null,
      company: typeof parsedData.customer?.company === 'string' && parsedData.customer.company.trim() ? parsedData.customer.company.trim() : null,
      email: typeof parsedData.customer?.email === 'string' && parsedData.customer.email.trim() ? parsedData.customer.email.trim() : null,
      phone: typeof parsedData.customer?.phone === 'string' && parsedData.customer.phone.trim() ? parsedData.customer.phone.trim() : null,
      address: typeof parsedData.customer?.address === 'string' && parsedData.customer.address.trim() ? parsedData.customer.address.trim() : null,
    },
    requestedServices: Array.isArray(parsedData.requestedServices)
      ? parsedData.requestedServices
          .filter((s) => s && typeof s.serviceName === 'string' && s.serviceName.trim().length > 0)
          .map((s) => ({
            serviceName: s.serviceName.trim(),
            quantity: Math.max(1, parseInt(s.quantity, 10) || 1),
            notes: typeof s.notes === 'string' && s.notes.trim() ? s.notes.trim() : null,
          }))
      : [],
    missingInformation: Array.isArray(parsedData.missingInformation)
      ? parsedData.missingInformation.filter((item) => typeof item === 'string' && item.trim())
      : [],
    assistantMessage: typeof parsedData.assistantMessage === 'string' && parsedData.assistantMessage.trim()
      ? parsedData.assistantMessage.trim()
      : 'I have analyzed your request and identified the customer requirements.',
  };

  return res.status(200).json({
    success: true,
    data: validatedData,
    modelUsed,
  });
}
