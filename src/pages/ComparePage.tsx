import React from 'react';
import type { Scholarship, StudentProfile } from '../types/scholarship.ts';
import { StatusBadge } from '../components/StatusBadge.tsx';
import { validateOfficialDestination } from '../lib/tinyfish-normalizer.ts';
import {
  GitCompare,
  X,
  Plus,
  ExternalLink,
  CheckCircle2,
  Calendar,
  IndianRupee,
  Building2,
  FileCheck2,
  ArrowRight
} from 'lucide-react';

interface ComparePageProps {
  comparingIds: string[];
  scholarships: Scholarship[];
  onRemoveCompare: (id: string) => void;
  onClearCompare: () => void;
  navigate: (path: string) => void;
}

export const ComparePage: React.FC<ComparePageProps> = ({
  comparingIds,
  scholarships,
  onRemoveCompare,
  onClearCompare,
  navigate,
}) => {
  const compareItems = scholarships.filter(s => comparingIds.includes(s.id));

  const handleApply = (url: string) => {
    const check = validateOfficialDestination(url);
    if (check.isValid) {
      window.open(check.sanitizedUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (compareItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 py-16 px-4">
        <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
            <GitCompare className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">No Scholarships Selected for Comparison</h2>
          <p className="text-xs text-slate-500">
            Compare up to 4 scholarships side-by-side on eligibility criteria, stipend amounts, and required certificates.
          </p>
          <button
            onClick={() => navigate('/scholarships')}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors"
          >
            Browse & Select Scholarships
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
              <GitCompare className="w-4 h-4" />
              <span>Multi-Scheme Analytical Matrix</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Compare Scholarships Side-by-Side
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Evaluating {compareItems.length} schemes across award amounts, minimum marks cutoffs, and state quotas.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClearCompare}
              className="px-3 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-100"
            >
              Clear All
            </button>
            <button
              onClick={() => navigate('/scholarships')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add More (Max 4)</span>
            </button>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80">
                <th className="p-4 font-bold text-slate-600 w-48 shrink-0">Criteria / Attribute</th>
                {compareItems.map((s) => (
                  <th key={s.id} className="p-4 font-bold text-slate-900 min-w-[240px] max-w-[280px]">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <StatusBadge status={s.status} isDemo={s.isDemo} />
                      <button
                        onClick={() => onRemoveCompare(s.id)}
                        className="text-slate-400 hover:text-rose-600"
                        title="Remove from comparison"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="font-extrabold text-sm text-slate-900 line-clamp-2">
                      {s.name}
                    </div>
                    <div className="text-[11px] font-normal text-slate-500 truncate mt-0.5">
                      {s.provider}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Award Amount */}
              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50/40">Financial Award</td>
                {compareItems.map(s => (
                  <td key={s.id} className="p-4 font-black text-blue-700 text-sm">
                    {s.awardFormatted}
                  </td>
                ))}
              </tr>

              {/* Application Deadline */}
              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50/40">Application Deadline</td>
                {compareItems.map(s => (
                  <td key={s.id} className="p-4 font-semibold text-slate-800">
                    {s.applicationDeadline || 'Not specified in notice'}
                  </td>
                ))}
              </tr>

              {/* Education Levels */}
              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50/40">Eligible Academic Levels</td>
                {compareItems.map(s => (
                  <td key={s.id} className="p-4 text-slate-700">
                    {s.educationLevels.join(', ')}
                  </td>
                ))}
              </tr>

              {/* Family Income Limit */}
              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50/40">Family Income Ceiling</td>
                {compareItems.map(s => (
                  <td key={s.id} className="p-4 text-slate-700 font-medium">
                    {s.maxAnnualFamilyIncome ? `≤ ₹${s.maxAnnualFamilyIncome.toLocaleString('en-IN')}` : 'No ceiling enforced'}
                  </td>
                ))}
              </tr>

              {/* Min Marks Cutoff */}
              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50/40">Minimum Academic Marks</td>
                {compareItems.map(s => (
                  <td key={s.id} className="p-4 text-slate-700 font-medium">
                    {s.minMarksPercentage ? `≥ ${s.minMarksPercentage}% qualifying` : 'No cutoff specified'}
                  </td>
                ))}
              </tr>

              {/* Social Categories */}
              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50/40">Reservation / Category</td>
                {compareItems.map(s => (
                  <td key={s.id} className="p-4 text-slate-700">
                    {s.applicableCategories.join(', ')}
                  </td>
                ))}
              </tr>

              {/* Domicile Restrictions */}
              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50/40">Domicile / State</td>
                {compareItems.map(s => (
                  <td key={s.id} className="p-4 text-slate-700">
                    {s.domicileStates.join(', ')}
                  </td>
                ))}
              </tr>

              {/* Required Documents */}
              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50/40">Mandatory Certificates</td>
                {compareItems.map(s => (
                  <td key={s.id} className="p-4 text-[11px] text-slate-600">
                    <ul className="list-disc list-inside space-y-1">
                      {s.requiredDocuments.slice(0, 3).map((doc, idx) => (
                        <li key={idx} className="line-clamp-1">{doc}</li>
                      ))}
                      {s.requiredDocuments.length > 3 && (
                        <li className="text-blue-600 font-semibold">+{s.requiredDocuments.length - 3} more</li>
                      )}
                    </ul>
                  </td>
                ))}
              </tr>

              {/* Verification & Official Link */}
              <tr className="bg-slate-50/40">
                <td className="p-4 font-bold text-slate-700">Direct Portal Action</td>
                {compareItems.map(s => (
                  <td key={s.id} className="p-4">
                    <button
                      onClick={() => handleApply(s.officialApplicationUrl)}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>Apply on Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
