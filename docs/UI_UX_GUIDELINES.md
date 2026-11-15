# UI/UX Design System & Sitemap Specification
## Project: FraudShield — AI-Powered Digital Payment Fraud Prevention Platform
**Document Version:** 1.0.0  
**Status:** Approved for Implementation Phase  
**Design Philosophy:** Trust-First, High-Legibility FinTech Security, Cognitive Ease for Seniors  

---

## 1. Visual Brand Identity & Design Principles

FraudShield exists at the intersection of high-stakes financial security and human-centered accessibility. Users approaching the platform are often anxious, suspicious, or in active panic after receiving a threatening message. The interface must communicate authority, calm reassurance, absolute clarity, and instant comprehension.

### 1.1 Core Design Pillars
1. **Unambiguous Risk Semantics:** Never rely solely on color. Every safety state must combine a distinct color, an accessible icon, and an explicit text label (e.g., Red + Octagon Shield + "HIGH RISK: DANGER").
2. **Cognitive Ease for Seniors:** Large default typography, generous touch targets (>= 48px), zero cryptographic or cyber jargon, and a persistent "Senior-Friendly / High Contrast Mode" toggle.
3. **Speed to Safety:** Pre-transaction analysis must present the verdict above the fold within one screen glance, followed by plain-language guidance.
4. **Emergency Accessibility:** One-touch access to the **Fraud Response Center** and 1930 Cyber Helpline from any page.

---

## 2. Color Palette & Accessibility Tokens

The visual direction uses deep enterprise Navy, clean White, and sharp Teal/Cyan accents for proactive security, with standard Amber and Crimson for threat levels.

```
+-----------------------------------------------------------------------------------------+
|                                    PRIMARY BRAND PALETTE                                |
+-----------------------------------------------------------------------------------------+
| Navy 950 (Background / Deep Surface)     : #0A192F (rgb: 10, 25, 47)                   |
| Navy 900 (Card / Elevated Container)     : #112240 (rgb: 17, 34, 64)                   |
| Navy 800 (Borders / Dividers)            : #1E3A8A (rgb: 30, 58, 138)                  |
| Navy 700 (Muted Surface)                 : #233554 (rgb: 35, 53, 84)                   |
| Teal 500 (Primary Brand Accent)          : #0D9488 (rgb: 13, 148, 136)                 |
| Teal 400 (Active Hover / Glow)           : #14B8A6 (rgb: 20, 184, 166)                 |
| Cyan 400 (Data Highlight & Visual Anchor): #06B6D4 (rgb: 6, 182, 212)                  |
+-----------------------------------------------------------------------------------------+

+-----------------------------------------------------------------------------------------+
|                                  THREAT & SEMANTIC STATUS                               |
+-----------------------------------------------------------------------------------------+
| SAFE (Low Risk 0-29)        : Emerald 500 (#10B981) | Surface: Emerald 950 (#064E3B)    |
| CAUTION (Medium Risk 30-69) : Amber 500 (#F59E0B)   | Surface: Amber 950 (#451A03)      |
| HIGH DANGER (High Risk 70-89): Orange 600 (#EA580C)  | Surface: Orange 950 (#431407)     |
| CRITICAL (Critical 90-100)  : Crimson 600 (#DC2626) | Surface: Rose 950 (#4C0519)       |
+-----------------------------------------------------------------------------------------+

+-----------------------------------------------------------------------------------------+
|                               NEUTRALS (LIGHT & DARK MODES)                             |
+-----------------------------------------------------------------------------------------+
| Dark Mode Text Primary   : #F8FAFC (Slate 50)  | Text Secondary : #94A3B8 (Slate 400)   |
| Light Mode Background    : #F8FAFC (Slate 50)  | Card Surface   : #FFFFFF (White)       |
| Light Mode Text Primary  : #0F172A (Slate 900) | Text Secondary : #475569 (Slate 600)   |
+-----------------------------------------------------------------------------------------+
```

