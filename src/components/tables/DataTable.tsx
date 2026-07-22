import React from 'react';
import { EmptyState } from '@/src/components/ui/EmptyState';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  isLoading?: boolean;
}

export function DataTable<T>({ columns, data, keyExtractor, isLoading }: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-xl border border-slate-200 p-6 animate-pulse space-y-3">
        <div className="h-8 bg-slate-100 rounded w-full" />
        <div className="h-12 bg-slate-50 rounded w-full" />
        <div className="h-12 bg-slate-50 rounded w-full" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-left border-collapse min-w-[640px]">
          <thead>
            <tr className="bg-slate-50 text-[11px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
              {columns.map((col, idx) => (
                <th key={idx} className={`px-5 py-3.5 ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
            {data.map((row) => (
              <tr key={keyExtractor(row)} className="hover:bg-slate-50/80 transition-colors">
                {columns.map((col, idx) => (
                  <td key={idx} className={`px-5 py-3.5 whitespace-nowrap ${col.className || ''}`}>
                    {col.cell
                      ? col.cell(row)
                      : col.accessorKey
                      ? String(row[col.accessorKey] ?? '')
                      : null}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
