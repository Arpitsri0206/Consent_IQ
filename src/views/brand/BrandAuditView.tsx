import React, { useState } from 'react';
import { useApp } from '../../services/store';
import { FileCheck, Search, Filter, ShieldCheck, Download, Lock } from 'lucide-react';

interface BrandAuditViewProps {
  onVerifyEvidence: (consentId: string) => void;
}

export const BrandAuditView: React.FC<BrandAuditViewProps> = ({ onVerifyEvidence }) => {
  const { auditLogs } = useApp();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.actor.toLowerCase().includes(search.toLowerCase()) ||
      log.entityId.toLowerCase().includes(search.toLowerCase()) ||
      log.id.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || log.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Compliance Audit Trail
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Immutable, write-once tamper-evident logs for DPDP statutory compliance and Data Protection Board audits.
          </p>
        </div>

        <button
          onClick={() => {
            const blob = new Blob([JSON.stringify(auditLogs, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `consentiq_audit_export_${Date.now()}.json`;
            a.click();
          }}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50"
        >
          <Download className="h-4 w-4" />
          <span>Export Audit Bundle (.JSON)</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by action, actor, entity ID, or hash..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-hidden"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-800 focus:bg-white focus:outline-hidden"
        >
          <option value="ALL">All Categories</option>
          <option value="CONSENT_LIFECYCLE">Consent Lifecycle</option>
          <option value="NOTICE_MANAGEMENT">Notice Management</option>
          <option value="PURPOSE_GOVERNANCE">Purpose Governance</option>
          <option value="DSR_PROCESSING">DSR Processing</option>
          <option value="SECURITY">Security</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Timestamp</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Actor</th>
                <th className="py-3.5 px-4">Entity ID</th>
                <th className="py-3.5 px-4">IP Address</th>
                <th className="py-3.5 px-4 text-right">Cryptographic Digest</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors font-sans">
                  <td className="py-4 px-4 sm:px-6 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-900 text-xs">
                    {log.action}
                  </td>
                  <td className="py-4 px-4">
                    <span className="rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                      {log.category}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-700 font-medium">
                    {log.actor}
                  </td>
                  <td className="py-4 px-4 font-mono text-slate-600">
                    {log.entityId}
                  </td>
                  <td className="py-4 px-4 font-mono text-slate-500">
                    {log.ipAddress}
                  </td>
                  <td className="py-4 px-4 text-right font-mono text-slate-400">
                    <button
                      onClick={() => onVerifyEvidence(log.entityId)}
                      className="text-emerald-600 font-sans text-xs font-semibold hover:underline"
                    >
                      {log.cryptoHash.substring(0, 16)}...
                    </button>
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
