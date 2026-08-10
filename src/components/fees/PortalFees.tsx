"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CreditCard, Download, Eye, Receipt, X } from "lucide-react";
import { DatabaseEmptyState } from "@/src/components/ui/DatabaseEmptyState";
import { formatCurrency } from "@/src/lib/utils";

type PortalPayment = { id: string; receiptNumber: string; amount: number; paymentMethod: string; transactionId?: string | null; paidAt: string; notes?: string | null };
type PortalInvoice = { id: string; invoiceNumber: string; amount: number; discount: number; paidAmount: number; dueAmount: number; dueDate: string; createdAt: string; status: string; feeStructure: { name: string; frequency: string; category: string }; payments: PortalPayment[] };

export function PortalFees({ studentId, studentName }: { studentId: string; studentName?: string }) {
  const [invoices, setInvoices] = useState<PortalInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState<PortalInvoice | null>(null);
  const [paying, setPaying] = useState<PortalInvoice | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [activeView, setActiveView] = useState<"installments" | "payments">("installments");
  const [form, setForm] = useState({ amount: "", paymentMethod: "BKASH", transactionId: "" });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/portal/fees?studentId=${encodeURIComponent(studentId)}`, { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error);
      setInvoices(payload);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to load fees.");
    } finally { setLoading(false); }
  }, [studentId]);
  useEffect(() => { load(); }, [load]);

  const totalFee = invoices.reduce((sum, item) => sum + item.amount, 0);
  const totalDiscount = invoices.reduce((sum, item) => sum + item.discount, 0);
  const totalBill = totalFee - totalDiscount;
  const totalPaid = invoices.reduce((sum, item) => sum + item.paidAmount, 0);
  const balance = totalBill - totalPaid;
  const amountToPay = Math.max(0, balance);
  const nextDue = invoices.find((item) => item.dueAmount > 0 && item.status !== "CANCELLED");
  const payments = useMemo(() => invoices.flatMap((invoice) => invoice.payments.map((payment) => ({ invoice, payment }))).sort((a, b) => new Date(b.payment.paidAt).getTime() - new Date(a.payment.paidAt).getTime()), [invoices]);

  function openPayment(item: PortalInvoice) {
    setPaying(item);
    setForm({ amount: String(item.dueAmount), paymentMethod: "BKASH", transactionId: "" });
    setMessage("");
  }
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!paying) return;
    setBusy(true);
    try {
      const response = await fetch("/api/portal/fees", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ invoiceId: paying.id, ...form, amount: Number(form.amount) }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error);
      setPaying(null);
      setMessage(`Payment successful. Receipt: ${payload.receiptNumber}`);
      await load();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Payment failed."); }
    finally { setBusy(false); }
  }
  async function downloadReceipt(invoice: PortalInvoice, payment: PortalPayment) {
    const { jsPDF } = await import("jspdf");
    const pdf = new jsPDF();
    pdf.setTextColor(15, 118, 110); pdf.setFont("helvetica", "bold"); pdf.setFontSize(18); pdf.text("PAYMENT RECEIPT", 20, 24);
    pdf.setTextColor(30, 41, 59); pdf.setFontSize(12); pdf.text(payment.receiptNumber, 20, 34);
    pdf.setFont("helvetica", "normal"); pdf.setFontSize(10);
    [`Student: ${studentName || "Student"}`, `Invoice: ${invoice.invoiceNumber}`, `Fee: ${invoice.feeStructure.name}`, `Amount paid: BDT ${payment.amount.toFixed(2)}`, `Payment method: ${payment.paymentMethod}`, `Transaction ID: ${payment.transactionId || "N/A"}`, `Payment date: ${new Date(payment.paidAt).toLocaleString("en-GB")}`, "Status: PAID"].forEach((line, index) => pdf.text(line, 20, 48 + index * 8));
    pdf.save(`${payment.receiptNumber}.pdf`);
  }

  if (loading) return <section className="rounded-xl border border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-sm">Loading payment details…</section>;
  if (!invoices.length) return <section className="rounded-xl border border-slate-200 bg-white shadow-sm"><DatabaseEmptyState title="No fees assigned" description="Assigned tuition, exam and event fees will appear here." /></section>;

  return <div className="space-y-5">
    {message && <div className="rounded-xl border border-teal-200 bg-teal-50 p-4 text-xs font-semibold text-teal-800">{message}</div>}

    <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <SummaryGroup items={[["Total Fee", formatCurrency(totalFee)], ["Total Discount", `-${formatCurrency(totalDiscount)}`]]} />
          <SummaryGroup items={[["Total Bill", formatCurrency(totalBill)], ["Total Paid", formatCurrency(totalPaid)]]} />
          <div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Balance (Due / Advance)</p><p className={`mt-2 text-2xl font-black ${balance > 0 ? "text-amber-700" : balance < 0 ? "text-blue-700" : "text-emerald-700"}`}>{formatCurrency(balance)}</p><p className="mt-1 text-[10px] text-slate-500">Negative balance means advance payment</p></div>
        </div>
      </section>
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-black text-slate-900">Amount to Pay</h2>
        <input aria-label="Amount to pay" type="number" readOnly value={amountToPay} className="form-input mt-3 text-lg font-bold" />
        {nextDue ? <button type="button" onClick={() => openPayment(nextDue)} className="btn-primary mt-3 w-full justify-center"><CreditCard className="h-4 w-4" />Pay {nextDue.invoiceNumber}</button> : <p className="mt-3 rounded-lg bg-emerald-50 p-3 text-center text-xs font-bold text-emerald-700">All assigned fees are paid</p>}
      </section>
    </div>

    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div><h2 className="text-sm font-bold text-slate-900">Fee Records</h2><p className="mt-1 text-xs text-slate-500">Switch between assigned installments and completed payments</p></div>
        <div className="inline-flex w-fit rounded-lg border border-slate-200 bg-slate-50 p-1">
          <button type="button" onClick={() => setActiveView("installments")} className={`rounded-md px-4 py-2 text-xs font-bold transition-colors ${activeView === "installments" ? "bg-teal-600 text-white shadow-xs" : "text-slate-600 hover:bg-white"}`}>Installments & Invoices <span className="ml-1 opacity-75">({invoices.length})</span></button>
          <button type="button" onClick={() => setActiveView("payments")} className={`rounded-md px-4 py-2 text-xs font-bold transition-colors ${activeView === "payments" ? "bg-teal-600 text-white shadow-xs" : "text-slate-600 hover:bg-white"}`}>Payments & Receipts <span className="ml-1 opacity-75">({payments.length})</span></button>
        </div>
      </div>

      {activeView === "installments" ? <>
        <div className="border-b border-slate-100 px-5 py-4"><h3 className="flex items-center gap-2 text-sm font-bold text-slate-900"><Receipt className="h-4 w-4 text-teal-600" />Installment & Invoice Schedule</h3><p className="mt-1 text-xs text-slate-500">Due dates, payable amounts and current installment status</p></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[1000px] text-left text-xs"><thead className="bg-teal-700 text-white"><tr><th className="p-3 text-center">SL. No</th><th className="p-3">Invoice / Installment</th><th className="p-3">Fee Type</th><th className="p-3">Due Date</th><th className="p-3 text-right">Installment Amount</th><th className="p-3 text-right">Discount</th><th className="p-3 text-right">Payable</th><th className="p-3">Status</th><th className="p-3">Action</th></tr></thead><tbody className="divide-y divide-slate-100">{invoices.map((item, index) => <tr key={item.id} className="hover:bg-teal-50/50"><td className="p-3 text-center font-bold">{index + 1}</td><td className="p-3"><p className="font-mono font-semibold">{item.invoiceNumber}</p><p className="mt-1 text-[10px] text-slate-400">{ordinal(index + 1)} installment · {item.feeStructure.frequency}</p></td><td className="p-3 font-semibold">{item.feeStructure.name}</td><td className="p-3">{new Date(`${item.dueDate}T00:00:00`).toLocaleDateString("en-GB")}</td><td className="p-3 text-right">{formatCurrency(item.amount)}</td><td className="p-3 text-right text-rose-600">{formatCurrency(item.discount)}</td><td className="p-3 text-right font-bold text-amber-700">{formatCurrency(item.dueAmount)}</td><td className="p-3"><Status value={item.status} /></td><td className="p-3"><div className="flex gap-2"><button type="button" onClick={() => setDetails(item)} className="btn-secondary"><Eye className="h-4 w-4" />Details</button>{item.dueAmount > 0 && item.status !== "CANCELLED" && <button type="button" onClick={() => openPayment(item)} className="btn-primary">Pay</button>}</div></td></tr>)}</tbody></table></div>
      </> : <>
        <div className="border-b border-slate-100 px-5 py-4"><h3 className="flex items-center gap-2 text-sm font-bold text-slate-900"><Receipt className="h-4 w-4 text-teal-600" />Payment History & Receipts</h3><p className="mt-1 text-xs text-slate-500">Every successful payment, method, transaction reference and receipt</p></div>
        {!payments.length ? <p className="p-10 text-center text-sm text-slate-500">No payment history is available.</p> : <div className="overflow-x-auto"><table className="w-full min-w-[1050px] text-left text-xs"><thead className="bg-teal-700 text-white"><tr><th className="p-3 text-center">SL No.</th><th className="p-3">Fee Type</th><th className="p-3">Invoice</th><th className="p-3">Receipt</th><th className="p-3 text-right">Payment</th><th className="p-3">Method</th><th className="p-3">Transaction ID</th><th className="p-3">Date</th><th className="p-3">Action</th></tr></thead><tbody className="divide-y divide-slate-100">{payments.map(({ invoice, payment }, index) => <tr key={payment.id} className="hover:bg-teal-50/50"><td className="p-3 text-center font-bold">{index + 1}</td><td className="p-3 font-semibold">{invoice.feeStructure.name}</td><td className="p-3 font-mono">{invoice.invoiceNumber}</td><td className="p-3 font-mono font-semibold text-teal-700">{payment.receiptNumber}</td><td className="p-3 text-right font-bold">{formatCurrency(payment.amount)}</td><td className="p-3">{payment.paymentMethod}</td><td className="p-3">{payment.transactionId || "—"}</td><td className="p-3">{new Date(payment.paidAt).toLocaleDateString("en-GB")}</td><td className="p-3"><button type="button" onClick={() => downloadReceipt(invoice, payment)} className="btn-secondary"><Download className="h-4 w-4" />Receipt</button></td></tr>)}</tbody></table></div>}
      </>}
    </section>

    {details && <Modal title="Invoice & payment details" onClose={() => setDetails(null)}><div className="grid gap-3 rounded-xl bg-slate-50 p-4 text-xs sm:grid-cols-2"><Info label="Invoice" value={details.invoiceNumber} /><Info label="Fee" value={details.feeStructure.name} /><Info label="Original amount" value={formatCurrency(details.amount)} /><Info label="Discount" value={formatCurrency(details.discount)} /><Info label="Total paid" value={formatCurrency(details.paidAmount)} /><Info label="Outstanding" value={formatCurrency(details.dueAmount)} /><Info label="Due date" value={new Date(`${details.dueDate}T00:00:00`).toLocaleDateString("en-GB")} /><Info label="Status" value={details.status} /></div><div className="mt-5"><h4 className="text-sm font-black">Payment history</h4>{details.payments.length ? <div className="mt-3 space-y-3">{details.payments.map((payment) => <article key={payment.id} className="rounded-xl border border-slate-200 p-4"><div className="flex items-center justify-between gap-3"><div><p className="font-mono text-xs font-black">{payment.receiptNumber}</p><p className="mt-1 text-[11px] text-slate-500">{new Date(payment.paidAt).toLocaleString("en-GB")}</p></div><button type="button" onClick={() => downloadReceipt(details, payment)} className="btn-secondary"><Download className="h-4 w-4" />Receipt PDF</button></div><div className="mt-3 grid gap-2 text-xs sm:grid-cols-3"><Info label="Paid amount" value={formatCurrency(payment.amount)} /><Info label="Method" value={payment.paymentMethod} /><Info label="Transaction ID" value={payment.transactionId || "Not provided"} /></div></article>)}</div> : <p className="mt-3 text-xs text-slate-500">No payment recorded.</p>}</div></Modal>}
    {paying && <Modal title="Pay invoice" subtitle={`${paying.invoiceNumber} · Due ${formatCurrency(paying.dueAmount)}`} onClose={() => setPaying(null)}><form onSubmit={submit}><div className="space-y-4"><label><span className="field-label">Amount</span><input required type="number" min="0.01" step="0.01" max={paying.dueAmount} className="form-input" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} /></label><label><span className="field-label">Payment method</span><select className="form-input" value={form.paymentMethod} onChange={(event) => setForm({ ...form, paymentMethod: event.target.value })}><option>BKASH</option><option>NAGAD</option><option>CARD</option><option>BANK_TRANSFER</option></select></label><label><span className="field-label">Transaction reference</span><input required minLength={4} className="form-input" value={form.transactionId} onChange={(event) => setForm({ ...form, transactionId: event.target.value })} placeholder="Enter transaction ID" /></label></div><div className="mt-5 flex justify-end gap-2"><button type="button" className="btn-secondary" onClick={() => setPaying(null)}>Cancel</button><button disabled={busy} className="btn-primary">{busy ? "Processing…" : "Confirm payment"}</button></div></form></Modal>}
  </div>;
}

function SummaryGroup({items}:{items:Array<[string,string]>}) { return <div className="space-y-3">{items.map(([label,value]) => <div key={label} className="flex items-center justify-between gap-4"><span className="text-sm font-semibold text-slate-600">{label}</span><strong className="text-base text-slate-900">{value}</strong></div>)}</div>; }
function Status({value}:{value:string}) { const paid=value==="PAID"; return <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${paid?"bg-emerald-50 text-emerald-700":value==="OVERDUE"?"bg-rose-50 text-rose-700":"bg-amber-50 text-amber-700"}`}>{value}</span>; }
function ordinal(value:number) { const mod100=value%100; if(mod100>=11&&mod100<=13)return `${value}th`; return `${value}${value%10===1?"st":value%10===2?"nd":value%10===3?"rd":"th"}`; }
function Modal({ title, subtitle, onClose, children }: { title: string; subtitle?: string; onClose: () => void; children: React.ReactNode }) { return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4"><div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"><div className="sticky top-0 z-10 flex items-start justify-between border-b bg-white p-5"><div><h3 className="font-bold">{title}</h3>{subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}</div><button type="button" onClick={onClose} className="p-1 text-slate-400"><X className="h-5 w-5" /></button></div><div className="p-5">{children}</div></div></div>; }
function Info({ label, value }: { label: string; value: string }) { return <div><p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 font-bold text-slate-800">{value}</p></div>; }
