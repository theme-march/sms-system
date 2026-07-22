import React from 'react';

interface DateFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const DateField = React.forwardRef<HTMLInputElement, DateFieldProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          {label} {props.required && <span className="text-rose-500">*</span>}
        </label>
        <input
          ref={ref}
          type="date"
          className={`w-full px-3 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all shadow-2xs ${
            error ? 'border-rose-400 bg-rose-50/20' : ''
          } ${className}`}
          {...props}
        />
        {error ? (
          <p className="mt-1 text-xs text-rose-500 font-medium">{error}</p>
        ) : helperText ? (
          <p className="mt-1 text-xs text-slate-400">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

DateField.displayName = 'DateField';
