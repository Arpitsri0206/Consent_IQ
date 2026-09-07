import React from 'react';
import { useApp } from '../../services/store';
import { StatCard } from '../../components/common/StatCard';
import {
  Users,
  CheckCircle2,
  Send,
  RotateCcw,
  Sparkles,
  Layers,
  FileText,
  Clock,
  AlertCircle,
  TrendingUp,
  ShieldCheck,
  Building2,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

interface BrandDashboardViewProps {
  onNavigate: (route: string) => void;
}

export const BrandDashboardView: React.FC<BrandDashboardViewProps> = ({ onNavigate }) => {
  const { organizations, consents, purposes, requests, t } = useApp();

  const brandOrg = organizations.find(o => o.id === 'org_apex') || organizations[0];
  const brandConsents = consents.filter(c => c.tenantId === 'org_apex');
  const openRequests = requests.filter(r => r.tenantId === 'org_apex' && r.status !== 'RESOLVED');

  // Chart Data: Monthly Consent Trend
  const trendData = [
    { month: 'Jan', granted: 120, withdrawn: 4 },
    { month: 'Feb', granted: 145, withdrawn: 5 },
    { month: 'Mar', granted: 170, withdrawn: 6 },
    { month: 'Apr', granted: 210, withdrawn: 8 },
    { month: 'May', granted: 240, withdrawn: 7 },
    { month: 'Jun', granted: 290, withdrawn: 9 },
    { month: 'Jul', granted: 330, withdrawn: 11 },
    { month: 'Aug', granted: 380, withdrawn: 12 },
    { month: 'Sep', granted: 420, withdrawn: 14 }
  ];

  // Chart Data: Purpose Breakdown
  const purposeChartData = [
    { name: 'Marketing & Offers', value: 1820000, color: '#4f46e5' },
    { name: 'Digital KYC & Ops', value: 2380000, color: '#06b6d4' },
    { name: 'Fraud & Security', value: 2410000, color: '#10b981' },
    { name: 'Analytics & Insights', value: 890000, color: '#f59e0b' }
  ];

  // Chart Data: Channel Breakdown
  const channelChartData = [
    { channel: 'Web Portal', count: 1240000 },
    { channel: 'Mobile App', count: 980000 },
    { channel: 'QR Scan', count: 120000 },
    { channel: 'API SDK', count: 70000 }
  ];

  return (
    <div className="space-y-6">
      {/* Brand Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white text-2xl shadow-xs">
            {brandOrg.logo}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{brandOrg.name}</h1>
              <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700 font-mono">
                {brandOrg.industry}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Chief Privacy Officer: <span className="font-semibold text-slate-700">{brandOrg.adminName}</span> • DPDP Consent Operations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('/brand/consents/create')}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-indigo-700"
          >
            <Sparkles className="h-4 w-4" />
            <span>New Consent Request</span>
          </button>
        </div>
      </div>

      {/* Row 1 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Data Principals"
          value="2.42M"
          subtitle="Registered customer profiles"
          change="+4.2% MoM"
          trend="up"
          icon={Users}
          iconBg="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Active Consents"
          value={`${(brandOrg.activeConsents / 1000000).toFixed(2)}M`}
          subtitle="Valid DPDP active grants"
          change="+8.1% vs Q2"
          trend="up"
          icon={CheckCircle2}
          iconBg="bg-emerald-50 text-emerald-600"
          onClick={() => onNavigate('/brand/consents')}
        />
        <StatCard
          title="Consent Requests Sent"
          value="2.41M"
          subtitle="Broadcasted via Web & App"
          icon={Send}
          iconBg="bg-indigo-50 text-indigo-600"
        />
        <StatCard
          title="Total Withdrawals"
          value={`${(brandOrg.withdrawals / 1000).toFixed(1)}K`}
          subtitle="Downstream halted: 1.58%"
          change="-0.2% drop"
          trend="down"
          icon={RotateCcw}
          iconBg="bg-purple-50 text-purple-600"
        />
      </div>

      {/* Row 2 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Consent Acceptance Rate"
          value={`${brandOrg.consentRate}%`}
          subtitle="Benchmark: >70% BFSI avg"
          change="+2.4%"
          trend="up"
          badge="High Trust"
        />
        <StatCard
          title="Pending Authorization"
          value="12,482"
          subtitle="Active onboarding flows"
          icon={Clock}
          iconBg="bg-amber-50 text-amber-600"
        />
        <StatCard
          title="Expiring in 30 Days"
          value="8,240"
          subtitle="Scheduled for automated renewal"
          icon={AlertCircle}
          iconBg="bg-slate-100 text-slate-700"
        />
        <StatCard
          title="Open DSR Grievances"
          value={openRequests.length + 280}
          subtitle="Avg resolution: 3.2 days"
          badge="SLA 100%"
          iconBg="bg-rose-50 text-rose-600"
          onClick={() => onNavigate('/brand/requests')}
        />
      </div>

      {/* Charts Grid: Consent Volume Analytics (Col 8) + Real-time Events (Col 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Consent Trend Chart (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Consent Volume Analytics</h3>
              <p className="text-xs text-slate-500">Aggregate new consent grants vs withdrawal revocations</p>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-full">
              <span className="px-3 py-1 bg-white text-indigo-600 text-xs font-bold rounded-full shadow-2xs">
                Monthly
              </span>
              <span className="px-3 py-1 text-slate-500 text-xs font-semibold rounded-full hover:text-slate-900 cursor-pointer">
                Weekly
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '11px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="granted"
                  name="Granted (Thousands)"
                  stroke="#4f46e5"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="withdrawn"
                  name="Withdrawn (Thousands)"
                  stroke="#9333ea"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real-time Events (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white shadow-xs flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Real-time Events</h3>
              <p className="text-xs text-slate-500">Live ledger activity stream</p>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            <div className="p-4 hover:bg-slate-50 flex gap-3.5 items-start transition-colors">
              <div className="w-2 h-2 mt-2 bg-indigo-500 rounded-full shrink-0"></div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-slate-900 truncate">New Opt-in: James R.</div>
                <div className="text-xs text-slate-500">Marketing preference updated • 2m ago</div>
              </div>
            </div>

            <div className="p-4 hover:bg-slate-50 flex gap-3.5 items-start transition-colors">
              <div className="w-2 h-2 mt-2 bg-amber-500 rounded-full shrink-0"></div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-slate-900 truncate">DSR Request #812</div>
                <div className="text-xs text-slate-500">Automatic verification pending • 14m ago</div>
              </div>
            </div>

            <div className="p-4 hover:bg-slate-50 flex gap-3.5 items-start transition-colors">
              <div className="w-2 h-2 mt-2 bg-emerald-500 rounded-full shrink-0"></div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-slate-900 truncate">Policy Notice Published</div>
                <div className="text-xs text-slate-500">Notice v2.2 statutory signed • 41m ago</div>
              </div>
            </div>

            <div className="p-4 hover:bg-slate-50 flex gap-3.5 items-start transition-colors">
              <div className="w-2 h-2 mt-2 bg-purple-500 rounded-full shrink-0"></div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-slate-900 truncate">Downstream Revocation</div>
                <div className="text-xs text-slate-500">Mixpanel processing halted • 1h ago</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('/brand/audit')}
            className="p-3.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50 border-t border-slate-100 text-center transition-colors block w-full"
          >
            View All Ledger Records →
          </button>
        </div>
      </div>

      {/* Second Row Grid: Purpose Distribution + Channel Distribution + Fast Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Purpose Breakdown Donut Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">Consents by Purpose Scope</h3>
            <p className="text-xs text-slate-500">Distribution across processing objectives</p>
          </div>

          <div className="mt-4 h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={purposeChartData}
                  cx="50%"
                  cy="45%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {purposeChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => `${(Number(val) / 1000000).toFixed(2)}M`}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '11px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '10px', bottom: 0 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Channel Bar Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Collection Channels</h3>
              <p className="text-xs text-slate-500">Web, Mobile SDK, QR and APIs</p>
            </div>
          </div>

          <div className="mt-4 h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={channelChartData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="channel" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} />
                <Tooltip
                  formatter={(val: any) => `${(Number(val) / 1000).toLocaleString()}K Consents`}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '11px'
                  }}
                />
                <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fast Action Shortcuts */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">Privacy Fast Operations</h3>
            <p className="text-xs text-slate-500">Quick shortcuts for privacy engineers</p>
          </div>

          <div className="space-y-2.5 text-xs font-semibold">
            <button
              onClick={() => onNavigate('/brand/consents/create')}
              className="w-full flex items-center justify-between rounded-xl border border-indigo-200 bg-indigo-50/70 p-3 text-indigo-950 hover:bg-indigo-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-600" />
                <span>Launch Consent Request Builder</span>
              </div>
              <ArrowRight className="h-4 w-4 text-indigo-600" />
            </button>

            <button
              onClick={() => onNavigate('/brand/purposes')}
              className="w-full flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 text-slate-800 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-slate-500" />
                <span>Register New Purpose Scope</span>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400" />
            </button>

            <button
              onClick={() => onNavigate('/brand/notices')}
              className="w-full flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 text-slate-800 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-slate-500" />
                <span>Publish Privacy Notice v2.2</span>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400" />
            </button>

            <button
              onClick={() => onNavigate('/brand/evidence')}
              className="w-full flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 text-slate-800 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Cryptographic Consent Ledger</span>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
