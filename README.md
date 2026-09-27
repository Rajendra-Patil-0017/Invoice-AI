# InvoiceLens AI — Smart Natural Language Invoice & Quotation Assistant

[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC.svg)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.0_Flash-4285F4.svg)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> Built by **Rajendra Patil** for the **Kodnexus AI Build Battle – Smart Invoice Challenge**.

**InvoiceLens AI** transforms unstructured client conversations and plain-English requirements into itemized, print-ready invoices and quotations in seconds. It also provides an AI Document Inspector to analyze existing invoice documents (PDF/CSV), extract line items, calculate taxes, and answer queries.

---

## 🌟 Key Features

### 1. 🤖 Natural Language Invoice Creation
- Describe customer requirements in natural conversational English.
- Instant AI entity extraction powered by **Google Gemini 2.0 Flash**.
- Automatically extracts customer name, company name, contact info, requested services, quantities, and billing terms.

### 2. 📊 Authoritative CSV Service Catalog
- Deterministic INR (`₹`) pricing synchronized with `public/data/services.csv`.
- Intelligent alias and fuzzy service matching (e.g., "ecommerce", "seo", "stripe", "branding").
- Differentiates one-time services from monthly recurring subscriptions with recurring breakdown.
- Support for uploading custom CSV price catalogs directly in the UI.

### 3. 🔍 Document Analysis & Inspector (PDF & CSV)
- Dedicated analysis mode to inspect existing invoices and quotations.
- Drag-and-drop file upload zone for PDF and CSV documents.
- Automatic breakdown of subtotal, 18% GST estimate, and grand total.
- Interactive QA chatbot to ask questions:
  - *"Summarize this invoice"*
  - *"What is the total amount?"*
  - *"List all services and rates"*
  - *"How much tax is included?"*
  - *"Extract customer details"*
- **"Create Draft from Document"** action to import analyzed line items directly into the invoice editor.

### 4. 📄 Vector PDF & Print Engine
- Generate clean, pixel-perfect vector PDF documents using **jsPDF** and **jsPDF-AutoTable**.
- Dynamic mode synchronization: Generates official **Tax Invoices** (`INV-`) or **Official Quotations** (`QUO-`).
- Print-ready stylesheet formatted for standard A4 paper.

### 5. 🎯 Live Demo Mode & Welcome Experience
- Beautiful entry screen with one-click **"Try Demo"** access with preloaded sample business data.
- **"Reset Demo"** button to restore sample states instantly.
- Future-ready **"Sign In / Create Account"** informational modal.

---

## 🛠️ Tech Stack

- **Frontend Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS + Vanilla CSS (Print stylesheet)
- **Icons:** Lucide React
- **AI Model:** Google Gemini 2.0 Flash (`@google/genai` / serverless API proxy)
- **Document Generation:** jsPDF & jsPDF-AutoTable

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (or yarn / pnpm)
- Google Gemini API Key ([Get one here](https://aistudio.google.com/))

### Installation

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
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

5. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 📁 Project Structure

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
│   │   ├── auth/                   # Authentication Coming Soon modal
│   │   ├── catalog/                # Service Catalog Modal & search
│   │   ├── chat/                   # Natural Language Assistant & message bubbles
│   │   ├── invoice/                # Live Invoice Preview, Line Items, Edit Modal
│   │   ├── layout/                 # Sticky Navigation Header & branding
│   │   ├── ui/                     # Reusable Buttons & Status Badges
│   │   ├── upload/                 # Drag-and-drop file upload zone
│   │   ├── welcome/                # Entry & Welcome Screen
│   │   └── workspace/              # Workspace Mode Selector (Create vs Analyze)
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
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 👨‍💻 Author

**Rajendra Patil**  
- GitHub: [@Rajendra-Patil-0017](https://github.com/Rajendra-Patil-0017)
- Hackathon: **Kodnexus AI Build Battle – Smart Invoice Challenge**

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
