import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({
  icon: Icon = ShieldAlert,
  title = 'No Data Found',
  description = 'There are no records to display at this time.',
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 rounded-2xl bg-[#0A192F]/40 border border-[#233554]/50 my-4">
      <div className="p-4 rounded-2xl bg-teal-500/10 text-teal-400 mb-4 border border-teal-500/20">
        <Icon className="w-8 h-8" />
      </div>
      <h4 className="text-base font-bold text-slate-100">{title}</h4>
      <p className="text-sm text-slate-400 max-w-sm mt-1 mb-5">{description}</p>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
