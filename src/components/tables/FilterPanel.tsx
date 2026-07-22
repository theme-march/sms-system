import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterField {
  key: string;
  label: string;
  options: FilterOption[];
  value: string;
}

interface FilterPanelProps {
  filters: FilterField[];
  onFilterChange: (key: string, value: string) => void;
  onReset: () => void;
}

export function FilterPanel({ filters, onFilterChange, onReset }: FilterPanelProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 p-3 bg-white border border-slate-200/80 rounded-xl shadow-2xs">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mr-2">
        <Filter className="w-3.5 h-3.5 text-teal-600" />
        <span>Filters:</span>
      </div>

      {filters.map((field) => (
        <select
          key={field.key}
          value={field.value}
          onChange={(e) => onFilterChange(field.key, e.target.value)}
          className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-teal-600 transition-colors"
        >
          <option value="">{field.label}: All</option>
          {field.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ))}

      <button
        onClick={onReset}
        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors ml-auto"
        title="Reset Filters"
      >
        <RotateCcw className="w-3 h-3" />
        <span>Reset</span>
      </button>
    </div>
  );
}
