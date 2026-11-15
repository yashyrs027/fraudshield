import React from 'react';
import { FileText, AlertTriangle } from 'lucide-react';
import { Card } from '../components/common/Card';

export const TermsConditions = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-bold uppercase">
          <FileText className="w-4 h-4" />
          <span>Legal Agreement</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Terms & Conditions of Service</h1>
        <p className="text-sm text-slate-400">Effective Date: November 15, 2026</p>
      </div>

      <Card className="space-y-6 text-sm text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">1. Nature of the Advisory Service</h2>
          <p>
            FraudShield provides AI-driven threat intelligence and heuristic risk scoring for digital payment
            communications. While our detection models exceed 96% precision, no automated tool can guarantee 100% elimination of zero-day social engineering scams.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">2. User Responsibility & The Universal UPI Rule</h2>
          <p>
            Users are advised to always adhere to the fundamental rule of Indian digital payments:{' '}
            <strong className="text-teal-300">
              Entering your UPI PIN always deducts money from your account. You NEVER need to enter a UPI PIN to receive money, cashback, or merchant refunds.
            </strong>
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">3. Limitation of Financial Liability</h2>
          <p>
            FraudShield is an informational and defensive utility. The platform and its developers assume no
            liability for unauthorized transactions, delays by banks or telecom providers, or failure by users to report incidents to official portals (1930 / cybercrime.gov.in) within the golden hour.
          </p>
        </section>
      </Card>
    </div>
  );
};
