import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Zap,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileText,
  PhoneCall,
  Smartphone,
  CreditCard,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';

const SCAM_ARTICLES = [
  {
    id: 'scam-1',
    category: 'ELECTRICITY',
    title: 'Electricity Bill Disconnection SMS Scam',
    tag: 'Highest Frequency in India',
    severity: 'CRITICAL',
    summary:
      'Victims receive an SMS threatening power disconnection within hours unless they call a mobile number or click an unverified link.',
    modusOperandi: [
      'Scammer sends SMS claiming power station disconnection tonight at 9:30 PM.',
      'Includes a personal 10-digit mobile number labeled as "Electricity Officer".',
      'When called, the scammer instructs the victim to download a remote support app (AnyDesk) or transfer a nominal ₹10 test fee via a phishing link.',
      'Once the app is installed or credentials typed, the attacker drains the linked bank accounts.',
    ],
    redFlags: [
      'Disconnection threatened with unrealistic urgency (< 2 hours).',
      'Message directs to a personal mobile number, not official discom toll-free lines.',
      'URL uses bit.ly, tinyurl, or suspicious .in/.org domains.',
    ],
    safePractice:
      'State electricity boards never cut power without formal postal notices, nor do they collect payments via personal phone calls. Always pay directly on your official discom portal.',
  },
  {
    id: 'scam-2',
    category: 'UPI_COLLECT',
    title: 'Deceptive Cashback & Refund UPI QR Scams',
    tag: 'OLX & Marketplace Scams',
    severity: 'CRITICAL',
    summary:
      'Scammers send collect requests or QR codes claiming "Scan this QR to receive your cashback / OLX payment".',
    modusOperandi: [
      'A seller lists an item on OLX or Facebook Marketplace. A buyer agrees immediately without bargaining.',
      'Buyer sends a payment QR code saying: "Scan this to receive advance payment into your Google Pay".',
      'The QR is technically encoded as an auto-debit collect request.',
      'Victim scans and enters their UPI PIN thinking they are verifying reception; instead, their account is debited.',
    ],
    redFlags: [
      'Claim that you need to enter your PIN to "receive" or "unlock" money.',
      'Transaction note says "Cashback Received" but the prompt asks for UPI PIN.',
    ],
    safePractice:
      'Remember the Universal Rule of UPI: You ONLY enter your UPI PIN to SEND money or check your balance. You NEVER enter a PIN to receive money.',
  },
  {
    id: 'scam-3',
    category: 'DIGITAL_ARREST',
    title: 'Digital Arrest & Fake Police / CBI Video Call Scams',
    tag: 'Severe Psychological Coercion',
    severity: 'CRITICAL',
    summary:
      'Scammers impersonate police, customs officials, or CBI on Skype/WhatsApp video calls in fake police station setups, claiming you are under "Digital Arrest".',
    modusOperandi: [
      'Victim receives an IVR call claiming an illegal parcel (drugs, fake passports) has been detained at Mumbai Customs.',
      'Call is transferred to an "investigating officer" dressed in police uniform with realistic police backdrops.',
      'Attacker demands that the victim transfer their entire savings to a "RBI Verification Escrow Account" for legal clearance.',
    ],
    redFlags: [
      'There is NO legal provision for "Digital Arrest" under Indian law.',
      'Law enforcement agencies (CBI, ED, Police) NEVER conduct interrogations or demand fund transfers over video calls.',
    ],
    safePractice:
      'Immediately disconnect the video call. Do not transfer funds. Report the caller\'s phone number on the Chakshu portal (sancharsaathi.gov.in) and call 1930.',
  },
  {
    id: 'scam-4',
    category: 'KYC_EXPIRY',
    title: 'Bank KYC & PAN Card Update Phishing SMS',
    tag: 'Banking Credential Theft',
    severity: 'HIGH',
    summary:
      'Fake SMS spoofing major banks (SBI, HDFC, PNB) claiming account suspension unless KYC/PAN is verified on a linked portal.',
    modusOperandi: [
      'SMS received from header like "VM-SBINB" stating: "Dear customer, your YONO account is blocked today due to pending KYC update."',
      'Victim clicks the link, landing on an exact visual clone of the bank login portal.',
      'Victim enters net banking username, password, and subsequent OTP.',
      'Attacker intercepts credentials in real time and transfers money.',
    ],
    redFlags: [
      'Shortened URL or domain ending in .cc, .top, or .xyz rather than .sbi or official bank domain.',
      'Banks never ask for online KYC updates through unsolicited SMS links.',
    ],
    safePractice:
      'Always open your official banking app directly from your phone screen. Never click links in SMS to update documents.',
  },
];

export const FraudAwareness = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const filteredArticles = SCAM_ARTICLES.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/30 text-xs font-bold uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>Indian Cyber Threat Intelligence Library</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          {t('awareness.title')}
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {t('awareness.subtitle')}
        </p>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#112240] border border-[#233554] flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder={t('awareness.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0A192F] text-slate-100 rounded-xl pl-10 pr-4 py-2.5 border border-[#233554] text-xs focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'ELECTRICITY', 'UPI_COLLECT', 'DIGITAL_ARREST', 'KYC_EXPIRY'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-teal-500 text-navy-950 font-extrabold'
                  : 'bg-[#0A192F] text-slate-400 hover:text-white border border-[#233554]'
              }`}
            >
              {cat === 'ALL' ? t('awareness.allCategories') : cat.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Stream */}
      <div className="space-y-6">
        {filteredArticles.map((article) => (
          <Card key={article.id} className="space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#233554]/60 pb-4">
              <div>
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                  {article.tag}
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">{article.title}</h3>
              </div>
              <Badge level={article.severity} size="md" />
            </div>

            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              {article.summary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* How scam unfolds */}
              <div className="p-4 rounded-xl bg-[#0A192F] border border-[#233554] space-y-2">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <XCircle className="w-4 h-4" />
                  <span>Modus Operandi (How It Works)</span>
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {article.modusOperandi.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-rose-400 font-bold shrink-0">•</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Red Flags & Safe Practice */}
              <div className="p-4 rounded-xl bg-[#0A192F] border border-[#233554] space-y-3 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Key Red Flags</span>
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {article.redFlags.map((flag, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-400 font-bold shrink-0">⚠</span>
                        <span>{flag}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-lg bg-teal-950/40 border border-teal-500/30 text-xs text-teal-200">
                  <strong>Safe Rule:</strong> {article.safePractice}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
