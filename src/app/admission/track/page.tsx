"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  School,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Calendar,
  UserCheck,
  ArrowLeft,
  Building,
} from "lucide-react";
import { getAdmissionApplicationByTracking } from "@/src/services/admission.service";
import { PublicHeader } from "@/src/components/website/PublicHeader";
import {
  defaultWebsiteContent,
  type WebsiteContent,
} from "@/src/lib/website-content";
import { websiteThemeStyle } from "@/src/lib/website-theme";
import "../../school-home.css";

function TrackingContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get("code") || "";

  const [queryCode, setQueryCode] = useState(initialCode);
  const [queryPhone, setQueryPhone] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [application, setApplication] = useState<any>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!queryCode.trim()) return;

    setIsSearching(true);
    setSearched(true);
    const result = await getAdmissionApplicationByTracking(
      queryCode.trim(),
      queryPhone.trim(),
    );
    setApplication(result);
    setIsSearching(false);
  };

  useEffect(() => {
    if (initialCode) {
      handleSearch();
    }
  }, [initialCode]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "submitted":
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Submitted & Pending
          </span>
        );
      case "under_review":
        return (
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-bold flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Under Review
          </span>
        );
      case "correction_requested":
        return (
          <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" /> Correction Requested
          </span>
        );
      case "waiting_list":
        return (
          <span className="px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-xs font-bold flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Waiting List
          </span>
        );
      case "approved":
        return (
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Approved for Admission
          </span>
        );
      case "enrolled":
        return (
          <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-bold flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5" /> Enrolled Student
          </span>
        );
      case "rejected":
        return (
          <span className="px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-bold flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5" /> Rejected
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Search Box Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Search className="w-5 h-5 text-teal-600" />
          Track Admission Application
        </h2>
        <form
          onSubmit={handleSearch}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
        >
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              Application Number or Tracking Code
            </label>
            <input
              type="text"
              value={queryCode}
              onChange={(e) => setQueryCode(e.target.value)}
              placeholder="e.g. APP-2026-0001 or TRK-9821A"
              required
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={isSearching}
              className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
            >
              {isSearching ? "Searching..." : "Track Status"}
            </button>
          </div>
        </form>
      </div>

      {/* Results View */}
      {searched && (
        <div>
          {application ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Application Details
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                    {application.studentNameEn}
                  </h3>
                  <p className="text-xs text-slate-500">
                    App #:{" "}
                    <span className="font-bold text-teal-700">
                      {application.applicationNumber}
                    </span>{" "}
                    | Tracking Code:{" "}
                    <span className="font-bold text-slate-800">
                      {application.trackingCode}
                    </span>
                  </p>
                </div>
                <div>{getStatusBadge(application.status)}</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl text-xs">
                <div>
                  <p className="text-slate-400 font-bold uppercase text-[10px]">
                    Applying Class
                  </p>
                  <p className="font-bold text-slate-800 text-sm mt-0.5">
                    {application.class?.name || "Class 10"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 font-bold uppercase text-[10px]">
                    Gender & DOB
                  </p>
                  <p className="font-semibold text-slate-800 mt-0.5">
                    {application.gender} (
                    {new Date(application.dateOfBirth).toLocaleDateString()})
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 font-bold uppercase text-[10px]">
                    Phone Number
                  </p>
                  <p className="font-semibold text-slate-800 mt-0.5">
                    {application.phone || "N/A"}
                  </p>
                </div>
              </div>

              {/* Test & Interview Information */}
              {(application.test || application.interview) && (
                <div className="border border-teal-100 rounded-xl p-4 bg-teal-50/50 space-y-3">
                  <h4 className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    Admission Test & Interview Schedule
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {application.test && (
                      <div className="bg-white p-3 rounded-lg border border-teal-100">
                        <p className="font-bold text-slate-900">
                          Admission Written Test
                        </p>
                        <p className="text-slate-600 mt-0.5">
                          Date:{" "}
                          {new Date(application.test.testDate).toLocaleString()}
                        </p>
                        <p className="text-slate-600">
                          Venue: {application.test.venue}
                        </p>
                        {application.test.marksObtained !== null && (
                          <p className="mt-1 font-bold text-teal-700">
                            Marks: {application.test.marksObtained} /{" "}
                            {application.test.totalMarks}
                          </p>
                        )}
                      </div>
                    )}

                    {application.interview && (
                      <div className="bg-white p-3 rounded-lg border border-teal-100">
                        <p className="font-bold text-slate-900">
                          Viva & Interview
                        </p>
                        <p className="text-slate-600 mt-0.5">
                          Date:{" "}
                          {new Date(
                            application.interview.interviewDate,
                          ).toLocaleString()}
                        </p>
                        <p className="text-slate-600">
                          Interviewer: {application.interview.interviewerName}
                        </p>
                        <p className="mt-1 font-bold text-slate-700">
                          Status: {application.interview.status}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Correction or Rejection Notes if present */}
              {application.correctionNotes && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Action Required: Correction Requested
                  </p>
                  <p>{application.correctionNotes}</p>
                </div>
              )}

              {application.rejectionReason && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-xs text-rose-900 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-rose-600" />
                    Rejection Notice
                  </p>
                  <p>{application.rejectionReason}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
              <FileText className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">
                No Admission Record Found
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                We could not find an application matching{" "}
                <span className="font-bold text-slate-800">{queryCode}</span>.
                Please verify your tracking code or contact school office.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ApplicationTrackingPage() {
  const [websiteContent, setWebsiteContent] = useState<WebsiteContent>(
    defaultWebsiteContent,
  );
  const [schoolName, setSchoolName] = useState("আপনার বিদ্যালয়ের নাম");
  useEffect(() => {
    fetch("/api/website")
      .then((res) => res.json())
      .then((data) => {
        if (data.content) setWebsiteContent(data.content);
        if (data.school?.name) setSchoolName(data.school.name);
      })
      .catch(() => {});
  }, []);
  return (
    <div
      className="school-site admission-site"
      style={websiteThemeStyle(websiteContent.theme)}
    >
      <div className="school-shell">
        <PublicHeader content={websiteContent} schoolName={schoolName} />
        <section className="admission-page-heading">
          <div>
            <div className="page-breadcrumb">
              <Link href="/">হোম</Link>
              <span>›</span>
              <Link href="/admission-information">ভর্তি তথ্য</Link>
              <span>›</span>
              <b>আবেদন ট্র্যাক</b>
            </div>
            <h1>ভর্তি আবেদন ট্র্যাক করুন</h1>
            <p>
              Application number অথবা tracking code দিয়ে আবেদনের সর্বশেষ অবস্থা
              দেখুন।
            </p>
          </div>
          <Link href="/admission/apply" className="admission-track-link">
            <ArrowLeft className="w-4 h-4" />
            নতুন আবেদন করুন
          </Link>
        </section>
        <main className="admission-form-wrap admission-track-wrap">
          <Suspense
            fallback={
              <div className="p-8 text-center text-slate-400">
                Loading tracking portal...
              </div>
            }
          >
            <TrackingContent />
          </Suspense>
        </main>
        <footer className="school-footer">
          <span>
            © {new Date().getFullYear()} {schoolName} —{" "}
            {websiteContent.footerText}
          </span>
          <Link href="/login">Admin Login</Link>
        </footer>
      </div>
    </div>
  );
}
