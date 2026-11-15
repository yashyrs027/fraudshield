import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Globe,
  ShieldCheck,
  Zap,
  Lock,
  Search,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { urlAnalysisSchema } from '../validation/schemas';
import { analysisService } from '../services/analysisService';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';

export const UrlChecker = () => {
  const { t } = useLanguage();
  const { error: toastError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [analyzing, setAnalyzing] = useState(false);
  const initialUrl = location.state?.initialUrl || '';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(urlAnalysisSchema),
    defaultValues: {
      url: initialUrl,
      consentGranted: true,
    },
  });

  const loadSampleUrl = (type) => {
    if (type === 'phish') {
      setValue('url', 'http://sbi-kyc-verify-portal.in/login.php');
    } else if (type === 'apk') {
      setValue('url', 'http://electricity-bill-pay.org/update-app.apk');
    } else if (type === 'safe') {
      setValue('url', 'https://www.onlinesbi.sbi');
    }
  };

  const onSubmit = async (data) => {
    try {
      setAnalyzing(true);
      const res = await analysisService.analyzeUrl({
        url: data.url,
        consentGranted: data.consentGranted,
      });

      if (res.data?.sessionId) {
        navigate(`/results/${res.data.sessionId}`, { state: { resultData: res.data } });
      }
    } catch (err) {
      toastError(err.response?.data?.error?.message || 'Failed to check URL safety.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold">
          <Globe className="w-4 h-4" />
          <span>SSRF-Protected URL & Typosquatting Inspector</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">{t('urlChecker.title')}</h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">{t('urlChecker.subtitle')}</p>
      </div>

      {/* Quick Test Samples */}
      <div className="p-4 rounded-2xl bg-[#112240] border border-[#233554] space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-teal-400" />
          <span>Try Sample Targets:</span>
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => loadSampleUrl('phish')}
            className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-colors"
          >
            🚨 Fake SBI KYC Phishing Portal
          </button>
          <button
            type="button"
            onClick={() => loadSampleUrl('apk')}
            className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-colors"
          >
            📦 Malicious Electricity APK Link
          </button>
          <button
            type="button"
            onClick={() => loadSampleUrl('safe')}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-colors"
          >
            🛡️ Official SBI Domain (onlinesbi.sbi)
          </button>
        </div>
      </div>

      {/* URL Input Form */}
      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Suspicious Web Link or Short URL"
            placeholder={t('urlChecker.placeholder')}
            icon={Globe}
            {...register('url')}
            error={errors.url?.message}
            helperText="Enter shortened links (bit.ly, tinyurl) or suspicious banking domains"
          />

          {/* Active Security Check Matrix Callout */}
          <div className="p-5 rounded-2xl bg-[#0A192F] border border-[#233554] space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Pre-Flight Inspection Checks
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Anti-SSRF Private IP Sandboxing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Levenshtein Distance Brand Matching</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Domain Age (&lt;30 days High Risk)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Direct .APK / Sideload File Detection</span>
              </div>
            </div>
          </div>

          {/* DPDP Consent */}
          <div className="p-4 rounded-xl bg-[#0A192F]/60 border border-[#233554]">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register('consentGranted')}
                className="mt-1 w-4 h-4 text-teal-500 rounded bg-[#112240] border-[#233554] focus:ring-teal-400"
              />
              <span className="text-xs text-slate-300 leading-relaxed">
                {t('common.consentNotice')}
              </span>
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full text-base font-bold shadow-xl shadow-teal-500/20"
            isLoading={analyzing}
            icon={ShieldCheck}
          >
            {analyzing ? t('common.analyzing') : t('urlChecker.btnCheck')}
          </Button>
        </form>
      </Card>
    </div>
  );
};
