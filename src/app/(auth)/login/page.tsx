'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { School, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { FormField } from '@/src/components/forms/FormField';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@school.com');
  const [password, setPassword] = useState('AdminPassword123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate authentication check or call auth API
      if (email === 'admin@school.com' && password) {
        document.cookie = `school_session=demo-admin-token; path=/; max-age=604800`;
        router.push('/dashboard');
      } else {
        setError('Invalid credentials. Use admin@school.com');
      }
    } catch {
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
            Dhaka Ideal Model High School
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
            <a href="#" className="text-teal-600 hover:underline font-medium">
              Forgot password?
            </a>
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

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-[11px] text-slate-500 space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-slate-700">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Seed Super Admin Credentials:</span>
          </div>
          <p>Email: <code className="text-teal-700 font-bold">admin@school.com</code></p>
          <p>Password: <code className="text-teal-700 font-bold">AdminPassword123!</code></p>
        </div>
      </div>
    </div>
  );
}
