/**
 * Frontend Gemini API Client
 * Communicates strictly with the backend serverless endpoint /api/analyze.
 * The Gemini API key is never stored or transmitted from the browser.
 */

/**
 * Sends customer requirement text to the backend for structured AI entity extraction.
 * @param {string} message
 * @returns {Promise<Object>} Normalized extraction object { customer, requestedServices, missingInformation, assistantMessage }
 */
export async function analyzeCustomerRequirements(message) {
  if (!message || typeof message !== 'string' || !message.trim()) {
    throw new Error('Please enter customer requirements to analyze.');
  }

  const trimmed = message.trim();
  if (trimmed.length > 2500) {
    throw new Error('Message is too long. Please summarize within 2500 characters.');
  }

  let response;
  try {
    response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: trimmed }),
    });
  } catch (networkErr) {
    console.error('Network Error during requirement analysis:', networkErr);
    throw new Error('Failed to connect to the analysis service. Please check your internet connection or local server.');
  }

  let result;
  try {
    result = await response.json();
  } catch (jsonErr) {
    console.error('JSON parse error from /api/analyze:', jsonErr);
    throw new Error(`Server returned an invalid response (Status ${response.status}).`);
  }

  if (!response.ok || !result.success) {
    const errorMsg = result?.error || `Analysis request failed with status ${response.status}.`;
    throw new Error(errorMsg);
  }

  return result.data;
}
