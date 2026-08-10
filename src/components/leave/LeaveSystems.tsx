"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Download,
  Eye,
  Banknote,
  WalletCards,
  Plus,
  Settings2,
  XCircle,
  X,
} from "lucide-react";
import { PageHeader } from "@/src/components/ui/PageHeader";
import { DatabaseEmptyState } from "@/src/components/ui/DatabaseEmptyState";
import { formatCurrency } from "@/src/lib/utils";

const today = new Date().toLocaleDateString("en-CA");

function useLeaves(admin = false) {
  const [data, setData] = useState<any>({
    types: [],
    applications: [],
    balances: [],
    salary: [],
  });
  const [message, setMessage] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const load = useCallback(async () => {
    const response = await fetch(`/api/leaves${admin ? "?scope=admin" : ""}`, {
      cache: "no-store",
    });
    const payload = await response.json();
    if (!response.ok) setMessage({ type: "error", text: payload.error });
    else setData(payload);
  }, [admin]);
  useEffect(() => {
    load();
  }, [load]);
  async function submit(body: any, text: string) {
    setBusy(true);
    setMessage(null);
    try {
      const response = await fetch("/api/leaves", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error);
      setMessage({ type: "success", text });
      await load();
      return true;
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Operation failed.",
      });
      return false;
    } finally {
      setBusy(false);
    }
  }
  return { data, message, busy, submit };
}

