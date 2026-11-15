import React from 'react';
import { AlertCircle, AlertTriangle, Info, ShieldAlert } from 'lucide-react';
import { Badge } from '../common/Badge';

export const ThreatIndicatorItem = ({ indicator }) => {
  const { code, severity, title, description } = indicator;

  const getIcon = () => {
    switch (severity) {
      case 'CRITICAL':
        return <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />;
      case 'HIGH':
        return <AlertCircle className="w-5 h-5 text-orange-400 shrink-0" />;
      case 'MEDIUM':
        return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-teal-400 shrink-0" />;
    }
  };

  return (
    <div className="p-4 rounded-xl bg-[#0A192F]/60 border border-[#233554] flex items-start gap-3.5 transition-all hover:border-[#1E3A8A]">
      <div className="mt-0.5">{getIcon()}</div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h4 className="text-sm font-bold text-slate-100">{title || code}</h4>
          <Badge level={severity === 'MEDIUM' ? 'CAUTION' : severity} size="sm" />
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};
