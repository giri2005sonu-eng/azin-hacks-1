import React, { useState } from 'react';
import type { Scholarship, StudentProfile } from '../types/scholarship.ts';
import { ScholarshipCard } from '../components/ScholarshipCard.tsx';
import {
  Search,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Building,
  ArrowRight,
  HelpCircle,
  FileText,
  Lock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface LandingPageProps {
  scholarships: Scholarship[];
  profile: StudentProfile | null;
  savedIds: string[];
  onToggleSave: (id: string) => void;
  navigate: (path: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  scholarships,
  profile,
  savedIds,
  onToggleSave,
  navigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/scholarships?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/scholarships');
    }
  };

  // Honest platform statistics from actual stored data
  const totalCount = scholarships.length;
  const verifiedOpenCount = scholarships.filter(s => s.status === 'verified_open').length;
  const centralGovCount = scholarships.filter(s => s.providerType === 'central_gov').length;
  const featuredScholarships = scholarships.slice(0, 3);

  const categories = [
    { title: 'Central Govt (NSP)', filter: 'providerType=central_gov', desc: 'MoE, Social Justice, AICTE & UGC Schemes', count: centralGovCount },
    { title: 'Girls in Higher Education', filter: 'gender=female_only', desc: 'AICTE Pragati, Kotak Kanya & L’Oréal grants', count: scholarships.filter(s => s.genderRestriction === 'female_only').length },
    { title: 'Corporate CSR & Foundations', filter: 'providerType=corporate_csr', desc: 'Reliance Foundation, Tata Capital, Sitaram Jindal', count: scholarships.filter(s => s.providerType === 'corporate_csr').length },
    { title: 'State Domicile Portals', filter: 'providerType=state_gov', desc: 'MahaDBT, West Bengal SVMCM, UP Scholarship', count: scholarships.filter(s => s.providerType === 'state_gov').length },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold mb-6">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>HAR STUDENT KA HAQ, HAR SCHOLARSHIP KI KHABAR</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Your Next Scholarship <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
              Could Change Everything.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop searching across dozens of disjointed portals. Discover verified central, state, and foundation scholarships with <strong>explainable eligibility breakdowns</strong> and accurate deadlines.
          </p>

          {/* Quick Search Bar */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto mb-8">
            <div className="relative flex items-center bg-white/95 backdrop-blur-md rounded-2xl p-1.5 shadow-2xl border border-white/20 focus-within:ring-4 focus-within:ring-blue-500/30 transition-all">
              <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search scholarship name, course (e.g. B.Tech), or provider (NSP, Tata)..."
                className="w-full px-3 py-3 text-slate-900 text-sm placeholder-slate-400 focus:outline-none bg-transparent"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all shrink-0 flex items-center gap-1.5"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => navigate('/onboarding')}
              className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2"
            >
              <span>Find My Scholarships</span>
              <Sparkles className="w-4 h-4 text-blue-200" />
            </button>
            <button
              onClick={() => navigate('/scholarships')}
              className="px-6 py-3.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 rounded-xl font-semibold text-sm transition-colors"
            >
              Explore All Opportunities
            </button>
          </div>

          {/* Real Live Platform Metrics (Non-fabricated!) */}
          <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
              <div className="text-2xl font-black text-white">{totalCount}</div>
              <div className="text-xs text-slate-400 font-medium">Catalogued Opportunities</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
              <div className="text-2xl font-black text-emerald-400">{verifiedOpenCount}</div>
              <div className="text-xs text-slate-400 font-medium">Verified Open Today</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
              <div className="text-2xl font-black text-blue-400">100%</div>
              <div className="text-xs text-slate-400 font-medium">Explainable Logic</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
              <div className="text-2xl font-black text-purple-400">TinyFish</div>
              <div className="text-xs text-slate-400 font-medium">Search & Fetch Live Sync</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold text-blue-600 tracking-wider uppercase mb-2">
            Engineered For Indian Students
          </h2>
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            How BHAIYO KI PHADAI Works
          </h3>
          <p className="text-sm text-slate-600 mt-2">
            No guessing, no mysterious percentages. Real transparency from discovery to submission.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-base mb-4">
              1
            </div>
            <h4 className="font-bold text-slate-900 text-base mb-2">Build Student Profile</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Add your current education level, course, category, and domicile. Documents are never mandatory for discovery.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-base mb-4">
              2
            </div>
            <h4 className="font-bold text-slate-900 text-base mb-2">Explainable Matching</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Understand exact criteria: what matches, what fails, and what needs official circular verification before applying.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold text-base mb-4">
              3
            </div>
            <h4 className="font-bold text-slate-900 text-base mb-2">Verified Deadlines</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Deadlines are actively checked against official gazettes using TinyFish live web discovery with evidence citations.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-base mb-4">
              4
            </div>
            <h4 className="font-bold text-slate-900 text-base mb-2">Track & Apply Directly</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              One-click redirection to the official government or foundation portal. Track your submission stages in your dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Verified Scholarships */}
      <section className="py-12 bg-slate-100/70 border-y border-slate-200/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                Verified Records
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Featured Verified Scholarships
              </h3>
            </div>
            <button
              onClick={() => navigate('/scholarships?openOnly=true')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 group"
            >
              <span>View all open schemes</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredScholarships.map((scholarship) => (
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
        </div>
      </section>

      {/* Scholarship Categories Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Browse by Scholarship Category
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Target opportunities tailored to your degree, domicile state, or corporate sponsorship.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => navigate(`/scholarships?${cat.filter}`)}
              className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-blue-400 hover:shadow-md transition-all text-left group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                  {cat.count} Available
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm mb-1.5 group-hover:text-blue-600 transition-colors">
                {cat.title}
              </h4>
              <p className="text-xs text-slate-500 leading-normal">
                {cat.desc}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Trust & Privacy Pledge */}
      <section className="py-14 bg-gradient-to-br from-indigo-900 to-slate-900 text-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="p-8 sm:p-10 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-blue-600 text-white">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Our Privacy & Ethics Constitution</h3>
                <p className="text-xs text-blue-200">Built to protect Indian students, not monetize sensitive data</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 text-xs text-slate-300">
              <div className="space-y-1.5">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>No Mandatory Uploads</span>
                </div>
                <p className="leading-relaxed">
                  You can discover every scholarship without uploading marks cards or caste certificates.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Official Redirection</span>
                </div>
                <p className="leading-relaxed">
                  We never pretend to submit government applications on your behalf. We send you to verified .gov.in & .org portals.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Transparent Uncertainty</span>
                </div>
                <p className="leading-relaxed">
                  If an academic cycle or income cutoff is unconfirmed in our crawl, we label it with "Verification Required".
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Clear answers on how BHAIYO KI PHADAI assists your higher education journey.
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <h4 className="font-bold text-slate-900 text-sm mb-1.5">
              Does BHAIYO KI PHADAI charge any application or convenience fee?
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              No. BHAIYO KI PHADAI is 100% free for students. We do not charge fees, take commissions on grants, or require credit cards.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <h4 className="font-bold text-slate-900 text-sm mb-1.5">
              How does the Explainable Eligibility engine work?
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Unlike black-box algorithms that spit out a random "85% match", our engine deterministically checks your academic level, qualifying marks, annual family income, category, and domicile against published government or CSR rules. We display exactly which rules matched and what needs official verification.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <h4 className="font-bold text-slate-900 text-sm mb-1.5">
              How are deadlines and official portals verified?
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              We leverage TinyFish Search and Fetch APIs to crawl public notifications, gazettes, and official department circulars. We store source provenance, last verification timestamps, and evidence quotes so you can check the authentic source yourself.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
