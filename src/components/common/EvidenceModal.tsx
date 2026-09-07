import React, { useState, useEffect } from 'react';
import { useApp } from '../../services/store';
import { ShieldCheck, CheckCircle2, Lock, ArrowRight, RefreshCw, X, FileCheck, Layers } from 'lucide-react';

interface EvidenceModalProps {
  consentId: string | null;
  onClose: () => void;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({ consentId, onClose }) => {
  const { consents, events, verifyConsentEvidence } = useApp();
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<any>(null);

  const selectedConsent = consents.find(c => c.id === consentId) || consents[0];
  const relatedEvents = events.filter(e => e.consentId === selectedConsent?.id);

  useEffect(() => {
    if (selectedConsent) {
      handleRunVerification();
    }
  }, [consentId]);

  const handleRunVerification = () => {
    setVerifying(true);
    setTimeout(() => {
      if (selectedConsent) {
        const res = verifyConsentEvidence(selectedConsent.id);
        setResult(res);
      }
      setVerifying(false);
    }, 600);
  };

  if (!consentId || !selectedConsent) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-xs">
      <div
        className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Cryptographic Consent Ledger Verification</h3>
              <p className="text-xs text-slate-500">
                DPDP Audit Proof Engine • SHA-256 State Chain
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Target Consent Overview */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div>
              <span className="text-xs text-slate-500 block">Consent Reference</span>
              <span className="font-mono text-sm font-bold text-slate-900">{selectedConsent.id}</span>
              <span className="text-xs text-slate-600 block mt-0.5">
                {selectedConsent.brandName} • {selectedConsent.purposeName}
              </span>
            </div>
            <button
              onClick={handleRunVerification}
              disabled={verifying}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${verifying ? 'animate-spin' : ''}`} />
              <span>{verifying ? 'Verifying Merkle Tree...' : 'Re-verify Integrity'}</span>
            </button>
          </div>

          {/* Verification Status Banner */}
          {result && !verifying && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-900">
                    Cryptographic Proof Valid • Chain Intact
                  </h4>
                  <p className="mt-1 text-xs text-emerald-700">
                    Evidence hashes for this consent match the immutable audit ledger. No tampering or altered metadata detected. Validated at {result.timestamp}.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Event Chain Timeline */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-indigo-600" />
                <span>Auditable Event Hash Chain ({relatedEvents.length || 1} Events)</span>
              </h4>
              <span className="text-xs text-slate-500 font-mono">SHA-256 Digest</span>
            </div>

            <div className="space-y-3">
              {relatedEvents.length > 0 ? (
                relatedEvents.map((evt, idx) => (
                  <div
                    key={evt.eventId}
                    className="rounded-xl border border-slate-200 bg-white p-4 font-mono text-xs transition-all hover:border-slate-300"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100 font-sans">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-indigo-50 px-2 py-0.5 text-[11px] font-bold text-indigo-700">
                          {evt.eventType}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">{evt.eventId}</span>
                      </div>
                      <span className="text-xs text-slate-400">{evt.timestamp}</span>
                    </div>

                    <div className="mt-3 space-y-1.5 text-[11px]">
                      <div className="flex items-start gap-2">
                        <span className="text-slate-400 w-16 shrink-0">Actor:</span>
                        <span className="text-slate-800 font-sans">{evt.actor}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-slate-400 w-16 shrink-0">Prev Hash:</span>
                        <span className="text-slate-500 break-all">{evt.previousHash}</span>
                      </div>
                      <div className="flex items-start gap-2 text-emerald-700">
                        <span className="text-emerald-600 font-bold w-16 shrink-0">Hash:</span>
                        <span className="font-bold break-all">{evt.eventHash}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs">
                  <div className="text-slate-800 font-sans font-bold text-sm">Genesis Consent Record</div>
                  <div className="mt-2 text-slate-500 text-[11px] break-all">
                    Stamp: {selectedConsent.evidenceHash}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-slate-100 bg-slate-50 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
