import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ExternalLink, Heart } from 'lucide-react';
import { NATIONAL_CYBER_CRIME } from '../../constants/indianBanks';

export const Footer = () => {
  return (
    <footer className="w-full bg-[#081220] border-t border-[#233554]/80 text-slate-400 py-12 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-teal-500 text-navy-950">
                <Shield className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-xl font-extrabold text-white">
                Fraud<span className="text-teal-400">Shield</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              India's dedicated pre-transaction digital fraud defense system. Powered by explainable
              AI to safeguard citizens and senior citizens across the UPI ecosystem.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#112240] text-teal-300 border border-teal-500/30 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
              <span>DPDP Act 2023 Compliant</span>
            </div>
          </div>

          {/* Quick Threat Tools */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Analysis Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/analyze/message" className="hover:text-teal-400 transition-colors">
                  SMS & Message Threat Scanner
                </Link>
              </li>
              <li>
                <Link to="/analyze/qr" className="hover:text-teal-400 transition-colors">
                  QR Code & UPI Deep-Link Verifier
                </Link>
              </li>
              <li>
                <Link to="/analyze/url" className="hover:text-teal-400 transition-colors">
                  Website Typosquatting Checker
                </Link>
              </li>
              <li>
                <Link to="/incident-center" className="hover:text-rose-400 transition-colors">
                  Emergency Fraud Response Playbook
                </Link>
              </li>
            </ul>
          </div>

          {/* Official Indian Cybersecurity Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Official Indian Portals
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href={NATIONAL_CYBER_CRIME.portal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-teal-400 transition-colors flex items-center gap-1.5"
                >
                  <span>National Cyber Crime Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="tel:1930"
                  className="hover:text-rose-400 transition-colors flex items-center gap-1.5 font-bold text-rose-300"
                >
                  <span>National Cyber Helpline (1930)</span>
                </a>
              </li>
              <li>
                <a
                  href={NATIONAL_CYBER_CRIME.chakshuPortal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-teal-400 transition-colors flex items-center gap-1.5"
                >
                  <span>Chakshu (Sanchar Saathi)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href={NATIONAL_CYBER_CRIME.rbiSachet}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-teal-400 transition-colors flex items-center gap-1.5"
                >
                  <span>RBI Sachet Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Legal & Privacy
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/privacy-policy" className="hover:text-teal-400 transition-colors">
                  Privacy Policy & Data Masking
                </Link>
              </li>
              <li>
                <Link to="/terms-conditions" className="hover:text-teal-400 transition-colors">
                  Terms of Service & Disclaimer
                </Link>
              </li>
              <li>
                <Link to="/awareness" className="hover:text-teal-400 transition-colors">
                  Fraud Awareness Articles
                </Link>
              </li>
              <li>
                <span className="text-slate-500">Zero Persistent PII Storage</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#233554]/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} FraudShield India. Built for citizen financial safety.</p>
          <p className="flex items-center gap-1">
            <span>Securing Bharat with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>& AI Intelligence</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
