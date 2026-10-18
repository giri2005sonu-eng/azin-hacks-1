import React, { useState } from 'react';
import {
  GraduationCap,
  Search,
  LayoutDashboard,
  CheckSquare,
  FileText,
  Bell,
  Shield,
  Menu,
  X,
  Bookmark,
  Sparkles,
  GitCompare
} from 'lucide-react';
import type { StudentProfile } from '../types/scholarship.ts';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
  profile: StudentProfile | null;
  unreadCount: number;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  navigate,
  profile,
  unreadCount,
  savedCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Explore Scholarships', path: '/scholarships', icon: Search },
    { label: 'My Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Application Tracker', path: '/applications', icon: CheckSquare },
    { label: 'Compare', path: '/compare', icon: GitCompare },
    { label: 'Doc Vault', path: '/documents', icon: FileText },
    { label: 'Admin & Sync', path: '/admin', icon: Shield },
  ];

  const handleNav = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
      {/* Top micro banner distinguishing data credibility */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-xs py-1 px-4 text-center font-medium text-blue-100 flex items-center justify-center gap-2">
        <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>
          <strong>BHAIYO KI PHADAI:</strong> Har Student Ka Haq, Har Scholarship Ki Khabar • Powered by TinyFish Search & Fetch Live Extraction
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <button
            onClick={() => handleNav('/')}
            className="flex items-center gap-3 text-left focus:outline-none group"
            aria-label="BHAIYO KI PHADAI Home"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-extrabold text-lg sm:text-xl tracking-tight text-white flex items-center gap-1.5">
                BHAIYO KI PHADAI
                <span className="text-[10px] font-bold tracking-widest uppercase bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/30">
                  INDIA
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                AI-Powered Indian Scholarship Discovery
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
              return (
                <button
                  key={link.path}
                  onClick={() => handleNav(link.path)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Saved Bookmarks Icon */}
            <button
              onClick={() => handleNav('/saved')}
              className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Saved Scholarships"
              aria-label="View Saved Scholarships"
            >
              <Bookmark className="w-5 h-5" />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Notifications Bell */}
            <button
              onClick={() => handleNav('/notifications')}
              className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Notifications"
              aria-label="View Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Student Profile Quick Chip */}
            <button
              onClick={() => handleNav('/onboarding')}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-left transition-colors"
              aria-label="Edit Student Profile"
            >
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
                {profile?.name ? profile.name[0].toUpperCase() : 'S'}
              </div>
              <div className="text-xs">
                <span className="font-semibold block text-slate-200 truncate max-w-[100px]">
                  {profile?.name || 'Student Profile'}
                </span>
                <span className="text-[10px] text-blue-400 font-medium">
                  {profile?.profileCompletedPercentage || 0}% Complete
                </span>
              </div>
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Open navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentPath === link.path;
            return (
              <button
                key={link.path}
                onClick={() => handleNav(link.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{link.label}</span>
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => handleNav('/onboarding')}
              className="flex items-center gap-2 text-sm text-blue-400 font-medium"
            >
              <span>Edit Profile ({profile?.name || 'Student'})</span>
            </button>
            <button
              onClick={() => handleNav('/admin')}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
            >
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
