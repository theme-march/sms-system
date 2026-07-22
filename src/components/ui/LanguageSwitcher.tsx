'use client';

import React, { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const [lang, setLang] = useState<'en' | 'bn'>('en');

  useEffect(() => {
    const saved = localStorage.getItem('school_lang') as 'en' | 'bn';
    if (saved) setLang(saved);
  }, []);

  const toggleLanguage = () => {
    const nextLang = lang === 'en' ? 'bn' : 'en';
    setLang(nextLang);
    localStorage.setItem('school_lang', nextLang);
    window.dispatchEvent(new Event('school_lang_change'));
  };

  return (
    <div className="flex bg-slate-100 p-1 rounded-lg text-[11px] font-bold shrink-0">
      <button
        type="button"
        onClick={() => {
          if (lang !== 'en') toggleLanguage();
        }}
        className={`px-3 py-1 rounded transition-all cursor-pointer ${
          lang === 'en'
            ? 'bg-white shadow-2xs text-teal-700 font-bold'
            : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => {
          if (lang !== 'bn') toggleLanguage();
        }}
        className={`px-3 py-1 rounded transition-all cursor-pointer ${
          lang === 'bn'
            ? 'bg-white shadow-2xs text-teal-700 font-bold'
            : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        বাং
      </button>
    </div>
  );
}
