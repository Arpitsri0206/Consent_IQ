import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  id?: string;
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: LucideIcon;
  iconBg?: string;
  badge?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  id,
  title,
  value,
  subtitle,
  change,
  trend,
  icon: Icon,
  iconBg = 'bg-indigo-50 text-indigo-600',
  badge,
  onClick
}) => {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-all hover:border-slate-300 hover:shadow-sm ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-slate-500 font-medium mb-1">{title}</div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900">{value}</span>
            {badge && (
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                {badge}
              </span>
            )}
          </div>
        </div>
        {Icon && (
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg} shadow-2xs`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>

      {(subtitle || change) && (
        <div className="mt-3 flex items-center gap-2 border-t border-slate-100/80 pt-2.5 text-xs">
          {change && (
            <span
              className={`inline-flex items-center gap-1 font-medium ${
                trend === 'up'
                  ? 'text-emerald-600'
                  : trend === 'down'
                  ? 'text-rose-600'
                  : 'text-slate-500'
              }`}
            >
              {trend === 'up' && <TrendingUp className="h-3.5 w-3.5" />}
              {trend === 'down' && <TrendingDown className="h-3.5 w-3.5" />}
              {trend === 'neutral' && <Minus className="h-3.5 w-3.5" />}
              <span>{change}</span>
            </span>
          )}
          {subtitle && <span className="truncate text-slate-400 font-medium">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};
