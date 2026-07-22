import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  description?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  change,
  trend = 'neutral',
  description,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs transition-all duration-200',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-tight">{title}</span>
        <div className="p-2 rounded-lg bg-teal-50 text-teal-600 border border-teal-100">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-2xl font-bold text-slate-800 tracking-tight">{value}</span>
        {change && (
          <span
            className={cn(
              'text-xs font-bold px-2 py-0.5 rounded',
              trend === 'up' && 'bg-emerald-50 text-emerald-600',
              trend === 'down' && 'bg-rose-50 text-rose-600',
              trend === 'neutral' && 'bg-slate-100 text-slate-600'
            )}
          >
            {change}
          </span>
        )}
      </div>

      {description && <p className="mt-1.5 text-xs text-slate-500">{description}</p>}
    </div>
  );
}