export function AdminLeaveSystem() {
  const { data, message, busy, submit } = useLeaves(true);
  const [tab, setTab] = useState("applications");
  const [modal, setModal] = useState("");
  const [selected, setSelected] = useState<any>(null);
  const [remarks, setRemarks] = useState("");
  const [policy, setPolicy] = useState({
    id: "",
    name: "",
    code: "",
    description: "",
    daysAllowed: "10",
    isPaid: true,
    isCarryForward: false,
  });
  const counts = (status: string) =>
    data.applications.filter((item: any) => item.status === status).length;
  function openPolicy(item?: any) {
    setPolicy(
      item
        ? {
            id: item.id,
            name: item.name,
            code: item.code,
            description: item.description || "",
            daysAllowed: String(item.daysAllowed),
            isPaid: item.isPaid,
            isCarryForward: item.isCarryForward,
          }
        : {
            id: "",
            name: "",
            code: "",
            description: "",
            daysAllowed: "10",
            isPaid: true,
            isCarryForward: false,
          },
    );
    setModal("policy");
  }
  return (
    <div className="space-y-5 pb-10">
      <PageHeader
        title="Leave Management"
        subtitle="Policies, applications, approvals and leave utilization"
        breadcrumbs={[{ label: "Leave" }]}
        action={
          data.canManage ? (
            <button className="btn-primary" onClick={() => openPolicy()}>
              <Plus className="h-4 w-4" />
              Leave Policy
            </button>
          ) : undefined
        }
      />
      <Notice value={message} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Pending" value={counts("PENDING")} icon={Clock3} />
        <Stat label="Approved" value={counts("APPROVED")} icon={CheckCircle2} />
        <Stat label="Rejected" value={counts("REJECTED")} icon={XCircle} />
        <Stat
          label="Active policies"
          value={data.types.filter((x: any) => x.isActive).length}
          icon={Settings2}
        />
      </div>
      <Tabs
        tab={tab}
        setTab={setTab}
        items={[
          ["applications", "Applications"],
          ["policies", "Leave Policies"],
        ]}
      />
      {tab === "applications" && (
        <section className="card overflow-hidden">
          <div className="p-5">
            <h2 className="text-sm font-bold">Staff leave applications</h2>
          </div>
          {!data.applications.length ? (
            <DatabaseEmptyState
              title="No leave applications"
              description="Staff applications will appear here."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="table-base">
                <thead>
                  <tr>
                    <th>Staff</th>
                    <th>Leave</th>
                    <th>Date range</th>
                    <th>Days</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Decision</th>
                  </tr>
                </thead>
                <tbody>
                  {data.applications.map((item: any) => (
                    <tr key={item.id}>
                      <td>
                        <b>{item.employee?.nameEn || "Unlinked user"}</b>
                        <span className="block text-[10px] text-slate-400">
                          {item.employee?.employeeCode || item.userId}
                        </span>
                      </td>
                      <td>{item.leaveType?.name || "Unknown"}</td>
                      <td>
                        {date(item.startDate)} — {date(item.endDate)}
                      </td>
                      <td>{item.totalDays}</td>
                      <td className="max-w-64 truncate">{item.reason}</td>
                      <td>
                        <Badge value={item.status} />
                      </td>
                      <td>
                        {data.canManage && item.status === "PENDING" && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => {
                                setSelected(item);
                                setModal("APPROVED");
                              }}
                              className="rounded-lg bg-emerald-50 px-3 py-2 font-bold text-emerald-700"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                setSelected(item);
                                setModal("REJECTED");
                              }}
                              className="rounded-lg bg-rose-50 px-3 py-2 font-bold text-rose-700"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
      {tab === "policies" && (
        <section className="card p-5">
          <div className="flex justify-between">
            <h2 className="text-sm font-bold">Leave policies</h2>
            {data.canManage && (
              <button className="btn-primary" onClick={() => openPolicy()}>
                <Plus className="h-4 w-4" />
                Add Policy
              </button>
            )}
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data.types.map((item: any) => (
              <article key={item.id} className="rounded-xl border p-4">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-bold">{item.name}</h3>
                    <p className="text-xs text-slate-400">{item.code}</p>
                  </div>
                  <Badge value={item.isActive ? "ACTIVE" : "INACTIVE"} />
                </div>
                <p className="mt-4 text-2xl font-black">
                  {item.daysAllowed}{" "}
                  <span className="text-xs font-medium text-slate-400">
                    days/year
                  </span>
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  {item.isPaid ? "Paid" : "Unpaid"} ·{" "}
                  {item.isCarryForward ? "Carry forward" : "No carry forward"}
                </p>
                {data.canManage && (
                  <div className="mt-4 flex gap-2">
                    <button
                      className="btn-secondary"
                      onClick={() => openPolicy(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-secondary"
                      onClick={() =>
                        submit(
                          {
                            action: "toggleType",
                            id: item.id,
                            isActive: !item.isActive,
                          },
                          "Policy status updated.",
                        )
                      }
                    >
                      {item.isActive ? "Disable" : "Enable"}
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      )}
      {modal === "policy" && (
        <Modal
          title={policy.id ? "Update leave policy" : "Create leave policy"}
          close={() => setModal("")}
        >
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              if (
                await submit(
                  {
                    action: "saveType",
                    ...policy,
                    daysAllowed: Number(policy.daysAllowed),
                  },
                  policy.id ? "Policy updated." : "Policy created.",
                )
              )
                setModal("");
            }}
          >
            <div className="grid gap-4 p-5 md:grid-cols-2">
              <Field
                label="Name"
                value={policy.name}
                set={(value: string) => setPolicy({ ...policy, name: value })}
              />
              <Field
                label="Code"
                value={policy.code}
                set={(value: string) => setPolicy({ ...policy, code: value })}
              />
              <Field
                label="Days/year"
                type="number"
                value={policy.daysAllowed}
                set={(value: string) =>
                  setPolicy({ ...policy, daysAllowed: value })
                }
              />
              <label className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  checked={policy.isPaid}
                  onChange={(event) =>
                    setPolicy({ ...policy, isPaid: event.target.checked })
                  }
                />
                Paid leave
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={policy.isCarryForward}
                  onChange={(event) =>
                    setPolicy({
                      ...policy,
                      isCarryForward: event.target.checked,
                    })
                  }
                />
                Carry forward
              </label>
            </div>
            <Footer
              busy={busy}
              close={() => setModal("")}
              label="Save Policy"
            />
          </form>
        </Modal>
      )}
      {["APPROVED", "REJECTED"].includes(modal) && selected && (
        <Modal
          title={`${modal === "APPROVED" ? "Approve" : "Reject"} leave`}
          close={() => setModal("")}
        >
          <div className="p-5">
            <p className="text-sm">
              {selected.employee?.nameEn} · {selected.leaveType?.name} ·{" "}
              {selected.totalDays} days
            </p>
            <label className="mt-4 block">
              <span className="field-label">Remarks</span>
              <textarea
                className="form-input min-h-24"
                value={remarks}
                onChange={(event) => setRemarks(event.target.value)}
              />
            </label>
          </div>
          <Footer
            busy={busy}
            close={() => setModal("")}
            label="Confirm Decision"
            action={async () => {
              if (
                await submit(
                  { action: "review", id: selected.id, status: modal, remarks },
                  `Leave ${modal.toLowerCase()}.`,
                )
              )
                setModal("");
            }}
          />
        </Modal>
      )}
    </div>
  );
}

export function StaffLeaveSystem({
  initialTab = "leave",
}: { initialTab?: "leave" | "salary" } = {}) {
  const { data, message, busy, submit } = useLeaves(false);
  const [tab, setTab] = useState(initialTab);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({
    leaveTypeId: "",
    startDate: today,
    endDate: today,
    reason: "",
    attachmentUrl: "",
  });
  return (
    <div className="space-y-5 pb-10">
      <PageHeader
        title={tab === "salary" ? "My Salary & Payslips" : "My Leave & Salary"}
        subtitle={
          tab === "salary"
            ? "View salary breakdown, payment history and download payslips"
            : "Apply for leave, track balances and decisions"
        }
        breadcrumbs={[{ label: "Self Service" }]}
        action={
          tab === "leave" ? (
            <button className="btn-primary" onClick={() => setModal(true)}>
              <Plus className="h-4 w-4" />
              Apply for Leave
            </button>
          ) : undefined
        }
      />
      <Notice value={message} />
      <Tabs
        tab={tab}
        setTab={setTab}
        items={[
          ["leave", "Leave & Balances"],
          ["salary", "Salary & Payslips"],
        ]}
      />
      {tab === "leave" && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {data.balances.map((item: any) => (
              <article key={item.id} className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="absolute inset-x-0 top-0 h-1 bg-teal-600" />
                <div className="flex justify-between">
                  <h3 className="font-bold">{item.name}</h3>
                  <Badge value={item.isPaid ? "PAID" : "UNPAID"} />
                </div>
                <p className="mt-3 text-2xl font-black">
                  {item.remaining}{" "}
                  <span className="text-xs text-slate-400">remaining</span>
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Used {item.used} · Pending {item.pending} · Total{" "}
                  {item.daysAllowed}
                </p>
              </article>
            ))}
          </div>
          <section className="card overflow-hidden">
            <div className="p-5">
              <h2 className="text-sm font-bold">My leave history</h2>
            </div>
            {!data.applications.length ? (
              <DatabaseEmptyState
                title="No leave history"
                description="Your applications will appear here."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="table-base">
                  <thead>
                    <tr>
                      <th>Leave</th>
                      <th>Date range</th>
                      <th>Days</th>
                      <th>Reason</th>
                      <th>Status</th>
                      <th>Remarks</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.applications.map((item: any) => (
                      <tr key={item.id}>
                        <td>{item.leaveType?.name}</td>
                        <td>
                          {date(item.startDate)} — {date(item.endDate)}
                        </td>
                        <td>{item.totalDays}</td>
                        <td>{item.reason}</td>
                        <td>
                          <Badge value={item.status} />
                        </td>
                        <td>{item.approval?.remarks || "—"}</td>
                        <td>
                          {item.status === "PENDING" && (
                            <button
                              onClick={() =>
                                confirm("Cancel application?") &&
                                submit(
                                  { action: "cancel", id: item.id },
                                  "Application cancelled.",
                                )
                              }
                              className="rounded-lg bg-rose-50 px-3 py-2 font-bold text-rose-700"
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
      {tab === "salary" && <SalaryPanel data={data} />}
      {modal && (
        <Modal title="Apply for leave" close={() => setModal(false)}>
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              if (
                await submit(
                  { action: "apply", ...form },
                  "Leave application submitted.",
                )
              )
                setModal(false);
            }}
          >
            <div className="grid gap-4 p-5 md:grid-cols-2">
              <label>
                <span className="field-label">Leave type</span>
                <select
                  required
                  className="form-input"
                  value={form.leaveTypeId}
                  onChange={(event) =>
                    setForm({ ...form, leaveTypeId: event.target.value })
                  }
                >
                  <option value="">Select leave</option>
                  {data.balances
                    .filter((item: any) => item.remaining > 0)
                    .map((item: any) => (
                      <option key={item.id} value={item.id}>
                        {item.name} · {item.remaining} days
                      </option>
                    ))}
                </select>
              </label>
              <Field
                label="Start date"
                type="date"
                value={form.startDate}
                set={(value: string) => setForm({ ...form, startDate: value })}
              />
              <Field
                label="End date"
                type="date"
                value={form.endDate}
                set={(value: string) => setForm({ ...form, endDate: value })}
              />
              <Field
                label="Attachment URL"
                value={form.attachmentUrl}
                set={(value: string) =>
                  setForm({ ...form, attachmentUrl: value })
                }
                optional
              />
              <label className="md:col-span-2">
                <span className="field-label">Reason</span>
                <textarea
                  required
                  minLength={5}
                  className="form-input min-h-24"
                  value={form.reason}
                  onChange={(event) =>
                    setForm({ ...form, reason: event.target.value })
                  }
                />
              </label>
            </div>
            <Footer
              busy={busy}
              close={() => setModal(false)}
              label="Submit Application"
            />
          </form>
        </Modal>
      )}
    </div>
  );
}

function SalaryPanel({ data }: { data: any }) {
  const [selected, setSelected] = useState<any>(null);
  const profile = data.salaryProfile;
  const current = data.currentSalary;
  const totals = data.salaryTotals || { gross: 0, net: 0, paid: 0, due: 0 };

  async function downloadPayslip(item: any) {
    const { jsPDF } = await import("jspdf");
    const pdf = new jsPDF();
    const period = item.period
      ? `${salaryMonth(item.period.payrollMonth)} ${item.period.payrollYear}`
      : "Salary period";
    pdf.setTextColor(174, 43, 30);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text(profile?.schoolName || "School Management System", 105, 20, {
      align: "center",
    });
    pdf.setFontSize(14);
    pdf.text("SALARY PAYSLIP", 105, 30, { align: "center" });
    pdf.setTextColor(30, 41, 59);
    pdf.setFontSize(11);
    pdf.text(period, 105, 38, { align: "center" });
    pdf.setDrawColor(174, 43, 30);
    pdf.line(18, 44, 192, 44);
    pdf.setFont("helvetica", "normal");
    const identity = [
      `Staff: ${profile?.nameEn || "Staff member"}`,
      `Employee code: ${profile?.employeeCode || "N/A"}`,
      `Designation: ${profile?.designation?.nameEn || profile?.type || "Staff"}`,
      `Payslip: ${item.payslip?.payslipNumber || "Not formally issued"}`,
      `Status: ${item.status}`,
    ];
    identity.forEach((line, index) => pdf.text(line, 20, 56 + index * 7));
    pdf.setFont("helvetica", "bold");
    pdf.text("Salary breakdown", 20, 96);
    pdf.setFont("helvetica", "normal");
    const breakdown = [
      ["Basic salary", item.basicSalary],
      ["Allowances", item.totalAllowances],
      ["Overtime", item.overtime],
      ["Bonus", item.bonus],
      ["Gross salary", item.grossSalary],
      ["Standard deductions", item.totalDeductions],
      ["Tax", item.tax],
      ["Loan deduction", item.loanDeduction],
      ["Absence deduction", item.absenceDeduction],
      ["Net salary", item.netSalary],
      ["Paid", item.paidAmount],
      ["Outstanding", item.dueAmount],
    ];
    breakdown.forEach(([label, value], index) => {
      const y = 106 + index * 7;
      pdf.text(String(label), 24, y);
      pdf.text(`BDT ${Number(value).toFixed(2)}`, 184, y, { align: "right" });
    });
    pdf.line(20, 191, 190, 191);
    pdf.setFont("helvetica", "bold");
    pdf.text("Payment history", 20, 202);
    pdf.setFont("helvetica", "normal");
    if (item.payments?.length) {
      item.payments
        .slice(0, 8)
        .forEach((payment: any, index: number) =>
          pdf.text(
            `${new Date(payment.paymentDate).toLocaleDateString("en-GB")} | ${payment.paymentMethod} | ${payment.transactionRef || "No reference"} | BDT ${Number(payment.amount).toFixed(2)}`,
            24,
            212 + index * 7,
          ),
        );
    } else {
      pdf.text("No payment has been recorded for this period.", 24, 212);
    }
    pdf.save(
      `${profile?.employeeCode || "staff"}-${period.replace(/\s+/g, "-").toLowerCase()}-payslip.pdf`,
    );
  }

  return (
    <div className="space-y-5">
      {current ? (
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                Current salary assignment
              </p>
              <h2 className="mt-1 text-lg font-black text-slate-900">
                {current.structure.name}
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                {profile?.nameEn} · {profile?.employeeCode} · Effective{" "}
                {date(current.effectiveDate)}
              </p>
            </div>
            <Badge value="ACTIVE" />
          </div>
          <div className="grid gap-4 p-5 lg:grid-cols-[1fr_320px]">
            <div className="grid gap-3 sm:grid-cols-2">
              {current.components.map((component: any) => (
                <div
                  key={component.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 p-4 text-sm"
                >
                  <div>
                    <p className="font-bold text-slate-800">{component.name}</p>
                    <p className="mt-1 text-[10px] text-slate-400">
                      {component.type} · {component.amountType}
                    </p>
                  </div>
                  <strong
                    className={
                      component.type === "DEDUCTION"
                        ? "text-rose-700"
                        : "text-emerald-700"
                    }
                  >
                    {component.type === "DEDUCTION" ? "−" : "+"}
                    {component.amountType === "PERCENTAGE"
                      ? `${component.amount}%`
                      : formatCurrency(component.amount)}
                  </strong>
                </div>
              ))}
            </div>
            <div className="dashboard-hero rounded-xl p-5 text-white shadow-sm">
              <p className="dashboard-hero-muted text-[10px] font-bold uppercase tracking-wider">
                Estimated monthly salary
              </p>
              <p className="mt-3 text-2xl font-black">
                {formatCurrency(
                  current.estimatedEarnings - current.estimatedDeductions,
                )}
              </p>
              <div className="mt-5 space-y-2 border-t border-white/10 pt-4 text-xs">
                <div className="flex justify-between">
                  <span className="dashboard-hero-muted">Earnings</span>
                  <b>{formatCurrency(current.estimatedEarnings)}</b>
                </div>
                <div className="flex justify-between">
                  <span className="dashboard-hero-muted">Deductions</span>
                  <b>{formatCurrency(current.estimatedDeductions)}</b>
                </div>
              </div>
              <p className="dashboard-hero-muted mt-4 text-[10px] leading-relaxed">
                Final salary may change after attendance, overtime, bonus, tax
                and adjustments are calculated.
              </p>
            </div>
          </div>
        </section>
      ) : (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
          No active salary structure is assigned. Contact HR or the payroll
          administrator.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SalaryMetric
          icon={Banknote}
          label="Total gross"
          value={totals.gross}
        />
        <SalaryMetric icon={WalletCards} label="Total net" value={totals.net} />
        <SalaryMetric
          icon={CheckCircle2}
          label="Total paid"
          value={totals.paid}
        />
        <SalaryMetric icon={Clock3} label="Outstanding" value={totals.due} />
      </div>

      <section className="card overflow-hidden">
        <div className="border-b border-slate-100 p-5">
          <h2 className="text-sm font-bold">Salary history & payslips</h2>
          <p className="mt-1 text-xs text-slate-500">
            Gross-to-net breakdown, payments, outstanding balance and payslip
            downloads
          </p>
        </div>
        {!data.salary.length ? (
          <DatabaseEmptyState
            title="Payroll not generated yet"
            description="Your salary structure is assigned. This section will populate after HR generates the next payroll period."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="table-base">
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Gross</th>
                  <th>Deductions</th>
                  <th>Net</th>
                  <th>Paid / Due</th>
                  <th>Status</th>
                  <th>Payments</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.salary.map((item: any) => (
                  <tr key={item.id}>
                    <td>
                      <b>
                        {item.period
                          ? `${salaryMonth(item.period.payrollMonth)} ${item.period.payrollYear}`
                          : "—"}
                      </b>
                      <span className="block text-[10px] text-slate-400">
                        Basic {formatCurrency(item.basicSalary)}
                      </span>
                    </td>
                    <td>{formatCurrency(item.grossSalary)}</td>
                    <td className="text-rose-700">
                      −{formatCurrency(item.deductions)}
                    </td>
                    <td className="font-black">
                      {formatCurrency(item.netSalary)}
                    </td>
                    <td>
                      <span className="text-emerald-700">
                        Paid {formatCurrency(item.paidAmount)}
                      </span>
                      <span className="block font-semibold text-amber-700">
                        Due {formatCurrency(item.dueAmount)}
                      </span>
                    </td>
                    <td>
                      <Badge value={item.status} />
                    </td>
                    <td>{item.payments.length}</td>
                    <td>
                      <div className="flex flex-wrap gap-2">
                        <button
                          className="btn-secondary"
                          onClick={() => setSelected(item)}
                        >
                          <Eye className="h-4 w-4" />
                          Details
                        </button>
                        <button
                          className="btn-secondary"
                          onClick={() => downloadPayslip(item)}
                        >
                          <Download className="h-4 w-4" />
                          Payslip PDF
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selected && (
        <Modal
          title={`Salary details · ${selected.period ? `${salaryMonth(selected.period.payrollMonth)} ${selected.period.payrollYear}` : "Period"}`}
          close={() => setSelected(null)}
        >
          <div className="max-h-[75vh] space-y-5 overflow-y-auto p-5">
            <div className="grid gap-3 sm:grid-cols-3">
              <SalaryValue label="Gross salary" value={selected.grossSalary} />
              <SalaryValue label="Net salary" value={selected.netSalary} />
              <SalaryValue label="Outstanding" value={selected.dueAmount} />
            </div>
            <div>
              <h3 className="text-sm font-black">Complete breakdown</h3>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {[
                  ["Basic salary", selected.basicSalary],
                  ["Allowances", selected.totalAllowances],
                  ["Overtime", selected.overtime],
                  ["Bonus", selected.bonus],
                  ["Standard deductions", selected.totalDeductions],
                  ["Tax", selected.tax],
                  ["Loan deduction", selected.loanDeduction],
                  ["Absence deduction", selected.absenceDeduction],
                ].map(([label, value]) => (
                  <div
                    key={String(label)}
                    className="flex justify-between rounded-lg bg-slate-50 p-3 text-xs"
                  >
                    <span>{label}</span>
                    <b>{formatCurrency(Number(value))}</b>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-black">Payment history</h3>
              {selected.payments.length ? (
                <div className="mt-3 space-y-2">
                  {selected.payments.map((payment: any) => (
                    <div
                      key={payment.id}
                      className="flex flex-col justify-between gap-2 rounded-xl border p-3 text-xs sm:flex-row"
                    >
                      <div>
                        <b>{payment.paymentMethod}</b>
                        <p className="mt-1 text-slate-500">
                          {new Date(payment.paymentDate).toLocaleString(
                            "en-GB",
                          )}{" "}
                          · {payment.transactionRef || "No reference"}
                        </p>
                      </div>
                      <strong className="text-emerald-700">
                        {formatCurrency(payment.amount)}
                      </strong>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-xs text-slate-500">
                  No payment recorded.
                </p>
              )}
            </div>
            <div className="flex justify-end">
              <button
                className="btn-primary"
                onClick={() => downloadPayslip(selected)}
              >
                <Download className="h-4 w-4" />
                Download Payslip PDF
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function SalaryMetric({ icon: Icon, label, value }: any) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex justify-between">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </p>
        <span className="rounded-lg bg-teal-50 p-2 text-teal-700">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-2 text-xl font-black">
        {formatCurrency(Number(value || 0))}
      </p>
    </div>
  );
}
function SalaryValue({ label, value }: any) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-lg font-black">
        {formatCurrency(Number(value || 0))}
      </p>
    </div>
  );
}
function salaryMonth(value: number) {
  return new Date(2026, value - 1, 1).toLocaleString("en", { month: "long" });
}

function Tabs({ tab, setTab, items }: any) {
  return (
    <nav className="flex gap-1 rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm">
      {items.map((item: any) => (
        <button
          key={item[0]}
          onClick={() => setTab(item[0])}
          className={`rounded-lg px-4 py-2.5 text-xs font-bold transition-colors ${tab === item[0] ? "bg-teal-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-50 hover:text-teal-700"}`}
        >
          {item[1]}
        </button>
      ))}
    </nav>
  );
}
function Stat({ label, value, icon: Icon }: any) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex justify-between">
        <span className="text-xs text-slate-500">{label}</span>
        <Icon className="h-4 w-4 text-teal-600" />
      </div>
      <p className="mt-2 text-2xl font-black">{value}</p>
    </div>
  );
}
function Badge({ value }: any) {
  const good = ["APPROVED", "ACTIVE", "PAID"].includes(value);
  const bad = ["REJECTED", "CANCELLED", "INACTIVE"].includes(value);
  return (
    <span
      className={`rounded-full px-2 py-1 text-[10px] font-bold ${good ? "bg-emerald-50 text-emerald-700" : bad ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"}`}
    >
      {value}
    </span>
  );
}
function Notice({ value }: any) {
  return value ? (
    <div
      className={`rounded-xl border p-3 text-sm ${value.type === "success" ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"}`}
    >
      {value.text}
    </div>
  ) : null;
}
function Modal({ title, close, children }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white">
        <div className="flex justify-between border-b p-5">
          <h2 className="font-bold">{title}</h2>
          <button onClick={close}>
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
function Footer({ busy, close, label, action }: any) {
  return (
    <div className="flex justify-end gap-2 border-t p-5">
      <button type="button" className="btn-secondary" onClick={close}>
        Cancel
      </button>
      <button
        type={action ? "button" : "submit"}
        onClick={action}
        disabled={busy}
        className="btn-primary"
      >
        {busy ? "Saving…" : label}
      </button>
    </div>
  );
}
function Field({ label, value, set, type = "text", optional = false }: any) {
  return (
    <label>
      <span className="field-label">{label}</span>
      <input
        required={!optional}
        type={type}
        min={type === "number" ? 0 : undefined}
        className="form-input"
        value={value}
        onChange={(event) => set(event.target.value)}
      />
    </label>
  );
}
function date(value: string) {
  return new Date(value).toLocaleDateString("en-GB");
}
