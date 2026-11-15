import React from 'react';

export const LoadingSkeleton = ({ count = 3, className = 'h-16' }) => {
  return (
    <div className="space-y-3 w-full animate-pulse" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`w-full bg-[#162a4d]/60 rounded-xl border border-[#233554]/40 ${className}`}
        />
      ))}
    </div>
  );
};
