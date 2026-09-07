import React, { useState } from 'react';
import { useApp } from '../../services/store';
import { ShieldCheck, CheckCircle2, AlertTriangle, Key, Search, Database } from 'lucide-react';

interface BrandEvidenceViewProps {
  onVerifyEvidence: (consentId: string) => void;
}

export const BrandEvidenceView: React.FC<BrandEvidenceViewProps> = ({ onVerifyEvidence }) => {
  const { consents, events } = useApp();
  const [search, setSearch] = useState('');
  const [verificationResult, setVerificationResult] = useState<string | null>(null);

  const brandConsents = consents.filter(c => c.tenantId === 'org_apex');

  const filtered = brandConsents.filter(
    c =>
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.evidenceHash.toLowerCase().includes(search.toLowerCase()) ||
      c.userRef.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Cryptographic Consent Ledger
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            SHA-256 Merkle-anchored evidence ledger guaranteeing non-repudiation and statutory compliance under Section 6(7).
          </p>
        </div>
      </div>

      {/* Proof Health Banner */}
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Ledger State: 100% Intact & Verified</h3>
            <p className="text-xs text-slate-600">All 1,820,000+ active hashes chain sequentially to genesis root.</p>
          </div>
        </div>
        <span className="rounded-md bg-emerald-100 px-3 py-1 font-mono text-xs font-bold text-emerald-800">
          ALGORITHM: SHA-256
        </span>
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
                      className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 hover:bg-emerald-100"
                    >
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>Verify Hash Proof</span>
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
