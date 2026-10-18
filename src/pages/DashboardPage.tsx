import React from 'react';
import type { Scholarship, StudentProfile, ApplicationTrackerItem } from '../types/scholarship.ts';
import { ScholarshipCard } from '../components/ScholarshipCard.tsx';
import { evaluateEligibility } from '../lib/matching.ts';
import {
  GraduationCap,
  Calendar,
  Bookmark,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  FileText,
  ChevronRight,
  HelpCircle
} from 'lucide-react';

interface DashboardPageProps {
  profile: StudentProfile | null;
  scholarships: Scholarship[];
  savedIds: string[];
  applications: ApplicationTrackerItem[];
  onToggleSave: (id: string) => void;
  navigate: (path: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  profile,
  scholarships,
  savedIds,
  applications,
  onToggleSave,
  navigate,
}) => {
  // Rank scholarships for profile
  const ranked = scholarships.map((s) => ({
    scholarship: s,
    eligibility: evaluateEligibility(profile, s),
  }));

  const strongMatches = ranked.filter(r => r.eligibility.overallCategory === 'eligible');
  const potentialMatches = ranked.filter(r => r.eligibility.overallCategory === 'potential_match');
  const verifiedOpenMatches = ranked.filter(
    r => (r.eligibility.overallCategory === 'eligible' || r.eligibility.overallCategory === 'potential_match') &&
         r.scholarship.status === 'verified_open'
  );

  const savedScholarships = scholarships.filter(s => savedIds.includes(s.id));

  // Compute applications stats
  const inProgressApps = applications.filter(a => ['interested', 'not_started', 'preparing_documents', 'ready_to_apply'].includes(a.status));
  const submittedApps = applications.filter(a => ['submitted', 'under_review'].includes(a.status));
  const awardedApps = applications.filter(a => a.status === 'awarded');

  // Deadlines sort
  const upcomingDeadlines = [...scholarships]
    .filter(s => s.status === 'verified_open')
    .sort((a, b) => new Date(a.applicationDeadline).getTime() - new Date(b.applicationDeadline).getTime())
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>STUDENT DISCOVERY DESK</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome back, {profile?.name || 'Aspiring Scholar'}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Here is your live scholarship matching status based on your {profile?.course || 'degree program'} and state profile.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate('/scholarships')}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
              >
                <span>Find More Scholarships</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('/onboarding')}
                className="px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-colors"
              >
                Update Profile
              </button>
            </div>
          </div>
        </div>

        {/* Real Platform & Profile KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Profile Completion
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-blue-600">
                {profile?.profileCompletedPercentage || 0}%
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
              <div
                className="bg-blue-600 h-1.5 rounded-full"
                style={{ width: `${profile?.profileCompletedPercentage || 0}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Matching Open Schemes
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
              {verifiedOpenMatches.length}
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              Verified active today
            </span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Tracked Applications
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600">
              {applications.length}
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              {inProgressApps.length} in progress • {submittedApps.length} submitted
            </span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Saved Bookmarks
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-600">
              {savedIds.length}
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              For quick access
            </span>
          </div>
        </div>

        {/* Section: Recommended for You */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <span>Recommended For You</span>
              </h2>
              <p className="text-xs text-slate-500">
                Opportunities with the highest eligibility compatibility for your profile.
              </p>
            </div>

            <button
              onClick={() => navigate('/scholarships')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>View all ({scholarships.length})</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {strongMatches.slice(0, 3).map(({ scholarship }) => (
              <ScholarshipCard
                key={scholarship.id}
                scholarship={scholarship}
                profile={profile}
                isSaved={savedIds.includes(scholarship.id)}
                onToggleSave={onToggleSave}
                onSelect={(id) => navigate(`/scholarships/${id}`)}
              />
            ))}
          </div>
        </section>

        {/* Grid: Upcoming Deadlines + Application Tracker Snapshot */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Deadlines (2 cols) */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  Upcoming Application Deadlines
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">Verified Official Dates</span>
            </div>

            <div className="space-y-3">
              {upcomingDeadlines.map((s) => {
                const diffDays = Math.ceil((new Date(s.applicationDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                return (
                  <div
                    key={s.id}
                    onClick={() => navigate(`/scholarships/${s.id}`)}
                    className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-100/60 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <div className="space-y-1 pr-4">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1">
                        {s.name}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {s.provider} • Award: <strong className="text-blue-700">{s.awardFormatted}</strong>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`text-xs font-bold block ${
                        diffDays <= 7 ? 'text-rose-600' : 'text-slate-800'
                      }`}>
                        {s.applicationDeadline}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {diffDays > 0 ? `${diffDays} days left` : 'Due today'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Eligibility Improvements & Tips (1 col) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  Eligibility Insights
                </h3>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-900 space-y-1">
                <span className="font-bold block">Annual Income Ceiling:</span>
                <p className="text-[11px] text-emerald-800">
                  Your declared household income (₹{(profile?.annualHouseholdIncome || 0).toLocaleString('en-IN')}) makes you eligible for both Central Sector PM-USP and State Fee Waivers.
                </p>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-xs text-blue-900 space-y-1">
                <span className="font-bold block">Engineering & STEM Scope:</span>
                <p className="text-[11px] text-blue-800">
                  Enrolled in {profile?.course || 'STEM program'}. 8 corporate CSR and Central AICTE schemes accept this degree.
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate('/onboarding')}
              className="w-full mt-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Refine Eligibility Fields</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Application Tracker Fast-Action Desk */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                <span>My Active Application Trackers</span>
              </h3>
              <p className="text-xs text-slate-500">
                Manage your submission checklists, personal notes, and government references.
              </p>
            </div>

            <button
              onClick={() => navigate('/applications')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>Open Tracker ({applications.length})</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {applications.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500 space-y-2">
              <p>You haven't tracked any scholarship applications yet.</p>
              <button
                onClick={() => navigate('/scholarships')}
                className="text-blue-600 font-semibold hover:underline"
              >
                Browse scholarships and click "Track in My Applications"
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {applications.slice(0, 2).map((app) => (
                <div key={app.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full capitalize">
                      {app.status.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      Due: {app.deadline}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 line-clamp-1">
                    {app.scholarshipName}
                  </h4>
                  <p className="text-xs text-slate-600 italic line-clamp-1">
                    "{app.notes || 'No notes added yet'}"
                  </p>
                  <div className="pt-2 flex items-center justify-between text-xs">
                    <button
                      onClick={() => navigate('/applications')}
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      Update Status →
                    </button>
                    {app.applicationReference && (
                      <span className="text-slate-400 font-mono text-[11px]">
                        Ref: {app.applicationReference}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
