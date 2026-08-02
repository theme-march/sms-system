import React from 'react';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const descriptionId = error || helperText ? `${inputId}-description` : undefined;

    return (
      <div className="w-full">
        <label htmlFor={inputId} className="block text-xs font-semibold text-slate-700 mb-1">
          {label} {props.required && <span className="text-rose-500">*</span>}
        </label>
        <input
          id={inputId}
          ref={ref}
          aria-invalid={error ? true : undefined}
          aria-describedby={descriptionId}
          className={`w-full px-3 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all shadow-2xs ${
            error ? 'border-rose-400 bg-rose-50/20' : ''
          } ${className}`}
          {...props}
        />
        {error ? (
          <p id={descriptionId} role="alert" className="mt-1 text-xs text-rose-500 font-medium">{error}</p>
        ) : helperText ? (
          <p id={descriptionId} className="mt-1 text-xs text-slate-400">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

FormField.displayName = 'FormField';
