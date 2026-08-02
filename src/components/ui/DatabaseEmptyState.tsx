import { Database } from 'lucide-react';

export function DatabaseEmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
      <Database className="mx-auto h-8 w-8 text-slate-400" />
      <h3 className="mt-3 text-sm font-bold text-slate-800">{title}</h3>
      <p className="mx-auto mt-1 max-w-xl text-xs text-slate-500">{description}</p>
    </div>
  );
}
