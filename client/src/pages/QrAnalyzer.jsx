import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  QrCode,
  Upload,
  X,
  ShieldCheck,
  AlertOctagon,
  Info,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { qrAnalysisSchema } from '../validation/schemas';
import { analysisService } from '../services/analysisService';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';

export const QrAnalyzer = () => {
  const { t } = useLanguage();
  const { error: toastError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'uri'
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const initialUri = location.state?.initialUri || '';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(qrAnalysisSchema),
    defaultValues: {
      qrPayload: initialUri,
      consentGranted: true,
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toastError('Please upload an image file (JPEG, PNG, or WebP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toastError('File size exceeds 10 MB limit.');
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

  const setSampleUri = () => {
    setValue(
      'qrPayload',
      'upi://pay?pa=fraudster99@ybl&pn=Cashback_Refund_Desk&mc=0000&tr=99887766&tn=Cashback%20Refund%20Reward&am=4999.00&cu=INR'
    );
    setActiveTab('uri');
  };

  const onSubmit = async (data) => {
    if (activeTab === 'upload' && !selectedFile) {
      toastError('Please choose a QR code image to analyze.');
      return;
    }

    try {
      setAnalyzing(true);
      const res = await analysisService.analyzeQr({
        file: selectedFile,
        qrPayload: data.qrPayload,
        consentGranted: data.consentGranted,
      });

      if (res.data?.sessionId) {
        navigate(`/results/${res.data.sessionId}`, { state: { resultData: res.data } });
      }
    } catch (err) {
      toastError(err.response?.data?.error?.message || 'Failed to complete QR analysis.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-bold">
          <QrCode className="w-4 h-4" />
          <span>Pre-Transaction UPI Protocol Dissector</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">{t('qrAnalyzer.title')}</h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">{t('qrAnalyzer.subtitle')}</p>
      </div>

      {/* Senior Golden Rule Box */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/60 via-[#112240] to-amber-950/40 border-2 border-amber-500/50 shadow-xl flex items-start gap-4">
        <AlertOctagon className="w-8 h-8 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-amber-300 uppercase tracking-wide">
            Golden Payment Safety Rule
          </h4>
          <p className="text-sm font-semibold text-white leading-relaxed">
            {t('qrAnalyzer.importantWarning')}
          </p>
        </div>
      </div>

      {/* Tabs & Form Card */}
      <Card>
        {/* Ingress Tabs */}
        <div className="flex border-b border-[#233554] mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'upload'
                ? 'border-teal-400 text-teal-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>{t('qrAnalyzer.tabUpload')}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('uri')}
            className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'uri'
                ? 'border-teal-400 text-teal-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>{t('qrAnalyzer.tabRawUri')}</span>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {activeTab === 'upload' ? (
            <div className="space-y-4">
              {!previewUrl ? (
                <label className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-[#233554] hover:border-teal-400/50 bg-[#0A192F] text-center cursor-pointer transition-colors group">
                  <div className="p-4 rounded-2xl bg-teal-500/10 text-teal-400 group-hover:scale-110 transition-transform mb-3">
                    <QrCode className="w-8 h-8" />
                  </div>
                  <span className="text-sm font-bold text-white mb-1">
                    Upload or take photo of the payment QR code
                  </span>
                  <span className="text-xs text-slate-400">
                    Supports counter standees, Google Pay, PhonePe, and Paytm receipts (Max 10MB)
                  </span>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              ) : (
                <div className="p-4 rounded-2xl bg-[#0A192F] border border-[#233554] flex flex-col sm:flex-row items-center gap-6">
                  <img
                    src={previewUrl}
                    alt="Scanned QR preview"
                    className="w-32 h-32 object-contain rounded-xl border border-[#233554] bg-white p-2"
                  />
                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <div className="text-sm font-bold text-white">{selectedFile?.name}</div>
                    <div className="text-xs text-slate-400">
                      File Size: {((selectedFile?.size || 0) / 1024).toFixed(1)} KB
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={removeFile}
                      icon={X}
                    >
                      Choose Different Photo
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <Input
                label="UPI Deep-Link String (`upi://pay?...`)"
                placeholder={t('qrAnalyzer.uriPlaceholder')}
                {...register('qrPayload')}
                error={errors.qrPayload?.message}
                helperText="Paste decoded string from any QR scanner or SMS payment link"
              />

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-400">Want to test a known scam pattern?</span>
                <button
                  type="button"
                  onClick={setSampleUri}
                  className="text-teal-400 hover:underline font-semibold flex items-center gap-1"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Load Sample Reverse Debit UPI Link</span>
                </button>
              </div>
            </div>
          )}

          {/* Consent Checkbox */}
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

          {/* Submit */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full text-base font-bold shadow-xl shadow-teal-500/20"
            isLoading={analyzing}
            icon={ShieldCheck}
          >
            {analyzing ? t('common.analyzing') : t('qrAnalyzer.btnAnalyze')}
          </Button>
        </form>
      </Card>
    </div>
  );
};
