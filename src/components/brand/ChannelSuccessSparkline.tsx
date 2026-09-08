import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  YAxis,
  XAxis,
} from 'recharts';
import { TrendingUp, TrendingDown, CheckCircle2, BarChart2, Activity } from 'lucide-react';

export interface DailyMessageSuccessPoint {
  day: string; // e.g., 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'
  date: string; // e.g., 'Sep 01', 'Sep 02'
  successRate: number; // e.g., 99.8 (percentage)
  totalSent: number; // e.g., 8420
  delivered: number;
  failed: number;
}

export interface ChannelSuccessSparklineProps {
  channelId: string;
  channelName: string;
  dailyData: DailyMessageSuccessPoint[];
  color: {
    stroke: string;
    fillGradient: string;
    badgeBg: string;
    badgeText: string;
    text: string;
  };
  compact?: boolean;
}

export const ChannelSuccessSparkline: React.FC<ChannelSuccessSparklineProps> = ({
  channelId,
  channelName,
  dailyData,
  color,
  compact = false,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<DailyMessageSuccessPoint | null>(null);

  if (!dailyData || dailyData.length === 0) {
    return null;
  }

  // Calculate 7-day stats
  const totalSent7D = dailyData.reduce((sum, d) => sum + d.totalSent, 0);
  const totalDelivered7D = dailyData.reduce((sum, d) => sum + d.delivered, 0);
  const avgSuccessRate = Number(
    ((totalDelivered7D / Math.max(1, totalSent7D)) * 100).toFixed(1)
  );

  // Compare first 3 days vs last 4 days for trend
  const firstHalf = dailyData.slice(0, 3);
  const secondHalf = dailyData.slice(3);
  const firstAvg = firstHalf.reduce((s, d) => s + d.successRate, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((s, d) => s + d.successRate, 0) / secondHalf.length;
  const trendDiff = Number((secondAvg - firstAvg).toFixed(2));

  const minRate = Math.min(...dailyData.map((d) => d.successRate));
  const maxRate = Math.max(...dailyData.map((d) => d.successRate));

  // Determine Y-axis domain padding
  const yDomainMin = Math.max(80, Math.floor(minRate - 1));
  const yDomainMax = Math.min(100, Math.ceil(maxRate + 0.5));

  const gradientId = `sparklineGradient-${channelId.replace(/\s+/g, '-')}`;

  // Custom hover tooltip
  const CustomSparklineTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: DailyMessageSuccessPoint = payload[0].payload;
      return (
        <div className="rounded-lg border border-slate-700 bg-slate-950 p-2 shadow-xl text-[11px] text-white min-w-[140px] font-sans pointer-events-none z-30">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1 mb-1 font-mono">
            <span className="font-bold text-slate-200">
              {data.day} ({data.date})
            </span>
            <span className="text-[10px] text-slate-400">7D Trace</span>
          </div>
          <div className="space-y-1 font-mono text-[10px]">
            <div className="flex items-center justify-between gap-2">
              <span className="text-slate-400">Success Rate:</span>
              <span className="font-bold text-emerald-400 text-[11px]">
                {data.successRate.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-slate-400">Delivered:</span>
              <span className="text-slate-200">{data.delivered.toLocaleString()}</span>
            </div>
            {data.failed > 0 && (
              <div className="flex items-center justify-between gap-2 text-rose-400">
                <span>Failed/Drop:</span>
                <span>{data.failed.toLocaleString()}</span>
              </div>
            )}
            <div className="flex items-center justify-between gap-2 pt-0.5 border-t border-slate-800/80 text-slate-400">
              <span>Total Volume:</span>
              <span className="text-slate-300">{data.totalSent.toLocaleString()}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-xl bg-white/95 p-3 border border-slate-200/80 shadow-2xs space-y-2">
      {/* Sparkline Title & 7D Summary Header */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
          <Activity className="h-3.5 w-3.5 text-slate-500" />
          <span className="text-[11px]">7-Day Message Success</span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Trend arrow */}
          <span
            className={`inline-flex items-center gap-0.5 text-[10px] font-mono font-bold ${
              trendDiff > 0
                ? 'text-emerald-700'
                : trendDiff < 0
                ? 'text-rose-600'
                : 'text-slate-600'
            }`}
            title={`7-day trend: ${trendDiff > 0 ? `+${trendDiff}%` : `${trendDiff}%`}`}
          >
            {trendDiff > 0 ? (
              <TrendingUp className="h-3 w-3 text-emerald-600" />
            ) : trendDiff < 0 ? (
              <TrendingDown className="h-3 w-3 text-rose-500" />
            ) : null}
            <span>{trendDiff > 0 ? `+${trendDiff}%` : trendDiff < 0 ? `${trendDiff}%` : '±0.0%'}</span>
          </span>

          {/* 7D Average Pill */}
          <span
            className={`rounded-md px-1.5 py-0.5 text-[10px] font-mono font-extrabold ${color.badgeBg} ${color.badgeText}`}
            title="7-Day Weighted Success Rate"
          >
            {avgSuccessRate}% Avg
          </span>
        </div>
      </div>

      {/* Sparkline Visual Graph */}
      <div className="relative h-12 w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={dailyData}
            margin={{ top: 2, right: 2, left: 2, bottom: 0 }}
            onMouseMove={(state: any) => {
              if (state && state.activePayload && state.activePayload.length) {
                setHoveredPoint(state.activePayload[0].payload);
              }
            }}
            onMouseLeave={() => setHoveredPoint(null)}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color.stroke} stopOpacity={0.45} />
                <stop offset="95%" stopColor={color.stroke} stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <YAxis domain={[yDomainMin, yDomainMax]} hide />
            <XAxis dataKey="day" hide />

            <Tooltip
              content={<CustomSparklineTooltip />}
              cursor={{
                stroke: '#94a3b8',
                strokeWidth: 1,
                strokeDasharray: '2 2',
              }}
            />

            <Area
              type="monotone"
              dataKey="successRate"
              stroke={color.stroke}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              dot={{
                r: 2.5,
                stroke: color.stroke,
                strokeWidth: 1.5,
                fill: '#ffffff',
              }}
              activeDot={{
                r: 4.5,
                stroke: '#0f172a',
                strokeWidth: 1.5,
                fill: color.stroke,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* 7-Day Ticks & Volume Summary Row */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-1.5 text-[10px] text-slate-500 font-mono">
        {/* Day Tick Badges */}
        <div className="flex items-center gap-1">
          {dailyData.map((pt, idx) => (
            <span
              key={pt.day + idx}
              className={`rounded px-1 py-0.2 text-[9px] font-medium transition-colors ${
                pt.day === 'Today' || idx === dailyData.length - 1
                  ? 'bg-slate-200 text-slate-800 font-bold'
                  : 'text-slate-400'
              }`}
              title={`${pt.day} (${pt.date}): ${pt.successRate}% (${pt.totalSent.toLocaleString()} sent)`}
            >
              {pt.day.charAt(0)}
            </span>
          ))}
        </div>

        {/* 7D Volume & Range */}
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
          <span>
            {totalSent7D >= 1000 ? `${(totalSent7D / 1000).toFixed(1)}k` : totalSent7D} msgs
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-emerald-700 font-bold">{minRate}%-{maxRate}%</span>
        </div>
      </div>
    </div>
  );
};
