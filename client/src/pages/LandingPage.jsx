import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  MessageSquare,
  QrCode,
  Globe,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Zap,
  Lock,
  PhoneCall,
  Accessibility,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';

export const LandingPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [quickInput, setQuickInput] = useState('');

  const handleQuickScan = (e) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    if (quickInput.startsWith('http://') || quickInput.startsWith('https://')) {
      navigate('/analyze/url', { state: { initialUrl: quickInput } });
    } else if (quickInput.startsWith('upi://')) {
      navigate('/analyze/qr', { state: { initialUri: quickInput } });
    } else {
      navigate('/analyze/message', { state: { initialText: quickInput } });
    }
  };

  return (
    <div className="space-y-20">
      {/* 1. Hero Section */}
      <section className="relative pt-6 pb-12 overflow-hidden text-center max-w-4xl mx-auto space-y-8">
        {/* Government 1930 Helpline Aligned Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30 text-xs font-bold tracking-wide uppercase shadow-sm">
          <ShieldCheck className="w-4 h-4 text-teal-400" />
          <span>{t('landing.heroBadge')}</span>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            {t('landing.heroTitle')}
          </h1>
          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t('landing.heroSubtitle')}
          </p>
        </div>

        {/* Quick Ingress Action Box */}
        <form
          onSubmit={handleQuickScan}
          className="max-w-2xl mx-auto p-2 rounded-2xl bg-[#112240] border border-[#233554] shadow-2xl flex flex-col sm:flex-row gap-2"
        >
          <input
            type="text"
            value={quickInput}
            onChange={(e) => setQuickInput(e.target.value)}
            placeholder="Paste suspicious SMS, UPI link, or website URL here..."
            className="flex-1 bg-transparent px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none"
          />
          <Button type="submit" variant="primary" size="md" icon={Zap}>
            <span>{t('common.scanNow')}</span>
          </Button>
        </form>

        {/* Quick CTAs for Specific Analyzers */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link to="/analyze/message">
            <Button variant="secondary" size="lg" icon={MessageSquare}>
              {t('landing.ctaScanMessage')}
            </Button>
          </Link>
          <Link to="/analyze/qr">
            <Button variant="outline" size="lg" icon={QrCode}>
              {t('landing.ctaScanQr')}
            </Button>
          </Link>
        </div>

        {/* Live Protection Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-[#233554]/60 max-w-3xl mx-auto">
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-teal-400">
              {t('landing.statsSaved')}
            </div>
            <div className="text-xs text-slate-400 font-medium">Citizen Losses Intercepted</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {t('landing.statsScans')}
            </div>
            <div className="text-xs text-slate-400 font-medium">Scams Evaluated & Flagged</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400">
              {t('landing.statsLatency')}
            </div>
            <div className="text-xs text-slate-400 font-medium">Average Analysis Verdict Time</div>
          </div>
        </div>
      </section>

      {/* 2. Three Pillars Threat Suite */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {t('landing.threePillarsTitle')}
          </h2>
          <p className="text-sm text-slate-400">{t('landing.threePillarsSub')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1: SMS Analyzer */}
          <Card
            hoverable
            className="flex flex-col justify-between"
            icon={MessageSquare}
            title={t('landing.feature1Title')}
            badge={<Badge level="HIGH" size="sm" />}
          >
            <div className="space-y-4">
              <p className="text-sm text-slate-300 leading-relaxed">
                {t('landing.feature1Desc')}
              </p>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>State Electricity Disconnection alerts</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Bank KYC & PAN Card expiry scams</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Digital Arrest & fake police extortion</span>
                </li>
              </ul>
            </div>
            <div className="pt-6">
              <Link to="/analyze/message">
                <Button variant="secondary" size="sm" className="w-full" icon={ArrowRight}>
                  Launch SMS Scanner
                </Button>
              </Link>
            </div>
          </Card>

          {/* Pillar 2: QR & UPI Analyzer */}
          <Card
            hoverable
            className="flex flex-col justify-between"
            icon={QrCode}
            title={t('landing.feature2Title')}
            badge={<Badge level="CRITICAL" size="sm" />}
          >
            <div className="space-y-4">
              <p className="text-sm text-slate-300 leading-relaxed">
                {t('landing.feature2Desc')}
              </p>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Reverse UPI Collect Debit detection</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Tampered store QR sticker verification</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Forged Google Pay payment receipt checks</span>
                </li>
              </ul>
            </div>
            <div className="pt-6">
              <Link to="/analyze/qr">
                <Button variant="secondary" size="sm" className="w-full" icon={ArrowRight}>
                  Launch QR Verifier
                </Button>
              </Link>
            </div>
          </Card>

          {/* Pillar 3: Link & APK Inspector */}
          <Card
            hoverable
            className="flex flex-col justify-between"
            icon={Globe}
            title={t('landing.feature3Title')}
            badge={<Badge level="CAUTION" size="sm" />}
          >
            <div className="space-y-4">
              <p className="text-sm text-slate-300 leading-relaxed">
                {t('landing.feature3Desc')}
              </p>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Typosquatting checks (SBI, HDFC, ICICI)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Malicious Android APK payload detection</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Safe unshortening of obfuscated URLs</span>
                </li>
              </ul>
            </div>
            <div className="pt-6">
              <Link to="/analyze/url">
                <Button variant="secondary" size="sm" className="w-full" icon={ArrowRight}>
                  Launch URL Checker
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* 3. Senior Citizen & Family Protection Banner */}
      <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-teal-950/60 via-[#112240] to-[#1E3A8A]/40 border border-teal-500/30 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold">
            <Accessibility className="w-4 h-4" />
            <span>Senior-Citizen-First Design</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            {t('landing.seniorBannerTitle')}
          </h3>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {t('landing.seniorBannerDesc')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <Link to="/register">
            <Button variant="primary" size="lg">
              Set Up Family Guardian
            </Button>
          </Link>
          <Link to="/awareness">
            <Button variant="outline" size="lg">
              Explore Scam Guides
            </Button>
          </Link>
        </div>
      </section>

      {/* 4. How It Works in 3 Steps */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {t('landing.howItWorksTitle')}
          </h2>
          <p className="text-sm text-slate-400">
            Simple, explainable, and instantaneous protection before you take any action.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#112240] border border-[#233554] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-lg border border-teal-500/30">
              1
            </div>
            <h4 className="text-lg font-bold text-white">{t('landing.step1Title')}</h4>
            <p className="text-sm text-slate-300 leading-relaxed">{t('landing.step1Desc')}</p>
          </div>

          <div className="p-6 rounded-2xl bg-[#112240] border border-[#233554] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-lg border border-cyan-500/30">
              2
            </div>
            <h4 className="text-lg font-bold text-white">{t('landing.step2Title')}</h4>
            <p className="text-sm text-slate-300 leading-relaxed">{t('landing.step2Desc')}</p>
          </div>

          <div className="p-6 rounded-2xl bg-[#112240] border border-[#233554] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg border border-emerald-500/30">
              3
            </div>
            <h4 className="text-lg font-bold text-white">{t('landing.step3Title')}</h4>
            <p className="text-sm text-slate-300 leading-relaxed">{t('landing.step3Desc')}</p>
          </div>
        </div>
      </section>

      {/* 5. Emergency Incident Strip */}
      <section className="p-6 rounded-2xl bg-rose-950/40 border border-rose-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-rose-600 text-white">
            <PhoneCall className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h4 className="text-base font-bold text-rose-200">
              Have you already sent money or entered your UPI PIN?
            </h4>
            <p className="text-xs text-rose-300">
              Access the step-by-step Golden Hour freeze protocol and National Cyber Helpline 1930.
            </p>
          </div>
        </div>
        <Link to="/incident-center">
          <Button variant="danger" size="md">
            Open Fraud Response Center
          </Button>
        </Link>
      </section>
    </div>
  );
};
