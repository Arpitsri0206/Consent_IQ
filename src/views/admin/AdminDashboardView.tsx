import React from 'react';
import { useApp } from '../../services/store';
import { StatCard } from '../../components/common/StatCard';
import { useCachedChartData } from '../../hooks/useCachedChartData';
import { apiClient } from '../../services/api';
import { Building2, ShieldCheck, CheckCircle2, Users, Database, Zap, ArrowRight, Lock, RefreshCw } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface AdminDashboardViewProps {
  onNavigate: (route: string) => void;
}

const fetchAdminDashboardCharts = () => apiClient.getDashboardChartAnalytics();

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ onNavigate }) => {
  const { organizations, consents, events } = useApp();

  const totalOrgs = organizations.length;
  const totalConsents = organizations.reduce((acc, o) => acc + o.activeConsents, 0);
  const totalPrincipals = organizations.reduce((acc, o) => acc + o.dataPrincipalsCount, 0);

  const defaultTenantVolumeData = organizations.map(o => ({
    name: o.name.split(' ')[0],
    active: Number((o.activeConsents / 1000000).toFixed(2)),
    rate: o.consentRate
  }));

  // Client-side cached chart data hook (5m TTL)
  const {
    data: chartAnalytics,
    isFromCache,
    refetch,
    loading: chartLoading
  } = useCachedChartData(
    'admin_dashboard_charts_analytics',
    fetchAdminDashboardCharts,
    {
      ttlMs: 5 * 60 * 1000,
      initialData: {
        generatedAt: 'static-init',
        source: 'Client Cache',
        monthlyTrend: [],
        purposeBreakdown: [],
        channelBreakdown: [],
        tenantVolumes: defaultTenantVolumeData,
        totalActiveConsents: totalConsents,
      }
    }
  );

  const tenantVolumeData = chartAnalytics?.tenantVolumes?.length
    ? chartAnalytics.tenantVolumes
    : defaultTenantVolumeData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Platform Operations & Multi-Tenant Registry
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Global governance of Data Fiduciaries, tenant isolations, cryptographic throughput, and DPDP compliance.
          </p>
        </div>

        <span className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>All 5 Data Zones Operational</span>
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Onboarded Fiduciaries"
          value={totalOrgs}
          subtitle="Multi-tenant enterprises"
          icon={Building2}
          iconBg="bg-blue-50 text-blue-600"
          onClick={() => onNavigate('/admin/organizations')}
        />
        <StatCard
          title="Total Platform Consents"
          value={`${(totalConsents / 1000000).toFixed(2)}M`}
          subtitle="Governed in ledger"
          change="+14.2% MoM"
          trend="up"
          icon={CheckCircle2}
          iconBg="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="Managed Data Principals"
          value={`${(totalPrincipals / 1000000).toFixed(2)}M`}
          subtitle="Indian citizen identities"
          icon={Users}
          iconBg="bg-indigo-50 text-indigo-600"
        />
        <StatCard
          title="Evidence Ledger Hashes"
          value="14.8M"
          subtitle="SHA-256 Merkle anchored"
          icon={ShieldCheck}
          iconBg="bg-purple-50 text-purple-600"
          onClick={() => onNavigate('/admin/security')}
        />
      </div>

      {/* Chart: Tenant Volume */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Tenant Consent Volumes (Millions)</h3>
            <p className="text-xs text-slate-500">Distribution of active DPDP consents by registered fiduciary</p>
          </div>
          <div className="flex items-center gap-2">
            <div
              title="Client-side chart cache active (5m TTL)"
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-mono text-slate-600"
            >
              <Zap className="h-3 w-3 text-indigo-600" />
              <span>{isFromCache ? '⚡ Cached (0ms)' : 'Synced'}</span>
            </div>
            <button
              onClick={() => refetch(true)}
              title="Refresh chart analytics cache"
              className="rounded-full p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={tenantVolumeData} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
              <Tooltip
                formatter={(val: any) => `${val} Million Active Consents`}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '11px'
                }}
              />
              <Bar dataKey="active" fill="#4f46e5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tenant Directory Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Registered Enterprise Tenants</h3>
            <p className="text-xs text-slate-500">Data Fiduciary compliance standing</p>
          </div>
          <button
            onClick={() => onNavigate('/admin/organizations')}
            className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
          >
            <span>Manage All Tenants</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Organization</th>
                <th className="py-3 px-4">Industry</th>
                <th className="py-3 px-4">Active Consents</th>
                <th className="py-3 px-4">Consent Rate</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {organizations.map(org => (
                <tr key={org.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{org.logo}</span>
                      <div>
                        <span className="font-bold text-slate-900 text-xs block">{org.name}</span>
                        <span className="font-mono text-[10px] text-slate-400">{org.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-600">{org.industry}</td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    {(org.activeConsents / 1000000).toFixed(2)}M
                  </td>
                  <td className="py-3 px-4 font-bold text-emerald-600">{org.consentRate}%</td>
                  <td className="py-3 px-4">
                    <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      {org.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onNavigate('/admin/organizations')}
                      className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      Audit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
