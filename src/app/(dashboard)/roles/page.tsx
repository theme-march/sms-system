'use client';

import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Lock, Save, Search, ShieldCheck } from 'lucide-react';
import { PageHeader } from '@/src/components/ui/PageHeader';

type Role = { id: string; name: string; displayName: string; description?: string | null; permissions: string[] };
type Permission = { id: string; code: string; name: string; module: string; description?: string | null };

export default function RolesAndPermissionsPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [assigned, setAssigned] = useState<Set<string>>(new Set());
  const [canManage, setCanManage] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetch('/api/roles')
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Unable to load access settings.');
        setRoles(data.roles);
        setPermissions(data.permissions);
        setCanManage(data.canManage);
        const firstEditable = data.roles.find((role: Role) => role.name !== 'Super Admin') || data.roles[0];
        if (firstEditable) {
          setSelectedId(firstEditable.id);
          setAssigned(new Set(firstEditable.permissions));
        }
      })
      .catch((error) => setMessage({ type: 'error', text: error.message }))
      .finally(() => setLoading(false));
  }, []);

  const selectedRole = roles.find((role) => role.id === selectedId);
  const readOnly = !canManage || selectedRole?.name === 'Super Admin';
  const grouped = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    return permissions.reduce<Record<string, Permission[]>>((result, permission) => {
      if (normalized && !`${permission.name} ${permission.code} ${permission.module}`.toLowerCase().includes(normalized)) return result;
      (result[permission.module] ||= []).push(permission);
      return result;
    }, {});
  }, [permissions, search]);

  function selectRole(role: Role) {
    setSelectedId(role.id);
    setAssigned(new Set(role.permissions));
    setMessage(null);
  }

  function toggle(code: string) {
    if (readOnly) return;
    setAssigned((current) => {
      const next = new Set(current);
      next.has(code) ? next.delete(code) : next.add(code);
      return next;
    });
  }

  async function save() {
    if (!selectedRole || readOnly) return;
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch(`/api/roles/${selectedRole.id}/permissions`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ permissionCodes: [...assigned] }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to save permissions.');
      setRoles((current) => current.map((role) => role.id === selectedRole.id ? { ...role, permissions: [...assigned] } : role));
      setMessage({ type: 'success', text: `${selectedRole.displayName} access updated. Active sessions will use it immediately.` });
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Unable to save permissions.' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Roles & Permissions" subtitle="Control exactly which modules and actions each role can access" breadcrumbs={[{ label: 'Roles & RBAC' }]} />

      <div className="grid gap-6 xl:grid-cols-[290px_minmax(0,1fr)]">
        <aside className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <p className="px-2 pb-3 text-xs font-bold uppercase tracking-wider text-slate-400">System roles ({roles.length})</p>
          <div className="space-y-1">
            {roles.map((role) => (
              <button key={role.id} onClick={() => selectRole(role)} className={`w-full rounded-lg px-3 py-3 text-left transition ${selectedId === role.id ? 'bg-teal-50 ring-1 ring-teal-200' : 'hover:bg-slate-50'}`}>
                <span className="flex items-center justify-between gap-2 text-sm font-semibold text-slate-800">
                  {role.displayName}
                  {role.name === 'Super Admin' && <Lock className="h-3.5 w-3.5 text-amber-500" />}
                </span>
                <span className="mt-1 block text-[11px] text-slate-400">{role.permissions.length} assigned permissions</span>
              </button>
            ))}
          </div>
        </aside>

        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900"><ShieldCheck className="h-5 w-5 text-teal-600" />{selectedRole?.displayName || 'Select a role'}</h2>
              <p className="mt-1 text-xs text-slate-500">{readOnly ? 'Read-only access configuration' : 'Changes control both navigation visibility and direct page access.'}</p>
            </div>
            <button onClick={save} disabled={readOnly || saving || loading} className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-300">
              <Save className="h-4 w-4" />{saving ? 'Saving…' : 'Save permissions'}
            </button>
          </div>

          <div className="p-5">
            {message && <div className={`mb-4 rounded-lg border px-4 py-3 text-sm ${message.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-rose-200 bg-rose-50 text-rose-700'}`}>{message.text}</div>}
            <label className="relative mb-5 block">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search permission, code or module…" className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" />
            </label>

            {loading ? <p className="py-12 text-center text-sm text-slate-400">Loading access policy…</p> : (
              <div className="space-y-6">
                {Object.entries(grouped).map(([module, items]) => (
                  <div key={module}>
                    <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">{module}</h3>
                    <div className="grid gap-2 md:grid-cols-2">
                      {items.map((permission) => {
                        const checked = selectedRole?.name === 'Super Admin' || assigned.has(permission.code);
                        return (
                          <button key={permission.code} onClick={() => toggle(permission.code)} disabled={readOnly} className={`flex items-start gap-3 rounded-lg border p-3 text-left transition ${checked ? 'border-teal-200 bg-teal-50/70' : 'border-slate-200 bg-white'} ${readOnly ? 'cursor-default' : 'hover:border-teal-300'}`}>
                            <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${checked ? 'border-teal-600 bg-teal-600 text-white' : 'border-slate-300 text-transparent'}`}><CheckCircle2 className="h-3.5 w-3.5" /></span>
                            <span><span className="block text-sm font-semibold text-slate-800">{permission.name}</span><span className="block text-[11px] text-slate-400">{permission.code}</span></span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
