import React, { useState } from 'react';
import type { ApplicationTrackerItem, ApplicationStatus, Scholarship } from '../types/scholarship.ts';
import { validateOfficialDestination } from '../lib/tinyfish-normalizer.ts';
import {
  CheckSquare,
  Calendar,
  ExternalLink,
  Trash2,
  Edit3,
  Plus,
  Clock,
  CheckCircle2,
  FileText,
  AlertCircle,
  HelpCircle,
  Building2,
  Search
} from 'lucide-react';

interface TrackerPageProps {
  applications: ApplicationTrackerItem[];
  scholarships: Scholarship[];
  onUpdateStatus: (id: string, updates: Partial<ApplicationTrackerItem>) => void;
  onDeleteApplication: (id: string) => void;
  onAddApplication: (scholarshipId: string, status?: ApplicationStatus, notes?: string) => void;
  navigate: (path: string) => void;
}

const STATUS_CONFIG: Record<ApplicationStatus, { label: string; color: string; border: string; bg: string }> = {
  interested: { label: 'Interested', color: 'text-sky-700', border: 'border-sky-200', bg: 'bg-sky-50' },
  not_started: { label: 'Not Started', color: 'text-slate-700', border: 'border-slate-200', bg: 'bg-slate-50' },
  preparing_documents: { label: 'Preparing Documents', color: 'text-amber-700', border: 'border-amber-200', bg: 'bg-amber-50' },
  ready_to_apply: { label: 'Ready to Apply', color: 'text-blue-700', border: 'border-blue-200', bg: 'bg-blue-50' },
  submitted: { label: 'Submitted', color: 'text-indigo-700', border: 'border-indigo-200', bg: 'bg-indigo-50' },
  under_review: { label: 'Under Review', color: 'text-purple-700', border: 'border-purple-200', bg: 'bg-purple-50' },
  awarded: { label: 'Awarded Grant 🎉', color: 'text-emerald-700', border: 'border-emerald-200', bg: 'bg-emerald-50' },
  rejected: { label: 'Rejected / Ineligible', color: 'text-rose-700', border: 'border-rose-200', bg: 'bg-rose-50' },
  withdrawn: { label: 'Withdrawn', color: 'text-slate-500', border: 'border-slate-200', bg: 'bg-slate-100' },
};

export const TrackerPage: React.FC<TrackerPageProps> = ({
  applications,
  scholarships,
  onUpdateStatus,
  onDeleteApplication,
  onAddApplication,
  navigate,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState<string>('');
  const [editRef, setEditRef] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [selectedScholarshipId, setSelectedScholarshipId] = useState<string>('');

  const filteredApps = filterStatus === 'all'
    ? applications
    : applications.filter(a => a.status === filterStatus);

  const startEdit = (app: ApplicationTrackerItem) => {
    setEditingId(app.id);
    setEditNotes(app.notes || '');
    setEditRef(app.applicationReference || '');
  };

  const saveEdit = (id: string) => {
    onUpdateStatus(id, {
      notes: editNotes,
      applicationReference: editRef,
    });
    setEditingId(null);
  };

  const handleOpenOfficial = (url: string) => {
    const check = validateOfficialDestination(url);
    if (check.isValid) {
      window.open(check.sanitizedUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCreateApplication = () => {
    if (selectedScholarshipId) {
      onAddApplication(selectedScholarshipId, 'interested', 'Added to tracker');
      setShowAddModal(false);
      setSelectedScholarshipId('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              <CheckSquare className="w-4 h-4" />
              <span>Application Progress Management</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Application Tracker
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Organize document prep, record portal reference numbers, and avoid missing crucial cutoffs.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Track New Scholarship</span>
          </button>
        </div>

        {/* Real Status Disclaimer */}
        <div className="p-3.5 bg-blue-50/70 border border-blue-200/60 rounded-xl text-xs text-blue-900 flex items-start gap-2.5">
          <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            <strong>Self-Managed Verification:</strong> BHAIYO KI PHADAI tracks your personal workflow stages. We never claim an application is submitted merely because you clicked an external link. You manually update milestones as you submit forms on official government and university portals.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-1.5 pb-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              filterStatus === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Tracked ({applications.length})
          </button>
          {Object.entries(STATUS_CONFIG).map(([statusKey, config]) => {
            const count = applications.filter(a => a.status === statusKey).length;
            if (count === 0 && filterStatus !== statusKey) return null;
            return (
              <button
                key={statusKey}
                onClick={() => setFilterStatus(statusKey)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                  filterStatus === statusKey
                    ? `${config.bg} ${config.color} ${config.border} shadow-xs`
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{config.label}</span>
                <span className="text-[10px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Applications List */}
        {filteredApps.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <CheckSquare className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">No tracked applications in this status</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Browse our verified catalog and add opportunities to your application pipeline.
            </p>
            <button
              onClick={() => navigate('/scholarships')}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700"
            >
              Explore Open Scholarships
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApps.map((app) => {
              const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.interested;
              const isEditing = editingId === app.id;

              return (
                <div
                  key={app.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Status Dropdown */}
                        <select
                          value={app.status}
                          onChange={(e) => onUpdateStatus(app.id, { status: e.target.value as ApplicationStatus })}
                          className={`text-xs font-bold px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                          {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                            <option key={k} value={k}>
                              {v.label}
                            </option>
                          ))}
                        </select>

                        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>Deadline: {app.deadline}</span>
                        </span>
                      </div>

                      <h3
                        onClick={() => navigate(`/scholarships/${app.scholarshipId}`)}
                        className="text-base sm:text-lg font-bold text-slate-900 hover:text-blue-600 cursor-pointer pt-1"
                      >
                        {app.scholarshipName}
                      </h3>

                      <div className="text-xs text-slate-500 font-medium flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{app.provider}</span> • <span className="text-blue-700 font-bold">{app.awardFormatted}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleOpenOfficial(app.officialUrl)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <span>Official Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => startEdit(app)}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                        title="Edit notes & reference ID"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onDeleteApplication(app.id)}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-slate-50"
                        title="Delete from tracker"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Notes & Reference Display/Edit */}
                  {isEditing ? (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Official Registration / Application ID
                          </label>
                          <input
                            type="text"
                            value={editRef}
                            onChange={(e) => setEditRef(e.target.value)}
                            placeholder="e.g. NSP/2026/UP/99824"
                            className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Personal Checklist / Document Notes
                          </label>
                          <input
                            type="text"
                            value={editNotes}
                            onChange={(e) => setEditNotes(e.target.value)}
                            placeholder="e.g. Fee receipt verified; need Tehsildar signature on income proof"
                            className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1 text-xs border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-100"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => saveEdit(app.id)}
                          className="px-3 py-1 text-xs bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="text-slate-600">
                        <span className="font-semibold text-slate-700">Notes:</span> {app.notes || 'No checklist notes recorded yet.'}
                      </div>
                      {app.applicationReference && (
                        <div className="font-mono text-slate-700 bg-white px-2.5 py-1 rounded-md border border-slate-200 shrink-0 text-[11px]">
                          Ref: {app.applicationReference}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add to Tracker Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Select Scholarship to Track</h3>
            <p className="text-xs text-slate-500">
              Pick an opportunity from the catalog to start organizing your submission.
            </p>

            <select
              value={selectedScholarshipId}
              onChange={(e) => setSelectedScholarshipId(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
            >
              <option value="">-- Choose a scholarship --</option>
              {scholarships.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.provider})
                </option>
              ))}
            </select>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateApplication}
                disabled={!selectedScholarshipId}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                Add to Tracker
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
