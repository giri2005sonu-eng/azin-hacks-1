import React, { useState, useEffect } from 'react';
import type { IngestionRun, UserReport } from '../types/scholarship.ts';
import {
  Shield,
  Activity,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Server,
  Database,
  Terminal,
  FileCheck2,
  Clock,
  Sparkles
} from 'lucide-react';

interface AdminStats {
  totalScholarships: number;
  verifiedOpen: number;
  upcoming: number;
  closed: number;
  verificationRequired: number;
  demoCount: number;
  liveCount: number;
  tinyFish: {
    hasKey: boolean;
    keyMasked: string;
    searchHost: string;
    fetchHost: string;
    lastTestedAt?: string;
    lastTestStatus?: 'success' | 'failed' | 'not_tested';
    lastError?: string;
  };
  recentIngestions: IngestionRun[];
  reportsCount: number;
  unresolvedReports: number;
  reportsList: UserReport[];
}

export const AdminPage: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncQuery, setSyncQuery] = useState('site:scholarships.gov.in OR site:aicte-india.org 2026 scholarship');
  const [syncResult, setSyncResult] = useState<IngestionRun | null>(null);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to load admin stats', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/admin/test-tinyfish', { method: 'POST' });
      const data = await res.json();
      setTestResult(data);
      fetchStats();
    } catch (err: any) {
      setTestResult({
        success: false,
        message: `Connection test error: ${err.message || String(err)}`,
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleRunSync = async () => {
    setIsSyncing(true);
    setSyncResult(null);
    try {
      const res = await fetch('/api/admin/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: syncQuery }),
      });
      const data = await res.json();
      setSyncResult(data);
      fetchStats();
    } catch (err: any) {
      alert(`Sync failed: ${err.message || String(err)}`);
    } finally {
      setIsSyncing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
          <span>Loading Administrative Dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
              <Shield className="w-4 h-4" />
              <span>Platform Administration & Integrations</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Data Pipeline & Integration Health
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Live crawler metrics, TinyFish API telemetry, database breakdown, and discrepancy audit.
            </p>
          </div>

          <button
            onClick={fetchStats}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Telemetry</span>
          </button>
        </div>

        {/* Database & Ingestion Breakdown Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Total Catalogued
            </div>
            <div className="text-3xl font-extrabold text-slate-900">
              {stats?.totalScholarships || 0}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {stats?.liveCount || 0} Live Ingested • {stats?.demoCount || 0} Demo Sample
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Verified Open
            </div>
            <div className="text-3xl font-extrabold text-emerald-600">
              {stats?.verifiedOpen || 0}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Confirmed active application windows
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Audit Pending
            </div>
            <div className="text-3xl font-extrabold text-amber-600">
              {stats?.verificationRequired || 0}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Verification required records
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              User Reports
            </div>
            <div className="text-3xl font-extrabold text-rose-600">
              {stats?.reportsCount || 0}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {stats?.unresolvedReports || 0} unresolved issues
            </div>
          </div>
        </div>

        {/* TinyFish API Integration Card (CRITICAL REQUIREMENT) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-100 text-purple-700">
                <Server className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  TinyFish Search & Fetch Live Integration
                </h2>
                <p className="text-xs text-slate-500">
                  Used for real-time discovery of public Indian university & government scholarship announcements.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleTestConnection}
                disabled={isTesting}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5"
              >
                <Activity className={`w-3.5 h-3.5 ${isTesting ? 'animate-pulse text-purple-400' : ''}`} />
                <span>{isTesting ? 'Testing API...' : 'Test Connection'}</span>
              </button>
            </div>
          </div>

          {/* Configuration Telemetry Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-600 block">Server Key Status:</span>
              <div className="flex items-center gap-1.5">
                {stats?.tinyFish.hasKey ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="font-mono text-emerald-700 font-bold">{stats.tinyFish.keyMasked}</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span className="text-rose-700 font-semibold">Missing TINYFISH_API_KEY</span>
                  </>
                )}
              </div>
              <span className="text-[10px] text-slate-400 block pt-1">
                Rotated & protected strictly server-side in .env
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-600 block">Search Host:</span>
              <span className="font-mono text-slate-800 text-[11px] block truncate">
                {stats?.tinyFish.searchHost || 'https://api.search.tinyfish.ai'}
              </span>
              <span className="font-bold text-slate-600 block pt-1">Fetch Host:</span>
              <span className="font-mono text-slate-800 text-[11px] block truncate">
                {stats?.tinyFish.fetchHost || 'https://api.fetch.tinyfish.ai'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-600 block">Last Test Outcome:</span>
              <div className="flex items-center gap-1.5 font-bold">
                {stats?.tinyFish.lastTestStatus === 'success' && (
                  <span className="text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Connected OK
                  </span>
                )}
                {stats?.tinyFish.lastTestStatus === 'failed' && (
                  <span className="text-rose-600 flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> Check API Key / Network
                  </span>
                )}
                {(!stats?.tinyFish.lastTestStatus || stats.tinyFish.lastTestStatus === 'not_tested') && (
                  <span className="text-slate-500">Not Tested Yet</span>
                )}
              </div>
              {stats?.tinyFish.lastTestedAt && (
                <span className="text-[10px] text-slate-400 block pt-1">
                  Tested: {new Date(stats.tinyFish.lastTestedAt).toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>

          {/* Test Result Alert */}
          {testResult && (
            <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
              testResult.success
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}>
              <div className="font-bold mb-0.5">
                {testResult.success ? 'TinyFish Connection Successful' : 'TinyFish Connection Result'}
              </div>
              <p>{testResult.message}</p>
            </div>
          )}

          {/* Sync Trigger Panel */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="font-bold text-slate-900 text-xs">
              Execute Live Scholarship Ingestion Run
            </div>
            <p className="text-[11px] text-slate-600">
              Generates privacy-preserving search queries, queries TinyFish Search for candidate portals, fetches public pages via TinyFish Fetch, extracts deadlines, normalizes schema, and updates database records.
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={syncQuery}
                onChange={(e) => setSyncQuery(e.target.value)}
                placeholder="Search query for live ingestion..."
                className="flex-1 text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
              />
              <button
                onClick={handleRunSync}
                disabled={isSyncing}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50 shrink-0 flex items-center justify-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Ingesting via TinyFish...' : 'Run Scholarship Sync'}</span>
              </button>
            </div>

            {syncResult && (
              <div className="mt-3 p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1">
                <div className="font-bold text-slate-900">
                  Ingestion Outcome: <span className="capitalize">{syncResult.status}</span>
                </div>
                <div className="text-slate-600">
                  Candidates Found: <strong>{syncResult.candidatesFound}</strong> • Fetched: <strong>{syncResult.successfullyFetched}</strong> • Added: <strong>{syncResult.recordsAdded}</strong> • Updated: <strong>{syncResult.recordsUpdated}</strong>
                </div>
                {syncResult.errors.length > 0 && (
                  <div className="text-rose-600 text-[11px] pt-1">
                    <strong>Logged Notes:</strong> {syncResult.errors.join('; ')}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Recent Ingestion Runs History */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <span>Recent Ingestion Pipeline Runs</span>
            </h3>
            <span className="text-xs text-slate-400">Provenance Audit</span>
          </div>

          <div className="space-y-3">
            {(stats?.recentIngestions || []).map((run) => (
              <div
                key={run.id}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="font-mono text-slate-900 font-semibold truncate max-w-md">
                    {run.query}
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    Started: {new Date(run.startedAt).toLocaleString()} • Trigger: {run.trigger}
                  </div>
                </div>

                <div className="flex items-center gap-3 text-right shrink-0">
                  <div className="text-[11px] text-slate-600">
                    <div>+{run.recordsAdded} Added • {run.recordsUpdated} Updated</div>
                    <div className="text-slate-400">{run.candidatesFound} Candidates</div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    run.status === 'success'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : run.status === 'partial'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    {run.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Reported Issues */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>User Discrepancy Reports ({stats?.reportsList?.length || 0})</span>
            </h3>
            <span className="text-xs text-slate-400">Community Quality Assurance</span>
          </div>

          {(stats?.reportsList || []).length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-400">
              No discrepancy reports logged. All published listings currently verified.
            </div>
          ) : (
            <div className="space-y-2.5">
              {(stats?.reportsList || []).map((rep) => (
                <div
                  key={rep.id}
                  className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900">
                      {rep.scholarshipName}
                    </div>
                    <div className="text-slate-600">
                      <strong>Issue ({rep.issueType}):</strong> {rep.description}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Reported: {new Date(rep.reportedAt).toLocaleString()} {rep.userEmail && `• By: ${rep.userEmail}`}
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md shrink-0">
                    Needs Audit
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
