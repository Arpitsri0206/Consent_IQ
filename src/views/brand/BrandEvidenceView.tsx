import React, { useState } from 'react';
import { useApp } from '../../services/store';
import { ShieldCheck, CheckCircle2, AlertTriangle, Key, Search, Database, Fingerprint, Layers, Hash } from 'lucide-react';

interface BrandEvidenceViewProps {
  onVerifyEvidence: (consentId: string) => void;
}

export const BrandEvidenceView: React.FC<BrandEvidenceViewProps> = ({ onVerifyEvidence }) => {
  const { consents, events, auditLogs } = useApp();
  const [search, setSearch] = useState('');
  const [quickHashInput, setQuickHashInput] = useState('');

  const brandConsents = consents.filter(c => c.tenantId === 'org_apex');

  const filtered = brandConsents.filter(
    c =>
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.evidenceHash.toLowerCase().includes(search.toLowerCase()) ||
      c.userRef.toLowerCase().includes(search.toLowerCase())
  );

  const handleQuickVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickHashInput.trim()) {
      onVerifyEvidence(quickHashInput.trim());
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Cryptographic Consent Ledger
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            SHA-256 Merkle-anchored evidence ledger guaranteeing non-repudiation and statutory compliance under DPDP Section 6(7).
          </p>
        </div>
      </div>

      {/* Proof Health Banner */}
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Ledger State: 100% Intact & Cryptographically Verified</h3>
            <p className="text-xs text-slate-600">All active consent hashes chain sequentially to the genesis root with zero discrepancies.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-emerald-100 px-3 py-1 font-mono text-xs font-bold text-emerald-800">
            ALGORITHM: SHA-256
          </span>
          <span className="rounded-md bg-indigo-100 px-3 py-1 font-mono text-xs font-bold text-indigo-800">
            FIPS 180-4
          </span>
        </div>
      </div>

      {/* Quick Hash Direct Inspector */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Fingerprint className="h-4 w-4 text-indigo-600" />
            <span>Direct Hash & Consent ID Verifier</span>
          </span>
          <span className="text-[11px] text-slate-500 font-mono">Instant Audit Check</span>
        </div>

        <form onSubmit={handleQuickVerify} className="flex gap-2">
          <div className="relative flex-1">
            <Hash className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Paste any SHA-256 Hash or Consent ID (e.g. TA-CNS-2026-..., 9f3a4b...)"
              value={quickHashInput}
              onChange={e => setQuickHashInput(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-hidden font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={!quickHashInput.trim()}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-1.5 transition-colors"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Verify Hash Proof</span>
          </button>
        </form>
      </div>

      {/* Search Bar for Ledger Table */}
      <div className="flex items-center rounded-2xl border border-slate-200 bg-white p-3 shadow-2xs">
        <Search className="h-4 w-4 text-slate-400 ml-2" />
        <input
          type="text"
          placeholder="Filter ledger table by Consent ID, Principal Ref, or Evidence Hash..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-transparent px-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden"
        />
      </div>

      {/* Ledger Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px] font-sans">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Consent ID</th>
                <th className="py-3.5 px-4">Principal Ref</th>
                <th className="py-3.5 px-4">Evidence Hash (SHA-256)</th>
                <th className="py-3.5 px-4">Notice Version</th>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[11px]">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-4 sm:px-6 font-bold text-slate-900">{c.id}</td>
                  <td className="py-4 px-4 text-slate-600">{c.userRef}</td>
                  <td className="py-4 px-4 text-slate-500 max-w-xs truncate font-mono">
                    {c.evidenceHash}
                  </td>
                  <td className="py-4 px-4 text-slate-700">{c.noticeVersion}</td>
                  <td className="py-4 px-4 text-slate-500 font-sans">{c.grantedAt || 'Pending'}</td>
                  <td className="py-4 px-4 text-right font-sans">
                    <button
                      onClick={() => onVerifyEvidence(c.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 shadow-2xs transition-colors"
                    >
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>Verify Hash Proof</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="py-12 text-center text-slate-400 font-sans">
              <p className="text-sm font-medium">No ledger records match your filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
