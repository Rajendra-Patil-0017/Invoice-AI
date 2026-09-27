/**
 * Initial conversation state and prompt suggestions.
 */

export const EXAMPLE_PROMPT_SUGGESTIONS = [
  {
    id: 'p1',
    title: 'Website, SEO & Maintenance',
    prompt: "Hi, I'm Rahul Sharma from ABC Technologies. I need a business website with SEO optimization and monthly maintenance. Please prepare a quotation.",
  },
  {
    id: 'p2',
    title: 'E-commerce & Payment Gateway',
    prompt: "Client: Priya Mehta (Apex Retail). Need an E-commerce platform setup, Payment Gateway Integration, and 2 months of maintenance.",
  },
  {
    id: 'p3',
    title: 'UI/UX Design & Branding Pack',
    prompt: "I'm Vikram from Zenith Labs. We require a complete UI/UX Design Package and Brand Identity & Logo for our new fintech product.",
  },
  {
    id: 'p4',
    title: 'Digital Marketing & Content',
    prompt: "For Ananya at Nova Health: We need Social Media Marketing, Google Ads Campaign, and Monthly Blog & Article Pack.",
  },
];

export const INITIAL_MOCK_MESSAGES = [
  {
    id: 'msg-1',
    sender: 'assistant',
    timestamp: '11:45 AM',
    text: "Hi! Tell me what your customer needs, and I’ll help prepare an itemized invoice or quotation. You can review and edit the details before exporting it.",
    isSystem: true,
  },
  {
    id: 'msg-2',
    sender: 'user',
    timestamp: '11:48 AM',
    text: "Hi, I'm Rahul Sharma from ABC Technologies. I need a business website with SEO optimization and monthly maintenance. Please prepare a quotation.",
  },
  {
    id: 'msg-3',
    sender: 'assistant',
    timestamp: '11:48 AM',
    text: "I've identified 3 requested services for **Rahul Sharma (ABC Technologies)** and verified them against our live CSV service catalog. Review the extracted requirements and line items in the invoice preview on the right.",
    extractedEntities: {
      clientName: 'Rahul Sharma',
      company: 'ABC Technologies',
      servicesFound: 3,
      estimatedTotal: '₹36,500',
    },
    isSimulated: true,
  },
];
