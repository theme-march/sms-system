'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Check, CheckCircle2, ChevronDown, ChevronRight, Copy, Edit3, Eye, Filter,
  KeyRound, Lock, Plus, RotateCcw, Save, Search, ShieldAlert, ShieldCheck, Sparkles, Trash2, UserRound,
  UsersRound, X,
} from 'lucide-react';
import { PageHeader } from '@/src/components/ui/PageHeader';

type Role = {
  id: string;
  name: string;
  displayName: string;
  description?: string | null;
  isSystem: boolean;
  userCount: number;
  createdAt: string;
  updatedAt: string;
  permissions: string[];
};
type Permission = { id: string; code: string; name: string; module: string; description?: string | null };
type Notice = { type: 'success' | 'error'; text: string };

const PERMISSION_SECTION_ORDER = [
  'Core Management',
  'Website Settings',
  'Academic & Administration',
  'Operations & Evaluation',
  'Finance & Accounts',
  'Self Service',
] as const;

function permissionSection(code: string) {
  if (code.startsWith('website.')) return 'Website Settings';
  if (
    code.startsWith('academic.') || code.startsWith('students.') ||
    code.startsWith('guardians.') || code.startsWith('admissions.') ||
    code.startsWith('teachers.') || code.startsWith('employees.') ||
    code.startsWith('departments.') || code.startsWith('designations.') ||
    code.startsWith('teacher-assignments.') || code === 'portal.teacher.view' ||
    code === 'portal.student.view' || code === 'portal.guardian.view'
  ) return 'Academic & Administration';
  if (
    code.startsWith('attendance.') || code.startsWith('routines.') ||
    code.startsWith('homework.') || code.startsWith('exams.') ||
    code.startsWith('marks.') || code.startsWith('results.') ||
    code.startsWith('leave.')
  ) return 'Operations & Evaluation';
  if (
    code.startsWith('fees.') || code.startsWith('payments.') ||
    code.startsWith('payroll.') || code.startsWith('reports.') ||
    code.startsWith('audit.')
  ) return 'Finance & Accounts';
  if (code === 'portal.employee.view') return 'Self Service';
  return 'Core Management';
}

function permissionHelpText(permission: Permission) {
  if (permission.description) return permission.description;
  const subject = permission.name.replace(/^(Manage|View|Access|Enter|Verify|Lock|Calculate|Publish|Collect|Reverse|Generate|Approve|Export|Migrate)\s+/i, '').toLowerCase();
  if (permission.code.endsWith('.manage')) return `Create, edit, update and delete ${subject}.`;
  if (permission.code.endsWith('.view')) return `View and access ${subject}.`;
  if (permission.code.includes('export')) return `Export ${subject} for reporting and offline use.`;
  if (permission.code.includes('approve')) return `Review and approve ${subject}.`;
  if (permission.code.includes('publish')) return `Publish ${subject} for authorized portal users.`;
  return `${permission.name} within the authorized school workspace.`;
}

const SENSITIVE_PERMISSIONS = new Set([
  'users.manage', 'roles.manage', 'school.settings.manage', 'backup.manage',
  'payments.reverse', 'payroll.approve', 'marks.lock', 'legacy.migrate',
]);

function roleInitials(name: string) {
  return name.split(/\s+/).slice(0, 2).map((word) => word[0]).join('').toUpperCase();
}

function formatDate(value?: string) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value));
}

