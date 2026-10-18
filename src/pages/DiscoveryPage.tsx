import React, { useState, useMemo } from 'react';
import type { Scholarship, StudentProfile, ProviderType, EducationLevel, SocialCategory, ScholarshipStatus } from '../types/scholarship.ts';
import { ScholarshipCard } from '../components/ScholarshipCard.tsx';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Calendar,
  IndianRupee,
  Building,
  GraduationCap
} from 'lucide-react';

interface DiscoveryPageProps {
  scholarships: Scholarship[];
  profile: StudentProfile | null;
  savedIds: string[];
  onToggleSave: (id: string) => void;
  comparingIds: string[];
  onToggleCompare: (id: string) => void;
  navigate: (path: string) => void;
  initialQuery?: string;
  initialOpenOnly?: boolean;
}

export const DiscoveryPage: React.FC<DiscoveryPageProps> = ({
  scholarships,
  profile,
  savedIds,
  onToggleSave,
  comparingIds,
  onToggleCompare,
  navigate,
  initialQuery = '',
  initialOpenOnly = false,
}) => {
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [statusFilter, setStatusFilter] = useState<string>(initialOpenOnly ? 'verified_open' : 'all');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [educationLevelFilter, setEducationLevelFilter] = useState<string>('all');
  const [providerTypeFilter, setProviderTypeFilter] = useState<string>('all');
  const [domicileFilter, setDomicileFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('best_match');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // States list for domicile filter
  const stateOptions = [
    'All India',
    'Uttar Pradesh',
    'Maharashtra',
    'West Bengal',
    'Bihar',
    'Rajasthan',
    'Madhya Pradesh',
    'Tamil Nadu',
    'Karnataka',
    'Delhi',
    'Gujarat',
    'Kerala',
    'Andhra Pradesh',
    'Punjab',
    'Haryana',
    'Assam',
    'Odisha',
    'Telangana',
    'Jharkhand',
  ];

  // Filtering & Sorting
  const filteredScholarships = useMemo(() => {
    let result = [...scholarships];

    // Search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.provider.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.applicableCourses.some(c => c.toLowerCase().includes(q)) ||
        (s.tags && s.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(s => s.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== 'All') {
      result = result.filter(s =>
        s.applicableCategories.includes('All') ||
        s.applicableCategories.includes(categoryFilter as SocialCategory)
      );
    }

    // Education level
    if (educationLevelFilter !== 'all') {
      result = result.filter(s =>
        s.educationLevels.includes(educationLevelFilter as EducationLevel)
      );
    }

    // Provider type
    if (providerTypeFilter !== 'all') {
      result = result.filter(s => s.providerType === providerTypeFilter);
    }

    // Domicile state
    if (domicileFilter !== 'all') {
      result = result.filter(s =>
        s.domicileStates.includes('All India') ||
        s.domicileStates.some(d => d.toLowerCase() === domicileFilter.toLowerCase())
      );
    }

    // Sorting
    if (sortBy === 'deadline') {
      result.sort((a, b) => new Date(a.applicationDeadline).getTime() - new Date(b.applicationDeadline).getTime());
    } else if (sortBy === 'amount_desc') {
      result.sort((a, b) => b.awardAmount - a.awardAmount);
    } else if (sortBy === 'amount_asc') {
      result.sort((a, b) => a.awardAmount - b.awardAmount);
    } else if (sortBy === 'recently_verified') {
      result.sort((a, b) => new Date(b.lastVerifiedAt).getTime() - new Date(a.lastVerifiedAt).getTime());
    }

    return result;
  }, [
    scholarships,
    searchTerm,
    statusFilter,
    categoryFilter,
    educationLevelFilter,
    providerTypeFilter,
    domicileFilter,
    sortBy,
  ]);

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setCategoryFilter('All');
    setEducationLevelFilter('all');
    setProviderTypeFilter('all');
    setDomicileFilter('all');
    setSortBy('best_match');
  };

  const activeFiltersCount = [
    statusFilter !== 'all',
    categoryFilter !== 'All',
    educationLevelFilter !== 'all',
    providerTypeFilter !== 'all',
    domicileFilter !== 'all',
    searchTerm.trim() !== '',
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                <span>Verified Scholarship Database</span>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Discover Scholarships & Grants
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Search verified Indian scholarship opportunities with explainable eligibility and deadline citations.
              </p>
            </div>

            {/* Comparison Bar Trigger */}
            {comparingIds.length > 0 && (
              <button
                onClick={() => navigate('/compare')}
                className="self-start md:self-auto flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-indigo-700 transition-colors"
              >
                <span>Compare Selected ({comparingIds.length}/4)</span>
              </button>
            )}
          </div>
        </div>

        {/* Search & Top Action Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-6 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by scholarship title, stream, college, or provider (e.g. B.Tech, NSP, Pragati)..."
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Dedicated "Open Now" quick filter */}
              <button
                onClick={() => setStatusFilter(statusFilter === 'verified_open' ? 'all' : 'verified_open')}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  statusFilter === 'verified_open'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Open Now</span>
              </button>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="sm:hidden px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5"
              >
                <Filter className="w-4 h-4" />
                <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
              </button>

              {/* Sort Selector */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="best_match">Sort: Best Match</option>
                <option value="deadline">Sort: Nearest Deadline</option>
                <option value="amount_desc">Sort: Highest Award</option>
                <option value="amount_asc">Sort: Lowest Award</option>
                <option value="recently_verified">Sort: Recently Verified</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content: Sidebar Filters + Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Desktop Filters Sidebar */}
          <aside className={`lg:block ${showMobileFilters ? 'block' : 'hidden'} lg:col-span-1`}>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-6 sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                  <span>Filter Criteria</span>
                </div>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Application Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="all">All Statuses</option>
                  <option value="verified_open">Verified Open</option>
                  <option value="upcoming">Upcoming Cycle</option>
                  <option value="verification_required">Verification Required</option>
                  <option value="closed">Closed / Past Cycle</option>
                </select>
              </div>

              {/* Education Level */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Education Level
                </label>
                <select
                  value={educationLevelFilter}
                  onChange={(e) => setEducationLevelFilter(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="all">All Academic Levels</option>
                  <option value="school">School (10th / 11th / 12th)</option>
                  <option value="diploma">Diploma / Polytechnic</option>
                  <option value="undergraduate">Undergraduate (B.Tech, B.Sc, B.Com, MBBS)</option>
                  <option value="postgraduate">Postgraduate (M.Tech, M.Sc, MBA)</option>
                  <option value="doctoral">Doctoral / PhD</option>
                  <option value="research">Research Fellowship</option>
                </select>
              </div>

              {/* Social Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Social Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="All">All Categories</option>
                  <option value="General">General</option>
                  <option value="OBC">OBC (Other Backward Class)</option>
                  <option value="SC">SC (Scheduled Caste)</option>
                  <option value="ST">ST (Scheduled Tribe)</option>
                  <option value="EWS">EWS (Economically Weaker Section)</option>
                  <option value="Minority">Minority Communities</option>
                </select>
              </div>

              {/* Provider Type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Awarding Provider
                </label>
                <select
                  value={providerTypeFilter}
                  onChange={(e) => setProviderTypeFilter(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="all">All Providers</option>
                  <option value="central_gov">Central Government (NSP, AICTE, UGC)</option>
                  <option value="state_gov">State Govt Departments (MahaDBT, WB, etc.)</option>
                  <option value="corporate_csr">Corporate CSR (Reliance, Tata, Kotak)</option>
                  <option value="private_foundation">Charitable & Private Foundations</option>
                  <option value="university">University / Institute Endowments</option>
                </select>
              </div>

              {/* Domicile State */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Domicile State
                </label>
                <select
                  value={domicileFilter}
                  onChange={(e) => setDomicileFilter(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="all">Any Resident State</option>
                  {stateOptions.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Profile Match Banner */}
              <div className="p-3 bg-blue-50/70 border border-blue-200/60 rounded-xl text-xs space-y-1">
                <span className="font-bold text-blue-900 block">Active Match Profile:</span>
                <span className="text-slate-600 block">
                  {profile?.name} • {profile?.course} • {profile?.category}
                </span>
                <button
                  onClick={() => navigate('/onboarding')}
                  className="text-blue-600 font-semibold hover:underline text-[11px] pt-1 block"
                >
                  Update Profile Details →
                </button>
              </div>
            </div>
          </aside>

          {/* Cards Grid */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-medium">
              <span>Showing {filteredScholarships.length} of {scholarships.length} scholarships</span>
              {activeFiltersCount > 0 && (
                <span className="text-blue-600 font-semibold">
                  {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} applied
                </span>
              )}
            </div>

            {filteredScholarships.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
                <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-base">No scholarships match your filters</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try clearing specific filters (like Domicile or Status) or searching for broader terms like "Engineering" or "Post-Matric".
                </p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredScholarships.map((scholarship) => (
                  <ScholarshipCard
                    key={scholarship.id}
                    scholarship={scholarship}
                    profile={profile}
                    isSaved={savedIds.includes(scholarship.id)}
                    onToggleSave={onToggleSave}
                    isComparing={comparingIds.includes(scholarship.id)}
                    onToggleCompare={onToggleCompare}
                    onSelect={(id) => navigate(`/scholarships/${id}`)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
