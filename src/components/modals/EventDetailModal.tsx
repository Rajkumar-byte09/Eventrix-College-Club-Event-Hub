import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  Bookmark,
  Bell,
  Download,
  AlertTriangle,
  Building,
  Users,
  Check,
  Edit2,
  Trash2,
} from 'lucide-react';
import {
  formatFullDateTime,
  formatTime,
  formatDate,
  downloadIcsCalendar,
  getGoogleCalendarUrl,
} from '../../utils/dateUtils';

export const EventDetailModal: React.FC = () => {
  const {
    selectedEvent,
    setSelectedEvent,
    setSelectedClub,
    clubs,
    toggleSaveItem,
    isItemSaved,
    toggleReminder,
    hasReminder,
    toggleRegisterEvent,
    isEventRegistered,
    currentUser,
    cancelEvent,
    deleteEvent,
  } = useApp();

  const [reminderSelected, setReminderSelected] = useState('24 hours before');
  const [showReminderMenu, setShowReminderMenu] = useState(false);

  if (!selectedEvent) return null;

  const isSaved = isItemSaved('event', selectedEvent.id);
  const isReminded = hasReminder('event', selectedEvent.id);
  const isOwnerOrAdmin =
    currentUser.role === 'admin' ||
    (currentUser.role === 'coordinator' && currentUser.name === selectedEvent.created_by);

  const hostClub = clubs.find((c) => c.id === selectedEvent.club_id);

  const handleOpenClub = () => {
    if (hostClub) {
      setSelectedClub(hostClub);
    }
  };

  const handleSetReminder = (leadTime: string) => {
    toggleReminder(
      'event',
      selectedEvent.id,
      selectedEvent.title,
      selectedEvent.start_at,
      leadTime
    );
    setShowReminderMenu(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col transition-colors">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between">
          <div className="flex-1 pr-4">
            {/* Status indicator - text label without relying on color alone */}
            <div className="flex items-center gap-2 mb-2">
              {selectedEvent.status === 'cancelled' ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/60 px-2.5 py-0.5 rounded border border-red-200 dark:border-red-800">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                  Cancelled
                </span>
              ) : selectedEvent.status === 'updated' ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  Details Updated
                </span>
              ) : selectedEvent.status === 'pending_approval' ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-0.5 rounded border border-purple-200 dark:border-purple-800">
                  Pending Admin Approval
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-0.5 rounded border border-teal-200 dark:border-teal-800">
                  Confirmed Upcoming
                </span>
              )}

              <span className="text-xs text-slate-400 dark:text-slate-500">·</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{selectedEvent.category}</span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-snug">
              {selectedEvent.title}
            </h2>

            <button
              onClick={handleOpenClub}
              className="mt-1 flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold transition-colors cursor-pointer"
            >
              <Building className="w-3.5 h-3.5" />
              <span>Hosted by {selectedEvent.club_name}</span>
            </button>
          </div>

          <button
            onClick={() => setSelectedEvent(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700 dark:text-slate-300 text-sm">
          {/* Status Note banner if updated or cancelled */}
          {selectedEvent.status_note && (
            <div className={`p-3.5 rounded-xl border flex items-start gap-2.5 ${
              selectedEvent.status === 'cancelled'
                ? 'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-900/60 text-red-800 dark:text-red-300'
                : 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-300'
            }`}>
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-semibold block">Organizer Update Note</span>
                <span>{selectedEvent.status_note}</span>
              </div>
            </div>
          )}

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 flex items-start gap-3">
              <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Date & Time</p>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  {formatDate(selectedEvent.start_at)}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {formatTime(selectedEvent.start_at)} – {formatTime(selectedEvent.end_at)} (IST)
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 flex items-start gap-3">
              <MapPin className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Location</p>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  {selectedEvent.venue}
                </p>
                {selectedEvent.is_online && selectedEvent.online_url && (
                  <a
                    href={selectedEvent.online_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 mt-0.5"
                  >
                    <span>Open Virtual Meeting Room</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
              About This Event
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm whitespace-pre-line">
              {selectedEvent.description}
            </p>
          </div>

          {/* Metadata row */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 dark:text-slate-500 gap-2">
            <div>
              <span>Created by {selectedEvent.created_by}</span>
              <span className="mx-1.5">·</span>
              <span>Updated {formatDate(selectedEvent.updated_at)}</span>
            </div>
            {selectedEvent.registered_count !== undefined && selectedEvent.capacity && (
              <div className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-400">
                <Users className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                <span>
                  {selectedEvent.registered_count} / {selectedEvent.capacity} seats filled
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 transition-colors">
          {/* Calendar export & Reminder */}
          <div className="flex items-center gap-2">
            {/* Save Bookmark */}
            <button
              onClick={() => toggleSaveItem('event', selectedEvent.id)}
              className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer ${
                isSaved
                  ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-blue-600 text-blue-600 dark:fill-blue-400 dark:text-blue-400' : ''}`} />
              <span>{isSaved ? 'Saved' : 'Save Event'}</span>
            </button>

            {/* Reminder button */}
            <div className="relative">
              <button
                onClick={() => setShowReminderMenu(!showReminderMenu)}
                className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isReminded
                    ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <Bell className={`w-3.5 h-3.5 ${isReminded ? 'fill-amber-500 text-amber-600 dark:text-amber-400' : ''}`} />
                <span>{isReminded ? 'Reminder Set' : 'Set Reminder'}</span>
              </button>

              {showReminderMenu && (
                <div className="absolute left-0 bottom-full mb-2 w-52 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-2 z-50 text-xs transition-colors">
                  <p className="px-2 py-1 font-semibold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider">
                    Alert Time
                  </p>
                  <button
                    onClick={() => handleSetReminder('2 hours before')}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer"
                  >
                    2 hours before event
                  </button>
                  <button
                    onClick={() => handleSetReminder('24 hours before')}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer"
                  >
                    24 hours (1 day) before
                  </button>
                  <button
                    onClick={() => handleSetReminder('Morning of event')}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer"
                  >
                    Morning of event (8:00 AM)
                  </button>
                  {isReminded && (
                    <button
                      onClick={() => handleSetReminder('remove')}
                      className="w-full text-left px-2 py-1.5 rounded hover:bg-red-50 dark:hover:bg-red-950/50 text-red-600 dark:text-red-400 border-t border-slate-100 dark:border-slate-700 mt-1 cursor-pointer"
                    >
                      Turn off reminder
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Export .ics */}
            <button
              onClick={() =>
                downloadIcsCalendar(
                  selectedEvent.title,
                  selectedEvent.description,
                  selectedEvent.venue,
                  selectedEvent.start_at,
                  selectedEvent.end_at
                )
              }
              title="Download iCal (.ics) file"
              className="p-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Primary Registration / Action button */}
          <div className="flex items-center gap-2">
            {isOwnerOrAdmin && (
              <button
                onClick={() => {
                  if (window.confirm('Mark this event as cancelled?')) {
                    cancelEvent(selectedEvent.id);
                  }
                }}
                className="px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors cursor-pointer"
              >
                Mark Cancelled
              </button>
            )}

            {selectedEvent.status !== 'cancelled' && (
              <button
                onClick={() => toggleRegisterEvent(selectedEvent.id)}
                className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ${
                  isEventRegistered(selectedEvent.id)
                    ? 'bg-teal-50 dark:bg-teal-950/60 border border-teal-300 dark:border-teal-700 text-teal-800 dark:text-teal-200 hover:bg-red-50 dark:hover:bg-red-950/60 hover:text-red-700 dark:hover:text-red-300 hover:border-red-200 dark:hover:border-red-800'
                    : 'bg-teal-600 hover:bg-teal-700 text-white'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isEventRegistered(selectedEvent.id) ? 'Seat Confirmed (Registered ✓)' : 'Confirm Seat Pass'}</span>
              </button>
            )}

            {selectedEvent.registration_url && selectedEvent.status !== 'cancelled' && (
              <a
                href={selectedEvent.registration_url}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>External Link</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