### 2.1 WCAG 2.1 Contrast Ratios
- **Critical Alert text on Red Background:** Minimum `7.2:1` (Exceeds WCAG AAA requirement).
- **Body Text on Dark Navy Surface:** `#F8FAFC` on `#112240` yields `13.5:1` (Passes AAA).
- **Interactive Buttons:** `#0D9488` with `#FFFFFF` text yields `4.6:1` (Passes AA for large/bold text).

---

## 3. Typography Hierarchy

- **Primary Typeface:** `Plus Jakarta Sans`, sans-serif (Clean modern geometry with friendly human humanist open counters).
- **Monospace Typeface (for UPI VPAs, URLs, and RRN hashes):** `JetBrains Mono`, monospace.

| Element | Size (Default) | Size (Senior Mode) | Weight | Line Height |
|---|---|---|---|---|
| **Display Heading (H1)** | 36px (2.25rem) | 44px (2.75rem) | 800 (Extrabold) | 1.2 |
| **Section Title (H2)** | 28px (1.75rem) | 34px (2.125rem) | 700 (Bold) | 1.25 |
| **Card Heading (H3)** | 20px (1.25rem) | 24px (1.5rem) | 600 (Semibold) | 1.3 |
| **Body Primary** | 16px (1.0rem) | 20px (1.25rem) | 400 (Regular) | 1.6 |
| **Body Emphasized** | 16px (1.0rem) | 20px (1.25rem) | 600 (Semibold) | 1.6 |
| **Caption / Helper** | 14px (0.875rem) | 16px (1.0rem) | 500 (Medium) | 1.5 |
| **Button Text** | 16px (1.0rem) | 18px (1.125rem) | 600 (Semibold) | 1.0 |

---

## 4. Spacing, Elevation & Layout Grid

### 4.1 Layout Grid
- **Desktop (>= 1280px):** 12-column responsive grid, max-width `1280px`, `32px` gutter.
- **Tablet (768px - 1279px):** 8-column grid, `24px` gutter, `24px` outer margins.
- **Mobile (< 768px):** 4-column grid, `16px` gutter, `16px` outer margins.

### 4.2 Elevation & Shadows
- **Card Flat:** `border: 1px solid rgba(255, 255, 255, 0.08); background: #112240;`
- **Elevated Hover:** `box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(13, 148, 136, 0.1);`
- **Critical Alert Glow:** `box-shadow: 0 0 30px rgba(220, 38, 38, 0.25); border: 2px solid #DC2626;`

---

## 5. Website Sitemap & Information Architecture

```
                                      [ FraudShield ]
                                             │
      ┌──────────────────────┬───────────────┴───────────────┬──────────────────────┐
      │                      │                               │                      │
[ Public Pages ]       [ Analyzers ]                [ User Account ]      [ Legal & Info ]
      │                      │                               │                      │
  ├── 1. Landing Page    ├── 3. Message Analyzer         ├── 9. Login           ├── 8. Fraud Awareness
  ├── 7. Fraud Response  ├── 4. QR & UPI Analyzer        ├── 10. Registration   ├── 12. Privacy Policy
  │      Center          ├── 5. URL Checker              ├── 2. Protection      └── 13. Terms &
  │                      └── 6. Unified Analysis Results │      Dashboard               Conditions
  │                                                      └── 11. Profile &
  │                                                              Settings
```

---

## 6. Detailed Page-by-Page Layout Specifications

### Page 1: Landing Page (`/`)
- **Header:** Sticky Navigation bar with Logo, Quick Scanner CTA, "1930 Emergency Helpline" pill, Theme & Senior Mode Toggles, Login/Register buttons.
- **Hero Section:**
  - High-impact headline: *"Stop Indian Digital Payment Fraud Before It Strikes."*
  - Subhead: *"Verify suspicious SMS messages, QR codes, and UPI links in under 1.5 seconds with explainable AI."*
  - Dual Primary Action: [Instant Scan Message] & [Upload QR Code].
  - Live Counter: "₹14.2 Crore Saved • 120,000+ Scams Detected".
