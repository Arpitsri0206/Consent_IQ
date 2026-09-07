import React from 'react';
import { useApp } from '../../services/store';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  RotateCcw,
  Building2,
  ArrowRight,
  Shield,
  Sparkles,
  AlertCircle,
  ExternalLink,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface UserDashboardViewProps {
  onNavigate: (route: string) => void;
  onOpenReceipt: (consentId: string) => void;
  onOpenNotice: (noticeId: string) => void;
  onVerifyEvidence: (consentId: string) => void;
}

export const UserDashboardView: React.FC<UserDashboardViewProps> = ({
  onNavigate,
  onOpenReceipt,
  onOpenNotice,
  onVerifyEvidence
}) => {
  const { currentUser, consents, events, organizations, grantConsent, denyConsent, t } = useApp();

  const activeConsents = consents.filter(c => c.status === 'GRANTED');
  const pendingRequests = consents.filter(c => c.status === 'REQUESTED');
  const withdrawnConsents = consents.filter(c => c.status === 'WITHDRAWN');
  const uniqueBrands = Array.from(new Set(consents.map(c => c.brandName)));

  const handleGrant = async (id: string) => {
    await grantConsent(id, 'Web');
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
  };

  return (
    <div className="space-y-6">
      {/* Header Welcome */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t.welcomeUser}, {currentUser.name}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            {t.userDashboardSubtitle}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 font-mono text-xs text-slate-600 shadow-2xs">
            Principal ID: {currentUser.userRef}
          </span>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t.activeConsentsCount}
          value={activeConsents.length + 15}
          subtitle="Governed under DPDP rules"
          change="+2 this month"
          trend="up"
          icon={CheckCircle2}
          iconBg="bg-emerald-50 text-emerald-600"
          onClick={() => onNavigate('/user/consents')}
        />
        <StatCard
          title={t.pendingRequestsCount}
          value={pendingRequests.length}
          subtitle="Awaiting your authorization"
          badge={pendingRequests.length > 0 ? 'Action Required' : undefined}
          icon={Clock}
          iconBg="bg-amber-50 text-amber-600"
          onClick={() => onNavigate('/user/consents')}
        />
        <StatCard
          title={t.withdrawnConsentsCount}
          value={withdrawnConsents.length + 3}
          subtitle="Downstream processing stopped"
          icon={RotateCcw}
          iconBg="bg-purple-50 text-purple-600"
          onClick={() => onNavigate('/user/consents')}
        />
        <StatCard
          title={t.connectedBrandsCount}
          value={uniqueBrands.length + 3}
          subtitle="Authorized Data Fiduciaries"
          icon={Building2}
          iconBg="bg-blue-50 text-blue-600"
          onClick={() => onNavigate('/user/data-sharing')}
        />
      </div>

      {/* Privacy Health Score Banner */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-indigo-300 border border-indigo-500/30">
                DPDP Privacy Posture
              </span>
            </div>
            <h3 className="text-xl font-bold">{t.privacyHealth}: 82% (Optimal)</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t.privacyHealthText} You have zero unverified third-party transfers, and all active consents have valid Section 5 privacy notices attached.
            </p>
          </div>

          {/* Meter representation */}
          <div className="flex items-center gap-4 bg-white/10 rounded-2xl p-4 backdrop-blur-xs border border-white/10">
            <div className="text-center">
              <div className="text-3xl font-extrabold text-emerald-400 font-mono">82%</div>
              <span className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">
                Control Index
              </span>
            </div>
            <div className="h-10 w-px bg-white/20" />
            <div className="space-y-1 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Notice Verified</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Withdrawal Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Consent Action Cards (Interactive Scenario Entrypoint) */}
      {pendingRequests.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
              <span>Pending Consent Requests ({pendingRequests.length})</span>
            </h3>
            <span className="text-xs text-slate-500">Requires your voluntary authorization</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingRequests.map(req => (
              <div
                key={req.id}
                className="rounded-2xl border-2 border-amber-200 bg-amber-50/40 p-5 shadow-xs transition-all hover:border-amber-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{req.brandLogo}</span>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{req.brandName}</h4>
                      <span className="text-xs text-slate-500 font-mono">{req.id}</span>
                    </div>
                  </div>
                  <StatusBadge status={req.status} size="sm" />
                </div>

                <div className="mt-3 space-y-2">
                  <div>
                    <span className="text-xs font-semibold text-slate-700">Requested Purpose:</span>
                    <p className="text-xs font-bold text-slate-900 mt-0.5">{req.purposeName}</p>
                    <p className="text-xs text-slate-600 mt-0.5">{req.purposeDescription}</p>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-slate-600 block">
                      Data Requested:
                    </span>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {req.dataCategories.map(cat => (
                        <span
                          key={cat}
                          className="rounded-md bg-white border border-slate-200 px-2 py-0.5 text-xs font-medium text-slate-800"
                        >
                          ✓ {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-amber-200/60 pt-3 text-xs">
                  <button
                    onClick={() => onOpenNotice(req.noticeId)}
                    className="inline-flex items-center gap-1 font-semibold text-indigo-700 hover:underline"
                  >
                    <span>Read Privacy Notice ({req.noticeVersion})</span>
                    <ExternalLink className="h-3 w-3" />
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => denyConsent(req.id)}
                      className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      {t.actionDecline}
                    </button>
                    <button
                      onClick={() => handleGrant(req.id)}
                      className="rounded-xl bg-indigo-600 px-4 py-1.5 font-bold text-white shadow-xs hover:bg-indigo-700"
                    >
                      {t.actionAllow}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Two Columns: Recent Consent Activity + Connected Brands */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Timeline (2 Columns) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Recent Consent Activity Timeline</h3>
              <p className="text-xs text-slate-500">Immutable chronological events logged under your ID</p>
            </div>
            <button
              onClick={() => onNavigate('/user/history')}
              className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
            >
              <span>View All Events</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {events.slice(0, 4).map(evt => (
              <div
                key={evt.eventId}
                className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 text-xs hover:bg-slate-50 transition-colors"
              >
                <div
                  className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-white font-bold ${
                    evt.eventType === 'CONSENT_GRANTED'
                      ? 'bg-emerald-600'
                      : evt.eventType === 'CONSENT_WITHDRAWN'
                      ? 'bg-purple-600'
                      : evt.eventType === 'CONSENT_DENIED'
                      ? 'bg-rose-600'
                      : 'bg-indigo-600'
                  }`}
                >
                  {evt.eventType === 'CONSENT_GRANTED' ? '✓' : evt.eventType === 'CONSENT_WITHDRAWN' ? '↺' : 'ℹ'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs truncate">
                      {evt.organization} • {evt.eventType.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">{evt.timestamp}</span>
                  </div>
                  <p className="text-slate-600 text-xs mt-0.5 truncate">{evt.purpose}</p>
                  <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>Channel: {evt.channel}</span>
                    <button
                      onClick={() => onVerifyEvidence(evt.consentId)}
                      className="text-indigo-600 font-sans font-semibold hover:underline"
                    >
                      Verify Hash Proof →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Connected Brands (1 Column) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Connected Brands</h3>
              <p className="text-xs text-slate-500">Active Fiduciaries</p>
            </div>
            <button
              onClick={() => onNavigate('/user/consents')}
              className="text-xs font-semibold text-indigo-600 hover:underline"
            >
              Manage
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {organizations.slice(0, 4).map(org => {
              const brandConsents = consents.filter(c => c.tenantId === org.id && c.status === 'GRANTED');
              return (
                <div
                  key={org.id}
                  className="flex items-center justify-between rounded-xl border border-slate-100 p-3 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{org.logo}</span>
                    <div>
                      <h4 className="font-bold text-slate-900">{org.name}</h4>
                      <span className="text-[11px] text-slate-500">{brandConsents.length} active consents</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate('/user/consents')}
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    View
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
