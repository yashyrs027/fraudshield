import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 space-y-6">
      <div className="p-4 rounded-3xl bg-rose-500/10 text-rose-400 border border-rose-500/30">
        <ShieldAlert className="w-12 h-12" />
      </div>
      <h1 className="text-4xl font-extrabold text-white">404: Page Not Found</h1>
      <p className="text-sm text-slate-400 max-w-md">
        The destination or analysis record you are looking for does not exist or has expired under our
        data retention policies.
      </p>
      <Link to="/">
        <Button variant="primary" size="md" icon={ArrowLeft}>
          Return to Safe Home
        </Button>
      </Link>
    </div>
  );
};
