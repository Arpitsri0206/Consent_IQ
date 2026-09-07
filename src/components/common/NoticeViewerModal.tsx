import React, { useState } from 'react';
import { useApp } from '../../services/store';
import { PrivacyNotice } from '../../types';
import { X, FileText, CheckCircle2, ShieldAlert, History, BookOpen, Clock } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface NoticeViewerModalProps {
  noticeId: string | null;
  onClose: () => void;
}

export const NoticeViewerModal: React.FC<NoticeViewerModalProps> = ({ noticeId, onClose }) => {
  const { notices } = useApp();
  const [selectedNoticeId, setSelectedNoticeId] = useState<string | null>(noticeId);

  const activeNotice = notices.find(n => n.id === (selectedNoticeId || noticeId)) || notices[0];
  const allVersions = notices.filter(n => n.tenantId === activeNotice?.tenantId);

  if (!noticeId || !activeNotice) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-xs">
      <div
        className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900">{activeNotice.title}</h3>
                <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-800 font-mono">
                  {activeNotice.version}
                </span>
                <StatusBadge status={activeNotice.status} size="sm" />
              </div>
              <p className="text-xs text-slate-500">
                Effective Date: {activeNotice.effectiveDate} • Managed under DPDP Act 2023 Sec 5
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

        {/* Version Switcher if multiple versions exist */}
        {allVersions.length > 1 && (
          <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/50 px-6 py-2.5 text-xs">
            <span className="font-medium text-slate-500 flex items-center gap-1">
              <History className="h-3.5 w-3.5" /> Notice History:
            </span>
            <div className="flex items-center gap-1.5">
              {allVersions.map(v => (
                <button
                  key={v.id}
                  onClick={() => setSelectedNoticeId(v.id)}
                  className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                    v.id === activeNotice.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {v.version} {v.status === 'PUBLISHED' ? '(Current)' : ''}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Body */}
        <div className="max-h-[65vh] overflow-y-auto p-6 space-y-6">
          {/* Summary Box */}
          <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-blue-700" />
              <span>Executive Plain Language Summary</span>
            </h4>
            <p className="mt-1.5 text-xs text-blue-950 leading-relaxed">
              {activeNotice.summary}
            </p>
          </div>

          {/* Clauses */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Statutory Notice Clauses
            </h4>
            {activeNotice.clauses.map((clause, index) => (
              <div
                key={clause.id || index}
                className="rounded-xl border border-slate-200 bg-white p-4 text-xs space-y-1.5 shadow-2xs"
              >
                <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{clause.title}</span>
                </div>
                <p className="text-slate-600 leading-relaxed pl-5.5">{clause.content}</p>
              </div>
            ))}
          </div>

          {activeNotice.changelog && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
              <span className="font-bold block">Version Changelog:</span>
              <p className="mt-0.5 text-amber-800">{activeNotice.changelog}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-4">
          <span className="text-xs text-slate-500">
            Author: {activeNotice.createdBy}
          </span>
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
