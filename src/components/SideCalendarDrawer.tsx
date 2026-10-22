import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Ticket,
  Download,
  ExternalLink,
  ChevronRight,
  QrCode,
  Building2,
  Trash2,
} from 'lucide-react';
import { formatDate, formatTime, downloadIcsCalendar, getGoogleCalendarUrl } from '../utils/dateUtils';

export const SideCalendarDrawer: React.FC = () => {
  const {
    isSideCalendarOpen,
    setIsSideCalendarOpen,
    events,
    registeredEventIds,
    toggleRegisterEvent,
    setSelectedEvent,
    setActiveTab,
  } = useApp();

  if (!isSideCalendarOpen) return null;

  const registeredEvents = events
    .filter((e) => registeredEventIds.includes(e.id))
    .sort((a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime());

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 dark:bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between animate-in slide-in-from-right duration-200 text-slate-800 dark:text-slate-100">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between bg-slate-50/50 dark:bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Registered Passes</h3>
                <span className="text-[10px] font-mono font-bold text-teal-800 dark:text-teal-300 bg-teal-100 dark:bg-teal-950/70 border border-teal-200/50 dark:border-teal-800/50 px-1.5 py-0.2 rounded-full">
                  {registeredEvents.length}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">KIET Deemed to be University Schedule</p>
            </div>
          </div>

          <button
            onClick={() => setIsSideCalendarOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable list */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-slate-700 dark:text-slate-300 text-xs">
          {registeredEvents.length === 0 ? (
            <div className="py-16 text-center">
              <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">No registered events yet</h4>
              <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                Explore campus workshops and InnoHack 2026 to register and secure your seat pass.
              </p>
              <button
                onClick={() => {
                  setIsSideCalendarOpen(false);
                  setActiveTab('events');
                }}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-xs"
              >
                Browse Campus Events
              </button>
            </div>
          ) : (
            registeredEvents.map((evt) => (
              <div
                key={evt.id}
                className="bg-white dark:bg-slate-850 rounded-2xl border border-teal-200/90 dark:border-teal-800/80 shadow-2xs p-4 space-y-3 hover:border-teal-400 transition-all group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-md border border-teal-200 dark:border-teal-800 mb-1">
                      <CheckCircle2 className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                      ENTRY CONFIRMED
                    </span>
                    <h4
                      onClick={() => {
                        setSelectedEvent(evt);
                        setIsSideCalendarOpen(false);
                      }}
                      className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 cursor-pointer"
                    >
                      {evt.title}
                    </h4>
                  </div>
                  <button
                    onClick={() => toggleRegisterEvent(evt.id)}
                    className="p-1.5 text-slate-300 dark:text-slate-600 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    title="Cancel Registration"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1 text-slate-500 dark:text-slate-400 text-[11px]">
                  <div className="flex items-center gap-1.5 font-mono text-slate-700 dark:text-slate-200 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span>{formatDate(evt.start_at)}</span>
                    <span className="text-slate-300 dark:text-slate-600">·</span>
                    <span>{formatTime(evt.start_at)}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                    <span className="truncate">{evt.venue}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                    <span className="truncate">{evt.club_name}</span>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() =>
                        downloadIcsCalendar(
                          evt.title,
                          evt.description,
                          evt.venue,
                          evt.start_at,
                          evt.end_at
                        )
                      }
                      className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-1"
                      title="Download .ics"
                    >
                      <Download className="w-3 h-3" />
                      <span>.ics Pass</span>
                    </button>
                    <a
                      href={getGoogleCalendarUrl(
                        evt.title,
                        evt.description,
                        evt.venue,
                        evt.start_at,
                        evt.end_at
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-1"
                      title="Google Calendar"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>GCal</span>
                    </a>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedEvent(evt);
                      setIsSideCalendarOpen(false);
                    }}
                    className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between">
          <button
            onClick={() => {
              setIsSideCalendarOpen(false);
              setActiveTab('calendar');
            }}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors text-center text-xs shadow-xs flex items-center justify-center gap-2"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Open Full Interactive Calendar</span>
          </button>
        </div>

      </div>
    </div>
  );
};
