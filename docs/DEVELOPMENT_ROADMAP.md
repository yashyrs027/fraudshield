# Development Roadmap & Implementation Plan
## Project: FraudShield — AI-Powered Digital Payment Fraud Prevention Platform
**Document Version:** 1.0.0  
**Status:** Approved for Implementation Phase  
**Timeline:** 12-Week Production Execution Plan  

---

## 1. Project Phasing & Sprint Breakdown

The engineering roadmap is structured into 6 sequential, milestone-driven phases. Each phase culminates in an automated test gate and stakeholder review.

```
+-------------------------------------------------------------------------------------------------------+
| Week 1 - 2  | Phase 1: Planning & Architecture (Current Sign-off)                                     |
| Week 3 - 4  | Phase 2: Foundational Infrastructure, Database & Core Backend Gateway                   |
| Week 5 - 6  | Phase 3: Python AI/ML Detection Engine, OCR & QR Parsers                                |
| Week 7 - 8  | Phase 4: React 19 Frontend, Design System & Recharts Visualizations                     |
| Week 9 - 10 | Phase 5: Fraud Response Center, SOS Alerts & Trusted Contact Network                    |
| Week 11 - 12| Phase 6: Security Hardening, Pen Testing, DPDP Audit & Production Launch                 |
+-------------------------------------------------------------------------------------------------------+
```

---

### Phase 1: Planning & Architecture (Weeks 1–2) — COMPLETE
- [x] Product Requirements Document (`PRD.md`) defining target personas, pain points, and MVP scope.
- [x] System Architecture Document (`SYSTEM_ARCHITECTURE.md`) specifying microservices, data flows, and tech stack.
- [x] Database Schema Specification (`DATABASE_SCHEMA.md`) with 3NF tables, indexes, constraints, and RLS policies.
- [x] REST API Specification (`API_SPECIFICATION.md`) detailing all request/response schemas and Zod contracts.
- [x] UI/UX Design System Guidelines (`UI_UX_GUIDELINES.md`) with color tokens, typography, and page wireframes.
- [x] Development Roadmap & Risk Register (`DEVELOPMENT_ROADMAP.md`).

---

### Phase 2: Foundational Setup & Core Backend (Weeks 3–4)
**Objective:** Establish cloud database, authentication micro-services, and API Gateway scaffolding.

#### Sprint 2.1: Database & Supabase Environment Setup
- Deploy PostgreSQL instance on Supabase.
- Execute baseline migrations (`001_initial_schema.sql`, `002_indexes_and_constraints.sql`, `003_rls_policies.sql`).
- Seed reference data for `threat_sources` and Indian bank fraud hotlines.
- Configure automated backup snapshots and PgBouncer connection pooling.

#### Sprint 2.2: Node.js & Express API Gateway Bootstrap
- Initialize Express application with Node 20 LTS.
- Configure security middleware: Helmet, CORS whitelist, Express Rate Limiter, Winston structured logger.
- Implement user authentication module:
  - Argon2id password hashing.
  - Dual JWT issuing: Access Token (15m) + Secure HTTP-only Refresh Token (7d).
  - Refresh token rotation and revocation logic.
- Implement global error handler envelope and Zod request validation middleware.
- Configure Multer memory upload middleware with magic number MIME-type verification.

**Exit Gate:** Automated Jest integration test suite passing with >= 85% code coverage for Auth and Session modules.

---

### Phase 3: AI/ML Detection Engine Implementation (Weeks 5–6)
**Objective:** Build high-performance Python FastAPI microservice for NLP, OCR, QR decoding, and explainable scoring.

#### Sprint 3.1: QR & UPI Protocol Dissector
- Integrate `pyzbar` and OpenCV for fast QR extraction from images.
- Implement UPI URI parser for `upi://pay` specification:
  - Detects `pa` (VPA), `pn` (Payee Name), `am` (Amount), `tn` (Note).
  - Flags reverse debit/collect intents disguised as credits.
  - Integrates VPA blacklist matching with local in-memory Trie structure.

