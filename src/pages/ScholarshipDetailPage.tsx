import React, { useState } from 'react';
import type { Scholarship, StudentProfile, ApplicationStatus } from '../types/scholarship.ts';
import { StatusBadge } from '../components/StatusBadge.tsx';
import { ReportModal } from '../components/ReportModal.tsx';
import { evaluateEligibility } from '../lib/matching.ts';
import { validateOfficialDestination } from '../lib/tinyfish-normalizer.ts';
import {
  Building2,
  Calendar,
  IndianRupee,
  GraduationCap,
  FileCheck2,
  Bookmark,
  Share2,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  ArrowLeft,
  PlusCircle,
  Check
} from 'lucide-react';

interface ScholarshipDetailPageProps {
  scholarshipId: string;
  scholarships: Scholarship[];
  profile: StudentProfile | null;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onAddToTracker: (scholarshipId: string, status?: ApplicationStatus, notes?: string) => void;
  navigate: (path: string) => void;
}

export const ScholarshipDetailPage: React.FC<ScholarshipDetailPageProps> = ({
  scholarshipId,
  scholarships,
  profile,
  isSaved,
  onToggleSave,
  onAddToTracker,
  navigate,
}) => {
  const [showReportModal, setShowReportModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [addedToTracker, setAddedToTracker] = useState(false);

  const scholarship = scholarships.find(s => s.id === scholarshipId);

  if (!scholarship) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center max-w-md shadow-xs">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Scholarship Record Not Found</h2>
          <p className="text-xs text-slate-500 mb-6">
            The requested scholarship ID may have been archived or removed from the database.
          </p>
          <button
            onClick={() => navigate('/scholarships')}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
          >
            Back to All Scholarships
          </button>
        </div>
      </div>
    );
  }

  const eligibility = evaluateEligibility(profile, scholarship);
  const destinationCheck = validateOfficialDestination(scholarship.officialApplicationUrl);

  const handleApplyClick = () => {
    if (destinationCheck.isValid) {
      window.open(destinationCheck.sanitizedUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleTrack = () => {
    onAddToTracker(scholarship.id, 'interested', 'Added from scholarship detail page');
    setAddedToTracker(true);
    setTimeout(() => setAddedToTracker(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Breadcrumb / Back button */}
        <button
          onClick={() => navigate('/scholarships')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Scholarships</span>
        </button>

        {/* Main Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={scholarship.status} isDemo={scholarship.isDemo} />
                <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full capitalize">
                  {scholarship.providerType.replace('_', ' ')}
                </span>
                <span className="text-xs font-medium text-slate-500">
                  Cycle: {scholarship.academicCycle}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {scholarship.name}
              </h1>

              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 font-medium">
                <Building2 className="w-4 h-4 text-slate-400" />
                <span>{scholarship.provider}</span>
              </div>
            </div>

            {/* Top Action Bar */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onToggleSave(scholarship.id)}
                className={`p-2.5 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-semibold ${
                  isSaved
                    ? 'bg-blue-50 border-blue-200 text-blue-600'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
                aria-label="Save scholarship"
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-blue-600' : ''}`} />
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>

              <button
                onClick={handleShareClick}
                className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                aria-label="Share opportunity"
              >
                <Share2 className="w-4 h-4" />
                <span>{copiedLink ? 'Copied!' : 'Share'}</span>
              </button>

              <button
                onClick={() => setShowReportModal(true)}
                className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-amber-600 hover:bg-slate-50 transition-colors"
                title="Report incorrect details"
                aria-label="Report incorrect details"
              >
                <AlertTriangle className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Key Facts Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Financial Award
              </div>
              <div className="text-base sm:text-lg font-black text-blue-700 mt-0.5">
                {scholarship.awardFormatted}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Application Deadline
              </div>
              <div className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>{scholarship.applicationDeadline || 'Check Circular'}</span>
              </div>
            </div>

            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Family Income Ceiling
              </div>
              <div className="text-sm font-bold text-slate-900 mt-1">
                {scholarship.maxAnnualFamilyIncome ? `₹${scholarship.maxAnnualFamilyIncome.toLocaleString('en-IN')}/yr` : 'No Limit'}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Minimum Marks
              </div>
              <div className="text-sm font-bold text-slate-900 mt-1">
                {scholarship.minMarksPercentage ? `${scholarship.minMarksPercentage}% qualifying` : 'No Cutoff Stated'}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Scheme Overview
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {scholarship.description}
            </p>
          </div>

          {/* CTA Actions Bar */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handleApplyClick}
                className="flex-1 sm:flex-none px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>Apply on Official Website</span>
                <ExternalLink className="w-4 h-4" />
              </button>

              <button
                onClick={handleTrack}
                className="px-4 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                {addedToTracker ? <Check className="w-4 h-4 text-emerald-600" /> : <PlusCircle className="w-4 h-4 text-slate-500" />}
                <span>{addedToTracker ? 'Added to Tracker!' : 'Track in My Applications'}</span>
              </button>
            </div>

            <div className="text-[11px] text-slate-500 text-right sm:text-right">
              Official destination verified • Secure redirection
            </div>
          </div>
        </div>

        {/* Explainable Eligibility Breakdown Panel (CRITICAL REQUIREMENT) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-slate-900">
                  Explainable Eligibility Breakdown
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Comparing current student profile against documented provider criteria.
              </p>
            </div>

            <div className="text-right">
              <div className="text-xs font-semibold text-slate-500">Relevance Score</div>
              <div className="text-xl font-black text-blue-600">
                {eligibility.relevanceScore}/100
              </div>
            </div>
          </div>

          {/* Mathematical Formula Explanation */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600 font-medium">
            <span className="font-bold text-slate-800">Scoring Transparency:</span> {eligibility.scoringFormula}
          </div>

          {/* Criteria Grid */}
          <div className="space-y-3">
            {Object.entries(eligibility.criteria).map(([key, item]) => {
              let badgeColor = 'bg-slate-100 text-slate-700 border-slate-200';
              let Icon = HelpCircle;

              if (item.status === 'matches') {
                badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                Icon = CheckCircle2;
              } else if (item.status === 'does_not_match') {
                badgeColor = 'bg-rose-50 text-rose-700 border-rose-200';
                Icon = XCircle;
              } else if (item.status === 'needs_confirmation') {
                badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
                Icon = HelpCircle;
              } else if (item.status === 'not_applicable') {
                badgeColor = 'bg-slate-50 text-slate-500 border-slate-200';
                Icon = CheckCircle2;
              }

              return (
                <div
                  key={key}
                  className="p-3.5 rounded-xl border border-slate-100 bg-white hover:bg-slate-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-800">
                      {item.title}
                    </div>
                    <div className="text-xs text-slate-600">
                      {item.reason}
                    </div>
                  </div>

                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shrink-0 ${badgeColor}`}>
                    <Icon className="w-3.5 h-3.5" />
                    <span className="capitalize">{item.status.replace(/_/g, ' ')}</span>
                  </span>
                </div>
              );
            })}
          </div>

          {/* Natural Language Breakdown Lists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
            {eligibility.whatMatches.length > 0 && (
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/60 space-y-2">
                <h4 className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>What Matches Your Profile</span>
                </h4>
                <ul className="list-disc list-inside space-y-1 text-emerald-800">
                  {eligibility.whatMatches.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {eligibility.whatDoesNotMatch.length > 0 && (
              <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200/60 space-y-2">
                <h4 className="font-bold text-rose-900 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>Unsatisfied Requirements</span>
                </h4>
                <ul className="list-disc list-inside space-y-1 text-rose-800">
                  {eligibility.whatDoesNotMatch.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {eligibility.whatIsMissing.length > 0 && (
              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/60 space-y-2">
                <h4 className="font-bold text-amber-900 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                  <span>Information Needing Confirmation</span>
                </h4>
                <ul className="list-disc list-inside space-y-1 text-amber-800">
                  {eligibility.whatIsMissing.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {eligibility.nextSteps.length > 0 && (
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/60 space-y-2">
                <h4 className="font-bold text-blue-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Recommended Next Steps</span>
                </h4>
                <ul className="list-disc list-inside space-y-1 text-blue-800">
                  {eligibility.nextSteps.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-500 pt-2 italic">
            {eligibility.disclaimer}
          </div>
        </div>

        {/* Required Documents Checklist */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Required Supporting Documents
            </h2>
          </div>
          <p className="text-xs text-slate-600">
            Keep clear self-attested scans ready before beginning your formal application on the provider portal.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {scholarship.requiredDocuments.map((doc, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center gap-2.5 text-xs text-slate-800"
              >
                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                  {idx + 1}
                </div>
                <span>{doc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Verification & Source Provenance */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Source Provenance & Audit Evidence
            </h3>
            <span className="text-xs font-semibold text-slate-600">
              Last Verified: {scholarship.lastVerifiedAt}
            </span>
          </div>

          <div className="text-xs text-slate-700 space-y-1">
            <p>
              <strong>Official Gazette / Circular Evidence:</strong> {scholarship.verificationEvidence}
            </p>
            <p className="text-slate-500">
              <strong>Source Host:</strong> {scholarship.sourceDomain} • <strong>Trust Classification:</strong> {scholarship.sourceReliability.replace('_', ' ')}
            </p>
          </div>

          <div className="pt-2 flex items-center gap-3 text-xs">
            <a
              href={scholarship.primarySourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-semibold hover:underline flex items-center gap-1"
            >
              <span>View Source Notification</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => setShowReportModal(true)}
              className="text-slate-500 hover:text-amber-600"
            >
              Notice an outdated rule? Report Discrepancy
            </button>
          </div>
        </div>
      </div>

      {/* Discrepancy Report Modal */}
      <ReportModal
        scholarshipId={scholarship.id}
        scholarshipName={scholarship.name}
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
      />
    </div>
  );
};
