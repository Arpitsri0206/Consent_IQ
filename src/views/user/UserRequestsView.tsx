import React, { useState } from 'react';
import { useApp } from '../../services/store';
import { RequestType } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  FileQuestion,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  X,
  FileText,
  Paperclip
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const UserRequestsView: React.FC = () => {
  const { requests, organizations, submitDataPrincipalRequest, currentUser } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [requestType, setRequestType] = useState<RequestType>('Access My Data');
  const [selectedOrgId, setSelectedOrgId] = useState(organizations[0]?.id || '');
  const [description, setDescription] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const myRequests = requests.filter(r => r.userRef === currentUser.userRef);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    submitDataPrincipalRequest({
      requestType,
      organizationId: selectedOrgId,
      description,
      attachmentName: attachmentName || undefined
    });

    setSubmittedSuccess(true);
    confetti({ particleCount: 35, spread: 60 });
    setTimeout(() => {
      setSubmittedSuccess(false);
      setModalOpen(false);
      setDescription('');
      setAttachmentName('');
    }, 1500);
  };

  const requestOptions: { type: RequestType; title: string; desc: string }[] = [
    { type: 'Access My Data', title: 'Access My Data (Section 11)', desc: 'Obtain summary of processed data and identities of processors' },
    { type: 'Correct My Data', title: 'Correction & Updating (Section 12)', desc: 'Correct inaccurate personal data or update contact information' },
    { type: 'Delete My Data', title: 'Erasure of Personal Data (Section 12)', desc: 'Request deletion of data no longer necessary for specified purpose' },
    { type: 'Withdraw Consent', title: 'Direct Consent Revocation', desc: 'Notify fiduciary to erase processing traces' },
    { type: 'Raise Grievance', title: 'Grievance Redressal (Section 13)', desc: 'Lodge formal grievance with the Data Protection Officer' },
    { type: 'Request Information', title: 'General Inquiries & Ingestion Proof', desc: 'Request details regarding security safeguards and retention' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Data Principal Rights (DSR) & Grievances
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Exercise your statutory rights under the DPDP Act 2023 — Access, Correction, Erasure, and Grievances.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          <span>Raise New Data Request</span>
        </button>
      </div>

      {/* Requests List */}
      <div className="space-y-3">
        {myRequests.map(req => (
          <div
            key={req.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-slate-300"
          >
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 font-bold">
                  <FileQuestion className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{req.requestType}</span>
                    <span className="font-mono text-xs text-slate-400">{req.id}</span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">Fiduciary: {req.organizationName}</span>
                </div>
              </div>

              <StatusBadge status={req.status} size="sm" />
            </div>

            <p className="mt-3 text-xs text-slate-700 leading-relaxed">{req.description}</p>

            {req.resolutionNotes && (
              <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900">
                <span className="font-bold block flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Resolution Notes:
                </span>
                <p className="mt-0.5 text-emerald-800">{req.resolutionNotes}</p>
                <span className="text-[10px] text-emerald-600 block mt-1">Resolved at {req.resolvedAt}</span>
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-[11px] text-slate-500 font-medium">
              <span>Submitted: {req.receivedAt}</span>
              <span className="text-indigo-600 font-semibold">Statutory SLA Due Date: {req.dueAt}</span>
            </div>
          </div>
        ))}

        {myRequests.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-400">
            <p className="text-sm font-medium">You have not raised any Data Principal requests yet.</p>
          </div>
        )}
      </div>

      {/* New Request Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
            {submittedSuccess ? (
              <div className="text-center py-8 space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Request Submitted Successfully</h3>
                <p className="text-xs text-slate-500">
                  The Data Fiduciary has been notified and is mandated to resolve your request within 7 business days under DPDP regulations.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <FileQuestion className="h-5 w-5 text-indigo-600" />
                    <h3 className="font-bold text-slate-900 text-base">Raise Data Principal Request (DSR)</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Select Target Fiduciary (Brand)</label>
                  <select
                    value={selectedOrgId}
                    onChange={e => setSelectedOrgId(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-hidden"
                  >
                    {organizations.map(org => (
                      <option key={org.id} value={org.id}>
                        {org.name} ({org.industry})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Request Type</label>
                  <select
                    value={requestType}
                    onChange={e => setRequestType(e.target.value as RequestType)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-hidden"
                  >
                    {requestOptions.map(opt => (
                      <option key={opt.type} value={opt.type}>
                        {opt.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Description & Specific Details of Request
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Specify exactly what data, correction, or grievance you are raising..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 focus:bg-white focus:outline-hidden leading-relaxed"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Attachment (Optional Identity Proof / Evidence)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="e.g. proof_identity_masked.pdf"
                      value={attachmentName}
                      onChange={e => setAttachmentName(e.target.value)}
                      className="flex-1 rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 focus:bg-white focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="rounded-xl px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-indigo-600 px-5 py-2 font-bold text-white shadow-2xs hover:bg-indigo-700"
                  >
                    Submit DPDP Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
