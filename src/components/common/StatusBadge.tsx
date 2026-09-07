import React from 'react';
import { ConsentStatus, RequestStatus } from '../../types';

interface StatusBadgeProps {
  status: ConsentStatus | RequestStatus | 'ACTIVE' | 'SUPERSEDED' | 'DRAFT' | 'DELIVERED' | 'FAILED' | 'HALTED' | 'SUCCESS';
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-medium',
    md: 'px-2.5 py-1 text-xs font-semibold',
    lg: 'px-3 py-1.5 text-sm font-semibold'
  };

  const getStyle = () => {
    switch (status) {
      case 'GRANTED':
      case 'ACTIVE':
      case 'RESOLVED':
      case 'PUBLISHED':
      case 'DELIVERED':
      case 'SUCCESS':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-600/10';

      case 'REQUESTED':
      case 'SUBMITTED':
      case 'UNDER_REVIEW':
      case 'PENDING_REVIEW':
        return 'bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-600/10';

      case 'WITHDRAWN':
      case 'HALTED':
        return 'bg-purple-50 text-purple-700 border-purple-200 ring-1 ring-purple-600/10';

      case 'EXPIRED':
      case 'SUPERSEDED':
      case 'DRAFT':
        return 'bg-slate-100 text-slate-700 border-slate-200 ring-1 ring-slate-400/10';

      case 'DENIED':
      case 'REJECTED':
      case 'FAILED':
      case 'SUSPENDED':
        return 'bg-rose-50 text-rose-700 border-rose-200 ring-1 ring-rose-600/10';

      case 'ACTION_REQUIRED':
        return 'bg-orange-50 text-orange-700 border-orange-200 ring-1 ring-orange-600/10';

      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getDotColor = () => {
    switch (status) {
      case 'GRANTED':
      case 'ACTIVE':
      case 'RESOLVED':
      case 'PUBLISHED':
      case 'DELIVERED':
      case 'SUCCESS':
        return 'bg-emerald-500';
      case 'REQUESTED':
      case 'SUBMITTED':
      case 'UNDER_REVIEW':
        return 'bg-amber-500 animate-pulse';
      case 'WITHDRAWN':
      case 'HALTED':
        return 'bg-purple-500';
      case 'DENIED':
      case 'REJECTED':
      case 'FAILED':
        return 'bg-rose-500';
      default:
        return 'bg-slate-400';
    }
  };

  const formatText = () => {
    switch (status) {
      case 'GRANTED': return 'Active (Granted)';
      case 'REQUESTED': return 'Pending Action';
      case 'UNDER_REVIEW': return 'Under Review';
      case 'ACTION_REQUIRED': return 'Action Needed';
      case 'WITHDRAWN': return 'Withdrawn';
      case 'SUPERSEDED': return 'Archived (vOld)';
      default: return status.replace(/_/g, ' ');
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${getStyle()} ${sizeClasses[size]} whitespace-nowrap`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${getDotColor()}`} />
      <span>{formatText()}</span>
    </span>
  );
};
