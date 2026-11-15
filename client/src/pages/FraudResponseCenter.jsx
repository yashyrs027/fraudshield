import React, { useState } from 'react';
import {
  PhoneCall,
  ShieldAlert,
  AlertTriangle,
  Building,
  Smartphone,
  ExternalLink,
  Search,
  CheckCircle2,
  FileText,
  Copy,
  Check,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { INDIAN_BANKS_DIRECTORY, NATIONAL_CYBER_CRIME } from '../constants/indianBanks';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';

export const FraudResponseCenter = () => {
  const { t } = useLanguage();
  const { success: toastSuccess } = useToast();

  const [bankSearch, setBankSearch] = useState('');
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [copiedBankId, setCopiedBankId] = useState(null);

  // Filtered Banks
  const filteredBanks = INDIAN_BANKS_DIRECTORY.filter((b) =>
    b.name.toLowerCase().includes(bankSearch.toLowerCase()) ||
    b.shortName.toLowerCase().includes(bankSearch.toLowerCase())
  );

  const copySmsFormat = (bank) => {
    navigator.clipboard.writeText(bank.smsFormat);
    setCopiedBankId(bank.id);
    toastSuccess(`Copied SMS format for ${bank.shortName}`);
    setTimeout(() => setCopiedBankId(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-600/20 text-rose-300 border border-rose-500/40 text-xs font-bold uppercase tracking-wider">
          <PhoneCall className="w-4 h-4 animate-pulse" />
          <span>Emergency Cybercrime Action Protocol</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          {t('responseCenter.title')}
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {t('responseCenter.subtitle')}
        </p>
      </div>

      {/* Golden Hour Urgency Callout */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-rose-950 via-[#112240] to-rose-950 border-2 border-rose-500/60 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
            Immediate Action Required
          </span>
          <h2 className="text-2xl font-black text-white">The Golden 2-Hour Window</h2>
          <p className="text-sm text-rose-200/90 max-w-xl">
            {t('responseCenter.goldenHourNotice')}
          </p>
        </div>

        <a
          href="tel:1930"
          className="shrink-0 inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-lg shadow-xl shadow-rose-600/40 hover:scale-105 active:scale-95 transition-all"
        >
          <PhoneCall className="w-6 h-6 animate-bounce" />
          <span>CALL 1930 NOW</span>
        </a>
      </div>

      {/* 4-Step Interactive Containment Playbook */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-400" />
          <span>Step-by-Step Incident Containment Checklist</span>
        </h2>

        {/* Step 1: Bank Freeze */}
        <Card
          title={t('responseCenter.step1Title')}
          subtitle={t('responseCenter.step1Desc')}
          icon={Building}
        >
          <div className="space-y-4">
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="text"
                placeholder={t('responseCenter.filterBank')}
                value={bankSearch}
                onChange={(e) => setBankSearch(e.target.value)}
                className="w-full bg-[#0A192F] text-slate-100 rounded-xl pl-10 pr-4 py-2.5 border border-[#233554] text-xs focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBanks.map((bank) => (
                <div
                  key={bank.id}
                  className="p-4 rounded-xl bg-[#0A192F] border border-[#233554] space-y-3 hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">{bank.shortName}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {bank.officialDomain}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Fraud Helpline:</span>
                      <a
                        href={`tel:${bank.helpline}`}
                        className="text-teal-400 font-bold hover:underline"
                      >
                        {bank.helpline}
                      </a>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>SMS Shortcode:</span>
                      <span className="font-mono text-slate-200">{bank.smsBlockNumber}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#233554] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => copySmsFormat(bank)}
                      className="text-[11px] font-semibold text-slate-300 hover:text-white flex items-center gap-1"
                    >
                      {copiedBankId === bank.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied SMS Format</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy SMS Format</span>
                        </>
                      )}
                    </button>
                    <a
                      href={bank.disputePortal}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-semibold text-teal-400 hover:underline flex items-center gap-0.5"
                    >
                      <span>Dispute Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Step 2: National Cyber Crime Portal */}
        <Card
          title={t('responseCenter.step2Title')}
          subtitle={t('responseCenter.step2Desc')}
          icon={FileText}
          headerAction={
            <a
              href={NATIONAL_CYBER_CRIME.portal}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="primary" size="sm" icon={ExternalLink}>
                Open cybercrime.gov.in
              </Button>
            </a>
          }
        >
          <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
            <p>
              When reporting on the Government portal, make sure you have the following ready to
              receive an official Acknowledgement Number (Ack No):
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-200">
              <li className="flex items-center gap-2 p-2.5 rounded-lg bg-[#0A192F] border border-[#233554]">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Bank Account Number & IFSC</span>
              </li>
              <li className="flex items-center gap-2 p-2.5 rounded-lg bg-[#0A192F] border border-[#233554]">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>12-digit UPI RRN / Transaction ID</span>
              </li>
              <li className="flex items-center gap-2 p-2.5 rounded-lg bg-[#0A192F] border border-[#233554]">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Scammer's VPA Handle or Mobile Number</span>
              </li>
              <li className="flex items-center gap-2 p-2.5 rounded-lg bg-[#0A192F] border border-[#233554]">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Screenshot of SMS or debit notification</span>
              </li>
            </ul>
          </div>
        </Card>

        {/* Step 3: Smartphone Disinfection Checklist */}
        <Card
          title={t('responseCenter.step3Title')}
          subtitle={t('responseCenter.step3Desc')}
          icon={Smartphone}
        >
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-200 leading-relaxed">
                If the scammer instructed you to install any app to "verify", "update KYC", or "receive cashback", your phone may be actively compromised.
              </div>
            </div>

            <ol className="space-y-2.5 text-xs sm:text-sm text-slate-200">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  <strong>Turn on Airplane Mode immediately</strong> to cut off remote internet access to the phone.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  Check and uninstall screen-sharing applications:{' '}
                  <strong className="text-rose-300">AnyDesk, TeamViewer QuickSupport, RustDesk, or AirDroid</strong>.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  3
                </span>
                <span>
                  Open <em>Files / Downloads</em> and delete any recently downloaded <strong className="text-rose-300">.APK</strong> files.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  4
                </span>
                <span>
                  From a secondary safe device, change your net banking password and UPI PIN.
                </span>
              </li>
            </ol>
          </div>
        </Card>
      </div>
    </div>
  );
};
