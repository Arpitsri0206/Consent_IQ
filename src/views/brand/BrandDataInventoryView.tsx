import React from 'react';
import { useApp } from '../../services/store';
import { Database, ShieldCheck, Lock, ExternalLink } from 'lucide-react';

export const BrandDataInventoryView: React.FC = () => {
  const { inventory } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Data Inventory & ROPA
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Record of Processing Activities (ROPA) mapping personal data categories, applications, encryption, and legal bases.
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Data Category</th>
                <th className="py-3.5 px-4">Application & Scope</th>
                <th className="py-3.5 px-4">Primary Purpose</th>
                <th className="py-3.5 px-4">Retention</th>
                <th className="py-3.5 px-4">Processor / 3rd Party</th>
                <th className="py-3.5 px-4">Legal Basis</th>
                <th className="py-3.5 px-4">Security Safeguard</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inventory.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-4 sm:px-6">
                    <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700">
                      {item.dataCategory}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-semibold text-slate-900">
                    {item.application}
                  </td>
                  <td className="py-4 px-4 text-slate-600 max-w-xs truncate">
                    {item.purpose}
                  </td>
                  <td className="py-4 px-4 font-mono text-slate-600">
                    {item.retention}
                  </td>
                  <td className="py-4 px-4 text-slate-700 font-medium">
                    {item.thirdParty}
                  </td>
                  <td className="py-4 px-4">
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                      {item.legalBasis}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-700 font-semibold">
                      <Lock className="h-3 w-3" />
                      <span>{item.encryptionStatus}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
