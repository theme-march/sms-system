'use client';

import { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, Clock3, Plus, Settings2, XCircle, X } from 'lucide-react';
import { PageHeader } from '@/src/components/ui/PageHeader';
import { DatabaseEmptyState } from '@/src/components/ui/DatabaseEmptyState';
import { formatCurrency } from '@/src/lib/utils';

const today = new Date().toLocaleDateString('en-CA');

function useLeaves(admin = false) {
  const [data, setData] = useState<any>({ types: [], applications: [], balances: [], salary: [] });
  const [message, setMessage] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const load = useCallback(async () => {
    const response = await fetch(`/api/leaves${admin ? '?scope=admin' : ''}`, { cache: 'no-store' });
    const payload = await response.json();
    if (!response.ok) setMessage({ type: 'error', text: payload.error }); else setData(payload);
  }, [admin]);
  useEffect(() => { load(); }, [load]);
  async function submit(body: any, text: string) {
    setBusy(true); setMessage(null);
    try {
      const response = await fetch('/api/leaves', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error);
      setMessage({ type: 'success', text }); await load(); return true;
    } catch (error) { setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Operation failed.' }); return false; }
    finally { setBusy(false); }
  }
  return { data, message, busy, submit };
}

export function AdminLeaveSystem() {
  const { data, message, busy, submit } = useLeaves(true);
  const [tab, setTab] = useState('applications');
  const [modal, setModal] = useState('');
  const [selected, setSelected] = useState<any>(null);
  const [remarks, setRemarks] = useState('');
  const [policy, setPolicy] = useState({ id: '', name: '', code: '', description: '', daysAllowed: '10', isPaid: true, isCarryForward: false });
  const counts = (status: string) => data.applications.filter((item: any) => item.status === status).length;
  function openPolicy(item?: any) {
    setPolicy(item ? { id: item.id, name: item.name, code: item.code, description: item.description || '', daysAllowed: String(item.daysAllowed), isPaid: item.isPaid, isCarryForward: item.isCarryForward } : { id: '', name: '', code: '', description: '', daysAllowed: '10', isPaid: true, isCarryForward: false });
    setModal('policy');
  }
  return <div className="space-y-5 pb-10">
    <PageHeader title="Leave Management" subtitle="Policies, applications, approvals and leave utilization" breadcrumbs={[{ label: 'Leave' }]} action={data.canManage ? <button className="btn-primary" onClick={() => openPolicy()}><Plus className="h-4 w-4" />Leave Policy</button> : undefined} />
    <Notice value={message} />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Stat label="Pending" value={counts('PENDING')} icon={Clock3} /><Stat label="Approved" value={counts('APPROVED')} icon={CheckCircle2} /><Stat label="Rejected" value={counts('REJECTED')} icon={XCircle} /><Stat label="Active policies" value={data.types.filter((x: any) => x.isActive).length} icon={Settings2} /></div>
    <Tabs tab={tab} setTab={setTab} items={[['applications', 'Applications'], ['policies', 'Leave Policies']]} />
    {tab === 'applications' && <section className="card overflow-hidden"><div className="p-5"><h2 className="text-sm font-bold">Staff leave applications</h2></div>{!data.applications.length ? <DatabaseEmptyState title="No leave applications" description="Staff applications will appear here." /> : <div className="overflow-x-auto"><table className="table-base"><thead><tr><th>Staff</th><th>Leave</th><th>Date range</th><th>Days</th><th>Reason</th><th>Status</th><th>Decision</th></tr></thead><tbody>{data.applications.map((item: any) => <tr key={item.id}><td><b>{item.employee?.nameEn || 'Unlinked user'}</b><span className="block text-[10px] text-slate-400">{item.employee?.employeeCode || item.userId}</span></td><td>{item.leaveType?.name || 'Unknown'}</td><td>{date(item.startDate)} — {date(item.endDate)}</td><td>{item.totalDays}</td><td className="max-w-64 truncate">{item.reason}</td><td><Badge value={item.status} /></td><td>{data.canManage && item.status === 'PENDING' && <div className="flex gap-1"><button onClick={() => { setSelected(item); setModal('APPROVED'); }} className="rounded-lg bg-emerald-50 px-3 py-2 font-bold text-emerald-700">Approve</button><button onClick={() => { setSelected(item); setModal('REJECTED'); }} className="rounded-lg bg-rose-50 px-3 py-2 font-bold text-rose-700">Reject</button></div>}</td></tr>)}</tbody></table></div>}</section>}
    {tab === 'policies' && <section className="card p-5"><div className="flex justify-between"><h2 className="text-sm font-bold">Leave policies</h2>{data.canManage && <button className="btn-primary" onClick={() => openPolicy()}><Plus className="h-4 w-4" />Add Policy</button>}</div><div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{data.types.map((item: any) => <article key={item.id} className="rounded-xl border p-4"><div className="flex justify-between"><div><h3 className="font-bold">{item.name}</h3><p className="text-xs text-slate-400">{item.code}</p></div><Badge value={item.isActive ? 'ACTIVE' : 'INACTIVE'} /></div><p className="mt-4 text-2xl font-black">{item.daysAllowed} <span className="text-xs font-medium text-slate-400">days/year</span></p><p className="mt-2 text-xs text-slate-500">{item.isPaid ? 'Paid' : 'Unpaid'} · {item.isCarryForward ? 'Carry forward' : 'No carry forward'}</p>{data.canManage && <div className="mt-4 flex gap-2"><button className="btn-secondary" onClick={() => openPolicy(item)}>Edit</button><button className="btn-secondary" onClick={() => submit({ action: 'toggleType', id: item.id, isActive: !item.isActive }, 'Policy status updated.')}>{item.isActive ? 'Disable' : 'Enable'}</button></div>}</article>)}</div></section>}
    {modal === 'policy' && <Modal title={policy.id ? 'Update leave policy' : 'Create leave policy'} close={() => setModal('')}><form onSubmit={async event => { event.preventDefault(); if (await submit({ action: 'saveType', ...policy, daysAllowed: Number(policy.daysAllowed) }, policy.id ? 'Policy updated.' : 'Policy created.')) setModal(''); }}><div className="grid gap-4 p-5 md:grid-cols-2"><Field label="Name" value={policy.name} set={(value: string) => setPolicy({ ...policy, name: value })} /><Field label="Code" value={policy.code} set={(value: string) => setPolicy({ ...policy, code: value })} /><Field label="Days/year" type="number" value={policy.daysAllowed} set={(value: string) => setPolicy({ ...policy, daysAllowed: value })} /><label className="flex items-center gap-2 pt-6"><input type="checkbox" checked={policy.isPaid} onChange={event => setPolicy({ ...policy, isPaid: event.target.checked })} />Paid leave</label><label className="flex items-center gap-2"><input type="checkbox" checked={policy.isCarryForward} onChange={event => setPolicy({ ...policy, isCarryForward: event.target.checked })} />Carry forward</label></div><Footer busy={busy} close={() => setModal('')} label="Save Policy" /></form></Modal>}
    {['APPROVED', 'REJECTED'].includes(modal) && selected && <Modal title={`${modal === 'APPROVED' ? 'Approve' : 'Reject'} leave`} close={() => setModal('')}><div className="p-5"><p className="text-sm">{selected.employee?.nameEn} · {selected.leaveType?.name} · {selected.totalDays} days</p><label className="mt-4 block"><span className="field-label">Remarks</span><textarea className="form-input min-h-24" value={remarks} onChange={event => setRemarks(event.target.value)} /></label></div><Footer busy={busy} close={() => setModal('')} label="Confirm Decision" action={async () => { if (await submit({ action: 'review', id: selected.id, status: modal, remarks }, `Leave ${modal.toLowerCase()}.`)) setModal(''); }} /></Modal>}
  </div>;
}

export function StaffLeaveSystem() {
  const { data, message, busy, submit } = useLeaves(false);
  const [tab, setTab] = useState('leave');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ leaveTypeId: '', startDate: today, endDate: today, reason: '', attachmentUrl: '' });
  return <div className="space-y-5 pb-10">
    <PageHeader title="My Leave & Salary" subtitle="Apply for leave, track balances, decisions and salary history" breadcrumbs={[{ label: 'Self Service' }]} action={<button className="btn-primary" onClick={() => setModal(true)}><Plus className="h-4 w-4" />Apply for Leave</button>} />
    <Notice value={message} /><Tabs tab={tab} setTab={setTab} items={[['leave', 'Leave & Balances'], ['salary', 'Salary & Payslips']]} />
    {tab === 'leave' && <><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{data.balances.map((item: any) => <article key={item.id} className="rounded-xl border bg-white p-5"><div className="flex justify-between"><h3 className="font-bold">{item.name}</h3><Badge value={item.isPaid ? 'PAID' : 'UNPAID'} /></div><p className="mt-3 text-2xl font-black">{item.remaining} <span className="text-xs text-slate-400">remaining</span></p><p className="mt-2 text-xs text-slate-500">Used {item.used} · Pending {item.pending} · Total {item.daysAllowed}</p></article>)}</div><section className="card overflow-hidden"><div className="p-5"><h2 className="text-sm font-bold">My leave history</h2></div>{!data.applications.length ? <DatabaseEmptyState title="No leave history" description="Your applications will appear here." /> : <div className="overflow-x-auto"><table className="table-base"><thead><tr><th>Leave</th><th>Date range</th><th>Days</th><th>Reason</th><th>Status</th><th>Remarks</th><th>Action</th></tr></thead><tbody>{data.applications.map((item: any) => <tr key={item.id}><td>{item.leaveType?.name}</td><td>{date(item.startDate)} — {date(item.endDate)}</td><td>{item.totalDays}</td><td>{item.reason}</td><td><Badge value={item.status} /></td><td>{item.approval?.remarks || '—'}</td><td>{item.status === 'PENDING' && <button onClick={() => confirm('Cancel application?') && submit({ action: 'cancel', id: item.id }, 'Application cancelled.')} className="rounded-lg bg-rose-50 px-3 py-2 font-bold text-rose-700">Cancel</button>}</td></tr>)}</tbody></table></div>}</section></>}
    {tab === 'salary' && <section className="card overflow-hidden"><div className="p-5"><h2 className="text-sm font-bold">My salary & payslips</h2></div>{!data.salary.length ? <DatabaseEmptyState title="No salary records" description="Generated payroll will appear here." /> : <div className="overflow-x-auto"><table className="table-base"><thead><tr><th>Period</th><th>Basic</th><th>Gross</th><th>Deductions</th><th>Net</th><th>Paid</th><th>Status</th><th>Payslip</th></tr></thead><tbody>{data.salary.map((item: any) => <tr key={item.id}><td>{item.period ? `${item.period.payrollMonth}/${item.period.payrollYear}` : '—'}</td><td>{formatCurrency(item.basicSalary)}</td><td>{formatCurrency(item.grossSalary)}</td><td>{formatCurrency(item.deductions)}</td><td className="font-bold">{formatCurrency(item.netSalary)}</td><td>{formatCurrency(item.paidAmount)}</td><td><Badge value={item.status} /></td><td>{item.payslip?.payslipNumber || 'Not issued'}</td></tr>)}</tbody></table></div>}</section>}
    {modal && <Modal title="Apply for leave" close={() => setModal(false)}><form onSubmit={async event => { event.preventDefault(); if (await submit({ action: 'apply', ...form }, 'Leave application submitted.')) setModal(false); }}><div className="grid gap-4 p-5 md:grid-cols-2"><label><span className="field-label">Leave type</span><select required className="form-input" value={form.leaveTypeId} onChange={event => setForm({ ...form, leaveTypeId: event.target.value })}><option value="">Select leave</option>{data.balances.filter((item: any) => item.remaining > 0).map((item: any) => <option key={item.id} value={item.id}>{item.name} · {item.remaining} days</option>)}</select></label><Field label="Start date" type="date" value={form.startDate} set={(value: string) => setForm({ ...form, startDate: value })} /><Field label="End date" type="date" value={form.endDate} set={(value: string) => setForm({ ...form, endDate: value })} /><Field label="Attachment URL" value={form.attachmentUrl} set={(value: string) => setForm({ ...form, attachmentUrl: value })} optional /><label className="md:col-span-2"><span className="field-label">Reason</span><textarea required minLength={5} className="form-input min-h-24" value={form.reason} onChange={event => setForm({ ...form, reason: event.target.value })} /></label></div><Footer busy={busy} close={() => setModal(false)} label="Submit Application" /></form></Modal>}
  </div>;
}

