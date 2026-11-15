import React from 'react';
import { PhoneCall, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmergencyBanner = () => {
  return (
    <div className="w-full bg-gradient-to-r from-rose-950 via-[#112240] to-rose-950 border-b border-rose-500/30 px-4 py-2 text-xs font-semibold text-rose-200">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>
            Victim of payment fraud within the last 2 hours? Act before funds leave mule accounts!
          </span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="tel:1930"
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold transition-colors"
          >
            <PhoneCall className="w-3 h-3" />
            <span>Call 1930</span>
          </a>
          <Link
            to="/incident-center"
            className="text-rose-300 hover:text-white underline font-bold"
          >
            Emergency Playbook →
          </Link>
        </div>
      </div>
    </div>
  );
};
