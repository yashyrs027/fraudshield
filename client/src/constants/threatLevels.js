export const THREAT_LEVELS = {
  SAFE: {
    level: 'SAFE',
    minScore: 0,
    maxScore: 29,
    label: 'Safe / Low Risk',
    color: '#10B981',
    bgClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
    icon: 'ShieldCheck',
    description: 'No known fraud patterns or malicious characteristics detected.'
  },
  CAUTION: {
    level: 'CAUTION',
    minScore: 30,
    maxScore: 69,
    label: 'Caution / Suspicious',
    color: '#F59E0B',
    bgClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    badgeClass: 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
    icon: 'AlertTriangle',
    description: 'Contains suspicious urgency cues, unverified sender, or untrusted domain.'
  },
  HIGH: {
    level: 'HIGH',
    minScore: 70,
    maxScore: 89,
    label: 'High Danger / Likely Scam',
    color: '#EA580C',
    bgClass: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    badgeClass: 'bg-orange-500/20 text-orange-300 border border-orange-500/40',
    icon: 'AlertOctagon',
    description: 'Strong probability of financial deception, deceptive collect intent, or typosquatting.'
  },
  CRITICAL: {
    level: 'CRITICAL',
    minScore: 90,
    maxScore: 100,
    label: 'Critical / Confirmed Scam',
    color: '#DC2626',
    bgClass: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    badgeClass: 'bg-rose-500/20 text-rose-300 border border-rose-500/40',
    icon: 'ShieldAlert',
    description: 'Confirmed predatory scam attack or known phishing infrastructure. Extreme danger of loss.'
  }
};

export const getThreatDetails = (score) => {
  if (score >= 90) return THREAT_LEVELS.CRITICAL;
  if (score >= 70) return THREAT_LEVELS.HIGH;
  if (score >= 30) return THREAT_LEVELS.CAUTION;
  return THREAT_LEVELS.SAFE;
};
