import React from 'react';
import type { Scholarship, StudentProfile } from '../types/scholarship.ts';
import { StatusBadge } from './StatusBadge.tsx';
import { evaluateEligibility } from '../lib/matching.ts';
import {
  Calendar,
  IndianRupee,
  Building2,
  Bookmark,
  GitCompare,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  AlertCircle
} from 'lucide-react';

interface ScholarshipCardProps {
  scholarship: Scholarship;
  profile: StudentProfile | null;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  isComparing?: boolean;
  onToggleCompare?: (id: string) => void;
  onSelect: (id: string) => void;
}

export const ScholarshipCard: React.FC<ScholarshipCardProps> = ({
  scholarship,
  profile,
  isSaved,
  onToggleSave,
  isComparing,
  onToggleCompare,
  onSelect,
}) => {
  const eligibility = profile ? evaluateEligibility(profile, scholarship) : null;

  // Deadline calculation
  const deadlineDate = new Date(scholarship.applicationDeadline);
  const now = new Date();
  const diffDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group relative">
      {/* Top Banner / Tags */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={scholarship.status} isDemo={scholarship.isDemo} />
            {scholarship.providerType && (
              <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full capitalize">
                {scholarship.providerType.replace('_', ' ')}
              </span>
            )}
            {scholarship.genderRestriction === 'female_only' && (
              <span className="text-[11px] font-semibold text-pink-700 bg-pink-50 border border-pink-200 px-2 py-0.5 rounded-full">
                Girls Only
              </span>
            )}
          </div>

          {/* Save Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(scholarship.id);
            }}
            className={`p-2 rounded-xl transition-colors ${
              isSaved
                ? 'bg-blue-50 text-blue-600 border border-blue-200'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
            title={isSaved ? 'Remove from saved' : 'Save scholarship'}
            aria-label={`Save ${scholarship.name}`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-blue-600' : ''}`} />
          </button>
        </div>

        {/* Title & Provider */}
        <button
          onClick={() => onSelect(scholarship.id)}
          className="text-left w-full focus:outline-none group-hover:text-blue-600 transition-colors"
        >
          <h3 className="font-bold text-slate-900 text-base sm:text-lg leading-snug line-clamp-2">
            {scholarship.name}
          </h3>
        </button>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1.5 font-medium">
          <Building2 className="w-3.5 h-3.5 shrink-0 text-slate-400" />
          <span className="truncate">{scholarship.provider}</span>
        </div>

        {/* Award Highlight */}
        <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
              Scholarship Award
            </div>
            <div className="text-base font-extrabold text-blue-700 flex items-center gap-1">
              <span>{scholarship.awardFormatted}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
              Deadline
            </div>
            <div className={`text-xs font-bold flex items-center gap-1 justify-end ${
              diffDays <= 7 && diffDays >= 0 ? 'text-rose-600' : 'text-slate-700'
            }`}>
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {scholarship.applicationDeadline ? scholarship.applicationDeadline : 'TBD'}
              </span>
            </div>
          </div>
        </div>

        {/* Key Eligibility Summary Chips */}
        <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] text-slate-600">
          <span className="bg-slate-100 px-2 py-0.5 rounded-md font-medium">
            Levels: {scholarship.educationLevels.slice(0, 2).join(', ')}
            {scholarship.educationLevels.length > 2 ? ` +${scholarship.educationLevels.length - 2}` : ''}
          </span>
          {scholarship.maxAnnualFamilyIncome && (
            <span className="bg-slate-100 px-2 py-0.5 rounded-md font-medium">
              Income &lt; ₹{(scholarship.maxAnnualFamilyIncome / 100000).toFixed(1)}L
            </span>
          )}
          {scholarship.minMarksPercentage && (
            <span className="bg-slate-100 px-2 py-0.5 rounded-md font-medium">
              Marks &ge; {scholarship.minMarksPercentage}%
            </span>
          )}
        </div>

        {/* Explainable Match Indicator */}
        {eligibility && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              {eligibility.overallCategory === 'eligible' && (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-emerald-700">Strong Match ({eligibility.relevanceScore}%)</span>
                </>
              )}
              {eligibility.overallCategory === 'potential_match' && (
                <>
                  <HelpCircle className="w-4 h-4 text-sky-600" />
                  <span className="font-semibold text-sky-700">Potential Match ({eligibility.relevanceScore}%)</span>
                </>
              )}
              {eligibility.overallCategory === 'additional_info_needed' && (
                <>
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span className="font-medium text-amber-700">Needs Profile Confirmation</span>
                </>
              )}
              {eligibility.overallCategory === 'not_eligible' && (
                <>
                  <AlertCircle className="w-4 h-4 text-slate-400" />
                  <span className="font-medium text-slate-500">Unmet Criteria</span>
                </>
              )}
            </div>
            <span className="text-[10px] text-slate-400 font-medium">
              {eligibility.whatMatches.length} matched
            </span>
          </div>
        )}
      </div>

      {/* Card Footer Actions */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
        {onToggleCompare && (
          <button
            onClick={() => onToggleCompare(scholarship.id)}
            className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-colors ${
              isComparing
                ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>{isComparing ? 'Comparing' : 'Compare'}</span>
          </button>
        )}

        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => onSelect(scholarship.id)}
            className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm hover:shadow transition-all"
          >
            <span>Eligibility & Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
