# FraudShield Frontend Client

AI-Powered Pre-Transaction Digital Payment Fraud Prevention Platform for India.

## Technology Stack
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS v4
- **Routing:** React Router DOM
- **Forms & Validation:** React Hook Form + Zod
- **Data Visualization:** Recharts
- **Iconography:** Lucide React
- **HTTP Client:** Axios with JWT Interceptors
- **Internationalization:** Context-based bilingual engine (English & हिन्दी)
- **State Management:** React Context API

---

## Getting Started

### 1. Prerequisites
- Node.js >= 20.x LTS
- npm >= 10.x

### 2. Installation
```bash
cd client
npm install
```

### 3. Environment Setup
Copy the example environment configuration:
```bash
cp .env.example .env
```
Configuration variables:
- `VITE_API_BASE_URL`: URL to the Node.js API Gateway (e.g., `http://localhost:5000/api/v1`).
- `VITE_USE_MOCK_SERVICES`: Set to `true` to run against the mock threat detection service without a running backend.

### 4. Running the Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 5. Production Build
```bash
npm run build
```

---

## Key Features & Accessibility Standards

### Senior Citizen Mode
Accessible via the persistent `Senior Mode` toggle in the navigation bar:
- Enlarges default body typography from 16px to 18px.
- Enforces minimum 48px interactive touch targets (`.senior-target`).
- Maximizes contrast ratios adhering to WCAG 2.1 Level AAA.

### Bilingual Support (EN & हिन्दी)
Instant client-side toggle switching between English and Hindi across all navigation labels, threat definitions, warnings, and emergency playbooks.

### Three-Pillar Ingress Analyzers
1. **SMS & Text Analyzer (`/analyze/message`):** Natural Language Processing scanner detecting urgency cues, fake electricity cutoffs, and KYC expiry traps.
2. **QR & UPI Verifier (`/analyze/qr`):** Decodes UPI deep links (`upi://pay`) and flags reverse debit/collect intents masquerading as refunds or cashback.
3. **URL & Typosquatting Checker (`/analyze/url`):** Unshortens obfuscated links, identifies typosquatted Indian banking domains, and flags malicious `.apk` sideload links.

### Emergency Incident Center (`/incident-center`)
- 1-Click National Cyber Helpline (1930) dialer.
- Direct SMS freeze syntax for SBI, HDFC, ICICI, Axis, PNB, and Bank of Baroda.
- Smartphone remote access (AnyDesk/TeamViewer) disinfection guide.
