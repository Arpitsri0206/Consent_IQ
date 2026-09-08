import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../services/store';
import { clientCache } from '../../services/cache';
import { generateConsentTrendPDF } from '../../utils/pdfReportGenerator';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Percent,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Filter,
  ArrowUpRight,
  Info,
  Layers,
  Sparkles,
  ChevronDown,
  FileSpreadsheet,
  FileText,
  Zap,
  RefreshCw,
  Loader2
} from 'lucide-react';

export type TimeRange = '7D' | '14D' | '30D' | '90D';
export type ChannelFilter = 'ALL' | 'WEB' | 'MOBILE' | 'QR' | 'API';

interface DailyDataPoint {
  date: string;
  formattedDate: string;
  dayOfWeek: string;
  requests: number;
  granted: number;
  denied: number;
  withdrawn: number;
  approvalRate: number; // percentage (0 - 100)
  withdrawalRate: number; // percentage of active base
  netGrowth: number;
}

// Generate high fidelity realistic daily records for the last 90 days leading to Sep 2026
function generateDailyAnalytics(): DailyDataPoint[] {
  const result: DailyDataPoint[] = [];
  const baseDate = new Date(2026, 8, 7); // 7 Sep 2026

  for (let i = 89; i >= 0; i--) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - i);

    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    const dayFactor = isWeekend ? 0.68 : 1.0;
    
    // Seasonal marketing push mid-August and late August
    const campaignBoost = (i >= 10 && i <= 18) ? 1.45 : (i >= 40 && i <= 46) ? 1.3 : 1.0;

    const baseRequests = Math.round((1400 + Math.sin(i * 0.4) * 260 + (90 - i) * 6) * dayFactor * campaignBoost);
    const rateNoise = (Math.sin(i * 0.7) * 4.2) + (Math.cos(i * 0.3) * 2.1);
    const approvalRate = Math.min(94.5, Math.max(76.2, Number((83.5 + rateNoise).toFixed(1))));
    
    const granted = Math.round(baseRequests * (approvalRate / 100));
    const denied = Math.round(baseRequests * 0.08 + Math.random() * 20);
    const withdrawn = Math.round(Math.max(12, (38 + Math.cos(i * 0.5) * 14 - (isWeekend ? 10 : 0))));
    const withdrawalRate = Number(((withdrawn / granted) * 100).toFixed(2));
    const netGrowth = granted - withdrawn;

    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const monthShort = d.toLocaleDateString('en-US', { month: 'short' });
    const dayNum = d.getDate();

    result.push({
      date: d.toISOString().split('T')[0],
      formattedDate: `${dayNum} ${monthShort}`,
      dayOfWeek: dayName,
      requests: baseRequests,
      granted,
      denied,
      withdrawn,
      approvalRate,
      withdrawalRate,
      netGrowth,
    });
  }

  return result;
}

const ALL_DAILY_DATA = generateDailyAnalytics();

