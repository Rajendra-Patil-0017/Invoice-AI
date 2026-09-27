# ⚡ InvoiceLens AI — Smart Natural Language Invoice & Quotation Assistant

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://invoice-noqh9b3aq-rjpatil0017-2184s-projects.vercel.app/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.0_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

> 🚀 **Live Production Deployment:** [https://invoice-noqh9b3aq-rjpatil0017-2184s-projects.vercel.app/](https://invoice-noqh9b3aq-rjpatil0017-2184s-projects.vercel.app/)  
> 🏆 Built by **Rajendra Patil** for the **Kodnexus AI Build Battle – Smart Invoice Challenge**.

---

## 📖 Overview

**InvoiceLens AI** is a next-generation financial SaaS assistant designed to bridge the gap between unstructured client communication and professional accounting documents.

Instead of manually drafting line items, computing tax brackets, and searching for rate cards, users simply describe requirements in plain conversational English. **InvoiceLens AI** leverages **Google Gemini 2.0 Flash** to extract entities and verify prices against a deterministic CSV service catalog.

Additionally, **InvoiceLens AI** includes a dedicated **Document Analysis & Inspector Engine** capable of parsing existing invoices (PDF & CSV), validating structures, summarizing financials, and answering user queries interactively.

---

## 🌐 Live Application & Demo

* **Live URL:** [https://invoice-noqh9b3aq-rjpatil0017-2184s-projects.vercel.app/](https://invoice-noqh9b3aq-rjpatil0017-2184s-projects.vercel.app/)
* **Demo Mode:** Interactive sandbox with sample business data preloaded. No signup required.
* **Reset Demo:** Restore initial sample conversation and invoice states anytime with one click.

---

## 🌟 Core Capabilities & Features

### 1. 🤖 Natural Language Invoice Creation
- **Conversational Input:** Submit natural client statements (e.g., *"Rahul Sharma from ABC Tech needs a 5-page business website with SEO optimization and 2 months maintenance"*).
- **Gemini 2.0 Flash Extraction:** Real-time entity identification for client name, company, email, phone, requested deliverables, and billing intervals.
- **Smart Catalog Matching:** Matches extracted services against an authoritative rate card (`services.csv`) with fuzzy alias detection.

### 2. 📊 Authoritative CSV Service Catalog & Pricing Math
- **Deterministic Math:** Eliminates AI hallucination on pricing. Rates and totals are computed deterministically in INR (`₹`).
- **Recurring vs. One-Time Breakdown:** Clearly isolates one-time project fees from recurring monthly subscriptions.
- **Custom Catalog Upload:** Upload custom service catalog CSV files directly in the UI to instantly update active rate cards.

### 3. 🔍 Document Analysis & Inspector (PDF & CSV)
- **Document Ingestion:** Drag-and-drop or upload existing invoices and quotations in `.pdf` or `.csv` format.
- **Structured Data Extraction:** Parses line items, quantities, unit prices, subtotal, 18% GST estimate, and grand total.
- **Interactive QA Chatbot:** Ask questions about uploaded files:
  - *"Summarize this invoice"*
  - *"What is the total amount payable?"*
  - *"List all services and their unit rates"*
  - *"How much tax is included?"*
  - *"Extract the customer and billing address"*
- **"Create Draft from Document":** One-click action to import analyzed line items directly into the invoice editor.

### 4. 📄 Vector PDF Export & Print Engine
- **Client-Side Vector PDF:** Uses `jsPDF` and `jsPDF-AutoTable` to generate clean vector PDFs.
- **Dynamic Mode Synchronization:**
  - **Quotation Mode:** Heading `OFFICIAL QUOTATION`, number prefix `QUO-`, label `Valid Until:`.
  - **Invoice Mode:** Heading `TAX INVOICE`, number prefix `INV-`, label `Payment Due:`.
- **Print Optimization:** Print stylesheet tailored for standard A4 paper with navigation and chrome stripped automatically.

### 5. 🎨 Modern SaaS Design & UX
- Two-panel responsive workspace with independent scrolling and fixed chat inputs.
- Clean visual hierarchy with subtle glassmorphism and WCAG-accessible contrast.
- Custom customer & metadata editing modal (`Edit Customer & Document`).
- Future-ready **Sign In / Account** informational modal.

---

## 🏗️ Architecture & Data Flow

```
                                    ┌────────────────────────┐
                                    │   User / Sales Agent   │
                                    └───────────┬────────────┘
                                                │
                 ┌──────────────────────────────┴──────────────────────────────┐
                 │                                                             │
                 ▼                                                             ▼
     [ Create Invoice Mode ]                                      [ Analyze Document Mode ]
                 │                                                             │
                 ▼                                                             ▼
  Natural Language Prompt Input                                Drag & Drop Upload (PDF / CSV)
                 │                                                             │
                 ▼                                                             ▼
 ┌───────────────────────────────┐                            ┌────────────────────────────────┐
 │ Serverless Proxy /api/analyze │                            │   Local Document Parser &      │
 │ (Google Gemini 2.0 Flash)     │                            │   Structured Financial Math    │
 └───────────────┬───────────────┘                            └────────────────┬───────────────┘
                 │ Extracted Entities                                          │ Extracted Line Items
                 ▼                                                             ▼
 ┌───────────────────────────────┐                            ┌────────────────────────────────┐
 │  CSV Catalog Rate Matcher     │                            │   Interactive QA Chatbot &     │
 │  (Deterministic Price Engine) │                            │   Document Inspector Panel     │
 └───────────────┬───────────────┘                            └────────────────┬───────────────┘
                 │                                                             │
                 ▼                                                             ▼
 ┌───────────────────────────────┐                            ┌────────────────────────────────┐
 │ Live Invoice/Quotation Sheet  │ ◄─── [Create Draft Action] ┘                                │
 └───────────────┬───────────────┘
                 │
                 ▼
 ┌───────────────────────────────┐
 │ Vector PDF & Print Generation │
 └───────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 6, Tailwind CSS 3 |
| **Icons & UI** | Lucide React |
| **AI Extraction** | Google Gemini 2.0 Flash (`@google/genai`) |
| **Backend / API** | Serverless Endpoint (`/api/analyze.js`) |
| **Document Generation** | jsPDF, jsPDF-AutoTable |
| **Pricing Engine** | Structured CSV Parser & Deterministic Math Engine |
| **Hosting** | Vercel |

---

## 🔒 Security & API Key Management

* **Zero Client Exposure:** The Google Gemini API key is never exposed or transmitted to the browser client.
* **Serverless Proxy:** API calls are routed through the backend proxy (`api/analyze.js`) using `process.env.GEMINI_API_KEY`.
* **Git Safe:** `.env` and `.env.local` files are strictly excluded from version control via `.gitignore`.

---

## 🚀 Getting Started Locally

### Prerequisites

* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* [npm](https://www.npmjs.com/) (or yarn / pnpm)
* Google Gemini API Key ([Get one free on Google AI Studio](https://aistudio.google.com/))

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Rajendra-Patil-0017/Invoice-AI.git
   cd Invoice-AI
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key_here
   GEMINI_MODEL=gemini-flash-lite-latest
   ```

4. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

5. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 📁 Project Directory Structure

```
invoicelens/
├── api/
│   └── analyze.js                  # Serverless endpoint proxying Gemini API requests
├── public/
│   ├── invoicelens-logo.png        # Official brand logo
│   └── data/
│       └── services.csv            # Authoritative service catalog & rate card
├── src/
│   ├── components/
│   │   ├── analyze/                # Document Analysis Chat & Inspector views
│   │   │   ├── AnalysisChatPanel.jsx
│   │   │   └── DocumentAnalysisPanel.jsx
│   │   ├── auth/                   # Authentication Coming Soon modal
│   │   │   └── AuthModal.jsx
│   │   ├── catalog/                # Service Catalog Modal & search
│   │   │   └── ServiceCatalogModal.jsx
│   │   ├── chat/                   # Natural Language Assistant & message bubbles
│   │   │   ├── ChatInput.jsx
│   │   │   ├── ChatPanel.jsx
│   │   │   └── MessageBubble.jsx
│   │   ├── invoice/                # Live Invoice Preview, Line Items, Edit Modal
│   │   │   ├── EditCustomerModal.jsx
│   │   │   ├── InvoiceLineItem.jsx
│   │   │   └── InvoicePreview.jsx
│   │   ├── layout/                 # Sticky Navigation Header & branding
│   │   │   └── Header.jsx
│   │   ├── ui/                     # Reusable Buttons & Status Badges
│   │   │   ├── Button.jsx
│   │   │   └── StatusBadge.jsx
│   │   ├── upload/                 # Drag-and-drop file upload zone
│   │   │   └── FileUploadZone.jsx
│   │   ├── welcome/                # Entry & Welcome Screen
│   │   │   └── WelcomeScreen.jsx
│   │   └── workspace/              # Workspace Mode Selector (Create vs Analyze)
│   │       └── WorkspaceModeSelector.jsx
│   ├── data/
│   │   ├── mockConversation.js     # Prompt suggestions & initial conversation
│   │   └── mockServices.js         # Initial sample invoice state
│   ├── utils/
│   │   ├── documentParser.js       # PDF & CSV invoice parsing & QA logic
│   │   ├── formatCurrency.js       # INR (₹) formatting & date utilities
│   │   ├── geminiClient.js         # Client-side API caller
│   │   ├── generatePdf.js          # Vector PDF generation engine
│   │   └── serviceCatalog.js       # CSV parsing, fuzzy lookup & price math
│   ├── pages/
│   │   └── HomePage.jsx            # Main app orchestrator
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css                   # Global styles & print media rules
├── .env.example
├── .gitignore
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 👨‍💻 Creator & Hackathon Details

* **Author:** Rajendra Patil
* **GitHub:** [@Rajendra-Patil-0017](https://github.com/Rajendra-Patil-0017)
* **Hackathon:** **Kodnexus AI Build Battle – Smart Invoice Challenge**
* **Project Repository:** [https://github.com/Rajendra-Patil-0017/Invoice-AI](https://github.com/Rajendra-Patil-0017/Invoice-AI)
* **Live Deployment:** [https://invoice-noqh9b3aq-rjpatil0017-2184s-projects.vercel.app/](https://invoice-noqh9b3aq-rjpatil0017-2184s-projects.vercel.app/)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
