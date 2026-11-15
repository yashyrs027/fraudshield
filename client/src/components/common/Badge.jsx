import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, ShieldAlert, Info } from 'lucide-react';
import { THREAT_LEVELS } from '../../constants/threatLevels';

export const Badge = ({
  level,
  variant = 'default',
  children,
  icon = true,
  size = 'md',
  className = '',
}) => {
  const threatInfo = level ? THREAT_LEVELS[level] : null;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs font-semibold gap-1.5',
    lg: 'px-3.5 py-1.5 text-sm font-bold gap-2',
  };

  const getIcon = () => {
    if (!icon) return null;
    if (level === 'SAFE') return <ShieldCheck className="w-3.5 h-3.5 shrink-0" />;
    if (level === 'CAUTION') return <AlertTriangle className="w-3.5 h-3.5 shrink-0" />;
    if (level === 'HIGH') return <AlertOctagon className="w-3.5 h-3.5 shrink-0" />;
    if (level === 'CRITICAL') return <ShieldAlert className="w-3.5 h-3.5 shrink-0" />;
    return <Info className="w-3.5 h-3.5 shrink-0" />;
  };

  let colorClasses = 'bg-slate-800 text-slate-300 border-slate-700';

  if (threatInfo) {
    colorClasses = threatInfo.badgeClass;
  } else if (variant === 'teal') {
    colorClasses = 'bg-teal-500/20 text-teal-300 border border-teal-500/40';
  } else if (variant === 'cyan') {
    colorClasses = 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40';
  } else if (variant === 'outline') {
    colorClasses = 'bg-transparent text-slate-300 border border-slate-600';
  }

  return (
    <span
      className={`inline-flex items-center rounded-lg border transition-colors ${sizeClasses[size]} ${colorClasses} ${className}`}
    >
      {getIcon()}
      <span>{children || threatInfo?.label || level}</span>
    </span>
  );
};