export default function RolesAndPermissionsPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [assigned, setAssigned] = useState<Set<string>>(new Set());
  const [savedAssigned, setSavedAssigned] = useState<Set<string>>(new Set());
  const [canManage, setCanManage] = useState(false);
  const [roleSearch, setRoleSearch] = useState('');
  const [permissionSearch, setPermissionSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('All sections');
  const [accessFilter, setAccessFilter] = useState<'all' | 'assigned' | 'unassigned'>('all');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [dialog, setDialog] = useState<'create' | 'edit' | 'details' | 'delete' | null>(null);
  const [form, setForm] = useState({ displayName: '', description: '', copyPermissions: true });
  const [submitting, setSubmitting] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [reviewOpen, setReviewOpen] = useState(false);

  const selectedRole = roles.find((role) => role.id === selectedId);
  const readOnly = !canManage || selectedRole?.name === 'Super Admin';
  const dirty = useMemo(() => {
    if (assigned.size !== savedAssigned.size) return true;
    return [...assigned].some((code) => !savedAssigned.has(code));
  }, [assigned, savedAssigned]);
  const addedPermissions = useMemo(() => permissions.filter((permission) => assigned.has(permission.code) && !savedAssigned.has(permission.code)), [permissions, assigned, savedAssigned]);
  const removedPermissions = useMemo(() => permissions.filter((permission) => !assigned.has(permission.code) && savedAssigned.has(permission.code)), [permissions, assigned, savedAssigned]);
  const sensitiveAssigned = useMemo(() => [...assigned].filter((code) => SENSITIVE_PERMISSIONS.has(code)).length, [assigned]);

  useEffect(() => {
    void loadRoles();
  }, []);

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  async function loadRoles(preferredId?: string) {
    setLoading(true);
    try {
      const response = await fetch('/api/roles');
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to load access settings.');
      setRoles(data.roles);
      setPermissions(data.permissions);
      setCanManage(data.canManage);
      const chosen = data.roles.find((role: Role) => role.id === preferredId)
        || data.roles.find((role: Role) => role.name !== 'Super Admin')
        || data.roles[0];
      if (chosen) applySelectedRole(chosen);
      const modules = new Set<string>((data.permissions as Permission[]).map((permission) => permission.module));
      setExpandedModules(modules);
    } catch (error) {
      setNotice({ type: 'error', text: error instanceof Error ? error.message : 'Unable to load access settings.' });
    } finally {
      setLoading(false);
    }
  }

  function applySelectedRole(role: Role) {
    const codes = new Set(role.permissions);
    setSelectedId(role.id);
    setAssigned(codes);
    setSavedAssigned(new Set(codes));
    setNotice(null);
  }

  function selectRole(role: Role) {
    if (role.id === selectedId) return;
    if (dirty && !window.confirm('You have unsaved permission changes. Discard them and open another role?')) return;
    applySelectedRole(role);
  }

  const modules = useMemo(() => PERMISSION_SECTION_ORDER.filter((section) =>
    permissions.some((permission) => permissionSection(permission.code) === section)), [permissions]);
  const filteredRoles = useMemo(() => {
    const query = roleSearch.trim().toLowerCase();
    if (!query) return roles;
    return roles.filter((role) => `${role.displayName} ${role.name} ${role.description || ''}`.toLowerCase().includes(query));
  }, [roles, roleSearch]);
  const grouped = useMemo(() => {
    const query = permissionSearch.trim().toLowerCase();
    return permissions.reduce<Record<string, Permission[]>>((result, permission) => {
      const checked = selectedRole?.name === 'Super Admin' || assigned.has(permission.code);
      const section = permissionSection(permission.code);
      if (moduleFilter !== 'All sections' && section !== moduleFilter) return result;
      if (accessFilter === 'assigned' && !checked) return result;
      if (accessFilter === 'unassigned' && checked) return result;
      if (query && !`${permission.name} ${permission.code} ${permission.module} ${section} ${permission.description || ''}`.toLowerCase().includes(query)) return result;
      (result[section] ||= []).push(permission);
      return result;
    }, {});
  }, [permissions, permissionSearch, moduleFilter, accessFilter, assigned, selectedRole]);
  const visiblePermissions = useMemo(() => Object.values(grouped).flat(), [grouped]);

  function toggle(code: string) {
    if (readOnly) return;
    setAssigned((current) => {
      const next = new Set(current);
      if (next.has(code)) {
        next.delete(code);
        if (code.endsWith('.view')) next.delete(code.replace(/\.view$/, '.manage'));
      } else {
        next.add(code);
        if (code.endsWith('.manage')) {
          const viewCode = code.replace(/\.manage$/, '.view');
          if (permissions.some((permission) => permission.code === viewCode)) next.add(viewCode);
        }
      }
      return next;
    });
  }

  function setMany(items: Permission[], enabled: boolean) {
    if (readOnly) return;
    setAssigned((current) => {
      const next = new Set(current);
      items.forEach((permission) => enabled ? next.add(permission.code) : next.delete(permission.code));
      return next;
    });
  }

  async function savePermissions() {
    if (!selectedRole || readOnly || !dirty) return;
    setSaving(true);
    setNotice(null);
    try {
      const response = await fetch(`/api/roles/${selectedRole.id}/permissions`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ permissionCodes: [...assigned] }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to save permissions.');
      const permissionCodes = [...assigned];
      setRoles((current) => current.map((role) => role.id === selectedRole.id
        ? { ...role, permissions: permissionCodes, updatedAt: new Date().toISOString() }
        : role));
      setSavedAssigned(new Set(permissionCodes));
      setReviewOpen(false);
      setNotice({ type: 'success', text: `${selectedRole.displayName} permissions updated successfully.` });
    } catch (error) {
      setNotice({ type: 'error', text: error instanceof Error ? error.message : 'Unable to save permissions.' });
    } finally {
      setSaving(false);
    }
  }

  function openCreate() {
    setForm({ displayName: '', description: '', copyPermissions: Boolean(selectedRole && selectedRole.name !== 'Super Admin') });
    setDialog('create');
  }

  function openEdit() {
    if (!selectedRole || selectedRole.name === 'Super Admin') return;
    setForm({ displayName: selectedRole.displayName, description: selectedRole.description || '', copyPermissions: false });
    setDialog('edit');
  }

  async function submitRole(event: React.FormEvent) {
    event.preventDefault();
    if (!form.displayName.trim()) return;
    setSubmitting(true);
    setNotice(null);
    try {
      const editing = dialog === 'edit';
      const response = await fetch(editing ? `/api/roles/${selectedRole?.id}` : '/api/roles', {
        method: editing ? 'PATCH' : 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          displayName: form.displayName,
          description: form.description,
          permissionCodes: !editing && form.copyPermissions ? [...assigned] : [],
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `Unable to ${editing ? 'update' : 'create'} role.`);
      if (editing && selectedRole) {
        const updated = { ...selectedRole, ...data.role };
        setRoles((current) => current.map((role) => role.id === updated.id ? updated : role));
        setNotice({ type: 'success', text: `${updated.displayName} details updated.` });
      } else {
        setRoles((current) => [...current, data.role].sort((a, b) => a.displayName.localeCompare(b.displayName)));
        applySelectedRole(data.role);
        setNotice({ type: 'success', text: `${data.role.displayName} role created.` });
      }
      setDialog(null);
    } catch (error) {
      setNotice({ type: 'error', text: error instanceof Error ? error.message : 'Unable to save role.' });
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteRole() {
    if (!selectedRole || selectedRole.isSystem) return;
    setSubmitting(true);
    try {
      const response = await fetch(`/api/roles/${selectedRole.id}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to delete role.');
      const remaining = roles.filter((role) => role.id !== selectedRole.id);
      setRoles(remaining);
      if (remaining[0]) applySelectedRole(remaining[0]);
      setDialog(null);
      setNotice({ type: 'success', text: `${selectedRole.displayName} role deleted.` });
    } catch (error) {
      setDialog(null);
      setNotice({ type: 'error', text: error instanceof Error ? error.message : 'Unable to delete role.' });
    } finally {
      setSubmitting(false);
    }
  }

  const totalAssignments = roles.reduce((total, role) => total + role.userCount, 0);
  const protectedRoles = roles.filter((role) => role.isSystem).length;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Roles & Permissions"
        subtitle="Create roles and control view, create, edit, update and delete access from one place"
        breadcrumbs={[{ label: 'Roles & RBAC' }]}
        action={canManage ? <button onClick={openCreate} className="btn-primary"><Plus className="h-4 w-4" />Create role</button> : undefined}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Total roles', value: roles.length, icon: ShieldCheck, tone: 'text-teal-600 bg-teal-50' },
          { label: 'System roles', value: protectedRoles, icon: Lock, tone: 'text-amber-600 bg-amber-50' },
          { label: 'Custom roles', value: roles.length - protectedRoles, icon: KeyRound, tone: 'text-violet-600 bg-violet-50' },
          { label: 'User assignments', value: totalAssignments, icon: UsersRound, tone: 'text-sky-600 bg-sky-50' },
        ].map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between"><p className="text-xs font-semibold text-slate-500">{label}</p><span className={`rounded-lg p-2 ${tone}`}><Icon className="h-4 w-4" /></span></div>
            <p className="mt-2 text-2xl font-bold text-slate-900">{loading ? '—' : value}</p>
          </div>
        ))}
      </div>

      {notice && (
        <div className={`flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${notice.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-rose-200 bg-rose-50 text-rose-700'}`}>
          <span className="flex items-center gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />{notice.text}</span>
          <button onClick={() => setNotice(null)} aria-label="Dismiss"><X className="h-4 w-4" /></button>
        </div>
      )}

      <div className="grid items-start gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="self-start overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:sticky xl:top-20">
          <div className="border-b border-slate-200 p-4">
            <div className="flex items-center justify-between gap-3">
              <div><h2 className="font-bold text-slate-900">All roles</h2><p className="text-xs text-slate-500">Select a role to manage</p></div>
              {canManage && <button onClick={openCreate} className="rounded-lg border border-slate-200 bg-white p-2 text-teal-600 hover:bg-teal-50" title="Create role"><Plus className="h-4 w-4" /></button>}
            </div>
            <label className="relative mt-4 block">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input value={roleSearch} onChange={(event) => setRoleSearch(event.target.value)} placeholder="Search roles…" className="form-input pl-9" />
            </label>
          </div>
          <div className="scrollbar-hidden max-h-[calc(100vh-230px)] space-y-2 overflow-y-auto overscroll-contain p-3">
            {loading ? <p className="py-12 text-center text-sm text-slate-400">Loading roles…</p> : filteredRoles.map((role) => (
              <button key={role.id} onClick={() => selectRole(role)} className={`group w-full rounded-xl border p-3 text-left transition ${selectedId === role.id ? 'border-teal-300 bg-teal-50 shadow-sm' : 'border-transparent hover:border-slate-200 hover:bg-white'}`}>
                <span className="flex items-start gap-3">
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-extrabold ${selectedId === role.id ? 'bg-teal-600 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200'}`}>{roleInitials(role.displayName)}</span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-900">{role.displayName}{role.name === 'Super Admin' && <Lock className="h-3.5 w-3.5 text-amber-500" />}</span>
                    <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500"><span>{role.permissions.length} permissions</span><span>{role.userCount} users</span></span>
                    <span className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${role.isSystem ? 'bg-amber-50 text-amber-700' : 'bg-violet-50 text-violet-700'}`}>{role.isSystem ? 'SYSTEM' : 'CUSTOM'}</span>
                  </span>
                  <ChevronRight className={`mt-3 h-4 w-4 ${selectedId === role.id ? 'text-teal-600' : 'text-slate-300'}`} />
                </span>
              </button>
            ))}
            {!loading && filteredRoles.length === 0 && <p className="py-10 text-center text-sm text-slate-400">No matching roles found.</p>}
          </div>
        </aside>

        <section className="min-h-[680px] min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {selectedRole ? <>
            <div className="border-b border-slate-200 p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex items-start gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600"><ShieldCheck className="h-6 w-6" /></span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2"><h2 className="text-xl font-bold text-slate-900">{selectedRole.displayName}</h2><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${selectedRole.isSystem ? 'bg-amber-50 text-amber-700' : 'bg-violet-50 text-violet-700'}`}>{selectedRole.isSystem ? 'BUILT-IN' : 'CUSTOM ROLE'}</span></div>
                    <p className="mt-1 max-w-2xl text-sm text-slate-500">{selectedRole.description || 'No description has been added for this role.'}</p>
                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5"><UserRound className="h-3.5 w-3.5" />{selectedRole.userCount} assigned users</span>
                      <span className="flex items-center gap-1.5"><KeyRound className="h-3.5 w-3.5" />{assigned.size} of {permissions.length} permissions</span>
                      <span>Updated {formatDate(selectedRole.updatedAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button onClick={() => setDialog('details')} className="btn-secondary" title="Current role details"><Eye className="h-4 w-4" />Details</button>
                  {canManage && selectedRole.name !== 'Super Admin' && <button onClick={openEdit} className="btn-secondary"><Edit3 className="h-4 w-4" />Edit</button>}
                  {canManage && !selectedRole.isSystem && <button onClick={() => setDialog('delete')} className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-rose-200 bg-white px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50"><Trash2 className="h-4 w-4" />Delete</button>}
                </div>
              </div>
              {selectedRole.name === 'Super Admin' && <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800"><Lock className="mt-0.5 h-4 w-4 shrink-0" /><span><strong>Protected role:</strong> Super Administrator always has full system access. Its permissions, details and deletion are locked for security.</span></div>}
            </div>

            <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 p-4 backdrop-blur">
              <div className="flex flex-col gap-3 2xl:flex-row 2xl:items-center 2xl:justify-between">
                <div className="grid flex-1 gap-2 md:grid-cols-[minmax(240px,1fr)_180px_150px]">
                  <label className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" /><input value={permissionSearch} onChange={(event) => setPermissionSearch(event.target.value)} placeholder="Search name, code or module…" className="form-input pl-9" /></label>
                  <label className="relative"><Filter className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" /><select value={moduleFilter} onChange={(event) => setModuleFilter(event.target.value)} className="form-input appearance-none pl-9 pr-8"><option>All sections</option>{modules.map((module) => <option key={module}>{module}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3 top-3 h-3.5 w-3.5 text-slate-400" /></label>
                  <select value={accessFilter} onChange={(event) => setAccessFilter(event.target.value as typeof accessFilter)} className="form-input"><option value="all">All access</option><option value="assigned">Assigned only</option><option value="unassigned">Unassigned only</option></select>
                </div>
                <div className="flex flex-wrap gap-2">
                  {!readOnly && <><button onClick={() => setMany(visiblePermissions, true)} className="btn-secondary"><Check className="h-4 w-4" />Select visible</button><button onClick={() => setMany(visiblePermissions, false)} className="btn-secondary">Clear visible</button></>}
                  <button onClick={() => setAssigned(new Set(savedAssigned))} disabled={readOnly || !dirty} className="btn-secondary"><RotateCcw className="h-4 w-4" />Reset</button>
                  {dirty && <button onClick={() => setReviewOpen(true)} className="btn-secondary"><Eye className="h-4 w-4" />Review</button>}
                  <button onClick={savePermissions} disabled={readOnly || saving || !dirty} className="btn-primary"><Save className="h-4 w-4" />{saving ? 'Saving…' : dirty ? 'Save changes' : 'Saved'}</button>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs"><span className="text-slate-500">Showing {visiblePermissions.length} permissions · {assigned.size} assigned</span>{dirty && <span className="font-semibold text-amber-600">Unsaved changes</span>}</div>
            </div>

            <div className="space-y-4 p-5">
              {!readOnly && <div className="rounded-xl border border-teal-200 bg-teal-50/40 p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div><h3 className="flex items-center gap-2 text-sm font-bold text-slate-900"><Sparkles className="h-4 w-4 text-teal-600" />Permission overview</h3><p className="mt-1 text-xs text-slate-500">Review the current selection and open or close permission sections.</p></div>
                  <div className="flex gap-2"><button onClick={() => setExpandedModules(new Set(PERMISSION_SECTION_ORDER))} className="btn-secondary">Expand all</button><button onClick={() => setExpandedModules(new Set())} className="btn-secondary">Collapse all</button></div>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="rounded-full bg-white px-2.5 py-1 font-semibold text-slate-600 ring-1 ring-slate-200">{assigned.size} selected</span>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700">+{addedPermissions.length} added</span>
                  <span className="rounded-full bg-rose-50 px-2.5 py-1 font-semibold text-rose-700">−{removedPermissions.length} removed</span>
                  {sensitiveAssigned > 0 && <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 font-semibold text-amber-700"><ShieldAlert className="h-3 w-3" />{sensitiveAssigned} sensitive permissions</span>}
                </div>
              </div>}
              {PERMISSION_SECTION_ORDER.filter((section) => grouped[section]?.length).map((module) => {
                const items = grouped[module];
                const moduleAssigned = items.filter((permission) => assigned.has(permission.code)).length;
                const allSelected = moduleAssigned === items.length;
                const expanded = expandedModules.has(module);
                return <div key={module} className="overflow-hidden rounded-xl border border-slate-200">
                  <div className="flex flex-col gap-3 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <button onClick={() => setExpandedModules((current) => { const next = new Set(current); next.has(module) ? next.delete(module) : next.add(module); return next; })} className="flex items-center gap-2 text-left"><ChevronDown className={`h-4 w-4 text-slate-400 transition ${expanded ? '' : '-rotate-90'}`} /><span className="text-sm font-bold text-slate-800">{module}</span><span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-slate-500 ring-1 ring-slate-200">{moduleAssigned}/{items.length}</span></button>
                    {!readOnly && <button onClick={() => setMany(items, !allSelected)} className="text-xs font-bold text-teal-600 hover:text-teal-700">{allSelected ? 'Clear module' : 'Select entire module'}</button>}
                  </div>
                  {expanded && <div className="grid gap-px bg-slate-100 md:grid-cols-2">
                    {items.map((permission) => {
                      const checked = selectedRole.name === 'Super Admin' || assigned.has(permission.code);
                      return <button key={permission.code} onClick={() => toggle(permission.code)} disabled={readOnly} className={`flex min-h-[92px] items-start gap-3 bg-white p-4 text-left transition ${!readOnly ? 'hover:bg-teal-50/50' : 'cursor-default'}`}>
                        <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${checked ? 'border-teal-600 bg-teal-600 text-white' : 'border-slate-300 text-transparent'}`}><Check className="h-3.5 w-3.5 stroke-[3]" /></span>
                        <span className="min-w-0"><span className="flex flex-wrap items-center gap-2"><span className="block text-sm font-semibold text-slate-800">{permission.name}</span>{SENSITIVE_PERMISSIONS.has(permission.code) && <span className="rounded-full bg-amber-50 px-1.5 py-0.5 text-[9px] font-bold text-amber-700">SENSITIVE</span>}</span><span className="mt-0.5 block font-mono text-[10px] text-slate-400">{permission.code}</span><span className="mt-1 block text-xs leading-5 text-slate-500">{permissionHelpText(permission)}</span></span>
                      </button>;
                    })}
                  </div>}
                </div>;
              })}
              {!loading && Object.keys(grouped).length === 0 && <div className="rounded-xl border border-dashed border-slate-300 py-16 text-center"><Search className="mx-auto h-8 w-8 text-slate-300" /><p className="mt-3 text-sm font-semibold text-slate-600">No permissions match your filters</p><button onClick={() => { setPermissionSearch(''); setModuleFilter('All sections'); setAccessFilter('all'); }} className="mt-2 text-xs font-bold text-teal-600">Clear filters</button></div>}
            </div>
          </> : <div className="flex min-h-[500px] items-center justify-center text-sm text-slate-400">Select a role to view its details.</div>}
        </section>
      </div>

      {(dialog === 'create' || dialog === 'edit') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm" onMouseDown={(event) => event.target === event.currentTarget && setDialog(null)}>
          <form onSubmit={submitRole} className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 p-5"><div><h3 className="text-lg font-bold text-slate-900">{dialog === 'create' ? 'Create a new role' : 'Edit role details'}</h3><p className="mt-1 text-xs text-slate-500">{dialog === 'create' ? 'Add a reusable access level for your team.' : 'Update the visible name and description.'}</p></div><button type="button" onClick={() => setDialog(null)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button></div>
            <div className="space-y-4 p-5">
              <label><span className="field-label">Role name <span className="text-rose-500">*</span></span><input autoFocus value={form.displayName} onChange={(event) => setForm((current) => ({ ...current, displayName: event.target.value }))} maxLength={60} placeholder="Example: Library Manager" className="form-input" /></label>
              <label><span className="field-label">Description</span><textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} maxLength={240} rows={4} placeholder="Describe what this role is responsible for…" className="form-input resize-none" /><span className="mt-1 block text-right text-[10px] text-slate-400">{form.description.length}/240</span></label>
              {dialog === 'create' && selectedRole && selectedRole.name !== 'Super Admin' && <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4"><input type="checkbox" checked={form.copyPermissions} onChange={(event) => setForm((current) => ({ ...current, copyPermissions: event.target.checked }))} className="mt-1 h-4 w-4 accent-teal-600" /><span><span className="flex items-center gap-1.5 text-sm font-semibold text-slate-800"><Copy className="h-4 w-4 text-teal-600" />Copy permissions from {selectedRole.displayName}</span><span className="mt-1 block text-xs text-slate-500">Start with its {assigned.size} selected permissions. You can change them after creation.</span></span></label>}
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 p-4"><button type="button" onClick={() => setDialog(null)} className="btn-secondary">Cancel</button><button disabled={submitting || form.displayName.trim().length < 2} className="btn-primary">{submitting ? 'Saving…' : dialog === 'create' ? 'Create role' : 'Update details'}</button></div>
          </form>
        </div>
      )}

      {dialog === 'details' && selectedRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm" onMouseDown={(event) => event.target === event.currentTarget && setDialog(null)}>
          <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="dashboard-hero flex items-start justify-between p-6">
              <div className="flex items-center gap-3"><span className="dashboard-hero-panel flex h-12 w-12 items-center justify-center rounded-xl border text-sm font-extrabold">{roleInitials(selectedRole.displayName)}</span><div><p className="dashboard-hero-muted text-[10px] font-bold uppercase tracking-[0.16em]">Role details</p><h3 className="text-xl font-bold text-white">{selectedRole.displayName}</h3></div></div>
              <button onClick={() => setDialog(null)} className="dashboard-hero-panel rounded-lg border p-2"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6">
              <p className="text-sm leading-6 text-slate-600">{selectedRole.description || 'No description has been added for this role.'}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  ['Internal role key', selectedRole.name],
                  ['Role type', selectedRole.isSystem ? 'Built-in system role' : 'Custom role'],
                  ['Assigned users', String(selectedRole.userCount)],
                  ['Assigned permissions', `${assigned.size} of ${permissions.length}`],
                  ['Created', formatDate(selectedRole.createdAt)],
                  ['Last updated', formatDate(selectedRole.updatedAt)],
                ].map(([label, value]) => <div key={label} className="rounded-xl border border-slate-200 bg-slate-50 p-3"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-1 break-words text-sm font-semibold text-slate-800">{value}</p></div>)}
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 p-4"><button onClick={() => setDialog(null)} className="btn-secondary">Close</button>{canManage && selectedRole.name !== 'Super Admin' && <button onClick={() => { setDialog(null); openEdit(); }} className="btn-primary"><Edit3 className="h-4 w-4" />Edit role</button>}</div>
          </div>
        </div>
      )}

      {reviewOpen && selectedRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm" onMouseDown={(event) => event.target === event.currentTarget && setReviewOpen(false)}>
          <div className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 p-5"><div><p className="text-[10px] font-bold uppercase tracking-wider text-teal-600">Permission change review</p><h3 className="mt-1 text-lg font-bold text-slate-900">Review {selectedRole.displayName} access</h3><p className="mt-1 text-xs text-slate-500">Confirm exactly what will change before updating this role.</p></div><button onClick={() => setReviewOpen(false)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button></div>
            <div className="grid gap-4 overflow-y-auto p-5 md:grid-cols-2">
              <section className="rounded-xl border border-emerald-200 bg-emerald-50/50">
                <header className="border-b border-emerald-200 px-4 py-3 text-sm font-bold text-emerald-700">Access being added ({addedPermissions.length})</header>
                <div className="max-h-72 space-y-1 overflow-y-auto p-2">{addedPermissions.length ? addedPermissions.map((permission) => <div key={permission.code} className="rounded-lg bg-white p-3"><p className="text-xs font-semibold text-slate-800">{permission.name}</p><p className="mt-0.5 font-mono text-[9px] text-slate-400">{permission.code}</p></div>) : <p className="p-5 text-center text-xs text-slate-400">No permissions added.</p>}</div>
              </section>
              <section className="rounded-xl border border-rose-200 bg-rose-50/50">
                <header className="border-b border-rose-200 px-4 py-3 text-sm font-bold text-rose-700">Access being removed ({removedPermissions.length})</header>
                <div className="max-h-72 space-y-1 overflow-y-auto p-2">{removedPermissions.length ? removedPermissions.map((permission) => <div key={permission.code} className="rounded-lg bg-white p-3"><p className="text-xs font-semibold text-slate-800">{permission.name}</p><p className="mt-0.5 font-mono text-[9px] text-slate-400">{permission.code}</p></div>) : <p className="p-5 text-center text-xs text-slate-400">No permissions removed.</p>}</div>
              </section>
            </div>
            {sensitiveAssigned > 0 && <div className="mx-5 mb-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800"><ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" /><span>This role will have {sensitiveAssigned} sensitive permission(s). Assign this role only to trusted users.</span></div>}
            <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 p-4"><p className="text-xs text-slate-500">Final access: <strong className="text-slate-800">{assigned.size} permissions</strong></p><div className="flex gap-2"><button onClick={() => setReviewOpen(false)} className="btn-secondary">Continue editing</button><button onClick={savePermissions} disabled={saving || !dirty} className="btn-primary"><Save className="h-4 w-4" />{saving ? 'Saving…' : 'Confirm & save'}</button></div></div>
          </div>
        </div>
      )}

      {dialog === 'delete' && selectedRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600"><Trash2 className="h-5 w-5" /></span>
            <h3 className="mt-4 text-lg font-bold text-slate-900">Delete {selectedRole.displayName}?</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">This removes the custom role and all of its permission mappings. This action cannot be undone.</p>
            {selectedRole.userCount > 0 && <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">This role is assigned to {selectedRole.userCount} user(s). Remove those assignments before deletion.</div>}
            <div className="mt-6 flex justify-end gap-2"><button onClick={() => setDialog(null)} className="btn-secondary">Keep role</button><button onClick={deleteRole} disabled={submitting || selectedRole.userCount > 0} className="inline-flex min-h-9 items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-slate-300">{submitting ? 'Deleting…' : 'Delete permanently'}</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