export const DailyConsentApprovalRatesWidget: React.FC = () => {
  const { organizations } = useApp();
  const [timeRange, setTimeRange] = useState<TimeRange>('14D');
  const [channel, setChannel] = useState<ChannelFilter>('ALL');
  const [chartViewMode, setChartViewMode] = useState<'COMBINED' | 'RATES_ONLY' | 'VOLUMES_ONLY'>('COMBINED');
  const [benchmarkTarget, setBenchmarkTarget] = useState<number>(80);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [isExportingPDF, setIsExportingPDF] = useState<boolean>(false);

  const brandOrg = organizations.find(o => o.id === 'org_apex') || organizations[0] || {
    name: 'Apex Retail Banking',
    adminName: 'Rohan Sharma',
    industry: 'Financial Services & Digital Lending',
  };

  const cacheKey = `chart_daily_rates_${timeRange}_${channel}`;
  const isCachedHit = clientCache.has(cacheKey);

  // Filter based on selected timeframe with client-side cache
  const filteredData = useMemo(() => {
    // Check client cache first
    const cached = clientCache.get<DailyDataPoint[]>(cacheKey);
    if (cached) {
      return cached;
    }

    let days = 14;
    if (timeRange === '7D') days = 7;
    if (timeRange === '14D') days = 14;
    if (timeRange === '30D') days = 30;
    if (timeRange === '90D') days = 90;

    const slice = ALL_DAILY_DATA.slice(-days);

    // Channel weighting multiplier
    const channelMultiplier =
      channel === 'WEB' ? 0.45 :
      channel === 'MOBILE' ? 0.38 :
      channel === 'QR' ? 0.11 :
      channel === 'API' ? 0.06 : 1.0;

    const computed = channel === 'ALL'
      ? slice
      : slice.map(item => {
          const g = Math.round(item.granted * channelMultiplier);
          const w = Math.round(item.withdrawn * channelMultiplier);
          const req = Math.round(item.requests * channelMultiplier);
          const rate = Number(((g / Math.max(1, req)) * 100).toFixed(1));
          return {
            ...item,
            requests: req,
            granted: g,
            withdrawn: w,
            netGrowth: g - w,
            approvalRate: Math.min(98, Math.max(68, rate)),
            withdrawalRate: Number(((w / Math.max(1, g)) * 100).toFixed(2)),
          };
        });

    // Store in client cache with 5-minute TTL
    clientCache.set(cacheKey, computed, 5 * 60 * 1000);
    return computed;
  }, [timeRange, channel, refreshKey, cacheKey]);

  const handleForceRefresh = () => {
    clientCache.invalidate(cacheKey);
    setRefreshKey(prev => prev + 1);
  };

  // Aggregate Metrics for selected timeframe
  const summaryMetrics = useMemo(() => {
    if (filteredData.length === 0) return {
      avgApprovalRate: 0,
      totalGranted: 0,
      totalWithdrawn: 0,
      totalRequests: 0,
      avgDailyNetGrowth: 0,
      approvalTrendDiff: 0,
      withdrawalTrendDiff: 0,
      peakApprovalDay: '-',
      lowestApprovalDay: '-',
    };

    const totalRequests = filteredData.reduce((acc, curr) => acc + curr.requests, 0);
    const totalGranted = filteredData.reduce((acc, curr) => acc + curr.granted, 0);
    const totalWithdrawn = filteredData.reduce((acc, curr) => acc + curr.withdrawn, 0);
    const avgApprovalRate = Number(((totalGranted / Math.max(1, totalRequests)) * 100).toFixed(1));
    const avgDailyNetGrowth = Math.round((totalGranted - totalWithdrawn) / filteredData.length);

    // Trend comparisons: First half vs Second half
    const half = Math.floor(filteredData.length / 2);
    const firstHalf = filteredData.slice(0, half);
    const secondHalf = filteredData.slice(half);

    const firstHalfAvgRate = firstHalf.length > 0
      ? firstHalf.reduce((a, b) => a + b.approvalRate, 0) / firstHalf.length
      : avgApprovalRate;
    const secondHalfAvgRate = secondHalf.length > 0
      ? secondHalf.reduce((a, b) => a + b.approvalRate, 0) / secondHalf.length
      : avgApprovalRate;
    const approvalTrendDiff = Number((secondHalfAvgRate - firstHalfAvgRate).toFixed(1));

    const firstHalfWithdrawn = firstHalf.reduce((a, b) => a + b.withdrawn, 0);
    const secondHalfWithdrawn = secondHalf.reduce((a, b) => a + b.withdrawn, 0);
    const withdrawalTrendDiff = Number(
      (((secondHalfWithdrawn - firstHalfWithdrawn) / Math.max(1, firstHalfWithdrawn)) * 100).toFixed(1)
    );

    // Extremes
    const sortedByApproval = [...filteredData].sort((a, b) => b.approvalRate - a.approvalRate);
    const peakApprovalDay = `${sortedByApproval[0].formattedDate} (${sortedByApproval[0].approvalRate}%)`;
    const lowestApprovalDay = `${sortedByApproval[sortedByApproval.length - 1].formattedDate} (${sortedByApproval[sortedByApproval.length - 1].approvalRate}%)`;

    return {
      avgApprovalRate,
      totalGranted,
      totalWithdrawn,
      totalRequests,
      avgDailyNetGrowth,
      approvalTrendDiff,
      withdrawalTrendDiff,
      peakApprovalDay,
      lowestApprovalDay,
    };
  }, [filteredData]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Date', 'Day', 'Consent Requests', 'Approved Grants', 'User Withdrawals', 'Approval Rate (%)', 'Withdrawal Churn (%)', 'Net Daily Growth'];
    const rows = filteredData.map(d => [
      d.date,
      d.dayOfWeek,
      d.requests,
      d.granted,
      d.withdrawn,
      `${d.approvalRate}%`,
      `${d.withdrawalRate}%`,
      d.netGrowth
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ConsentIQ_Approval_Withdrawal_Rates_${timeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Formatted PDF Report
  const handleExportPDF = async () => {
    setIsExportingPDF(true);
    try {
      generateConsentTrendPDF({
        brandName: brandOrg.name,
        adminName: brandOrg.adminName || 'Chief Privacy Officer',
        industry: brandOrg.industry || 'Enterprise Data Fiduciary',
        timeRange,
        channel,
        benchmarkTarget,
        summary: summaryMetrics,
        dailyRecords: filteredData,
      });
    } catch (err) {
      console.error('Failed to generate PDF report:', err);
    } finally {
      setIsExportingPDF(false);
    }
  };

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data: DailyDataPoint = payload[0].payload;
      return (
        <div className="rounded-xl border border-slate-700/80 bg-slate-950 p-3.5 shadow-2xl text-xs text-white min-w-[220px] font-sans">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <span className="font-bold text-slate-200">
              {data.formattedDate} ({data.dayOfWeek})
            </span>
            <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-indigo-300">
              DPDP Engine
            </span>
          </div>

          <div className="space-y-1.5 font-mono text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-emerald-400 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                Approval Rate:
              </span>
              <span className="font-bold text-emerald-300 text-xs">{data.approvalRate}%</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-indigo-400 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-indigo-400"></span>
                Granted Approvals:
              </span>
              <span className="font-semibold text-slate-200">{data.granted.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-purple-400 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-purple-400"></span>
                User Withdrawals:
              </span>
              <span className="font-semibold text-purple-300">{data.withdrawn.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-slate-500"></span>
                Total Requests:
              </span>
              <span className="text-slate-300">{data.requests.toLocaleString()}</span>
            </div>

            <div className="pt-2 mt-1 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
              <span className="text-slate-400">Net Consent Intake:</span>
              <span className={`font-bold ${data.netGrowth >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {data.netGrowth >= 0 ? `+${data.netGrowth.toLocaleString()}` : data.netGrowth.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header & Controls Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Percent className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Daily Consent Approval Rates & Withdrawal Trends</span>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200/60 font-mono">
                  Live Recharts Visualizer
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Granular daily telemetry tracking consent opt-in velocity, statutory withdrawals, and net conversion ratios.
              </p>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Cache Status Badge */}
          <div
            title="Client-side memory cache active (5m TTL). Prevents redundant API re-fetches when switching admin views."
            className={`inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1 text-[11px] font-medium transition-colors ${
              isCachedHit
                ? 'border-indigo-200 bg-indigo-50/80 text-indigo-700'
                : 'border-emerald-200 bg-emerald-50/80 text-emerald-700'
            }`}
          >
            <Zap className={`h-3 w-3 ${isCachedHit ? 'text-indigo-600' : 'text-emerald-600'}`} />
            <span className="font-mono font-bold">
              {isCachedHit ? '⚡ Cached (0ms)' : 'Synced'}
            </span>
          </div>

          {/* Quick Cache Refresh Button */}
          <button
            onClick={handleForceRefresh}
            title="Invalidate cache and refresh telemetry data"
            className="rounded-xl border border-slate-200 bg-white p-1.5 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors shadow-2xs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>

          {/* Channel Select */}
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1 text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 hidden sm:inline">
              Channel:
            </span>
            {(['ALL', 'WEB', 'MOBILE', 'QR', 'API'] as ChannelFilter[]).map(ch => (
              <button
                key={ch}
                onClick={() => setChannel(ch)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                  channel === ch
                    ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {ch === 'ALL' ? 'All Channels' : ch}
              </button>
            ))}
          </div>

          {/* Timeframe Select */}
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1 text-xs">
            {(['7D', '14D', '30D', '90D'] as TimeRange[]).map(t => (
              <button
                key={t}
                onClick={() => setTimeRange(t)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                  timeRange === t
                    ? 'bg-indigo-600 text-white shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            title="Export CSV Dataset"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
            <span className="hidden sm:inline">CSV</span>
          </button>

          {/* Export PDF Report Button */}
          <button
            onClick={handleExportPDF}
            disabled={isExportingPDF}
            title="Export DPDP Section 6 Compliant PDF Telemetry Report"
            className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 shadow-2xs hover:bg-indigo-100/80 transition-colors disabled:opacity-50"
          >
            {isExportingPDF ? (
              <Loader2 className="h-3.5 w-3.5 text-indigo-600 animate-spin" />
            ) : (
              <FileText className="h-3.5 w-3.5 text-indigo-600" />
            )}
            <span>Export PDF Report</span>
          </button>
        </div>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Avg Approval Rate */}
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 sm:p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold">Approval Rate (Avg)</span>
            <span className={`inline-flex items-center gap-0.5 text-[11px] font-bold ${
              summaryMetrics.approvalTrendDiff >= 0 ? 'text-emerald-600' : 'text-rose-600'
            }`}>
              {summaryMetrics.approvalTrendDiff >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {summaryMetrics.approvalTrendDiff >= 0 ? `+${summaryMetrics.approvalTrendDiff}%` : `${summaryMetrics.approvalTrendDiff}%`}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">
              {summaryMetrics.avgApprovalRate}%
            </span>
            <span className="text-[10px] text-slate-400">Target: ≥{benchmarkTarget}%</span>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                summaryMetrics.avgApprovalRate >= benchmarkTarget ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min(100, summaryMetrics.avgApprovalRate)}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Total Granted Volume */}
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 sm:p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold">Granted Consents</span>
            <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded">
              {timeRange} Total
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-indigo-950 font-mono tracking-tight">
              {summaryMetrics.totalGranted.toLocaleString()}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 truncate">
            from {summaryMetrics.totalRequests.toLocaleString()} prompts
          </p>
        </div>

        {/* Metric 3: User Withdrawals */}
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 sm:p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold">Revocations / Withdrawals</span>
            <span className={`inline-flex items-center gap-0.5 text-[11px] font-bold ${
              summaryMetrics.withdrawalTrendDiff <= 0 ? 'text-emerald-600' : 'text-amber-600'
            }`}>
              {summaryMetrics.withdrawalTrendDiff <= 0 ? '↓ Stabilizing' : '↑ Spiking'}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-purple-950 font-mono tracking-tight">
              {summaryMetrics.totalWithdrawn.toLocaleString()}
            </span>
            <span className="text-[10px] text-purple-600 font-mono">
              ({((summaryMetrics.totalWithdrawn / Math.max(1, summaryMetrics.totalGranted)) * 100).toFixed(1)}% churn)
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Downstream pipeline halted</p>
        </div>

        {/* Metric 4: Net Velocity */}
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 sm:p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold">Daily Net Inflow</span>
            <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
              Avg / Day
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-800 font-mono tracking-tight">
              +{summaryMetrics.avgDailyNetGrowth.toLocaleString()}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 truncate">
            Peak: {summaryMetrics.peakApprovalDay}
          </p>
        </div>
      </div>

      {/* Primary Interactive Chart Area */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-4 text-slate-600 font-medium">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-xs bg-indigo-500/80"></span>
              <span>Daily Granted Grants (Volume)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-xs bg-purple-400"></span>
              <span>Daily Withdrawals</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-4 bg-emerald-500 rounded-full"></span>
              <span className="font-bold text-emerald-700">Approval Rate % (Right Axis)</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">Benchmark line:</span>
            <select
              value={benchmarkTarget}
              onChange={e => setBenchmarkTarget(Number(e.target.value))}
              className="rounded-lg border border-slate-200 bg-white py-1 px-2 text-[11px] font-bold text-slate-700 focus:outline-hidden"
            >
              <option value={75}>75% Standard</option>
              <option value={80}>80% BFSI Target</option>
              <option value={85}>85% High Trust</option>
              <option value={90}>90% Exceptional</option>
            </select>
          </div>
        </div>

        {/* Recharts Dual-Axis Visualization */}
        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={filteredData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="grantedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="withdrawnGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0.3} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />

              {/* X Axis: Formatted Dates */}
              <XAxis
                dataKey="formattedDate"
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
              />

              {/* Left Y Axis: Daily Volume (Bar / Area) */}
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 10, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val: number) => val >= 1000 ? `${(val / 1000).toFixed(1)}k` : `${val}`}
              />

              {/* Right Y Axis: Percentage Rate (0 - 100%) */}
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[50, 100]}
                tick={{ fontSize: 10, fill: '#059669' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val: number) => `${val}%`}
              />

              <Tooltip content={<CustomTooltip />} />

              {/* Statutory Target Reference Line */}
              <ReferenceLine
                yAxisId="right"
                y={benchmarkTarget}
                stroke="#10b981"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: `Benchmark (${benchmarkTarget}%)`,
                  position: 'insideTopRight',
                  fill: '#059669',
                  fontSize: 10,
                  fontWeight: 600,
                }}
              />

              {/* Daily Granted Bar */}
              <Bar
                yAxisId="left"
                dataKey="granted"
                name="Approvals (Granted)"
                fill="url(#grantedGradient)"
                radius={[4, 4, 0, 0]}
                maxBarSize={timeRange === '90D' ? 6 : timeRange === '30D' ? 14 : 26}
              />

              {/* Daily Withdrawn Bar */}
              <Bar
                yAxisId="left"
                dataKey="withdrawn"
                name="Withdrawals"
                fill="url(#withdrawnGradient)"
                radius={[4, 4, 0, 0]}
                maxBarSize={timeRange === '90D' ? 6 : timeRange === '30D' ? 14 : 26}
              />

              {/* Approval Rate % Line (Smooth Monotone) */}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="approvalRate"
                name="Approval Rate %"
                stroke="#10b981"
                strokeWidth={3}
                dot={timeRange === '7D' || timeRange === '14D' ? { r: 3.5, stroke: '#059669', strokeWidth: 2, fill: '#ffffff' } : false}
                activeDot={{ r: 6, stroke: '#059669', strokeWidth: 2, fill: '#10b981' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Widget Footer: Statutory DPDP Insights Bar */}
      <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-indigo-600 shrink-0" />
          <span>
            <strong className="text-slate-800">DPDP Act Section 6(1) & 6(7) Telemetry:</strong> Consent revocation requests are verified and pushed downstream to SDK hooks with a latency under 120ms.
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0 font-mono text-[11px]">
          <span className="text-slate-400">Net Conversion:</span>
          <span className="font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
            +{((summaryMetrics.totalGranted - summaryMetrics.totalWithdrawn) / Math.max(1, summaryMetrics.totalRequests) * 100).toFixed(1)}% Yield
          </span>
        </div>
      </div>
    </div>
  );
};
