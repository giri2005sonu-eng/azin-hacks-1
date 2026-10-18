import React from 'react';
import type { NotificationItem } from '../types/scholarship.ts';
import {
  Bell,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Check
} from 'lucide-react';

interface NotificationsPageProps {
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  navigate: (path: string) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({
  notifications,
  onMarkAsRead,
  navigate,
}) => {
  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'match':
        return <Sparkles className="w-5 h-5 text-blue-600" />;
      case 'deadline':
        return <Clock className="w-5 h-5 text-rose-600" />;
      case 'verification':
        return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
      default:
        return <Bell className="w-5 h-5 text-indigo-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <Bell className="w-4 h-4" />
            <span>Alerts & Reminders</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Notifications Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time updates on approaching application deadlines, verified portal openings, and new matched schemes.
          </p>
        </div>

        {notifications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">You're all caught up!</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No new alerts. As state portals activate or deadlines approach your saved scholarships, notifications will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                  notif.read
                    ? 'bg-white border-slate-200'
                    : 'bg-blue-50/50 border-blue-200 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-xl shrink-0 ${
                    notif.read ? 'bg-slate-100' : 'bg-white shadow-xs'
                  }`}>
                    {getIcon(notif.type)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900">
                        {notif.title}
                      </h4>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {notif.message}
                    </p>
                    <span className="text-[10px] text-slate-400 block pt-1">
                      {new Date(notif.timestamp).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {notif.actionUrl && (
                    <button
                      onClick={() => {
                        onMarkAsRead(notif.id);
                        navigate(notif.actionUrl!);
                      }}
                      className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1"
                    >
                      <span>View</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {!notif.read && (
                    <button
                      onClick={() => onMarkAsRead(notif.id)}
                      className="p-1.5 text-slate-400 hover:text-blue-600"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
