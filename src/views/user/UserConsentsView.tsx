import React, { useState } from 'react';
import { useApp } from '../../services/store';
import { ConsentItem, ConsentStatus, DataCategory } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Search,
  Filter,
  ShieldCheck,
  FileText,
  RotateCcw,
  Download,
  AlertTriangle,
  X,
  CheckCircle2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface UserConsentsViewProps {
  onOpenReceipt: (consentId: string) => void;
  onOpenNotice: (noticeId: string) => void;
  onVerifyEvidence: (consentId: string) => void;
}

export const UserConsentsView: React.FC<UserConsentsViewProps> = ({
  onOpenReceipt,
  onOpenNotice,
  onVerifyEvidence
}) => {
  const { consents, withdrawConsent, grantConsent, denyConsent, t } = useApp();

  const [activeTab, setActiveTab] = useState<'ALL' | ConsentStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Modal states
  const [inspectingConsent, setInspectingConsent] = useState<ConsentItem | null>(null);
  const [withdrawingConsent, setWithdrawingConsent] = useState<ConsentItem | null>(null);
  const [withdrawalReason, setWithdrawalReason] = useState('No longer wish to receive marketing offers');
  const [isProcessingWithdrawal, setIsProcessingWithdrawal] = useState(false);
  const [withdrawalSuccess, setWithdrawalSuccess] = useState(false);

  // Brands list
  const brandOptions = Array.from(new Set(consents.map(c => c.brandName)));

  // Filter logic
  const filteredConsents = consents.filter(c => {
    const matchesTab = activeTab === 'ALL' || c.status === activeTab;
    const matchesSearch =
      c.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.purposeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand = selectedBrand === 'ALL' || c.brandName === selectedBrand;
    const matchesCategory =
      selectedCategory === 'ALL' || c.dataCategories.includes(selectedCategory as DataCategory);

    return matchesTab && matchesSearch && matchesBrand && matchesCategory;
  });

  const handleConfirmWithdrawal = async () => {
    if (!withdrawingConsent) return;
    setIsProcessingWithdrawal(true);
    await withdrawConsent(withdrawingConsent.id, withdrawalReason);
    setIsProcessingWithdrawal(false);
    setWithdrawalSuccess(true);
    setTimeout(() => {
      setWithdrawalSuccess(false);
      setWithdrawingConsent(null);
      if (inspectingConsent?.id === withdrawingConsent.id) {
        setInspectingConsent(null);
      }
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Title & Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {t.navConsents}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            View, inspect, verify, and withdraw consents given to authorized Data Fiduciaries under the DPDP Act.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-slate-200 gap-2 pb-px text-xs font-semibold">
        {(['ALL', 'GRANTED', 'REQUESTED', 'WITHDRAWN', 'EXPIRED'] as const).map(tab => {
          const count = tab === 'ALL' ? consents.length : consents.filter(c => c.status === tab).length;
          const label =
            tab === 'ALL'
              ? 'All Records'
              : tab === 'GRANTED'
              ? 'Active Consents'
              : tab === 'REQUESTED'
              ? 'Pending Requests'
              : tab === 'WITHDRAWN'
              ? 'Withdrawn'
              : 'Expired';

          const isActive = activeTab === tab;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 border-b-2 px-4 py-2.5 transition-all whitespace-nowrap ${
                isActive
                  ? 'border-indigo-600 text-indigo-700 font-bold'
                  : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800'
              }`}
            >
              <span>{label}</span>
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

      {/* Search and Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by brand, purpose or ID..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20"
          />
        </div>

        {/* Brand Filter */}
        <div>
          <select
            value={selectedBrand}
            onChange={e => setSelectedBrand(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-800 focus:bg-white focus:outline-hidden"
          >
            <option value="ALL">All Connected Brands</option>
            {brandOptions.map(b => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* Data Category Filter */}
        <div>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-800 focus:bg-white focus:outline-hidden"
          >
            <option value="ALL">All Data Categories</option>
            <option value="Identity">Identity</option>
            <option value="Contact">Contact</option>
            <option value="Financial">Financial</option>
            <option value="Location">Location</option>
            <option value="Behavioural">Behavioural</option>
            <option value="Health">Health</option>
          </select>
        </div>
      </div>

      {/* Consents Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Data Fiduciary / Brand</th>
                <th className="py-3.5 px-4">Processing Purpose</th>
                <th className="py-3.5 px-4">Data Categories</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Granted On</th>
                <th className="py-3.5 px-4">Expiry</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredConsents.map(consent => (
                <tr key={consent.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Brand */}
                  <td className="py-4 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{consent.brandLogo}</span>
                      <div>
                        <div className="font-bold text-slate-900 text-xs">{consent.brandName}</div>
                        <span className="font-mono text-[10px] text-slate-400">{consent.id}</span>
                      </div>
                    </div>
                  </td>

                  {/* Purpose */}
                  <td className="py-4 px-4 max-w-xs">
                    <div className="font-medium text-slate-900 truncate">{consent.purposeName}</div>
                    <span className="text-[11px] text-slate-500 block truncate">{consent.businessObjective}</span>
                  </td>

                  {/* Data Categories */}
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1">
                      {consent.dataCategories.slice(0, 2).map(cat => (
                        <span
                          key={cat}
                          className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700"
                        >
                          {cat}
                        </span>
                      ))}
                      {consent.dataCategories.length > 2 && (
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                          +{consent.dataCategories.length - 2}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4">
                    <StatusBadge status={consent.status} size="sm" />
                  </td>

                  {/* Granted */}
                  <td className="py-4 px-4 text-slate-600 font-medium whitespace-nowrap">
                    {consent.grantedAt ? consent.grantedAt.split(' ')[0] : '—'}
                  </td>

                  {/* Expiry */}
                  <td className="py-4 px-4 text-slate-500 whitespace-nowrap">
                    {consent.expiresAt ? consent.expiresAt.split(' ')[0] : '—'}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setInspectingConsent(consent)}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 shadow-2xs"
                      >
                        Details
                      </button>

                      {consent.status === 'GRANTED' && (
                        <button
                          onClick={() => setWithdrawingConsent(consent)}
                          className="rounded-lg border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-700 hover:bg-purple-100"
                        >
                          Withdraw
                        </button>
                      )}

                      {consent.status === 'REQUESTED' && (
                        <button
                          onClick={async () => {
                            await grantConsent(consent.id, 'Web');
                            confetti({ particleCount: 30, spread: 50 });
                          }}
                          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-indigo-700"
                        >
                          Allow
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredConsents.length === 0 && (
            <div className="py-12 text-center text-slate-400">
              <p className="text-sm font-medium">No consents found matching current criteria.</p>
              <button
                onClick={() => {
                  setActiveTab('ALL');
                  setSearchQuery('');
                  setSelectedBrand('ALL');
                  setSelectedCategory('ALL');
                }}
                className="mt-2 text-xs font-semibold text-indigo-600 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Comprehensive Consent Details Modal (Required by Master Prompt Section 12) */}
      {inspectingConsent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{inspectingConsent.brandLogo}</span>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{inspectingConsent.brandName}</h3>
                  <p className="text-xs text-slate-500 font-mono">Consent ID: {inspectingConsent.id}</p>
                </div>
              </div>
              <button
                onClick={() => setInspectingConsent(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6 text-xs max-h-[70vh] overflow-y-auto">
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                <div>
                  <span className="text-slate-500 block">Current Status</span>
                  <div className="mt-1">
                    <StatusBadge status={inspectingConsent.status} size="lg" />
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block">Notice Version Agreed</span>
                  <button
                    onClick={() => {
                      setInspectingConsent(null);
                      onOpenNotice(inspectingConsent.noticeId);
                    }}
                    className="font-bold text-indigo-600 hover:underline flex items-center gap-1 justify-end mt-1"
                  >
                    <span>{inspectingConsent.noticeVersion}</span>
                    <ExternalLink className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Why is my data being used? */}
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">Why is my data being used?</h4>
                <p className="text-slate-700 leading-relaxed bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                  {inspectingConsent.purposeDescription}
                </p>
              </div>

              {/* Data being processed */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">Personal Data Categories Processed</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {inspectingConsent.dataCategories.map(cat => (
                    <div
                      key={cat}
                      className="rounded-lg border border-slate-200 bg-white p-2.5 font-medium text-slate-800"
                    >
                      ✓ {cat}
                    </div>
                  ))}
                </div>
              </div>

              {/* Consent Information */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">Consent Provenance & Lifecycle</h4>
                <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                  <div>
                    <span className="text-slate-400 block">Granted Timestamp</span>
                    <span className="font-semibold text-slate-800">{inspectingConsent.grantedAt || 'Pending'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Valid Expiry</span>
                    <span className="font-semibold text-slate-800">{inspectingConsent.expiresAt || 'Active'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Collection Channel</span>
                    <span className="font-semibold text-slate-800">{inspectingConsent.collectionChannel}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Retention Limit</span>
                    <span className="font-semibold text-slate-800">{inspectingConsent.retentionPeriod}</span>
                  </div>
                </div>
              </div>

              {/* Data Sharing Stream */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">Authorized Third-Party Processors</h4>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                  {inspectingConsent.thirdParties.map((tp, idx) => (
                    <div key={tp} className="flex items-center gap-2 text-slate-700">
                      <span className="font-bold text-indigo-600">→</span>
                      <span>{tp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const id = inspectingConsent.id;
                    setInspectingConsent(null);
                    onOpenReceipt(id);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 shadow-2xs"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download Receipt</span>
                </button>
                <button
                  onClick={() => {
                    const id = inspectingConsent.id;
                    setInspectingConsent(null);
                    onVerifyEvidence(id);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Verify Ledger Proof</span>
                </button>
              </div>

              {inspectingConsent.status === 'GRANTED' && (
                <button
                  onClick={() => {
                    setWithdrawingConsent(inspectingConsent);
                  }}
                  className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-rose-700"
                >
                  Withdraw Consent
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Consent Confirmation Modal (Required by Master Prompt Section 13) */}
      {withdrawingConsent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            {withdrawalSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Consent Withdrawn Successfully</h3>
                <p className="text-xs text-slate-500">
                  The organization has been notified to halt downstream processing under DPDP mandates.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-rose-600">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Withdraw this consent?</h3>
                    <p className="text-xs text-slate-500">{withdrawingConsent.brandName}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Withdrawing consent will notify <span className="font-bold">{withdrawingConsent.brandName}</span> that you no longer permit personal data processing for <span className="font-bold">{withdrawingConsent.purposeName}</span>, subject to applicable legal requirements.
                </p>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Reason for withdrawal (Optional):
                  </label>
                  <textarea
                    rows={2}
                    value={withdrawalReason}
                    onChange={e => setWithdrawalReason(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => setWithdrawingConsent(null)}
                    className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmWithdrawal}
                    disabled={isProcessingWithdrawal}
                    className="rounded-xl bg-rose-600 px-5 py-2 text-xs font-bold text-white shadow-2xs hover:bg-rose-700 disabled:opacity-50"
                  >
                    {isProcessingWithdrawal ? 'Stopping Processing...' : 'Withdraw Consent'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
