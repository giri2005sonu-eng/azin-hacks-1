import React from 'react';
import type { ScholarshipStatus } from '../types/scholarship.ts';
import { CheckCircle2, Clock, AlertTriangle, XCircle, Sparkles } from 'lucide-react';

interface StatusBadgeProps {
  status: ScholarshipStatus;
  isDemo?: boolean;
  className?: string;
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  isDemo,
  className = '',
  showIcon = true,
}) => {
  if (isDemo) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200 ${className}`}>
        {showIcon && <Sparkles className="w-3.5 h-3.5" />}
        DEMO DATA
      </span>
    );
  }

  switch (status) {
    case 'verified_open':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 ${className}`}>
          {showIcon && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
          Verified Open
        </span>
      );
    case 'upcoming':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200 ${className}`}>
          {showIcon && <Clock className="w-3.5 h-3.5 text-sky-600" />}
          Upcoming
        </span>
      );
    case 'verification_required':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 ${className}`}>
          {showIcon && <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}
          Verification Required
        </span>
      );
    case 'closed':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 ${className}`}>
          {showIcon && <XCircle className="w-3.5 h-3.5 text-slate-500" />}
          Closed
        </span>
      );
    default:
      return null;
  }
};
