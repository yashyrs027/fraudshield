import React, { forwardRef } from 'react';

export const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      icon: Icon,
      type = 'text',
      className = '',
      isTextArea = false,
      rows = 4,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    const baseInputStyles =
      'w-full bg-[#0A192F] text-slate-100 rounded-xl px-4 py-3 border transition-colors duration-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent text-sm disabled:opacity-50 disabled:bg-slate-900';

    const errorStyles = error
      ? 'border-rose-500 focus:ring-rose-400'
      : 'border-[#233554] hover:border-slate-600 focus:border-teal-500';

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-semibold text-slate-200">
            {label}
          </label>
        )}

        <div className="relative">
          {Icon && (
            <div className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none">
              <Icon className="w-5 h-5" />
            </div>
          )}

          {isTextArea ? (
            <textarea
              id={inputId}
              ref={ref}
              rows={rows}
              className={`${baseInputStyles} ${errorStyles} ${Icon ? 'pl-11' : ''} ${className}`}
              {...props}
            />
          ) : (
            <input
              id={inputId}
              ref={ref}
              type={type}
              className={`${baseInputStyles} ${errorStyles} ${Icon ? 'pl-11' : ''} ${className}`}
              {...props}
            />
          )}
        </div>

        {error && (
          <p className="text-xs text-rose-400 font-medium flex items-center gap-1 mt-1">
            <span>•</span> {error}
          </p>
        )}

        {helperText && !error && (
          <p className="text-xs text-slate-400 mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
