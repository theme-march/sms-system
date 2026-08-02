'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { School, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { FormField } from '@/src/components/forms/FormField';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        const nextPath = new URLSearchParams(window.location.search).get('next');
        router.replace(nextPath?.startsWith('/') ? nextPath : data.redirectTo || '/dashboard');
        router.refresh();
      } else {
        setError(data?.error || 'Invalid credentials.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200/80 p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-teal-600 text-white shadow-md mb-2">
            <School className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            School Management System
          </h1>
          <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider">
            Management Console Portal
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@school.com"
            required
          />

          <FormField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <div className="flex items-center justify-between text-xs text-slate-500">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
              <span>Remember session</span>
            </label>
            <span className="text-slate-400">7-day secure session</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          <span>Your session is encrypted and protected.</span>
        </div>
      </div>
    </div>
  );
}
