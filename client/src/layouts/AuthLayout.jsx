import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Shield, CheckCircle2 } from 'lucide-react';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#0A192F] text-slate-100">
      {/* Left Info Column (Desktop) */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-[#112240] to-[#0A192F] border-r border-[#233554]/80">
        <div>
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-teal-500 text-navy-950 shadow-lg shadow-teal-500/20">
              <Shield className="w-8 h-8 stroke-[2.5]" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-white">
              Fraud<span className="text-teal-400">Shield</span>
            </span>
          </Link>

          <div className="mt-16 space-y-6 max-w-md">
            <h2 className="text-3xl font-extrabold text-white leading-tight">
              Pre-Transaction Cyber Fraud Defense for India.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Verify SMS messages, suspicious payment QR codes, and malicious banking links before
              entering your UPI PIN.
            </p>

            <div className="pt-6 space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-200">
                  Real-time Explainable AI scoring with factor breakdown
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-200">
                  Instant SMS & SOS alert delivery to your designated Family Guardians
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-200">
                  1-Click official 1930 Cybercrime and Indian bank freeze templates
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-500">
          © {new Date().getFullYear()} FraudShield. Digital Personal Data Protection (DPDP) 2023 Compliant.
        </div>
      </div>

      {/* Right Form Column */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-teal-500 text-navy-950">
                <Shield className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white">
                Fraud<span className="text-teal-400">Shield</span>
              </span>
            </Link>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