#### Sprint 3.2: Computer Vision & OCR Screenshot Verifier
- Build EasyOCR pipeline optimized with OpenCV grayscale, thresholding, and contrast filters.
- Implement bank receipt layout analyzer to detect forged Google Pay / PhonePe transaction screenshots.
- Validate UTR / Transaction Reference Number syntax and bank standard formats.

#### Sprint 3.3: NLP Urgency & Phishing Classifier
- Deploy lightweight transformer classifier (fine-tuned DistilBERT) for Indian scam categorization.
- Implement heuristic rule engine for urgency phrases, threats of disconnection, and mobile number harvesting.
- Develop Safe URL Inspector with DNS resolution, SSRF private IP blocker, and typosquatting distance calculator.

#### Sprint 3.4: Explainable AI (XAI) Synthesis
- Build composite 0–100 scoring algorithm with weighted factor contributions.
- Generate automated 3-part plain-language guidance: *What was found*, *Why it is risky*, *Action to take*.

**Exit Gate:** PyTest suite demonstrating p95 inference latency <= 1,200 ms and >= 96% precision on test corpus.

---

### Phase 4: Frontend Development & Design System (Weeks 7–8)
**Objective:** Deliver accessible, responsive React 19 web application matching the UI/UX design specification.

#### Sprint 4.1: Foundation, Routing & Layout Components
- Scaffold React 19 app with Vite, Tailwind CSS v4, and React Router DOM.
- Configure theme tokens: Navy, White, Teal, Amber, Crimson.
- Implement Senior Mode toggle (instant switch to large fonts, high contrast, simplified layout).
- Author core atomic components: `Button`, `Card`, `Badge`, `Input`, `Navbar`, `Footer`, `Modal`.

#### Sprint 4.2: Analyzer Interfaces & Data Visualization
- Build **Message Analyzer** with live character counter, example selector, and DPDP consent checkbox.
- Build **QR & UPI Analyzer** with image dropzone, camera upload, and instant preview.
- Build **URL Checker** with live security checklist indicators.
- Build **Unified Analysis Results** page featuring:
  - Recharts semi-circle Risk Gauge.
  - Factor contribution radar chart.
  - Threat indicator badges.
  - Actionable advice recommendation box.

#### Sprint 4.3: User Dashboard & History
- Develop authenticated Protection Dashboard with threat statistics.
- Interactive historical analysis table with pagination and risk level filtering.

**Exit Gate:** Lighthouse accessibility score >= 95 and performance score >= 90 on mobile profiles.

---

### Phase 5: Incident Response, Trusted Contacts & Integrations (Weeks 9–10)
**Objective:** Complete the emergency containment loop and family protection network.

#### Sprint 5.1: Fraud Response Center & Playbook
- Build interactive 4-step emergency workflow:
  - 1-click bank helpline directory with phone dialer triggers.
  - Pre-filled 1930 Cybercrime complaint generator.
  - Android device disinfection checklist (APK removal, safe mode).
- Build Emergency SOS notification modal.

#### Sprint 5.2: Trusted Contacts Network
- Implement CRUD endpoints and UI for managing up to 3 Trusted Contacts.
- Integrate Twilio / SMS provider webhook to dispatch instant SOS alerts with analysis summary.
- Develop "Family Guardian" view for designated relatives to monitor alerts.

**Exit Gate:** E2E automated test confirming end-to-end SOS alert dispatch within 5 seconds of scan trigger.

---

### Phase 6: Security Hardening, Audits & Launch (Weeks 11–12)
**Objective:** Ensure complete regulatory compliance, penetration testing, and production deployment.

#### Sprint 6.1: Security Hardening & Penetration Testing
- Conduct full OWASP Top 10 security audit.
- Execute automated DAST/SAST scans (SonarQube, Snyk).
- Verify anti-SSRF defenses against cloud metadata and private IP injection.
- Validate 24-hour ephemeral file deletion cron job.

