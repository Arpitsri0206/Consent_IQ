import React, { useState } from 'react';
import { useApp } from '../../services/store';
import { ConsentStatus } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Search, Filter, ShieldCheck, Download, ExternalLink, Sparkles } from 'lucide-react';

interface BrandConsentsViewProps {
  onOpenReceipt: (consentId: string) => void;
  onVerifyEvidence: (consentId: string) => void;
  onNavigate: (route: string) => void;
}

export const BrandConsentsView: React.FC<BrandConsentsViewProps> = ({
  onOpenReceipt,
  onVerifyEvidence,
  onNavigate
}) => {
  const { consents } = useApp();
  const [tab, setTab] = useState<'ALL' | ConsentStatus>('ALL');
  const [search, setSearch] = useState('');

  // Filter for brand
  const brandConsents = consents.filter(c => c.tenantId === 'org_apex');

  const filtered = brandConsents.filter(c => {
    const matchesTab = tab === 'ALL' || c.status === tab;
    const matchesSearch =
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.userRef.toLowerCase().includes(search.toLowerCase()) ||
      c.purposeName.toLowerCase().includes(search.toLowerCase()) ||
      c.noticeVersion.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Enterprise Consent Registry
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Pseudonymized registry of active and withdrawn Data Principal consents under DPDP Section 6.
          </p>
        </div>

        <button
          onClick={() => onNavigate('/brand/consents/create')}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-indigo-700"
        >
          <Sparkles className="h-4 w-4" />
          <span>New Consent Journey</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-slate-200 gap-2 pb-px text-xs font-semibold">
        {(['ALL', 'GRANTED', 'REQUESTED', 'WITHDRAWN', 'EXPIRED'] as const).map(t => {
          const count = t === 'ALL' ? brandConsents.length : brandConsents.filter(c => c.status === t).length;
          const isActive = tab === t;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex items-center gap-2 border-b-2 px-4 py-2.5 transition-all whitespace-nowrap ${
                isActive
                  ? 'border-indigo-600 text-indigo-700 font-bold'
                  : 'border-transparent text-slate-500 hover:border-slate-300'
              }`}
            >
              <span>{t === 'ALL' ? 'All Consents' : t}</span>
              <span
                className={`rounded-full px-2 py-0.2 text-[10px] font-bold ${
                  isActive ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Filter */}
      <div className="flex items-center rounded-2xl border border-slate-200 bg-white p-3 shadow-2xs">
        <Search className="h-4 w-4 text-slate-400 ml-2" />
        <input
          type="text"
          placeholder="Search by Consent ID, Data Principal Pseudonym (USR-...), Purpose or Notice..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-transparent px-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Consent ID</th>
                <th className="py-3.5 px-4">Data Principal Ref</th>
                <th className="py-3.5 px-4">Processing Purpose</th>
                <th className="py-3.5 px-4">Notice Version</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Granted On</th>
                <th className="py-3.5 px-4">Channel</th>
                <th className="py-3.5 px-4 text-right">Ledger Proof</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/70 transition-colors font-sans">
                  <td className="py-4 px-4 sm:px-6 font-mono font-bold text-slate-900 text-xs">
                    {c.id}
                  </td>
                  <td className="py-4 px-4 font-mono text-slate-600">
                    <span className="rounded bg-slate-100 px-2 py-0.5">{c.userRef}</span>
                  </td>
                  <td className="py-4 px-4 text-slate-900 font-medium max-w-xs truncate">
                    {c.purposeName}
                  </td>
                  <td className="py-4 px-4 font-mono text-slate-700">
                    {c.noticeVersion}
                  </td>
                  <td className="py-4 px-4">
                    <StatusBadge status={c.status} size="sm" />
                  </td>
                  <td className="py-4 px-4 text-slate-600 whitespace-nowrap">
                    {c.grantedAt ? c.grantedAt.split(' ')[0] : '—'}
                  </td>
                  <td className="py-4 px-4 text-slate-600 font-mono">
                    {c.collectionChannel}
                  </td>
                  <td className="py-4 px-4 text-right whitespace-nowrap font-sans">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onOpenReceipt(c.id)}
                        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                      >
                        Receipt
                      </button>
                      <button
                        onClick={() => onVerifyEvidence(c.id)}
                        className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                      >
                        Verify Hash
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="p-8 text-center text-slate-400">
              No consent records match your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
