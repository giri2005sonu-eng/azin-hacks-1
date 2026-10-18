/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import type {
  Scholarship,
  StudentProfile,
  ApplicationTrackerItem,
  UserDocument,
  NotificationItem,
  DocumentType,
  ApplicationStatus
} from './types/scholarship.ts';

import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';

import { LandingPage } from './pages/LandingPage.tsx';
import { DiscoveryPage } from './pages/DiscoveryPage.tsx';
import { ScholarshipDetailPage } from './pages/ScholarshipDetailPage.tsx';
import { DashboardPage } from './pages/DashboardPage.tsx';
import { OnboardingPage } from './pages/OnboardingPage.tsx';
import { TrackerPage } from './pages/TrackerPage.tsx';
import { SavedPage } from './pages/SavedPage.tsx';
import { ComparePage } from './pages/ComparePage.tsx';
import { DocumentsPage } from './pages/DocumentsPage.tsx';
import { NotificationsPage } from './pages/NotificationsPage.tsx';
import { AdminPage } from './pages/AdminPage.tsx';
import { InfoPages } from './pages/InfoPages.tsx';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname || '/');
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [comparingIds, setComparingIds] = useState<string[]>([]);
  const [applications, setApplications] = useState<ApplicationTrackerItem[]>([]);
  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync with browser navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path.split('?')[0]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Initial Data Fetch from Express backend
  useEffect(() => {
    const loadAppData = async () => {
      try {
        const [
          scholarshipsRes,
          profileRes,
          savedRes,
          appsRes,
          docsRes,
          notifsRes,
        ] = await Promise.all([
          fetch('/api/scholarships').then(r => r.json()).catch(() => ({ scholarships: [] })),
          fetch('/api/profile').then(r => r.json()).catch(() => null),
          fetch('/api/saved').then(r => r.json()).catch(() => ({ savedIds: [] })),
          fetch('/api/applications').then(r => r.json()).catch(() => []),
          fetch('/api/documents').then(r => r.json()).catch(() => []),
          fetch('/api/notifications').then(r => r.json()).catch(() => []),
        ]);

        if (scholarshipsRes.scholarships) setScholarships(scholarshipsRes.scholarships);
        if (profileRes) setProfile(profileRes);
        if (savedRes.savedIds) setSavedIds(savedRes.savedIds);
        if (Array.isArray(appsRes)) setApplications(appsRes);
        if (Array.isArray(docsRes)) setDocuments(docsRes);
        if (Array.isArray(notifsRes)) setNotifications(notifsRes);
      } catch (err) {
        console.error('Error initializing app data', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAppData();
  }, []);

  // Actions
  const handleToggleSave = async (scholarshipId: string) => {
    // Optimistic UI update
    setSavedIds(prev =>
      prev.includes(scholarshipId) ? prev.filter(id => id !== scholarshipId) : [...prev, scholarshipId]
    );

    try {
      await fetch(`/api/saved/${scholarshipId}`, { method: 'POST' });
    } catch (err) {
      console.error('Failed to toggle bookmark', err);
    }
  };

  const handleToggleCompare = (id: string) => {
    setComparingIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        if (prev.length >= 4) {
          alert('You can compare a maximum of 4 scholarships at a time.');
          return prev;
        }
        return [...prev, id];
      }
    });
  };

  const handleSaveProfile = async (updated: StudentProfile) => {
    setProfile(updated);
    try {
      await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch (err) {
      console.error('Failed to update profile', err);
    }
  };

  const handleAddToTracker = async (
    scholarshipId: string,
    status: ApplicationStatus = 'interested',
    notes: string = ''
  ) => {
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scholarshipId, status, notes }),
      });
      if (res.ok) {
        const item = await res.json();
        setApplications(prev => [item, ...prev]);
      }
    } catch (err) {
      console.error('Failed to add to tracker', err);
    }
  };

  const handleUpdateApplication = async (id: string, updates: Partial<ApplicationTrackerItem>) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    try {
      await fetch(`/api/applications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch (err) {
      console.error('Failed to update tracker', err);
    }
  };

  const handleDeleteApplication = async (id: string) => {
    setApplications(prev => prev.filter(a => a.id !== id));
    try {
      await fetch(`/api/applications/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to delete application', err);
    }
  };

  const handleUploadDocument = async (doc: {
    title: string;
    docType: DocumentType;
    fileName: string;
    fileSize: number;
    mimeType: string;
    consentGiven: boolean;
  }) => {
    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doc),
      });
      if (res.ok) {
        const newDoc = await res.json();
        setDocuments(prev => [newDoc, ...prev]);
      }
    } catch (err) {
      console.error('Failed to upload document', err);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
    try {
      await fetch(`/api/documents/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to delete document', err);
    }
  };

  const handleMarkNotificationAsRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'PUT' });
    } catch (err) {
      console.error('Failed to mark notification read', err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Route Resolver
  const renderCurrentView = () => {
    if (currentPath === '/' || currentPath === '') {
      return (
        <LandingPage
          scholarships={scholarships}
          profile={profile}
          savedIds={savedIds}
          onToggleSave={handleToggleSave}
          navigate={navigate}
        />
      );
    }

    if (currentPath.startsWith('/scholarships/')) {
      const id = currentPath.replace('/scholarships/', '');
      return (
        <ScholarshipDetailPage
          scholarshipId={id}
          scholarships={scholarships}
          profile={profile}
          isSaved={savedIds.includes(id)}
          onToggleSave={handleToggleSave}
          onAddToTracker={handleAddToTracker}
          navigate={navigate}
        />
      );
    }

    if (currentPath === '/scholarships') {
      const searchParams = new URLSearchParams(window.location.search);
      const queryParam = searchParams.get('q') || '';
      const openOnlyParam = searchParams.get('openOnly') === 'true';

      return (
        <DiscoveryPage
          scholarships={scholarships}
          profile={profile}
          savedIds={savedIds}
          onToggleSave={handleToggleSave}
          comparingIds={comparingIds}
          onToggleCompare={handleToggleCompare}
          navigate={navigate}
          initialQuery={queryParam}
          initialOpenOnly={openOnlyParam}
        />
      );
    }

    if (currentPath === '/dashboard') {
      return (
        <DashboardPage
          profile={profile}
          scholarships={scholarships}
          savedIds={savedIds}
          applications={applications}
          onToggleSave={handleToggleSave}
          navigate={navigate}
        />
      );
    }

    if (currentPath === '/onboarding') {
      return (
        <OnboardingPage
          initialProfile={profile}
          onSaveProfile={handleSaveProfile}
          navigate={navigate}
        />
      );
    }

    if (currentPath === '/applications') {
      return (
        <TrackerPage
          applications={applications}
          scholarships={scholarships}
          onUpdateStatus={handleUpdateApplication}
          onDeleteApplication={handleDeleteApplication}
          onAddApplication={handleAddToTracker}
          navigate={navigate}
        />
      );
    }

    if (currentPath === '/saved') {
      return (
        <SavedPage
          scholarships={scholarships}
          profile={profile}
          savedIds={savedIds}
          onToggleSave={handleToggleSave}
          comparingIds={comparingIds}
          onToggleCompare={handleToggleCompare}
          navigate={navigate}
        />
      );
    }

    if (currentPath === '/compare') {
      return (
        <ComparePage
          comparingIds={comparingIds}
          scholarships={scholarships}
          onRemoveCompare={handleToggleCompare}
          onClearCompare={() => setComparingIds([])}
          navigate={navigate}
        />
      );
    }

    if (currentPath === '/documents') {
      return (
        <DocumentsPage
          documents={documents}
          onUploadDocument={handleUploadDocument}
          onDeleteDocument={handleDeleteDocument}
          navigate={navigate}
        />
      );
    }

    if (currentPath === '/notifications') {
      return (
        <NotificationsPage
          notifications={notifications}
          onMarkAsRead={handleMarkNotificationAsRead}
          navigate={navigate}
        />
      );
    }

    if (currentPath === '/admin') {
      return <AdminPage />;
    }

    if (['/about', '/privacy', '/terms', '/help', '/contact'].includes(currentPath)) {
      const type = currentPath.replace('/', '') as any;
      return <InfoPages pageType={type} navigate={navigate} />;
    }

    // Default 404 fallback
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-8 text-center">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-800">Page Not Found</h2>
          <p className="text-xs text-slate-500">The requested address is not available.</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-blue-600 selection:text-white">
      <Navbar
        currentPath={currentPath}
        navigate={navigate}
        profile={profile}
        unreadCount={unreadCount}
        savedCount={savedIds.length}
      />

      <main className="flex-1">
        {isLoading ? (
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-500">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span>Connecting to BHAIYO KI PHADAI Database...</span>
            </div>
          </div>
        ) : (
          renderCurrentView()
        )}
      </main>

      <Footer navigate={navigate} />
    </div>
  );
}
