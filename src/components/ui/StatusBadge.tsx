import React from 'react';
import { cn } from '@/src/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalized = status.toUpperCase();

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';

  if (['ACTIVE', 'PRESENT', 'PAID', 'APPROVED', 'SUCCESS'].includes(normalized)) {
    colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (['INACTIVE', 'ABSENT', 'CANCELLED', 'SUSPENDED', 'FAILED'].includes(normalized)) {
    colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
  } else if (['PENDING', 'DRAFT', 'LATE', 'PARTIAL'].includes(normalized)) {
    colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (['EXCUSED', 'HALF_DAY'].includes(normalized)) {
    colorClasses = 'bg-sky-50 text-sky-700 border-sky-200';
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors',
        colorClasses,
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-75" />
      {status}
    </span>
  );
}
