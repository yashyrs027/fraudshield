import React from 'react';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

export const ActionRecommendations = ({ recommendations = [] }) => {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="p-5 rounded-xl bg-gradient-to-br from-teal-950/40 to-[#112240] border border-teal-500/30">
      <div className="flex items-center gap-2 mb-3 text-teal-400 font-bold text-sm uppercase tracking-wider">
        <ShieldCheck className="w-4 h-4" />
        <span>Recommended Emergency & Safety Actions</span>
      </div>

      <ul className="space-y-2.5">
        {recommendations.map((action, index) => (
          <li key={index} className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
            <span className="text-sm font-semibold text-slate-100 leading-relaxed">
              {action}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