- **Three-Pillar Threat Suite:**
  - Card 1: Message & SMS Scanner (Detects electricity, KYC, and digital arrest traps).
  - Card 2: QR & UPI Verifier (Prevents reverse debit and tampered store QR scams).
  - Card 3: Link & APK Inspector (Flags malicious download mirrors and typosquatting).
- **Senior-Friendly Commitment Banner:** Highlighting large font accessibility and family guardian alerts.
- **Official Helpline Quick Banner:** Direct link to Government 1930 portal & National Cyber Crime reporting.

---

### Page 2: Protection Dashboard (`/dashboard`)
*Requires Authentication.*
- **Top Metric Cards (Grid of 4):**
  - Personal Threat Protection Score (e.g., "98/100 Safe").
  - Scans Completed (Total & This Month).
  - High-Risk Threats Intercepted.
  - Active Trusted Contacts (e.g., "2 Family Guardians Guarding You").
- **Quick Scan Launcher:** Tabbed compact widget to paste text, drag-and-drop QR, or check a URL in-place.
- **Recent Analysis History Table:** Columns: Date/Time, Scan Type (Icon + Label), Threat Category, Risk Badge (Safe/Medium/Critical), "View Full Evidence" button.
- **Family Guardian SOS Status:** Indicator showing Trusted Contacts are synced and ready to receive alerts.

---

### Page 3: Message Analyzer (`/analyze/message`)
- **Breadcrumb Navigation:** Dashboard > Analyzers > Message Analyzer.
- **Input Canvas:**
  - Expansive Text Area with character counter (max 5,000 chars) and placeholder: *"Paste suspicious SMS or WhatsApp message here..."*
  - Optional Sender Header Field: *"e.g., VM-POWERT, AD-SBINB"*.
  - Drag-and-Drop Image Uploader for screenshot receipts.
  - Mandatory DPDP Consent Checkbox: *"I confirm I have permission to scan this message and consent to PII redaction."*
  - Action Button: [Analyze Message Safety] with loading spinner state.
- **Quick Pre-loaded Examples:** "Test with Electricity Scam SMS", "Test with Bank KYC SMS", "Test with Legitimate Bank Alert".

---

### Page 4: QR & UPI Analyzer (`/analyze/qr`)
- **Dual Ingress Options:**
  - Tab 1: **Upload QR Image / Photo** (Supports mobile camera upload, drag-and-drop).
  - Tab 2: **Paste Raw UPI Link** (`upi://pay?pa=...`).
- **Safety Tip Callout:** *"Remember: Entering your UPI PIN is ONLY done when MONEY IS LEAVING your account. You NEVER enter a PIN to receive a payment or refund."*
- **Auto Preview Box:** Shows uploaded QR code image with bounding box indicator once processed.

---

### Page 5: URL Checker (`/analyze/url`)
- **Input Box:** Prominent search-bar style URL input field with "Paste from Clipboard" button.
- **Security Check Checklist:** Live visual indicators showing checks in progress:
  - Domain age check (<30 days flag).
  - Brand typosquatting check (SBI, HDFC, ICICI, Paytm).
  - APK & direct download file scan.
  - Google Safe Browsing and Threat Database match.

---

### Page 6: Unified Analysis Results (`/results/:sessionId`)
The centerpiece result experience:
- **Top Status Banner:**
  - Red / Amber / Green full-width banner with bold verdict:  
    `[CRITICAL RISK: HIGH-DANGER UTILITY BILL SCAM DETECTED]`
- **Visual Risk Gauge (Recharts):**
  - Radial semi-circle gauge displaying score `94 / 100` with color gradient.
- **"What You Should Do Now" (Hero Action Box):**
  - High-contrast, large text bullet points:
    - *1. Do NOT click the link bit.ly/power-bill-updt.*
    - *2. Do NOT call the 10-digit number 9876543210.*
    - *3. Delete this SMS immediately.*
