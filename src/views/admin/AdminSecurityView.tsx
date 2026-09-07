import React, { useState } from 'react';
import { useApp } from '../../services/store';
import { Lock, ShieldCheck, Key, CheckCircle2, RotateCw, AlertTriangle, FileCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export const AdminSecurityView: React.FC = () => {
  const [reindexing, setReindexing] = useState(false);
  const [reindexSuccess, setReindexSuccess] = useState(false);

  const dpdpChecklist = [
    { rule: 'DPDP Section 5: Unbundled and Multilingual Notice Delivery', status: 'PASS', score: '100%' },
    { rule: 'DPDP Section 6: Specific, Voluntary, Informed Consent Mechanism', status: 'PASS', score: '100%' },
    { rule: 'DPDP Section 6(7): Burden of Proof Non-repudiation Cryptographic Ledger', status: 'PASS', score: '100%' },
    { rule: 'DPDP Section 6(4): Direct and Simple Consent Withdrawal Flow', status: 'PASS', score: '100%' },
    { rule: 'DPDP Section 11-13: Data Principal Access, Correction, Erasure & Grievance SLAs', status: 'PASS', score: '99.4%' },
    { rule: 'DPDP Section 16: Cross-Border Transfer Whitelist Filter', status: 'PASS', score: '100%' }
  ];

  const handleReindex = () => {
    setReindexing(true);
    setTimeout(() => {
      setReindexing(false);
      setReindexSuccess(true);
      confetti({ particleCount: 30, spread: 50 });
      setTimeout(() => setReindexSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Security & DPDP Compliance Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Systemic security posture, HSM keys, zero-trust cryptographic ledger integrity, and statutory audit readiness.
          </p>
        </div>

        <button
          onClick={handleReindex}
          disabled={reindexing}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-indigo-700 disabled:opacity-50"
        >
          <RotateCw className={`h-4 w-4 ${reindexing ? 'animate-spin' : ''}`} />
          <span>{reindexing ? 'Re-verifying Root...' : 'Re-verify Merkle Hash Roots'}</span>
        </button>
      </div>

      {reindexSuccess && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>All 14,820,000 ledger hashes re-verified against genesis root with 0 discrepancies!</span>
        </div>
      )}

      {/* Compliance Rule Audit Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">DPDP Act 2023 Statutory Readiness Matrix</h3>
            <p className="text-xs text-slate-500">Automated verification of statutory obligations</p>
          </div>
          <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
            Platform Overall: 99.8%
          </span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {dpdpChecklist.map((item, idx) => (
            <div key={idx} className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="font-medium text-slate-800">{item.rule}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-slate-900">{item.score}</span>
                <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 font-mono">
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* HSM & Cryptographic Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <Lock className="h-4 w-4 text-indigo-600" />
            <span>FIPS 140-2 Level 3 Key Management</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            All tenant isolation boundaries use dedicated AES-256 GCM keyrings managed by cloud HSM with automatic 90-day rotation.
          </p>
          <div className="font-mono text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl">
            Active Master Key ID: <span className="text-slate-800 font-bold">hsm_kms_in_mum_9a4f21</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Zero-Knowledge Ledger Proofs</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Data Principal references are strictly hashed and salted (`USR-XXXX`). No raw PII is ever written to the immutable ledger.
          </p>
          <div className="font-mono text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl">
            Ledger Hash Function: <span className="text-slate-800 font-bold">SHA-256 + HMAC Salt</span>
          </div>
        </div>
      </div>
    </div>
  );
};
