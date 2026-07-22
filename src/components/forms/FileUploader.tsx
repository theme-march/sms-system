'use client';

import React, { useState } from 'react';
import { Upload, File, X } from 'lucide-react';

interface FileUploaderProps {
  label: string;
  accept?: string;
  onFileSelect?: (file: File | null) => void;
  helperText?: string;
}

export function FileUploader({ label, accept = 'image/*', onFileSelect, helperText }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    if (onFileSelect) onFileSelect(selected);
  };

  const handleRemove = () => {
    setFile(null);
    if (onFileSelect) onFileSelect(null);
  };

  return (
    <div className="w-full">
      <label className="block text-xs font-semibold text-slate-700 mb-1">{label}</label>

      {!file ? (
        <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 hover:border-teal-500 rounded-xl bg-slate-50/50 cursor-pointer transition-all hover:bg-teal-50/10">
          <Upload className="w-5 h-5 text-teal-600 mb-1" />
          <span className="text-xs font-semibold text-slate-700">Click to upload file</span>
          <span className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, SVG up to 5MB</span>
          <input type="file" accept={accept} onChange={handleChange} className="hidden" />
        </label>
      ) : (
        <div className="flex items-center justify-between p-3 bg-teal-50/50 border border-teal-200 rounded-xl">
          <div className="flex items-center gap-2 overflow-hidden">
            <File className="w-4 h-4 text-teal-600 shrink-0" />
            <span className="text-xs font-medium text-slate-800 truncate">{file.name}</span>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {helperText && <p className="mt-1 text-[11px] text-slate-400">{helperText}</p>}
    </div>
  );
}