- **Factor Contribution Breakdown (Recharts Radar / Bar Chart):**
  - Urgency Linguistic Score (92%)
  - Unregistered Mobile Sender (85%)
  - Suspicious Short Link (95%)
- **Emergency Action Bar:**
  - [Alert My Trusted Contact (1-Click SOS)]
  - [I Already Lost Money -> Open Fraud Response Center]
  - [Download PDF Evidence Report]

---

### Page 7: Fraud Response Center (`/incident-center`)
- **Emergency Banner:** *"Act Fast. The first 2 hours ('The Golden Hour') are critical to freezing stolen funds."*
- **Direct Dial Quick Action:** Large interactive dial button: **[CALL NATIONAL CYBER HELPLINE 1930]**.
- **Interactive 4-Step Emergency Playbook:**
  - **Step 1: Freeze Your Bank Account / Card:** Direct one-click SMS templates and toll-free numbers for major Indian banks.
  - **Step 2: File Formal Complaint on cybercrime.gov.in:** Pre-fills crime details using data from your scan session.
  - **Step 3: Secure Your Phone:** Step-by-step checklist to uninstall malicious APKs, boot into safe mode, and revoke screen-sharing apps (AnyDesk, TeamViewer).
  - **Step 4: Notify UPI App Provider:** Direct links to dispute tickets inside Google Pay, PhonePe, and Paytm.

---

### Page 8: Fraud Awareness & Education Center (`/awareness`)
- **Curated Scam Playbooks:** Interactive guides with visual "Spot the Scam" breakdowns:
  - Electricity Bill Traps.
  - Digital Arrest & Fake Police Notice Scams.
  - Fake Work-from-Home & Telegram Investment Scams.
  - Reverse UPI Collect Scams.
- **Interactive Quiz:** "Can You Spot the Fake SMS?" with real-world examples.

---

### Page 9 & 10: Authentication (Login `/login` & Register `/register`)
- Clean split-screen design: Left side showcases security badges and live fraud prevention metrics; right side contains the form.
- Senior-friendly oversized inputs with clear floating labels.
- "Show Password" toggle button.
- Explicit Consent checkbox linking to Privacy Policy under DPDP Act.

---

### Page 11: Profile & Settings (`/settings`)
- **User Information:** Name, email, verified mobile number.
- **Accessibility Preferences:**
  - High Contrast Toggle (On/Off).
  - Font Size Selector (Standard, Medium, Large, Extra Large).
  - Language Selection (English, Hindi, Tamil, Telugu, Marathi).
- **Trusted Contacts Manager:** Add, edit, remove up to 3 contacts with relationship badges.
- **Privacy & Data Management:**
  - "Download My Data" (JSON export).
  - "Delete Account & All Scan Records" (Cascade purge button).

---

### Page 12 & 13: Privacy Policy & Terms of Service
- Structured, plain-English legal documentation explicitly articulating zero storage of bank credentials, 24-hour file purging, DPDP compliance, and limitation of liability.

---

## 7. Reusable Design Components & Component Hierarchy

```
<App>
  ├── <Navbar>
  │     ├── <BrandLogo>
  │     ├── <NavLinks>
  │     ├── <EmergencyPill (1930)>
  │     ├── <SeniorModeToggle>
  │     └── <UserMenu / AuthButtons>
  │
  ├── <PageContainer>
  │     ├── <RiskGauge (Recharts Radial)>
  │     ├── <ThreatIndicatorBadge>
  │     ├── <FactorContributionChart>
  │     ├── <ActionableAdviceCard>
  │     ├── <EmergencySOSModal>
  │     └── <DataTable (History & Logs)>
  │
  └── <Footer>
        ├── <SecurityCertifications>
        ├── <GovPortalLinks>
        └── <LegalDisclaimers>
```

---

## 8. Summary & UX Handoff

The FraudShield design system prioritizes absolute clarity, emotional reassurance, and rapid decision-making. By pairing high-contrast, large-format UI patterns with structured explainability visualizations, it ensures users of all digital literacies can defend themselves against sophisticated financial scams.
