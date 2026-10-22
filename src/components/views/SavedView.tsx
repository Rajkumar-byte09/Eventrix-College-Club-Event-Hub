import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bookmark,
  Calendar,
  Briefcase,
  Bell,
  Trash2,
  ExternalLink,
  Clock,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import { formatDate, formatTime, getDeadlineLabel } from '../../utils/dateUtils';

export const SavedView: React.FC = () => {
  const {
    currentUser,
    savedItems,
    reminders,
    events,
    recruitments,
    toggleSaveItem,
    toggleReminder,
    setSelectedEvent,
    setSelectedRecruitment,
    setActiveTab,
    setIsProfileModalOpen,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'events' | 'recruitments' | 'reminders'>('events');

  const mySavedEvents = savedItems
    .filter((s) => s.user_id === currentUser.id && s.item_type === 'event')
    .map((s) => ({ saveRecord: s, event: events.find((e) => e.id === s.item_id) }))
    .filter((item) => item.event !== undefined);

  const mySavedRecruitments = savedItems
    .filter((s) => s.user_id === currentUser.id && s.item_type === 'recruitment')
    .map((s) => ({ saveRecord: s, recruitment: recruitments.find((r) => r.id === s.item_id) }))
    .filter((item) => item.recruitment !== undefined);

  const myReminders = reminders.filter((r) => r.user_id === currentUser.id && r.status === 'active');

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
            <span>Personal Bookmarks</span>
            <span aria-hidden="true">·</span>
            <span>{currentUser.name}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Bookmarks & Opted-In Reminders
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
            Keep track of bookmarked events, drives, and scheduled reminders before club recruitment windows close.
          </p>
        </div>

        <button
          onClick={() => setIsProfileModalOpen(true)}
          className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Sliders className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
          <span>Reminder Preferences</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-xs font-semibold">
        <button
          onClick={() => setActiveSubTab('events')}
          className={`pb-3 flex items-center gap-1.5 transition-colors relative cursor-pointer ${
            activeSubTab === 'events'
              ? 'text-blue-600 dark:text-blue-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 dark:after:bg-blue-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Bookmarked Events</span>
          <span className="ml-1 text-[11px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.2 rounded-full">
            {mySavedEvents.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('recruitments')}
          className={`pb-3 flex items-center gap-1.5 transition-colors relative cursor-pointer ${
            activeSubTab === 'recruitments'
              ? 'text-blue-600 dark:text-blue-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 dark:after:bg-blue-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Bookmarked Recruitments</span>
          <span className="ml-1 text-[11px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.2 rounded-full">
            {mySavedRecruitments.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('reminders')}
          className={`pb-3 flex items-center gap-1.5 transition-colors relative cursor-pointer ${
            activeSubTab === 'reminders'
              ? 'text-blue-600 dark:text-blue-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 dark:after:bg-blue-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Scheduled Reminders</span>
          <span className="ml-1 text-[11px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.2 rounded-full">
            {myReminders.length}
          </span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeSubTab === 'events' && (
        <div>
          {mySavedEvents.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
              <Bookmark className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">No events bookmarked yet</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                Explore campus workshops, guest lectures, and student activities, then bookmark your favorites for easy access.
              </p>
              <button
                onClick={() => setActiveTab('events')}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Browse Campus Events
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mySavedEvents.map(({ saveRecord, event }) => {
                if (!event) return null;
                return (
                  <div
                    key={saveRecord.id}
                    className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-blue-300 dark:hover:border-blue-500 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{event.club_name}</span>
                        <span>{event.category}</span>
                      </div>

                      <h3
                        onClick={() => setSelectedEvent(event)}
                        className="text-base font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                      >
                        {event.title}
                      </h3>

                      <div className="mt-3 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1.5 font-mono">
                          <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                          <span>{formatDate(event.start_at)}</span>
                          <span className="text-slate-300 dark:text-slate-600">·</span>
                          <span>{formatTime(event.start_at)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                          <span className="truncate">{event.venue}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <button
                        onClick={() => toggleSaveItem('event', event.id)}
                        className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>

                      <button
                        onClick={() => setSelectedEvent(event)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'recruitments' && (
        <div>
          {mySavedRecruitments.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
              <Briefcase className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">No recruitment calls saved yet</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                Explore club vacancies and junior positions, then bookmark them so you don't miss application deadlines.
              </p>
              <button
                onClick={() => setActiveTab('recruitments')}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Explore Open Recruitments
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {mySavedRecruitments.map(({ saveRecord, recruitment }) => {
                if (!recruitment) return null;
                const dl = getDeadlineLabel(recruitment.deadline);

                return (
                  <div
                    key={saveRecord.id}
                    className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-blue-300 dark:hover:border-blue-500 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{recruitment.club_name}</span>
                        <span aria-hidden="true">·</span>
                        <span className={`font-semibold ${dl.isUrgent ? 'text-amber-700 dark:text-amber-400' : 'text-slate-600 dark:text-slate-400'}`}>
                          {dl.label}
                        </span>
                      </div>

                      <h3
                        onClick={() => setSelectedRecruitment(recruitment)}
                        className="text-base font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                      >
                        {recruitment.title}
                      </h3>

                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Eligibility: {recruitment.eligibility}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => toggleSaveItem('recruitment', recruitment.id)}
                        className="p-2 text-xs text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                        title="Remove bookmark"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setSelectedRecruitment(recruitment)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                      >
                        View
                      </button>

                      <a
                        href={recruitment.application_url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                      >
                        <span>Apply</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'reminders' && (
        <div>
          {myReminders.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
              <Bell className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">No active scheduled reminders</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                Open any event or recruitment detail view and click "Set Reminder" to receive alerts prior to deadlines.
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden transition-colors">
              {myReminders.map((rem) => (
                <div key={rem.id} className="p-4 sm:p-5 flex items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">
                        {rem.item_type === 'event' ? 'Event Reminder' : 'Recruitment Deadline Reminder'}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{rem.item_title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Alert schedule: <span className="font-semibold text-slate-700 dark:text-slate-300">{rem.lead_time_label}</span> (Delivery: In-App Notice & Campus Email)
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleReminder(rem.item_type, rem.item_id, rem.item_title, rem.target_date)}
                    className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                    title="Dismiss reminder"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
