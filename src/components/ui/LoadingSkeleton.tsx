import React from 'react';

export function LoadingSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="w-full space-y-3 animate-pulse">
      <div className="h-10 bg-slate-100 rounded-lg w-full" />
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="h-14 bg-slate-50 rounded-lg w-full border border-slate-100" />
      ))}
    </div>
  );
}
