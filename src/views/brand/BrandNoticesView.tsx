import React, { useState } from 'react';
import { useApp } from '../../services/store';
import { PrivacyNotice } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { FileText, Plus, CheckCircle2, History, X, Eye, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BrandNoticesViewProps {
  onOpenNoticeModal: (noticeId: string) => void;
}

export const BrandNoticesView: React.FC<BrandNoticesViewProps> = ({ onOpenNoticeModal }) => {
  const { notices, createNotice, currentUser } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('Apex Financial Master DPDP Privacy Notice');
  const [version, setVersion] = useState('v2.2');
  const [summary, setSummary] = useState('Updated with refined data fiduciary grievance SLAs and enhanced cross-border provisions.');
  const [changelog, setChangelog] = useState('Added Section 5 grievance redressal turnaround guarantee.');

  const brandNotices = notices.filter(n => n.tenantId === 'org_apex');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createNotice({
      title,
      version,
      status: 'PUBLISHED',
      effectiveDate: new Date().toISOString().split('T')[0],
      createdBy: `${currentUser.name} (Privacy Officer)`,
      summary,
      clauses: [
        { id: 'c1', title: '1. Identity and Contact of Data Fiduciary', content: 'Apex Financial Services Ltd, Mumbai 400021. Designated DPO: dpo@apexfin.example.com.' },
        { id: 'c2', title: '2. Purpose of Processing & Categories of Personal Data', content: 'We process personal identifiers, financial telemetry, and customer preferences strictly per approved consent.' },
        { id: 'c3', title: '3. Data Sharing & Third-Party Processors', content: 'Shared only with certified Indian data centers under strict confidentiality agreements.' },
        { id: 'c4', title: '4. Rights of Data Principal', content: 'Exercise right to access, correct, or erase data directly through the ConsentIQ self-service portal.' },
        { id: 'c5', title: '5. Grievance Redressal Mechanism', content: 'Designated Grievance Officer guarantees statutory resolution within 72 hours.' }
      ],
      changelog
    });

    confetti({ particleCount: 30, spread: 50 });
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Privacy Notice Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Maintain immutable versioned Privacy Notices under Section 5. Previous versions are archived and never overwritten.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          <span>Publish New Notice Version</span>
        </button>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {brandNotices.map(notice => (
          <div
            key={notice.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4 hover:border-slate-300 transition-all"
          >
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 font-bold">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-base">{notice.title}</h3>
                    <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-800 font-mono">
                      {notice.version}
                    </span>
                    <StatusBadge status={notice.status} size="sm" />
                  </div>
                  <span className="text-xs text-slate-500">
                    Effective Date: {notice.effectiveDate} • Author: {notice.createdBy}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onOpenNoticeModal(notice.id)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Inspect Clauses & Compare</span>
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl">
              {notice.summary}
            </p>

            {notice.changelog && (
              <div className="text-xs text-amber-900 bg-amber-50/70 border border-amber-200/60 p-3 rounded-xl">
                <span className="font-bold">Version Changelog: </span>
                <span>{notice.changelog}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
              <span>{notice.clauses.length} Section 5 Itemized Clauses</span>
              <span className="font-mono text-[11px] text-slate-400">{notice.id}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Publish Notice Version */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-indigo-600" />
                  <h3 className="font-bold text-slate-900 text-base">Create Notice Version</h3>
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
                <label className="font-semibold text-slate-700 block mb-1">Notice Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Version Number (e.g. v2.2)</label>
                <input
                  type="text"
                  required
                  value={version}
                  onChange={e => setVersion(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Plain Language Summary</label>
                <textarea
                  rows={3}
                  required
                  value={summary}
                  onChange={e => setSummary(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Changelog Details</label>
                <input
                  type="text"
                  value={changelog}
                  onChange={e => setChangelog(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-hidden"
                />
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
                  Publish & Supersede Old Version
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
