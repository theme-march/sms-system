'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ExternalLink, KeyRound, Pencil, Shield, Trash2, UserPlus, X } from 'lucide-react';
import { PageHeader } from '@/src/components/ui/PageHeader';
import { DataTable } from '@/src/components/tables/DataTable';
import { SearchInput } from '@/src/components/tables/SearchInput';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import { ConfirmDialog } from '@/src/components/ui/ConfirmDialog';

type Role = { id: string; name: string; displayName: string };
type UserRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING';
  language: 'en' | 'bn';
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
  roles: Role[];
  profile: { type: 'teacher' | 'employee' | 'student' | 'guardian'; id: string; code: string | null } | null;
};
type FormState = {
  name: string; email: string; phone: string; password: string; roleId: string;
  status: UserRow['status']; language: 'en' | 'bn'; avatarUrl: string;
};
const emptyForm: FormState = { name: '', email: '', phone: '', password: '', roleId: '', status: 'ACTIVE', language: 'en', avatarUrl: '' };

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentUserId, setCurrentUserId] = useState('');
  const [canManage, setCanManage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<UserRow | null>(null);
  const [deleting, setDeleting] = useState<UserRow | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadUsers = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const query = new URLSearchParams({ search, page: String(page), pageSize: '20' });
      if (roleFilter) query.set('roleId', roleFilter);
      if (statusFilter) query.set('status', statusFilter);
      const response = await fetch(`/api/users?${query}`, { signal, cache: 'no-store' });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Unable to load users.');
      setUsers(payload.data);
      setRoles(payload.roles);
      setTotal(payload.pagination.total);
      setTotalPages(Math.max(1, payload.pagination.totalPages));
      setCanManage(payload.canManage);
      setCurrentUserId(payload.currentUserId);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Unable to load users.' });
    } finally {
      setLoading(false);
    }
  }, [page, roleFilter, search, statusFilter]);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => loadUsers(controller.signal), 250);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [loadUsers]);

  function openCreate() {
    const defaultRole = roles.find((role) => role.name !== 'Super Admin');
    setEditing(null);
    setForm({ ...emptyForm, roleId: defaultRole?.id || '' });
    setMessage(null);
    setModalOpen(true);
  }

  function openEdit(user: UserRow) {
    setEditing(user);
    setForm({
      name: user.name, email: user.email, phone: user.phone || '', password: '',
      roleId: user.roles[0]?.id || '', status: user.status, language: user.language,
      avatarUrl: user.avatarUrl || '',
    });
    setMessage(null);
    setModalOpen(true);
  }

  async function saveUser(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch(editing ? `/api/users/${editing.id}` : '/api/users', {
        method: editing ? 'PATCH' : 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(form),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || `Unable to ${editing ? 'update' : 'create'} user.`);
      setModalOpen(false);
      setMessage({ type: 'success', text: editing ? 'User account updated successfully.' : 'User account created successfully.' });
      await loadUsers();
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Unable to save user.' });
    } finally {
      setSaving(false);
    }
  }

  async function deleteUser() {
    if (!deleting) return;
    try {
      const response = await fetch(`/api/users/${deleting.id}`, { method: 'DELETE' });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Unable to delete user.');
      setMessage({ type: 'success', text: `${deleting.name}'s account was deleted.` });
      setDeleting(null);
      await loadUsers();
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Unable to delete user.' });
    }
  }

  const profileHref = (profile: UserRow['profile']) => profile ? `/dashboard/${profile.type === 'guardian' ? 'guardians' : `${profile.type}s`}/${profile.id}` : '';
  const columns = [
    {
      header: 'User Profile',
      cell: (row: UserRow) => (
        <div className="flex items-center gap-2.5">
          {row.avatarUrl ? <img src={row.avatarUrl} alt="" className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-200" /> : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-800">{row.name.charAt(0).toUpperCase()}</div>
          )}
          <div>
            <p className="font-semibold text-slate-900">{row.name}</p>
            <p className="text-[10px] text-slate-400">{row.email}</p>
            {row.profile?.code && <p className="text-[10px] text-teal-600">{row.profile.code}</p>}
          </div>
        </div>
      ),
    },
    {
      header: 'Assigned Role',
      cell: (row: UserRow) => <div className="flex flex-wrap gap-1">{row.roles.length ? row.roles.map((role) => (
        <span key={role.id} className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-800"><Shield className="h-3 w-3 text-teal-600" />{role.displayName}</span>
      )) : <span className="text-slate-400">Unassigned</span>}</div>,
    },
    { header: 'Phone Number', cell: (row: UserRow) => row.phone || '—' },
    { header: 'Status', cell: (row: UserRow) => <StatusBadge status={row.status} /> },
    { header: 'Joined Date', cell: (row: UserRow) => new Date(row.createdAt).toLocaleDateString() },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (row: UserRow) => {
        const isSuperAdmin = row.roles.some((role) => role.name === 'Super Admin');
        return <div className="flex justify-end gap-1">
          {row.profile && <Link href={profileHref(row.profile)} title="Open linked profile" className="rounded-md p-2 text-slate-500 hover:bg-teal-50 hover:text-teal-700"><ExternalLink className="h-4 w-4" /></Link>}
          {canManage && <button onClick={() => openEdit(row)} title="Edit account" className="rounded-md p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-700"><Pencil className="h-4 w-4" /></button>}
          {canManage && !isSuperAdmin && row.id !== currentUserId && <button onClick={() => setDeleting(row)} title="Delete account" className="rounded-md p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-700"><Trash2 className="h-4 w-4" /></button>}
        </div>;
      },
    },
  ];

  const editingSuperAdmin = editing?.roles.some((role) => role.name === 'Super Admin') ?? false;
  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        subtitle="Create accounts, manage access, status, passwords, and linked profiles"
        breadcrumbs={[{ label: 'Users' }]}
        action={canManage ? <button onClick={openCreate} className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-teal-700"><UserPlus className="h-3.5 w-3.5" />Create System User</button> : undefined}
      />

      {message && <div className={`rounded-lg border px-4 py-3 text-sm ${message.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-rose-200 bg-rose-50 text-rose-700'}`}>{message.text}</div>}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <SearchInput value={search} onChange={(value) => { setSearch(value); setPage(1); }} placeholder="Search user by name, email or phone..." />
        <select value={roleFilter} onChange={(event) => { setRoleFilter(event.target.value); setPage(1); }} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-teal-500">
          <option value="">All roles</option>{roles.map((role) => <option key={role.id} value={role.id}>{role.displayName}</option>)}
        </select>
        <select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-teal-500">
          <option value="">All statuses</option><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option><option value="SUSPENDED">Suspended</option><option value="PENDING">Pending</option>
        </select>
        <span className="ml-auto text-xs text-slate-500">{total} users</span>
      </div>

      <DataTable columns={columns} data={users} keyExtractor={(row) => row.id} isLoading={loading} />
      <div className="flex items-center justify-end gap-3">
        <button disabled={page <= 1 || loading} onClick={() => setPage((value) => value - 1)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold disabled:opacity-40">Previous</button>
        <span className="text-xs text-slate-500">Page {page} of {totalPages}</span>
        <button disabled={page >= totalPages || loading} onClick={() => setPage((value) => value + 1)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold disabled:opacity-40">Next</button>
      </div>

      {modalOpen && <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/40 p-4 backdrop-blur-xs">
        <form onSubmit={saveUser} className="my-auto w-full max-w-2xl rounded-xl border border-slate-200 bg-white shadow-xl">
          <div className="flex items-start justify-between border-b border-slate-200 p-5">
            <div><h2 className="text-lg font-bold text-slate-900">{editing ? 'Edit User Account' : 'Create System User'}</h2><p className="mt-1 text-xs text-slate-500">Account details, login credentials and role-based access</p></div>
            <button type="button" onClick={() => setModalOpen(false)} className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
          </div>
          <div className="grid gap-4 p-5 sm:grid-cols-2">
            <Field label="Full name" required><input required minLength={2} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="form-input" /></Field>
            <Field label="Email address" required><input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="form-input" /></Field>
            <Field label="Phone number"><input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} className="form-input" /></Field>
            <Field label={editing ? 'New password (optional)' : 'Temporary password'} required={!editing}>
              <div className="relative"><KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" /><input required={!editing} minLength={8} type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="form-input pl-9" placeholder={editing ? 'Leave blank to keep current' : 'Minimum 8 characters'} /></div>
            </Field>
            <Field label="Assigned role" required><select required disabled={editingSuperAdmin} value={form.roleId} onChange={(event) => setForm({ ...form, roleId: event.target.value })} className="form-input disabled:bg-slate-100">
              <option value="">Select role</option>{roles.filter((role) => editingSuperAdmin || role.name !== 'Super Admin').map((role) => <option key={role.id} value={role.id}>{role.displayName}</option>)}
            </select></Field>
            <Field label="Account status" required><select disabled={editingSuperAdmin} value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as FormState['status'] })} className="form-input disabled:bg-slate-100"><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option><option value="SUSPENDED">Suspended</option><option value="PENDING">Pending</option></select></Field>
            <Field label="Language"><select value={form.language} onChange={(event) => setForm({ ...form, language: event.target.value as 'en' | 'bn' })} className="form-input"><option value="en">English</option><option value="bn">বাংলা</option></select></Field>
            <Field label="Avatar URL"><input type="url" value={form.avatarUrl} onChange={(event) => setForm({ ...form, avatarUrl: event.target.value })} className="form-input" placeholder="https://..." /></Field>
          </div>
          {editing?.profile && <div className="mx-5 mb-4 rounded-lg border border-teal-100 bg-teal-50 px-4 py-3 text-xs text-teal-800">This account is linked to a {editing.profile.type} profile. Account access changes apply immediately; academic or employment details remain managed in the linked profile.</div>}
          <div className="flex justify-end gap-2 border-t border-slate-200 p-5"><button type="button" onClick={() => setModalOpen(false)} className="rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-200">Cancel</button><button disabled={saving} className="rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 disabled:bg-slate-300">{saving ? 'Saving…' : editing ? 'Save Changes' : 'Create User'}</button></div>
        </form>
      </div>}

      <ConfirmDialog isOpen={Boolean(deleting)} onClose={() => setDeleting(null)} onConfirm={deleteUser} title="Delete user account?" description={`${deleting?.name || 'This user'} will immediately lose access. The record is retained as a soft-deleted audit record.`} confirmText="Delete account" />
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-700">{label}{required && <span className="text-rose-500"> *</span>}</span>{children}</label>;
}
