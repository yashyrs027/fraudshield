import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Users,
  Copy,
  Check,
  Share2,
  FileDown,
  PhoneCall,
  Clock,
  ArrowLeft,
  Info,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { analysisService } from '../services/analysisService';
import { contactService } from '../services/contactService';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { RiskGauge } from '../components/analysis/RiskGauge';
import { ThreatRadar } from '../components/analysis/ThreatRadar';
import { ThreatIndicatorItem } from '../components/analysis/ThreatIndicatorItem';
import { ActionRecommendations } from '../components/analysis/ActionRecommendations';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

export const UnifiedResults = () => {
  const { sessionId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { success: toastSuccess, error: toastError } = useToast();

  const [assessment, setAssessment] = useState(location.state?.resultData || null);
  const [loading, setLoading] = useState(!assessment);
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [sendingSos, setSendingSos] = useState(false);
  const [sosSent, setSosSent] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!assessment && sessionId) {
      const fetchAssessment = async () => {
        try {
          const res = await analysisService.getAssessmentById(sessionId);
          if (res.data) setAssessment(res.data);
        } catch (err) {
          toastError('Could not load analysis details.');
        } finally {
          setLoading(false);
        }
      };
      fetchAssessment();
    }
  }, [sessionId, assessment, toastError]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <LoadingSkeleton count={4} className="h-28" />
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Analysis session not found.</p>
        <Link to="/" className="mt-4 inline-block">
          <Button variant="secondary" size="md">
            Return Home
          </Button>
        </Link>
      </div>
    );
  }

  const {
    riskScore,
    riskLevel,
    title,
    summaryVerdict,
    actionableAdvice,
    factorContributions,
    indicators,
    extractedEntities,
    evaluatedAt,
  } = assessment;

  const handleCopySummary = () => {
    const text = `[FraudShield Threat Alert]\nVerdict: ${riskLevel} (${riskScore}/100)\nSummary: ${summaryVerdict}\nSession ID: ${sessionId}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toastSuccess(t('common.copied'));
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendSos = async () => {
    try {
      setSendingSos(true);
      await contactService.notifyContacts(
        sessionId,
        `Critical threat detected: ${title || summaryVerdict}`
      );
      setSosSent(true);
      toastSuccess('SOS Emergency Alert sent to your Family Guardians!');
    } catch (err) {
      toastError('Failed to send SOS notification.');
    } finally {
      setSendingSos(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('common.back')}</span>
        </button>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCopySummary}
            icon={copied ? Check : Copy}
          >
            {copied ? 'Copied' : 'Share Summary'}
          </Button>
          {(riskLevel === 'CRITICAL' || riskLevel === 'HIGH') && (
            <Button
              variant="warning"
              size="sm"
              icon={Users}
              onClick={() => setSosModalOpen(true)}
            >
              {t('common.alertContact')}
            </Button>
          )}
        </div>
      </div>

      {/* Main Verdict Hero Banner */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border shadow-2xl transition-all ${
          riskLevel === 'CRITICAL'
            ? 'bg-gradient-to-r from-rose-950/80 via-[#112240] to-rose-950/50 border-rose-500/60'
            : riskLevel === 'HIGH'
            ? 'bg-gradient-to-r from-orange-950/80 via-[#112240] to-orange-950/50 border-orange-500/60'
            : riskLevel === 'CAUTION'
            ? 'bg-gradient-to-r from-amber-950/80 via-[#112240] to-amber-950/50 border-amber-500/60'
            : 'bg-gradient-to-r from-emerald-950/80 via-[#112240] to-emerald-950/50 border-emerald-500/60'
        }`}
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-center lg:text-left max-w-xl">
            <div className="flex items-center justify-center lg:justify-start gap-2">
              <Badge level={riskLevel} size="lg" />
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{new Date(evaluatedAt || Date.now()).toLocaleTimeString()}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              {summaryVerdict}
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              {title}
            </p>

            {(riskLevel === 'CRITICAL' || riskLevel === 'HIGH') && (
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <Link to="/incident-center">
                  <Button variant="danger" size="md" icon={PhoneCall}>
                    I Sent Money → Open Incident Center
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="md"
                  icon={Users}
                  onClick={() => setSosModalOpen(true)}
                >
                  Alert Family Guardians
                </Button>
              </div>
            )}
          </div>

          {/* Visual Risk Gauge */}
          <div className="shrink-0 p-4 rounded-2xl bg-[#0A192F]/80 border border-[#233554]/60">
            <RiskGauge score={riskScore} size={230} />
          </div>
        </div>
      </div>

      {/* Actionable Advice & What to do now */}
      <ActionRecommendations recommendations={actionableAdvice} />

      {/* Grid: Factor Breakdown & Evidence */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar / Factor Contribution Chart */}
        <Card
          title={t('common.factorBreakdown')}
          subtitle="Relative contribution of urgency, link safety, and sender validation"
        >
          <ThreatRadar factorContributions={factorContributions} />
          <div className="mt-4 space-y-2 border-t border-[#233554]/50 pt-3">
            {factorContributions?.map((fc, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold">{fc.factor}</span>
                <span className="text-teal-400 font-mono font-bold">{fc.score}/100</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Extracted Evidence Box */}
        <Card
          title={t('common.evidence')}
          subtitle="Extracted entities, shortcodes, and technical identifiers"
        >
          <div className="space-y-3">
            {extractedEntities?.senderHeader && (
              <div className="p-3 rounded-xl bg-[#0A192F] border border-[#233554] flex items-center justify-between">
                <span className="text-xs text-slate-400">Sender Header</span>
                <span className="text-xs font-mono font-bold text-white">
                  {extractedEntities.senderHeader}
                </span>
              </div>
            )}
            {extractedEntities?.vpa && (
              <div className="p-3 rounded-xl bg-[#0A192F] border border-[#233554] flex items-center justify-between">
                <span className="text-xs text-slate-400">Payee VPA</span>
                <span className="text-xs font-mono font-bold text-amber-400">
                  {extractedEntities.vpa}
                </span>
              </div>
            )}
            {extractedEntities?.amount && (
              <div className="p-3 rounded-xl bg-[#0A192F] border border-[#233554] flex items-center justify-between">
                <span className="text-xs text-slate-400">Requested Amount</span>
                <span className="text-xs font-mono font-bold text-rose-400">
                  ₹{extractedEntities.amount}
                </span>
              </div>
            )}
            {extractedEntities?.urls?.length > 0 && (
              <div className="p-3 rounded-xl bg-[#0A192F] border border-[#233554] space-y-1">
                <span className="text-xs text-slate-400">Extracted Links</span>
                {extractedEntities.urls.map((u, i) => (
                  <div key={i} className="text-xs font-mono text-teal-300 break-all">
                    {u}
                  </div>
                ))}
              </div>
            )}
            {extractedEntities?.phoneNumbers?.length > 0 && (
              <div className="p-3 rounded-xl bg-[#0A192F] border border-[#233554] flex items-center justify-between">
                <span className="text-xs text-slate-400">Unregistered Mobile</span>
                <span className="text-xs font-mono font-bold text-rose-300">
                  {extractedEntities.phoneNumbers.join(', ')}
                </span>
              </div>
            )}
            {extractedEntities?.domainName && (
              <div className="p-3 rounded-xl bg-[#0A192F] border border-[#233554] flex items-center justify-between">
                <span className="text-xs text-slate-400">Domain Name</span>
                <span className="text-xs font-mono font-bold text-amber-300">
                  {extractedEntities.domainName}
                </span>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Threat Indicators List */}
      <Card
        title={t('common.indicators')}
        subtitle="Specific threat rules and linguistic triggers identified by AI"
      >
        <div className="space-y-3">
          {indicators?.map((ind) => (
            <ThreatIndicatorItem key={ind.id} indicator={ind} />
          ))}
        </div>
      </Card>

      {/* SOS Alert Modal */}
      <Modal
        isOpen={sosModalOpen}
        onClose={() => setSosModalOpen(false)}
        title="Alert Family Guardians"
        subtitle="Send an automated SMS/WhatsApp warning to your trusted emergency contacts."
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-300 leading-relaxed">
            Your registered Family Guardians will receive an instant alert with the scan summary:
          </p>

          <div className="p-4 rounded-xl bg-[#0A192F] border border-[#233554] text-xs font-mono text-slate-300 space-y-1">
            <p className="text-rose-400 font-bold">[CRITICAL FRAUDSHIELD ALERT]</p>
            <p>Ramesh Chandra just scanned a critical threat: "{summaryVerdict}"</p>
            <p>Immediate action taken: Advised not to enter UPI PIN or call numbers.</p>
          </div>

          {sosSent ? (
            <div className="p-4 rounded-xl bg-emerald-950 text-emerald-200 border border-emerald-500/40 text-center font-bold text-sm">
              ✓ Emergency SOS Dispatched to 2 Family Contacts.
            </div>
          ) : (
            <div className="flex gap-2 justify-end pt-2">
              <Button
                variant="ghost"
                size="md"
                onClick={() => setSosModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="warning"
                size="md"
                isLoading={sendingSos}
                onClick={handleSendSos}
                icon={Users}
              >
                Send SOS Now
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