function Tabs({ tab, setTab, items }: any) { return <nav className="flex gap-1 rounded-xl border bg-white p-1.5">{items.map((item: any) => <button key={item[0]} onClick={() => setTab(item[0])} className={`rounded-lg px-4 py-2.5 text-xs font-bold ${tab === item[0] ? 'bg-teal-600 text-white' : 'text-slate-600'}`}>{item[1]}</button>)}</nav>; }
function Stat({ label, value, icon: Icon }: any) { return <div className="rounded-xl border bg-white p-5"><div className="flex justify-between"><span className="text-xs text-slate-500">{label}</span><Icon className="h-4 w-4 text-teal-600" /></div><p className="mt-2 text-2xl font-black">{value}</p></div>; }
function Badge({ value }: any) { const good = ['APPROVED', 'ACTIVE', 'PAID'].includes(value); const bad = ['REJECTED', 'CANCELLED', 'INACTIVE'].includes(value); return <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${good ? 'bg-emerald-50 text-emerald-700' : bad ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>{value}</span>; }
function Notice({ value }: any) { return value ? <div className={`rounded-xl border p-3 text-sm ${value.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>{value.text}</div> : null; }
function Modal({ title, close, children }: any) { return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4"><div className="w-full max-w-2xl rounded-2xl bg-white"><div className="flex justify-between border-b p-5"><h2 className="font-bold">{title}</h2><button onClick={close}><X className="h-5 w-5" /></button></div>{children}</div></div>; }
function Footer({ busy, close, label, action }: any) { return <div className="flex justify-end gap-2 border-t p-5"><button type="button" className="btn-secondary" onClick={close}>Cancel</button><button type={action ? 'button' : 'submit'} onClick={action} disabled={busy} className="btn-primary">{busy ? 'Saving…' : label}</button></div>; }
function Field({ label, value, set, type = 'text', optional = false }: any) { return <label><span className="field-label">{label}</span><input required={!optional} type={type} min={type === 'number' ? 0 : undefined} className="form-input" value={value} onChange={event => set(event.target.value)} /></label>; }
function date(value: string) { return new Date(value).toLocaleDateString('en-GB'); }
