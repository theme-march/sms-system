"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { School, ArrowRight, ShieldCheck } from "lucide-react";
import { FormField } from "@/src/components/forms/FormField";
import { defaultWebsiteContent } from "@/src/lib/website-content";
import { websiteThemeStyle } from "@/src/lib/website-theme";
import styles from "./login-theme.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [schoolName, setSchoolName] = useState("School Management System");
  const [theme, setTheme] = useState(defaultWebsiteContent.theme);

  useEffect(() => {
    fetch("/api/website")
      .then((response) => response.json())
      .then((data) => {
        if (data?.school?.name) setSchoolName(data.school.name);
        if (data?.content?.theme) setTheme(data.content.theme);
      })
      .catch(() => undefined);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        const nextPath = new URLSearchParams(window.location.search).get(
          "next",
        );
        router.replace(
          nextPath?.startsWith("/")
            ? nextPath
            : data.redirectTo || "/dashboard",
        );
        router.refresh();
      } else {
        setError(data?.error || "Invalid credentials.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`${styles.page} flex min-h-screen flex-col items-center justify-center p-4`}
      style={websiteThemeStyle(theme)}
    >
      <div
        className={`${styles.card} w-full max-w-md space-y-6 rounded-2xl border p-8`}
      >
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div
            className={`${styles.mark} mb-2 inline-flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-md`}
          >
            <School className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {schoolName}
          </h1>
          <p
            className={`${styles.accent} text-xs font-semibold uppercase tracking-wider`}
          >
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
              <input
                type="checkbox"
                defaultChecked
                className={`${styles.checkbox} rounded border-slate-300`}
              />
              <span>Remember session</span>
            </label>
            <span className="text-slate-400">7-day secure session</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`${styles.submit} flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:shadow-lg disabled:opacity-50`}
          >
            <span>{loading ? "Authenticating..." : "Sign In to Portal"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
          <ShieldCheck className={`${styles.accent} h-3.5 w-3.5`} />
          <span>Your session is encrypted and protected.</span>
        </div>
      </div>
    </div>
  );
}
