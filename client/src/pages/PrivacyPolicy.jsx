import React from 'react';
import { Shield, Lock, Eye, Trash2, CheckCircle2 } from 'lucide-react';
import { Card } from '../components/common/Card';

export const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/30 text-xs font-bold uppercase">
          <Shield className="w-4 h-4" />
          <span>DPDP Act 2023 Compliance</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Privacy Policy & Data Protection</h1>
        <p className="text-sm text-slate-400">
          Last revised: November 15, 2026 • Governing Law: Digital Personal Data Protection Act, 2023 (India)
        </p>
      </div>

      <Card className="space-y-6 text-sm text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">1. Principles of Data Minimization</h2>
          <p>
            FraudShield operates on a strict "Zero Persistent PII" architecture. When you submit an SMS,
            screenshot, or URL for analysis:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-slate-400">
            <li>Any 16-digit card numbers, bank account credentials, CVVs, and Aadhaar numbers are redacted in volatile memory before storage.</li>
            <li>Uploaded screenshot images are held in temporary encrypted RAM and purged within 24 hours.</li>
            <li>We do NOT store unredacted bank transaction SMS alerts.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">2. Consent Logging (Section 6 DPDP)</h2>
          <p>
            Each threat evaluation requires your explicit consent checkbox. A cryptographically hashed record
            verifying that you authorized the analysis is recorded in our audit logs to comply with Indian regulatory guidelines.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">3. Trusted Contacts & SOS Notifications</h2>
          <p>
            If you designate Family Guardians, you authorize FraudShield to transmit critical threat alerts
            (including threat verdicts and risk categories) to their provided phone numbers or email addresses when a scan triggers a Critical Risk threshold.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">4. Your Rights (Right to be Forgotten)</h2>
          <p>
            You have the complete legal right under DPDP 2023 to review, export, or permanently erase all your historical analysis data from our database at any time through your Profile & Settings panel.
          </p>
        </section>
      </Card>
    </div>
  );
};
