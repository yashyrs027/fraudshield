import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  MessageSquare,
  QrCode,
  Globe,
  AlertTriangle,
  Users,
  Clock,
  ArrowRight,
  ShieldAlert,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { analysisService } from '../services/analysisService';
import { contactService } from '../services/contactService';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';

export const ProtectionDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [historyRes, contactsRes] = await Promise.all([
          analysisService.getHistory(),
          contactService.getContacts(),
        ]);
        if (historyRes.data?.items) {
          setHistory(historyRes.data.items);
        }
        if (contactsRes.data?.contacts) {
          setContacts(contactsRes.data.contacts);
        }
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalScans = history.length;
  const criticalThreats = history.filter((h) => h.riskLevel === 'CRITICAL' || h.riskLevel === 'HIGH').length;

  return (
    <div className="space-y-8">
      {/* 1. Welcome & Protection Status Hero */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-[#112240] via-[#162a4d] to-[#1E3A8A]/40 border border-[#233554] shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{t('dashboard.statusSafe')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {t('dashboard.welcome')}, {user?.fullName || 'Citizen'}!
          </h1>
          <p className="text-sm text-slate-300 max-w-xl">
            Your digital payment defense shield is active. Check messages, payment QR codes, or links
            before authorizing debits.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link to="/analyze/message">
            <Button variant="primary" size="md" icon={MessageSquare}>
              Scan Message
            </Button>
          </Link>
          <Link to="/analyze/qr">
            <Button variant="outline" size="md" icon={QrCode}>
              Verify QR
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Metric Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Protection Score
            </span>
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-teal-400">96 / 100</div>
            <p className="text-xs text-slate-400 mt-1">Optimal Defense Readiness</p>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Scans Evaluated
            </span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-white">{totalScans}</div>
            <p className="text-xs text-slate-400 mt-1">Pre-transaction scans completed</p>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Threats Intercepted
            </span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-rose-400">{criticalThreats}</div>
            <p className="text-xs text-slate-400 mt-1">High/Critical scams blocked</p>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Family Guardians
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-amber-400">{contacts.length}</div>
            <p className="text-xs text-slate-400 mt-1">Active SOS emergency contacts</p>
          </div>
        </Card>
      </div>

      {/* 3. Quick Scanner Shortcuts */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-teal-400" />
          <span>{t('dashboard.quickScanShortcuts')}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Link to="/analyze/message" className="block group">
            <Card hoverable className="h-full">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400 group-hover:bg-teal-500 group-hover:text-navy-950 transition-colors">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors">
                    SMS & Message Threat Scanner
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Evaluate electricity cut notices, bank KYC suspension SMS, and extortion threats.
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link to="/analyze/qr" className="block group">
            <Card hoverable className="h-full">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-navy-950 transition-colors">
                  <QrCode className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    QR & UPI Deep-Link Verifier
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Decode payment intents to guarantee you are not approving a reverse debit.
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link to="/analyze/url" className="block group">
            <Card hoverable className="h-full">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-navy-950 transition-colors">
                  <Globe className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                    Website & APK Safety Checker
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Unshorten obfuscated redirects and check for typosquatted banking domains.
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>

      {/* 4. Recent Analysis History Table */}
      <Card
        title={t('dashboard.recentScans')}
        headerAction={
          <span className="text-xs text-slate-400 font-semibold">
            {history.length} records saved
          </span>
        }
      >
        {loading ? (
          <LoadingSkeleton count={3} />
        ) : history.length === 0 ? (
          <EmptyState
            title="No analyses recorded yet"
            description="Start by scanning your first suspicious SMS or payment QR code."
            actionLabel="Scan Message Now"
            onAction={() => navigate('/analyze/message')}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-slate-400 border-b border-[#233554]">
                <tr>
                  <th className="pb-3 font-semibold">Threat / Title</th>
                  <th className="pb-3 font-semibold">Input Type</th>
                  <th className="pb-3 font-semibold">Risk Verdict</th>
                  <th className="pb-3 font-semibold">Date & Time</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#233554]/50">
                {history.map((item) => (
                  <tr key={item.sessionId} className="hover:bg-[#162a4d]/30 transition-colors">
                    <td className="py-4 pr-4">
                      <div className="font-bold text-white text-sm">{item.title}</div>
                      <div className="text-xs text-slate-400 mt-0.5 max-w-md truncate">
                        {item.summary}
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#0A192F] text-slate-300 border border-[#233554]">
                        {item.inputType}
                      </span>
                    </td>
                    <td className="py-4 pr-4">
                      <Badge level={item.riskLevel} size="md" />
                    </td>
                    <td className="py-4 pr-4 text-xs text-slate-400 whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-4 text-right">
                      <Link to={`/results/${item.sessionId}`}>
                        <Button variant="ghost" size="sm" icon={ExternalLink}>
                          View Evidence
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* 5. Family Guardians Quick Overview */}
      <Card
        title={t('dashboard.trustedContactsSummary')}
        subtitle="These designated contacts receive instant SOS notifications when a Critical Risk scan occurs."
        headerAction={
          <Link to="/settings">
            <Button variant="outline" size="sm">
              Manage Contacts
            </Button>
          </Link>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="p-4 rounded-xl bg-[#0A192F]/60 border border-[#233554] flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold">
                  {contact.contactName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{contact.contactName}</h4>
                  <p className="text-xs text-slate-400">
                    {contact.relationship} • {contact.phoneNumber}
                  </p>
                </div>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" title="Active Guard" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
