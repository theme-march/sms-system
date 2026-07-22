'use client';

import React, { useState, useEffect } from 'react';
import {
  Receipt,
  DollarSign,
  Plus,
  Printer,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileText,
  CreditCard,
  Building2,
  PhoneCall,
  Search,
  Filter,
  RefreshCw,
  Award,
  MinusCircle,
  ShieldAlert,
  Download,
  Users,
} from 'lucide-react';
import { PageHeader } from '@/src/components/ui/PageHeader';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import { formatCurrency } from '@/src/lib/utils';
import {
  getFeeTypes,
  getAccountantFeeDashboard,
  generateBulkMonthlyInvoices,
  generateExamFeeInvoices,
  processPayment,
  processPaymentReversal,
  checkAdmitCardEligibility,
} from '@/src/services/fee.service';

export default function FeesPage() {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'monthly_gen' | 'exam_fees' | 'payment_collect' | 'schedules' | 'scholarships' | 'transactions'
  >('overview');

  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [feeTypesList, setFeeTypesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Bulk Monthly Gen State
  const [genYear, setGenYear] = useState(2026);
  const [genMonth, setGenMonth] = useState(7); // July
  const [genClass, setGenClass] = useState('cls-10');
  const [genSection, setGenSection] = useState('sec-padma');
  const [includePrevDues, setIncludePrevDues] = useState(true);
  const [genSummary, setGenSummary] = useState<any>(null);

  // Exam Fee State
  const [examId, setExamId] = useState('exam-term1-2026');
  const [examAmount, setExamAmount] = useState(1500);
  const [examDueDate, setExamDueDate] = useState('2026-08-15');
  const [requireExamFeeForAdmitCard, setRequireExamFeeForAdmitCard] = useState(true);

  // Payment Collection State
  const [studentSearch, setStudentSearch] = useState('st-1');
  const [selectedInvoice, setSelectedInvoice] = useState<any>({
    id: 'inv-101',
    invoiceNumber: 'INV-202607-ST01-8812',
    studentName: 'Tanvir Hossain',
    class: 'Class 10 - Padma',
    totalAmount: 2500,
    paidAmount: 0,
    dueAmount: 2500,
    dueDate: '2026-08-10',
    feeType: 'Monthly Tuition Fee',
  });
  const [payAmount, setPayAmount] = useState(2500);
  const [payMethod, setPayMethod] = useState<'Cash' | 'Bank' | 'Mobile Financial Service' | 'Online'>('Mobile Financial Service');
  const [payRef, setPayRef] = useState('bKash-Trx991023');
  const [latestReceipt, setLatestReceipt] = useState<any>(null);

  // Invoices list
  const [invoices, setInvoices] = useState([
    {
      id: 'inv-101',
      invoiceNumber: 'INV-202607-ST01-8812',
      studentName: 'Tanvir Hossain',
      class: 'Class 10 - Padma',
      feeType: 'Monthly Tuition Fee',
      totalAmount: 2500,
      paidAmount: 2500,
      dueAmount: 0,
      dueDate: '2026-08-10',
      status: 'paid',
    },
    {
      id: 'inv-102',
      invoiceNumber: 'INV-202607-ST02-8813',
      studentName: 'Sumaiya Akter',
      class: 'Class 10 - Padma',
      feeType: 'Monthly Tuition Fee',
      totalAmount: 2500,
      paidAmount: 1000,
      dueAmount: 1500,
      dueDate: '2026-08-10',
      status: 'partially_paid',
    },
    {
      id: 'inv-103',
      invoiceNumber: 'INV-202607-ST03-8814',
      studentName: 'Sajid Islam',
      class: 'Class 10 - Meghna',
      feeType: 'Monthly Tuition Fee',
      totalAmount: 2500,
      paidAmount: 0,
      dueAmount: 2500,
      dueDate: '2026-08-10',
      status: 'unpaid',
    },
    {
      id: 'inv-104',
      invoiceNumber: 'EXAM-INV-2026-101',
      studentName: 'Fariha Karim',
      class: 'Class 9 - Jamuna',
      feeType: 'Examination Fee (1st Term)',
      totalAmount: 1500,
      paidAmount: 0,
      dueAmount: 1500,
      dueDate: '2026-08-15',
      status: 'unpaid',
    },
  ]);

  useEffect(() => {
    async function loadData() {
      const stats = await getAccountantFeeDashboard('school-1');
      setDashboardStats(stats);
      const types = await getFeeTypes('school-1');
      setFeeTypesList(types);
    }
    loadData();
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleRunBulkMonthlyInvoice = async () => {
    setLoading(true);
    const result = await generateBulkMonthlyInvoices({
      schoolId: 'school-1',
      academicYearId: 'ay-2026',
      billingYear: Number(genYear),
      billingMonth: Number(genMonth),
      classId: genClass,
      sectionId: genSection,
      includePreviousDues: includePrevDues,
    });
    setLoading(false);
    setGenSummary(result);
    triggerToast(`Bulk invoice generation complete! Created ${result.generatedCount} invoices.`);
  };

  const handleRunExamFeeInvoices = async () => {
    setLoading(true);
    const result = await generateExamFeeInvoices({
      schoolId: 'school-1',
      academicYearId: 'ay-2026',
      examId,
      classId: genClass,
      sectionId: genSection,
      feeTypeId: 'ft-3',
      amount: Number(examAmount),
      dueDate: examDueDate,
    });
    setLoading(false);
    triggerToast(`Generated ${result.generatedCount} exam fee invoices for ${examId}.`);
  };

  const handleCollectPayment = async () => {
    if (!selectedInvoice) return;
    setLoading(true);
    const res = await processPayment({
      schoolId: 'school-1',
      studentId: 'st-1',
      invoiceId: selectedInvoice.id,
      amount: Number(payAmount),
      paymentMethod: payMethod,
      transactionReference: payRef,
      accountHead: selectedInvoice.feeType.includes('Exam') ? 'Exam Fee Account' : 'Tuition Fee Account',
      remarks: 'In-person collection via fee counter',
    });
    setLoading(false);

    setLatestReceipt({
      receiptNumber: res.receiptNumber,
      paymentNumber: res.paymentNumber,
      studentName: selectedInvoice.studentName,
      amountPaid: payAmount,
      date: new Date().toLocaleDateString(),
      method: payMethod,
      ref: payRef,
      remainingDue: res.remainingDue,
    });

    // Update in-memory invoice list status
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === selectedInvoice.id
          ? {
              ...inv,
              paidAmount: inv.paidAmount + payAmount,
              dueAmount: Math.max(0, inv.totalAmount - (inv.paidAmount + payAmount)),
              status: inv.paidAmount + payAmount >= inv.totalAmount ? 'paid' : 'partially_paid',
            }
          : inv
      )
    );

    triggerToast(`Payment collected successfully! Receipt #${res.receiptNumber} generated.`);
  };

  const handleReversePayment = async (payId: string) => {
    setLoading(true);
    const res = await processPaymentReversal({
      schoolId: 'school-1',
      paymentId: payId,
      reversedById: 'accountant-01',
      reason: 'Incorrect transaction entry error reversal',
    });
    setLoading(false);
    triggerToast(`Payment ${payId} reversed successfully. Reversal Ref: ${res.reversalNumber}`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-teal-900 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 border border-teal-700 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <PageHeader
        title="Financial & Fee Management System"
        subtitle="Monthly tuition schedules, exam fees, invoice generation, bKash/MFS/cash collections, receipts & audit ledgers (BDT ৳)"
        breadcrumbs={[{ label: 'Financial Management' }, { label: 'Fees' }]}
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('payment_collect')}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Collect Fee Payment</span>
            </button>
            <button
              onClick={() => setActiveTab('monthly_gen')}
              className="px-3.5 py-2 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Generate Invoices</span>
            </button>
          </div>
        }
      />

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto border-b border-slate-200 gap-1 pb-px scrollbar-none text-xs font-medium text-slate-600">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-t-xl font-bold flex items-center gap-2 transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'overview'
              ? 'border-teal-600 text-teal-700 bg-teal-50/50'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Accountant Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('monthly_gen')}
          className={`px-4 py-2.5 rounded-t-xl font-bold flex items-center gap-2 transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'monthly_gen'
              ? 'border-teal-600 text-teal-700 bg-teal-50/50'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Monthly Tuition Invoices</span>
        </button>

        <button
          onClick={() => setActiveTab('exam_fees')}
          className={`px-4 py-2.5 rounded-t-xl font-bold flex items-center gap-2 transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'exam_fees'
              ? 'border-teal-600 text-teal-700 bg-teal-50/50'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Exam Fees & Admit Clearance</span>
        </button>

        <button
          onClick={() => setActiveTab('payment_collect')}
          className={`px-4 py-2.5 rounded-t-xl font-bold flex items-center gap-2 transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'payment_collect'
              ? 'border-teal-600 text-teal-700 bg-teal-50/50'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Payment Collection & Receipts</span>
        </button>

        <button
          onClick={() => setActiveTab('schedules')}
          className={`px-4 py-2.5 rounded-t-xl font-bold flex items-center gap-2 transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'schedules'
              ? 'border-teal-600 text-teal-700 bg-teal-50/50'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Fee Types & Structures</span>
        </button>

        <button
          onClick={() => setActiveTab('scholarships')}
          className={`px-4 py-2.5 rounded-t-xl font-bold flex items-center gap-2 transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'scholarships'
              ? 'border-teal-600 text-teal-700 bg-teal-50/50'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Scholarships & Waivers</span>
        </button>

        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-4 py-2.5 rounded-t-xl font-bold flex items-center gap-2 transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'transactions'
              ? 'border-teal-600 text-teal-700 bg-teal-50/50'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          <span>Transactions & Reversals</span>
        </button>
      </div>

      {/* TAB 1: ACCOUNTANT OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Dashboard Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Month Invoiced</span>
              <p className="text-2xl font-black text-slate-900">
                {formatCurrency(dashboardStats?.currentMonthInvoiced || 1850000)}
              </p>
              <p className="text-[11px] text-teal-700 font-bold">Academic Year 2026 — July</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Collected</span>
              <p className="text-2xl font-black text-emerald-600">
                {formatCurrency(dashboardStats?.currentMonthCollected || 1420000)}
              </p>
              <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 76.7% Collection Ratio
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Outstanding Dues</span>
              <p className="text-2xl font-black text-rose-600">
                {formatCurrency(dashboardStats?.currentMonthDue || 430000)}
              </p>
              <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Pending student payments
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Exam Fee Collected</span>
              <p className="text-2xl font-black text-teal-800">
                {formatCurrency(dashboardStats?.examFeeCollected || 260000)}
              </p>
              <p className="text-[11px] text-slate-500 font-medium">1st Term Final Examination</p>
            </div>
          </div>

          {/* Active Invoices Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-teal-600" />
                <h3 className="text-sm font-bold text-slate-900">Student Invoices Ledger (BDT ৳)</h3>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by student or invoice #..."
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                    <th className="px-4 py-3">Invoice No</th>
                    <th className="px-4 py-3">Student Name</th>
                    <th className="px-4 py-3">Class</th>
                    <th className="px-4 py-3">Fee Type</th>
                    <th className="px-4 py-3">Total Amount</th>
                    <th className="px-4 py-3">Paid Amount</th>
                    <th className="px-4 py-3">Due Amount</th>
                    <th className="px-4 py-3">Due Date</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-bold text-teal-700">{inv.invoiceNumber}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900">{inv.studentName}</td>
                      <td className="px-4 py-3 text-slate-600">{inv.class}</td>
                      <td className="px-4 py-3 font-medium text-slate-700">{inv.feeType}</td>
                      <td className="px-4 py-3 font-bold text-slate-900">{formatCurrency(inv.totalAmount)}</td>
                      <td className="px-4 py-3 text-emerald-600 font-semibold">{formatCurrency(inv.paidAmount)}</td>
                      <td className="px-4 py-3 text-rose-600 font-bold">{formatCurrency(inv.dueAmount)}</td>
                      <td className="px-4 py-3 text-slate-500">{inv.dueDate}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={inv.status} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedInvoice(inv);
                            setPayAmount(inv.dueAmount > 0 ? inv.dueAmount : inv.totalAmount);
                            setActiveTab('payment_collect');
                          }}
                          className="px-2.5 py-1 text-[11px] font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-md transition-colors"
                        >
                          Collect / Pay
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BULK MONTHLY TUITION GENERATOR */}
      {activeTab === 'monthly_gen' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-600" />
                Bulk Monthly Tuition Fee Invoice Generator
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Generates individual student monthly invoices automatically applying class schedules, custom student fee assignments, active scholarships, waivers, and rolling over previous dues. Prevents duplicate invoices for the same billing month.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Billing Year</label>
                <select
                  value={genYear}
                  onChange={(e) => setGenYear(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                >
                  <option value={2026}>2026</option>
                  <option value={2027}>2027</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Billing Month</label>
                <select
                  value={genMonth}
                  onChange={(e) => setGenMonth(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                >
                  <option value={1}>January</option>
                  <option value={2}>February</option>
                  <option value={3}>March</option>
                  <option value={4}>April</option>
                  <option value={5}>May</option>
                  <option value={6}>June</option>
                  <option value={7}>July</option>
                  <option value={8}>August</option>
                  <option value={9}>September</option>
                  <option value={10}>October</option>
                  <option value={11}>November</option>
                  <option value={12}>December</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Class</label>
                <select
                  value={genClass}
                  onChange={(e) => setGenClass(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                >
                  <option value="cls-10">Class 10</option>
                  <option value="cls-9">Class 9</option>
                  <option value="cls-8">Class 8</option>
                  <option value="cls-7">Class 7</option>
                  <option value="cls-6">Class 6</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Section</label>
                <select
                  value={genSection}
                  onChange={(e) => setGenSection(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                >
                  <option value="sec-padma">Padma Section</option>
                  <option value="sec-meghna">Meghna Section</option>
                  <option value="sec-jamuna">Jamuna Section</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-teal-50/60 p-4 rounded-xl border border-teal-100 text-xs">
              <input
                type="checkbox"
                id="prevDuesCheck"
                checked={includePrevDues}
                onChange={(e) => setIncludePrevDues(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded-xs border-slate-300"
              />
              <label htmlFor="prevDuesCheck" className="font-semibold text-slate-800 cursor-pointer">
                Include Previous Unpaid Dues in Generated Invoice Total (Rollover previous pending amounts)
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={handleRunBulkMonthlyInvoice}
                disabled={loading}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                <span>Execute Bulk Invoice Generation</span>
              </button>
            </div>

            {/* Execution Result Summary Box */}
            {genSummary && (
              <div className="mt-6 p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 animate-in fade-in">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  Generation Summary Result
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Generated Invoices</span>
                    <p className="text-lg font-black text-teal-700">{genSummary.generatedCount} Students</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Skipped (Duplicate Prevention)</span>
                    <p className="text-lg font-black text-amber-600">{genSummary.skippedCount} Students</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Total Invoiced Amount</span>
                    <p className="text-lg font-black text-slate-900">{formatCurrency(genSummary.totalInvoicedAmount)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: EXAM FEES & ADMIT CARD CLEARANCE */}
      {activeTab === 'exam_fees' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
            <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-teal-600" />
                  Exam Fee Structure & Admit Card Clearance
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Configure term examination fee structures and manage mandatory fee clearance before issuing exam admit cards.
                </p>
              </div>

              {/* Setting Toggle */}
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
                <div className="text-xs">
                  <p className="font-bold text-amber-900">Require Exam Fee for Admit Card</p>
                  <p className="text-[10px] text-amber-700">Prevents student admit card download if exam fee is unpaid.</p>
                </div>
                <input
                  type="checkbox"
                  checked={requireExamFeeForAdmitCard}
                  onChange={(e) => setRequireExamFeeForAdmitCard(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Select Examination</label>
                <select
                  value={examId}
                  onChange={(e) => setExamId(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                >
                  <option value="exam-term1-2026">1st Term Final Examination 2026</option>
                  <option value="exam-midterm-2026">Midterm Examination 2026</option>
                  <option value="exam-test-2026">SSC Test Examination 2026</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Exam Fee Amount (BDT ৳)</label>
                <input
                  type="number"
                  value={examAmount}
                  onChange={(e) => setExamAmount(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Payment Due Date</label>
                <input
                  type="date"
                  value={examDueDate}
                  onChange={(e) => setExamDueDate(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleRunExamFeeInvoices}
                disabled={loading}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Generate Exam Fee Invoices for Eligible Students</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PAYMENT COLLECTION & RECEIPT GENERATION */}
      {activeTab === 'payment_collect' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Collection Panel */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <CreditCard className="w-5 h-5 text-teal-600" />
              Collect Fee Payment & Issue Receipt
            </h3>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-teal-50/50 border border-teal-100 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-teal-800 uppercase">Selected Student Invoice</span>
                <p className="font-bold text-slate-900 text-sm">{selectedInvoice?.studentName} ({selectedInvoice?.class})</p>
                <p className="text-slate-600">Invoice: <span className="font-bold text-teal-700">{selectedInvoice?.invoiceNumber}</span></p>
                <div className="flex items-center gap-4 pt-1 font-bold">
                  <span>Total: {formatCurrency(selectedInvoice?.totalAmount || 0)}</span>
                  <span className="text-rose-600">Due: {formatCurrency(selectedInvoice?.dueAmount || 0)}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Payment Amount (BDT ৳)</label>
                <input
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-black text-lg text-slate-900 focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Payment Method</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                >
                  <option value="Cash">Cash Counter</option>
                  <option value="Mobile Financial Service">Mobile Financial Service (bKash / Nagad / Rocket)</option>
                  <option value="Bank">Bank Deposit / Cheque</option>
                  <option value="Online">Online Gateway / Card</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Transaction Reference / Cheque No</label>
                <input
                  type="text"
                  value={payRef}
                  onChange={(e) => setPayRef(e.target.value)}
                  placeholder="e.g. bKash TrxID / Bank Deposit Slip #"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                />
              </div>

              <button
                onClick={handleCollectPayment}
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Payment Collection & Print Receipt</span>
              </button>
            </div>
          </div>

          {/* Downloadable / Printable Official Receipt View */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Printer className="w-5 h-5 text-teal-600" />
                Official Fee Payment Receipt
              </h3>
              {latestReceipt && (
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
              )}
            </div>

            {latestReceipt ? (
              <div className="border-2 border-teal-600/30 rounded-2xl p-6 bg-linear-to-b from-teal-50/20 to-white space-y-4 text-xs font-medium text-slate-800">
                <div className="flex items-start justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h4 className="font-black text-slate-900 text-sm uppercase">Govt. Ideal High School & College</h4>
                    <p className="text-[10px] text-slate-500">Dhanmondi, Dhaka-1205 | School EIIN: 108234</p>
                    <p className="text-[10px] font-bold text-teal-700 mt-1">OFFICIAL MONEY RECEIPT</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">Receipt #: <span className="text-teal-700">{latestReceipt.receiptNumber}</span></p>
                    <p className="text-[10px] text-slate-500">Date: {latestReceipt.date}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <p><strong>Student Name:</strong> {latestReceipt.studentName}</p>
                  <p><strong>Method:</strong> {latestReceipt.method}</p>
                  <p><strong>Payment Ref:</strong> {latestReceipt.paymentNumber}</p>
                  <p><strong>Trx Ref:</strong> {latestReceipt.ref}</p>
                </div>

                <div className="bg-teal-100/60 p-3 rounded-xl flex items-center justify-between border border-teal-200">
                  <span className="font-bold text-teal-900">Amount Paid (BDT)</span>
                  <span className="font-black text-lg text-teal-900">{formatCurrency(latestReceipt.amountPaid)}</span>
                </div>

                <div className="pt-4 flex justify-between items-end border-t border-slate-200 text-[10px] text-slate-500">
                  <p>Computer Generated Receipt — Valid without physical signature.</p>
                  <div className="text-center">
                    <div className="w-24 border-b border-slate-400 mb-1"></div>
                    <p className="font-bold text-slate-700">Accounts Officer</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 space-y-2">
                <Receipt className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-xs font-semibold">No payment collected in this session yet.</p>
                <p className="text-[11px] text-slate-400">Select an invoice and confirm payment to preview printable money receipt.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: FEE TYPES & STRUCTURES */}
      {activeTab === 'schedules' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <DollarSign className="w-5 h-5 text-teal-600" />
              Configured School Fee Types
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              {feeTypesList.map((ft) => (
                <div key={ft.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1 hover:border-teal-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{ft.name}</span>
                    <span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded-xs">{ft.code}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">{ft.description}</p>
                  <div className="flex items-center gap-2 pt-1 text-[10px] text-slate-400 font-semibold">
                    <span>Category: {ft.category}</span>
                    <span>• {ft.isRecurring ? 'Monthly Recurring' : 'One-time'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: SCHOLARSHIPS & WAIVERS */}
      {activeTab === 'scholarships' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Award className="w-5 h-5 text-teal-600" />
            Active Student Scholarships & Special Waivers
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Title / Scheme</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Discount Value</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-bold text-slate-900">Tanvir Hossain</td>
                  <td className="px-4 py-3 font-semibold text-teal-700">Merit Scholarship 2026</td>
                  <td className="px-4 py-3 text-slate-600">MERIT</td>
                  <td className="px-4 py-3 font-bold text-emerald-600">10% Off Base Tuition</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md text-[10px] font-bold uppercase">ACTIVE</span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-bold text-slate-900">Mahir Faisal</td>
                  <td className="px-4 py-3 font-semibold text-teal-700">Financial Aid Waiver</td>
                  <td className="px-4 py-3 text-slate-600">NEED_BASED</td>
                  <td className="px-4 py-3 font-bold text-emerald-600">৳500 Fixed Discount</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md text-[10px] font-bold uppercase">ACTIVE</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7: TRANSACTIONS & REVERSALS */}
      {activeTab === 'transactions' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <RefreshCw className="w-5 h-5 text-teal-600" />
            Financial Transaction Audit Ledger & Payment Reversals
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                  <th className="px-4 py-3">Payment No</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-bold text-teal-700">PAY-881902</td>
                  <td className="px-4 py-3 text-slate-500">22/07/2026</td>
                  <td className="px-4 py-3 font-medium text-slate-700">bKash (MFS)</td>
                  <td className="px-4 py-3 font-bold text-slate-900">৳2,500.00</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md text-[10px] font-bold uppercase">CONFIRMED</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleReversePayment('PAY-881902')}
                      className="px-2.5 py-1 text-[10px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md transition-colors"
                    >
                      Process Reversal
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
