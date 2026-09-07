import React, { useState } from 'react';
import { useApp } from '../../services/store';
import { ShieldCheck, History, Search, Filter, Layers, ArrowUpRight } from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';

interface UserHistoryViewProps {
  onVerifyEvidence: (consentId: string) => void;
}

export const UserHistoryView: React.FC<UserHistoryViewProps> = ({ onVerifyEvidence }) => {
  const { events } = useApp();
  const [filterType, setFilterType] = useState('ALL');
  const [search, setSearch] = useState('');

  const filteredEvents = events.filter(e => {
    const matchesFilter = filterType === 'ALL' || e.eventType === filterType;
    const matchesSearch =
      e.organization.toLowerCase().includes(search.toLowerCase()) ||
      e.purpose.toLowerCase().includes(search.toLowerCase()) ||
      e.eventId.toLowerCase().includes(search.toLowerCase()) ||
      e.consentId.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Consent Event History</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Immutable, cryptographically anchored ledger of all consent transactions, notice presentations, and withdrawals.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search event ID, fiduciary, purpose, or hash..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-hidden"
          />
        </div>

        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-800 focus:bg-white focus:outline-hidden"
        >
          <option value="ALL">All Event Types</option>
          <option value="CONSENT_GRANTED">Consent Granted</option>
          <option value="CONSENT_WITHDRAWN">Consent Withdrawn</option>
          <option value="PROCESSING_STOPPED">Processing Stopped</option>
          <option value="CONSENT_REQUESTED">Consent Requested</option>
          <option value="NOTICE_VIEWED">Notice Viewed</option>
        </select>
      </div>

      {/* Events Timeline List */}
      <div className="space-y-3">
        {filteredEvents.map(evt => (
          <div
            key={evt.eventId}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-slate-300"
          >
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl text-white font-bold text-xs ${
                    evt.eventType === 'CONSENT_GRANTED'
                      ? 'bg-emerald-600'
                      : evt.eventType === 'CONSENT_WITHDRAWN'
                      ? 'bg-purple-600'
                      : evt.eventType === 'PROCESSING_STOPPED'
                      ? 'bg-rose-600'
                      : 'bg-indigo-600'
                  }`}
                >
                  <History className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{evt.eventType.replace(/_/g, ' ')}</span>
                    <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[10px] text-slate-600">
                      {evt.eventId}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    {evt.organization} • Channel: {evt.channel}
                  </span>
                </div>
              </div>

              <div className="text-right text-xs">
                <span className="font-mono text-slate-500 block">{evt.timestamp}</span>
                <span className="text-slate-400 text-[11px]">Actor: {evt.actor}</span>
              </div>
            </div>

            <div className="mt-3 text-xs text-slate-700">
              <span className="font-semibold text-slate-500">Purpose Scope: </span>
              <span className="font-medium text-slate-900">{evt.purpose}</span>
            </div>

            {/* Cryptographic hash chain strip */}
            <div className="mt-3 rounded-xl bg-slate-900 p-3 text-slate-300 font-mono text-[11px] space-y-1">
              <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase">
                <span>Proof Digest</span>
                <button
                  onClick={() => onVerifyEvidence(evt.consentId)}
                  className="text-emerald-400 font-bold hover:underline flex items-center gap-1"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Verify Hash Proof</span>
                </button>
              </div>
              <div className="truncate text-slate-300">
                <span className="text-slate-500">Current Hash: </span>{evt.eventHash}
              </div>
              <div className="truncate text-slate-400 text-[10px]">
                <span className="text-slate-600">Prev Hash: </span>{evt.previousHash}
              </div>
            </div>
          </div>
        ))}

        {filteredEvents.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-400">
            <p className="text-sm font-medium">No consent events match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};
