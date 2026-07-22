'use client';

import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, Building2, Globe, DollarSign, Shield, FileText } from 'lucide-react';
import { PageHeader } from '@/src/components/ui/PageHeader';
import { FormField } from '@/src/components/forms/FormField';
import { SelectField } from '@/src/components/forms/SelectField';
import { FileUploader } from '@/src/components/forms/FileUploader';
import { getSchoolProfile, updateSchoolProfile } from '@/src/services/school.service';

export default function SchoolSettingsPage() {
  const [formData, setFormData] = useState({
    id: '',
    name: 'Dhaka Ideal Model High School & College',
    code: 'SCH-001',
    eiin: '108234',
    principalName: 'Prof. Dr. Mohammad Rahman',
    address: 'Plot 12, Road 4, Sector 7, Uttara, Dhaka-1230, Bangladesh',
    phone: '+880 2 8951234',
    email: 'info@dhakaideal.edu.bd',
    website: 'https://dhakaideal.edu.bd',
    currency: 'BDT',
    timezone: 'Asia/Dhaka',
    dateFormat: 'DD/MM/YYYY',
    defaultLanguage: 'bn',
    academicYear: '2026',
    logoUrl: '',
    faviconUrl: '',
  });

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      const profile = await getSchoolProfile();
      if (profile) {
        setFormData({
          id: profile.id,
          name: profile.name,
          code: profile.code,
          eiin: profile.eiin || '',
          principalName: profile.principalName || '',
          address: profile.address || '',
          phone: profile.phone || '',
          email: profile.email || '',
          website: profile.website || '',
          currency: profile.settings?.currency || 'BDT',
          timezone: profile.settings?.timezone || 'Asia/Dhaka',
          dateFormat: profile.settings?.dateFormat || 'DD/MM/YYYY',
          defaultLanguage: profile.settings?.defaultLanguage || 'bn',
          academicYear: profile.settings?.academicYear || '2026',
          logoUrl: profile.branding?.logoUrl || '',
          faviconUrl: profile.branding?.faviconUrl || '',
        });
      }
    }
    loadData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      await updateSchoolProfile(formData.id, formData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch {
      alert('Failed to update school settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="School Settings"
        subtitle="Manage school details, registration numbers, branding, and localization settings"
        breadcrumbs={[{ label: 'Settings' }]}
      />

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>School profile and MySQL database settings updated successfully! Audit log entry recorded.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic School Information Card */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building2 className="w-4 h-4 text-teal-600" />
            <h2 className="text-sm font-bold text-slate-900">General Identification & Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              label="School Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <FormField
              label="School Code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
            />
            <FormField
              label="EIIN / Registration No."
              name="eiin"
              value={formData.eiin}
              onChange={handleChange}
              helperText="Educational Institute Identification Number (Bangladesh)"
            />
            <FormField
              label="Principal Name"
              name="principalName"
              value={formData.principalName}
              onChange={handleChange}
            />
            <FormField
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
            <FormField
              label="Official Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <FormField
              label="Website URL"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="md:col-span-2"
            />
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Address</label>
              <textarea
                name="address"
                rows={2}
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Localization & Academic Config Card */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Globe className="w-4 h-4 text-teal-600" />
            <h2 className="text-sm font-bold text-slate-900">Localization, Currency & Regional Settings</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <SelectField
              label="Currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              options={[
                { label: 'BDT - Bangladeshi Taka (৳)', value: 'BDT' },
                { label: 'USD - US Dollar ($)', value: 'USD' },
              ]}
            />
            <SelectField
              label="Timezone"
              name="timezone"
              value={formData.timezone}
              onChange={handleChange}
              options={[
                { label: 'Asia/Dhaka (GMT+6)', value: 'Asia/Dhaka' },
                { label: 'UTC', value: 'UTC' },
              ]}
            />
            <SelectField
              label="Date Format"
              name="dateFormat"
              value={formData.dateFormat}
              onChange={handleChange}
              options={[
                { label: 'DD/MM/YYYY (e.g. 21/07/2026)', value: 'DD/MM/YYYY' },
                { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' },
              ]}
            />
            <SelectField
              label="Default Language"
              name="defaultLanguage"
              value={formData.defaultLanguage}
              onChange={handleChange}
              options={[
                { label: 'বাংলা (Bangla)', value: 'bn' },
                { label: 'English', value: 'en' },
              ]}
            />
            <FormField
              label="Current Academic Year"
              name="academicYear"
              value={formData.academicYear}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Branding Assets */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <FileText className="w-4 h-4 text-teal-600" />
            <h2 className="text-sm font-bold text-slate-900">School Branding & Logos</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FileUploader label="Official School Logo" helperText="Displayed on headers, transcripts, and receipts" />
            <FileUploader label="Favicon Icon" helperText="Displayed in browser title tabs" />
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving to Database...' : 'Save School Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
