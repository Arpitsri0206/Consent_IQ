import React, { useState } from 'react';
import { useApp } from '../../services/store';
import { ConsentStatus, CollectionChannel } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Search,
  Filter,
  ShieldCheck,
  Download,
  ExternalLink,
  Sparkles,
  MessageCircle,
  MessageSquare,
  PhoneCall,
  Globe,
  Smartphone,
  QrCode,
  Mail,
  Building2,
  Cpu
} from 'lucide-react';

interface BrandConsentsViewProps {
  onOpenReceipt: (consentId: string) => void;
  onVerifyEvidence: (consentId: string) => void;
  onNavigate: (route: string) => void;
}

const renderChannelBadge = (ch: CollectionChannel) => {
  switch (ch) {
    case 'WhatsApp':
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
          <MessageCircle className="h-3 w-3" />
          WhatsApp
        </span>
      );
    case 'SMS':
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
          <MessageSquare className="h-3 w-3" />
          SMS
        </span>
      );
    case 'IVR':
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700 border border-purple-200">
          <PhoneCall className="h-3 w-3" />
          IVR Voice
        </span>
      );
    case 'Mobile App':
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-sky-700 border border-sky-200">
          <Smartphone className="h-3 w-3" />
          Mobile App
        </span>
      );
    case 'Web':
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 border border-indigo-200">
          <Globe className="h-3 w-3" />
          Web
        </span>
      );
    case 'QR Code':
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
          <QrCode className="h-3 w-3" />
          QR Code
        </span>
      );
    case 'Email':
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200">
          <Mail className="h-3 w-3" />
          Email
        </span>
      );
    case 'Assisted / Branch':
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-700 border border-teal-200">
          <Building2 className="h-3 w-3" />
          Branch Kiosk
        </span>
      );
    case 'API SDK':
    default:
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 border border-slate-200">
          <Cpu className="h-3 w-3" />
          API SDK
        </span>
      );
  }
};

export const BrandConsentsView: React.FC<BrandConsentsViewProps> = ({
  onOpenReceipt,
  onVerifyEvidence,
  onNavigate
}) => {
  const { consents } = useApp();
  const [tab, setTab] = useState<'ALL' | ConsentStatus>('ALL');
  const [channelFilter, setChannelFilter] = useState<'ALL' | CollectionChannel>('ALL');
  const [search, setSearch] = useState('');

  // Filter for brand
  const brandConsents = consents.filter(c => c.tenantId === 'org_apex');

  const filtered = brandConsents.filter(c => {
    const matchesTab = tab === 'ALL' || c.status === tab;
    const matchesChannel = channelFilter === 'ALL' || c.collectionChannel === channelFilter;
    const matchesSearch =
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.userRef.toLowerCase().includes(search.toLowerCase()) ||
      c.purposeName.toLowerCase().includes(search.toLowerCase()) ||
      c.collectionChannel.toLowerCase().includes(search.toLowerCase()) ||
      c.noticeVersion.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesChannel && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Enterprise Consent Registry
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Pseudonymized registry of active and withdrawn Data Principal consents under DPDP Section 6.
          </p>
        </div>

        <button
          onClick={() => onNavigate('/brand/consents/create')}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-indigo-700"
        >
          <Sparkles className="h-4 w-4" />
          <span>New Consent Journey</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-slate-200 gap-2 pb-px text-xs font-semibold">
        {(['ALL', 'GRANTED', 'REQUESTED', 'WITHDRAWN', 'EXPIRED'] as const).map(t => {
          const count = t === 'ALL' ? brandConsents.length : brandConsents.filter(c => c.status === t).length;
          const isActive = tab === t;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex items-center gap-2 border-b-2 px-4 py-2.5 transition-all whitespace-nowrap ${
                isActive
                  ? 'border-indigo-600 text-indigo-700 font-bold'
                  : 'border-transparent text-slate-500 hover:border-slate-300'
              }`}
            >
              <span>{t === 'ALL' ? 'All Consents' : t}</span>
              <span
                className={`rounded-full px-2 py-0.2 text-[10px] font-bold ${
                  isActive ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Channel Filters */}
      <div className="space-y-3">
        <div className="flex items-center rounded-2xl border border-slate-200 bg-white p-3 shadow-2xs">
          <Search className="h-4 w-4 text-slate-400 ml-2" />
          <input
            type="text"
            placeholder="Search by Consent ID, Data Principal Ref (USR-...), Purpose, Channel, or Notice..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-transparent px-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden"
          />
        </div>

        {/* Channel Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-medium text-slate-600">
          <span className="text-slate-400 text-xs font-semibold px-1 shrink-0">Channel:</span>
          {(['ALL', 'WhatsApp', 'SMS', 'IVR', 'Mobile App', 'Web', 'QR Code', 'Email', 'Assisted / Branch'] as const).map(ch => {
            const isSelected = channelFilter === ch;
            const count = ch === 'ALL' ? brandConsents.length : brandConsents.filter(c => c.collectionChannel === ch).length;
            return (
              <button
                key={ch}
                onClick={() => setChannelFilter(ch)}
                className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-slate-900 text-white font-bold shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{ch === 'ALL' ? 'All Channels' : ch}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[9px] font-bold ${
                    isSelected ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Consent ID</th>
                <th className="py-3.5 px-4">Data Principal Ref</th>
                <th className="py-3.5 px-4">Processing Purpose</th>
                <th className="py-3.5 px-4">Notice Version</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Granted On</th>
                <th className="py-3.5 px-4">Channel</th>
                <th className="py-3.5 px-4 text-right">Ledger Proof</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/70 transition-colors font-sans">
                  <td className="py-4 px-4 sm:px-6 font-mono font-bold text-slate-900 text-xs">
                    {c.id}
                  </td>
                  <td className="py-4 px-4 font-mono text-slate-600">
                    <span className="rounded bg-slate-100 px-2 py-0.5">{c.userRef}</span>
                  </td>
                  <td className="py-4 px-4 text-slate-900 font-medium max-w-xs truncate">
                    {c.purposeName}
                  </td>
                  <td className="py-4 px-4 font-mono text-slate-700">
                    {c.noticeVersion}
                  </td>
                  <td className="py-4 px-4">
                    <StatusBadge status={c.status} size="sm" />
                  </td>
                  <td className="py-4 px-4 text-slate-600 whitespace-nowrap">
                    {c.grantedAt ? c.grantedAt.split(' ')[0] : '—'}
                  </td>
                  <td className="py-4 px-4">
                    {renderChannelBadge(c.collectionChannel)}
                  </td>
                  <td className="py-4 px-4 text-right whitespace-nowrap font-sans">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onOpenReceipt(c.id)}
                        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                      >
                        Receipt
                      </button>
                      <button
                        onClick={() => onVerifyEvidence(c.id)}
                        className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                      >
                        Verify Hash
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="p-8 text-center text-slate-400">
              No consent records match your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
