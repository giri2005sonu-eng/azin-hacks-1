import React from 'react';
import type { Scholarship, StudentProfile } from '../types/scholarship.ts';
import { ScholarshipCard } from '../components/ScholarshipCard.tsx';
import { Bookmark, ArrowRight, GitCompare, Sparkles } from 'lucide-react';

interface SavedPageProps {
  scholarships: Scholarship[];
  profile: StudentProfile | null;
  savedIds: string[];
  onToggleSave: (id: string) => void;
  comparingIds: string[];
  onToggleCompare: (id: string) => void;
  navigate: (path: string) => void;
}

export const SavedPage: React.FC<SavedPageProps> = ({
  scholarships,
  profile,
  savedIds,
  onToggleSave,
  comparingIds,
  onToggleCompare,
  navigate,
}) => {
  const savedScholarships = scholarships.filter(s => savedIds.includes(s.id));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              <Bookmark className="w-4 h-4 fill-blue-600" />
              <span>Personal Bookmarks</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Saved Scholarships ({savedScholarships.length})
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Quickly revisit opportunities, compare requirements, and monitor deadline approaches.
            </p>
          </div>

          {savedScholarships.length >= 2 && (
            <button
              onClick={() => {
                // Prepopulate comparison with up to 4 saved scholarships
                savedScholarships.slice(0, 4).forEach(s => {
                  if (!comparingIds.includes(s.id)) onToggleCompare(s.id);
                });
                navigate('/compare');
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors self-start sm:self-auto"
            >
              <GitCompare className="w-4 h-4" />
              <span>Compare All Saved Side-by-Side</span>
            </button>
          )}
        </div>

        {savedScholarships.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <Bookmark className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">No scholarships saved yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Click the bookmark icon on any scholarship card to save it for easy access later.
            </p>
            <button
              onClick={() => navigate('/scholarships')}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors"
            >
              Explore Open Scholarships
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedScholarships.map((scholarship) => (
              <ScholarshipCard
                key={scholarship.id}
                scholarship={scholarship}
                profile={profile}
                isSaved={true}
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
  );
};
