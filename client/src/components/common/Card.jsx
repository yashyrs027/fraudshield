import React from 'react';

export const Card = ({
  children,
  className = '',
  title,
  subtitle,
  icon: Icon,
  badge,
  headerAction,
  footer,
  hoverable = false,
  bordered = true,
  glow = false,
  ...props
}) => {
  return (
    <div
      className={`bg-[#112240] rounded-2xl transition-all duration-300 ${
        bordered ? 'border border-[#233554]' : ''
      } ${
        hoverable ? 'hover:border-teal-500/40 hover:shadow-xl hover:shadow-teal-500/5' : ''
      } ${
        glow ? 'border-teal-500/40 shadow-xl shadow-teal-500/10' : 'shadow-lg'
      } ${className}`}
      {...props}
    >
      {(title || Icon || headerAction || badge) && (
        <div className="px-6 py-5 border-b border-[#233554]/60 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 shrink-0">
                <Icon className="w-5 h-5" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-100">{title}</h3>
                {badge}
              </div>
              {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}

      <div className="p-6">{children}</div>

      {footer && (
        <div className="px-6 py-4 bg-[#0A192F]/50 border-t border-[#233554]/60 rounded-b-2xl">
          {footer}
        </div>
      )}
    </div>
  );
};