#### Sprint 6.2: Regulatory & DPDP Act Compliance Audit
- Audit consent logging in `consent_records` table.
- Verify automatic PII redaction pipeline (Aadhaar, PAN, card numbers masked before persistence).
- Test one-click "Delete All My Data" right-to-erasure functionality.

#### Sprint 6.3: Production Deployment & Observability
- Deploy frontend to CDN edge (Cloudflare / Vercel).
- Deploy Node.js and FastAPI services in containerized clusters (Docker + Kubernetes / AWS ECS).
- Configure Sentry error monitoring and Datadog / Prometheus performance metrics.
- Execute soft launch and public rollout.

---

## 2. Technical Risk Management & Mitigation Matrix

| # | Technical Risk | Likelihood | Impact | Severity | Mitigation Strategy |
|---|---|---|---|---|---|
| **TR-01** | **SSRF Attack via URL Unshortener** | Medium | Critical | **HIGH** | Strict DNS resolution before fetching; drop any IP falling in private RFC 1918, loopback, or cloud metadata ranges (`169.254.169.254`). |
| **TR-02** | **OCR Engine CPU Bottleneck** | High | High | **HIGH** | Implement client-side image compression; run FastAPI workers with asynchronous process pools; enforce 10MB file limit; auto-scale worker pods. |
| **TR-03** | **False Negatives on Zero-Day Scams** | Medium | High | **HIGH** | Combine semantic NLP with hard heuristic rules; fallback to conservative advice reminding users that banks never ask for PIN/OTP. |
| **TR-04** | **PII Data Leakage from Scanned Messages** | Low | Critical | **HIGH** | Zero persistent storage of raw text; mandatory regex & NER redaction on ingest; 24-hour TTL on image buffers; encrypted database fields. |
| **TR-05** | **SMS Gateway Latency on SOS Alerts** | Medium | Medium | **MEDIUM** | Use asynchronous background worker queues (BullMQ / Celery) with retry policies and multi-vendor SMS fallback (Twilio + Exotel). |
| **TR-06** | **Adversarial QR Code Obfuscation** | Medium | Medium | **MEDIUM** | Multi-pass OpenCV pre-processing (contrast normalization, adaptive thresholding, perspective transform); reject unreadable codes with clear feedback. |

---

## 3. Unresolved Architectural Decisions & Proposed Resolutions

| # | Architectural Decision | Dilemma / Trade-off | Proposed Resolution & Recommendation |
|---|---|---|---|
| **AD-01** | **Client-Side vs Server-Side OCR** | Tesseract.js in browser saves server compute but incurs a ~15MB initial WASM bundle download and drains mobile battery. | **Recommendation:** Perform OCR on the Python backend via EasyOCR for speed and accuracy, but use client-side canvas to compress images to < 1MB before upload. |
| **AD-02** | **Guest vs Authenticated Scans** | Requiring login reduces friction drop-off, but guest access complicates rate limiting and legal consent tracking. | **Recommendation:** Allow guest scans with IP-hash based rate limiting (max 5/min) and required checkbox consent. Require login to access History, SOS alerts, and Trusted Contacts. |
| **AD-03** | **Self-Hosted LLM vs Lightweight Transformers** | Large models (e.g., Llama-3-70B) offer high nuance but introduce 3-5s latency and high GPU costs. | **Recommendation:** Use a hybrid model: fine-tuned lightweight DistilBERT + heuristic regex for the 800ms hot path; trigger external LLM APIs only for ambiguous edge cases. |
| **AD-04** | **Supabase Managed Auth vs Custom JWT** | Supabase Auth offers turnkey OAuth, but custom JWT provides complete control over refresh token rotation and corporate network constraints. | **Recommendation:** Use Supabase for PostgreSQL data storage while maintaining custom JWT authentication inside the Node.js API Gateway for strict security control. |

---

## 4. Phase 1 Sign-Off & Approvals

All Phase 1 architectural and planning documents are complete, fully specified, and aligned with Indian regulatory and technical constraints. The project is fully unblocked and ready for Phase 2 implementation.
