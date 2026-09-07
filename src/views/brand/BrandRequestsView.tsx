import React, { useState } from 'react';
import { useApp } from '../../services/store';
import { DataPrincipalRequest } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { FileQuestion, CheckCircle2, Clock, X, MessageSquare, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export const BrandRequestsView: React.FC = () => {
  const { requests, resolveDataPrincipalRequest } = useApp();

  const [resolvingReq, setResolvingReq] = useState<DataPrincipalRequest | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const brandRequests = requests.filter(r => r.tenantId === 'org_apex');

  const handleResolve = () => {
    if (!resolvingReq || !resolutionNotes.trim()) return;
    setIsSubmitting(true);
    resolveDataPrincipalRequest(resolvingReq.id, resolutionNotes);
    setIsSubmitting(false);
    confetti({ particleCount: 30, spread: 50 });
    setResolvingReq(null);
    setResolutionNotes('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            DSR Grievance Redressal Queue
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            DPDP Section 11-13 statutory requests (Access, Correction, Erasure, Grievance) assigned to Apex Financial DPO.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {brandRequests.map(req => (
          <div
            key={req.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3 hover:border-slate-300 transition-all"
          >
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 font-bold">
                  <FileQuestion className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">{req.requestType}</h3>
                    <span className="font-mono text-xs text-slate-400">{req.id}</span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    Data Principal Ref: <span className="font-mono font-bold text-slate-700">{req.userRef}</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <StatusBadge status={req.status} size="sm" />
                {req.status !== 'RESOLVED' && (
                  <button
                    onClick={() => {
                      setResolvingReq(req);
                      setResolutionNotes(
                        req.requestType === 'Access My Data'
                          ? 'Compiled full audit export of customer data from core ledger and encrypted bundle.'
                          : req.requestType === 'Delete My Data'
                          ? 'Purged marketing telemetry and flagged database record for retention archival.'
                          : 'Processed request per statutory standard.'
                      );
                    }}
                    className="rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-indigo-700"
                  >
                    Resolve Request
                  </button>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl">
              <span className="font-bold text-slate-900">User Request Details: </span>
              {req.description}
            </p>

            {req.resolutionNotes && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900">
                <span className="font-bold flex items-center gap-1 text-emerald-800">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Resolution Recorded:
                </span>
                <p className="mt-0.5">{req.resolutionNotes}</p>
                <span className="text-[10px] text-emerald-600 block mt-1">Resolved On: {req.resolvedAt}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2 text-[11px] text-slate-400 font-mono">
              <span>Received: {req.receivedAt}</span>
              <span className="text-amber-600 font-semibold">Statutory SLA: {req.dueAt}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Resolve Modal */}
      {resolvingReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">Resolve DSR / Grievance</h3>
              </div>
              <button onClick={() => setResolvingReq(null)} className="rounded-lg p-1 text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="rounded-xl bg-slate-50 p-3">
                <span className="text-slate-400 block">Principal Request</span>
                <p className="font-medium text-slate-800 mt-1">{resolvingReq.description}</p>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Official DPO Resolution Response & Audit Notes
                </label>
                <textarea
                  rows={4}
                  required
                  value={resolutionNotes}
                  onChange={e => setResolutionNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-hidden leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setResolvingReq(null)}
                  className="rounded-xl px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleResolve}
                  className="rounded-xl bg-emerald-600 px-5 py-2 font-bold text-white shadow-2xs hover:bg-emerald-700"
                >
                  Confirm Resolution
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
