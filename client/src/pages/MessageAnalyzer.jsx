import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  MessageSquare,
  Upload,
  X,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Zap,
  Info,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { messageAnalysisSchema } from '../validation/schemas';
import { analysisService } from '../services/analysisService';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';

export const MessageAnalyzer = () => {
  const { t } = useLanguage();
  const { error: toastError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const initialText = location.state?.initialText || '';

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(messageAnalysisSchema),
    defaultValues: {
      content: initialText,
      senderHeader: '',
      consentGranted: true,
    },
  });

  const contentValue = watch('content') || '';

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toastError('Please upload an image file (JPEG, PNG, or WebP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toastError('File size exceeds the 10 MB limit.');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const setExampleText = (type) => {
    if (type === 'electricity') {
      setValue(
        'content',
        'Dear Customer, your electricity power will be disconnected tonight at 9:30 PM from the power station due to pending bill update. Immediately contact Electricity Officer Mr. Verma at 9876543210 or update bill: http://bit.ly/power-bill-updt'
      );
      setValue('senderHeader', 'VM-POWERT');
    } else if (type === 'kyc') {
      setValue(
        'content',
        'Dear Customer, your SBI YONO account and debit card are suspended due to incomplete KYC documentation. Please click immediately to update your PAN and Aadhaar: http://sbi-kyc-verify-portal.in/login.php'
      );
      setValue('senderHeader', 'AD-SBINB');
    } else if (type === 'legitimate') {
      setValue(
        'content',
        'Your A/C ending 4589 has been credited with INR 45,000.00 on 15-Nov-2026 by NEFT-SALARY. Available Balance: INR 82,410.50. Call 18002026161 if not requested by you.'
      );
      setValue('senderHeader', 'AD-HDFCBK');
    }
  };

  const onSubmit = async (data) => {
    try {
      setAnalyzing(true);
      const res = await analysisService.analyzeMessage({
        content: data.content,
        senderHeader: data.senderHeader,
        file: selectedFile,
        consentGranted: data.consentGranted,
      });

      if (res.data?.sessionId) {
        navigate(`/results/${res.data.sessionId}`, { state: { resultData: res.data } });
      }
    } catch (err) {
      toastError(err.response?.data?.error?.message || 'Failed to complete message analysis.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/30 text-xs font-bold">
          <MessageSquare className="w-4 h-4" />
          <span>Pre-Transaction Natural Language Defense</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">{t('messageAnalyzer.title')}</h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          {t('messageAnalyzer.subtitle')}
        </p>
      </div>

      {/* Quick Example Loaders */}
      <div className="p-4 rounded-2xl bg-[#112240] border border-[#233554] space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-teal-400" />
          <span>{t('messageAnalyzer.quickExamples')}</span>
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setExampleText('electricity')}
            className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-colors"
          >
            ⚡ {t('messageAnalyzer.exampleElectricity')}
          </button>
          <button
            type="button"
            onClick={() => setExampleText('kyc')}
            className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-colors"
          >
            💳 {t('messageAnalyzer.exampleKyc')}
          </button>
          <button
            type="button"
            onClick={() => setExampleText('legitimate')}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-colors"
          >
            🛡️ {t('messageAnalyzer.exampleLegitimate')}
          </button>
        </div>
      </div>

      {/* Analyzer Form */}
      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Textarea Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="message-content" className="block text-sm font-semibold text-slate-200">
                Suspicious SMS / WhatsApp Text Message
              </label>
              <span className="text-xs text-slate-400 font-mono">
                {contentValue.length} / 5,000 chars
              </span>
            </div>
            <textarea
              id="message-content"
              rows={6}
              {...register('content')}
              placeholder={t('messageAnalyzer.placeholderText')}
              className={`w-full bg-[#0A192F] text-slate-100 rounded-xl p-4 border transition-colors text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                errors.content ? 'border-rose-500' : 'border-[#233554]'
              }`}
            />
            {errors.content && (
              <p className="text-xs text-rose-400 font-medium">{errors.content.message}</p>
            )}
          </div>

          {/* Optional Sender Header */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t('messageAnalyzer.senderHeaderLabel')}
              placeholder={t('messageAnalyzer.senderHeaderPlaceholder')}
              {...register('senderHeader')}
              error={errors.senderHeader?.message}
              helperText="E.g., TRAI DLT shortcode or phone number that delivered the SMS"
            />

            {/* File Upload Section */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-200">
                {t('messageAnalyzer.uploadScreenshot')}
              </label>
              {!previewUrl ? (
                <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-[#233554] hover:border-teal-400/50 bg-[#0A192F] text-slate-300 text-xs font-semibold cursor-pointer transition-colors">
                  <Upload className="w-4 h-4 text-teal-400" />
                  <span>Choose screenshot image (Max 10MB)</span>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              ) : (
                <div className="flex items-center justify-between p-2 rounded-xl bg-[#0A192F] border border-[#233554]">
                  <div className="flex items-center gap-3">
                    <img
                      src={previewUrl}
                      alt="Upload preview"
                      className="w-10 h-10 object-cover rounded-lg border border-[#233554]"
                    />
                    <div className="text-xs">
                      <div className="font-semibold text-white max-w-[180px] truncate">
                        {selectedFile?.name}
                      </div>
                      <div className="text-slate-400">
                        {((selectedFile?.size || 0) / 1024).toFixed(1)} KB
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* DPDP Consent Checkbox */}
          <div className="p-4 rounded-xl bg-[#0A192F]/60 border border-[#233554] space-y-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register('consentGranted')}
                className="mt-1 w-4 h-4 text-teal-500 rounded bg-[#112240] border-[#233554] focus:ring-teal-400"
              />
              <span className="text-xs text-slate-300 leading-relaxed">
                {t('common.consentNotice')} Personal numbers and bank credentials are automatically
                masked prior to storage.
              </span>
            </label>
            {errors.consentGranted && (
              <p className="text-xs text-rose-400 font-medium pl-7">
                {errors.consentGranted.message}
              </p>
            )}
          </div>

          {/* Submit Action */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full text-base font-bold shadow-xl shadow-teal-500/20"
            isLoading={analyzing}
            icon={ShieldCheck}
          >
            {analyzing ? t('common.analyzing') : t('messageAnalyzer.btnAnalyze')}
          </Button>
        </form>
      </Card>
    </div>
  );
};
