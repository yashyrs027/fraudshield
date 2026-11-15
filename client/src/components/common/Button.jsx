import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  className = '',
  type = 'button',
  onClick,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 cursor-pointer select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs font-medium gap-1.5 min-h-[36px]',
    md: 'px-5 py-2.5 text-sm gap-2 min-h-[44px]',
    lg: 'px-6 py-3.5 text-base gap-2.5 min-h-[50px] senior-target',
  };

  const variantStyles = {
    primary:
      'bg-teal-500 hover:bg-teal-400 text-white shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 border border-teal-400/30',
    secondary:
      'bg-[#112240] hover:bg-[#1E3A8A]/50 text-slate-100 border border-[#233554] hover:border-teal-500/50 shadow-md',
    danger:
      'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/25 border border-rose-500/40',
    warning:
      'bg-amber-500 hover:bg-amber-400 text-navy-950 font-bold shadow-lg shadow-amber-500/20 border border-amber-400/50',
    outline:
      'bg-transparent hover:bg-teal-500/10 text-teal-400 border border-teal-500/40 hover:border-teal-400',
    ghost:
      'bg-transparent hover:bg-slate-800/50 text-slate-300 hover:text-white',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4 shrink-0" />}
          {children}
        </>
      )}
    </button>
  );
};
