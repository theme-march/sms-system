"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Bell, User, LogOut, Shield, ChevronDown } from "lucide-react";
import { LanguageSwitcher } from "@/src/components/ui/LanguageSwitcher";
import { canAccessPermission } from "@/src/config/access-control";
import { PERMISSIONS } from "@/src/config/permissions";

interface HeaderProps {
  onToggleMobileSidebar: () => void;
  userName: string;
  userRole: string;
  permissions: string[];
  roles: string[];
}

export function Header({
  onToggleMobileSidebar,
  userName,
  userRole,
  permissions,
  roles,
}: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    setIsDropdownOpen(false);
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error("Logout request failed");
    } catch (err) {
      console.error("Logout failed", err);
    }
    router.replace("/login");
    router.refresh();
  };

  return (
    <header className="dashboard-header fixed inset-x-0 top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white/95 px-4 shadow-2xs backdrop-blur-sm lg:left-64 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden text-slate-600 hover:text-slate-900 p-2 rounded-lg hover:bg-slate-100 transition-colors"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-medium">
          <span className="text-slate-400">Dashboard</span>
          <span>/</span>
          <span className="text-slate-600 font-semibold">Overview</span>
        </div>
      </div>

      <div className="flex items-center gap-4 lg:gap-6">
        {/* Language Switcher */}
        <LanguageSwitcher />

        <div className="hidden sm:block w-px h-6 bg-slate-200" />

        {/* Notifications */}
        <button
          className="relative p-2 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors border border-slate-200/80"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
        </button>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 p-1 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="hidden md:block text-right">
              <p className="text-sm font-bold text-slate-700 leading-none">
                {userName}
              </p>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-1">
                {userRole}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-800 border-2 border-teal-500 flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
              {userName.charAt(0)}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{userName}</p>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">
                  {userRole}
                </p>
              </div>

              {canAccessPermission(
                permissions,
                roles,
                PERMISSIONS.SCHOOL_SETTINGS_MANAGE,
              ) && (
                <Link
                  href="/dashboard/settings"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Shield className="w-3.5 h-3.5 text-slate-400" />
                  <span>School Settings</span>
                </Link>
              )}

              {canAccessPermission(
                permissions,
                roles,
                PERMISSIONS.USERS_VIEW,
              ) && (
                <Link
                  href="/dashboard/users"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>My Profile</span>
                </Link>
              )}

              <div className="border-t border-slate-100 my-1" />

              <button
                onClick={handleSignOut}
                className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
