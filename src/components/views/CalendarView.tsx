import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  CheckCircle2,
  Bookmark,
  Zap,
  Download,
  ExternalLink,
  RotateCcw,
  Building,
  Award,
  CalendarCheck,
  Sparkles,
  Ticket,
  QrCode,
  Building2,
} from 'lucide-react';
import { formatDate, formatTime, downloadIcsCalendar, getGoogleCalendarUrl } from '../../utils/dateUtils';
import { CampusEvent } from '../../types';

export const CalendarView: React.FC = () => {
  const {
    events,
    registeredEventIds,
    toggleRegisterEvent,
    isEventRegistered,
    setSelectedEvent,
    selectedCollege,
  } = useApp();

  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 9, 1)); // October 2026
  // Selected day: null means show all registered events; a date string means show that specific date's registered/scheduled events
  const [selectedDayStr, setSelectedDayStr] = useState<string | null>('2026-10-25');
  const [filterMode, setFilterMode] = useState<'all_registered' | 'selected_day'>('selected_day');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const resetToCurrent = () => {
    setCurrentDate(new Date(2026, 9, 1));
    setSelectedDayStr('2026-10-25');
  };

  // Filter campus events by college
  const relevantEvents = useMemo(() => {
    return events.filter((evt) => {
      if (evt.status === 'cancelled' || evt.status === 'pending_approval') return false;
      if (selectedCollege !== 'All' && evt.college !== selectedCollege) return false;
      return true;
    });
  }, [events, selectedCollege]);

  // All registered events
  const myRegisteredEvents = useMemo(() => {
    return relevantEvents
      .filter((e) => registeredEventIds.includes(e.id))
      .sort((a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime());
  }, [relevantEvents, registeredEventIds]);

  // Days array for calendar month matrix
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const daysArray = useMemo(() => {
    const days: {
      dayNumber: number | null;
      dateStr: string | null;
      events: CampusEvent[];
      hasRegistered: boolean;
      registeredCount: number;
    }[] = [];

    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ dayNumber: null, dateStr: null, events: [], hasRegistered: false, registeredCount: 0 });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dayDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayEvents = relevantEvents.filter((evt) => {
        const evtDate = new Date(evt.start_at);
        return (
          evtDate.getFullYear() === year &&
          evtDate.getMonth() === month &&
          evtDate.getDate() === d
        );
      });

      const registeredForThisDay = dayEvents.filter((e) => registeredEventIds.includes(e.id));

      days.push({
        dayNumber: d,
        dateStr: dayDateStr,
        events: dayEvents,
        hasRegistered: registeredForThisDay.length > 0,
        registeredCount: registeredForThisDay.length,
      });
    }

    return days;
  }, [year, month, daysInMonth, firstDayIndex, relevantEvents, registeredEventIds]);

  // Events to show in the side panel
  const sideEventsToDisplay = useMemo(() => {
    if (filterMode === 'all_registered') {
      return myRegisteredEvents;
    }

    if (selectedDayStr) {
      return relevantEvents
        .filter((evt) => {
          const d = new Date(evt.start_at);
          const formatted = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
          return formatted === selectedDayStr;
        })
        .sort((a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime());
    }

    return myRegisteredEvents;
  }, [filterMode, selectedDayStr, myRegisteredEvents, relevantEvents]);

  const selectedDateObject = selectedDayStr ? new Date(selectedDayStr) : null;
  const formattedSelectedDate = selectedDateObject
    ? selectedDateObject.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })
    : 'All Dates';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
            <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>KIET Deemed to be University</span>
            <span aria-hidden="true">·</span>
            <span>Personal Campus Schedule</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Interactive Calendar & Registered Events
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
            View your confirmed event registrations on the side and explore dates across the semester.
          </p>
        </div>

        {/* Quick status pill */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl px-3.5 py-2 shadow-2xs">
          <Ticket className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-slate-900 dark:text-white font-mono tabular-nums">
              {registeredEventIds.length}
            </span>{' '}
            <span className="text-slate-500 dark:text-slate-400">Confirmed Registrations</span>
          </div>
        </div>
      </div>

      {/* Classy Main 2-Column Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left 7 Columns: Classy Interactive Calendar */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-6 sm:p-7 space-y-6 transition-colors">
          {/* Calendar Month Navigation Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">{monthName}</h2>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">KIET Academic Term 2026-27</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={prevMonth}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={resetToCurrent}
                className="px-3 py-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/60 rounded-xl transition-colors border border-blue-200 dark:border-blue-800"
              >
                Today
              </button>
              <button
                onClick={nextMonth}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                aria-label="Next month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Day of Week Labels */}
          <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Calendar Month Grid */}
          <div className="grid grid-cols-7 gap-2">
            {daysArray.map((cell, idx) => {
              if (cell.dayNumber === null) {
                return (
                  <div
                    key={`empty-${idx}`}
                    className="h-16 sm:h-20 rounded-2xl bg-slate-50/40 dark:bg-slate-800/30 border border-transparent"
                  />
                );
              }

              const isSelected = selectedDayStr === cell.dateStr;
              const hasEvents = cell.events.length > 0;
              const hasReg = cell.hasRegistered;

              return (
                <button
                  key={`day-${cell.dayNumber}`}
                  onClick={() => {
                    setSelectedDayStr(cell.dateStr);
                    setFilterMode('selected_day');
                  }}
                  className={`h-16 sm:h-20 p-1.5 sm:p-2 rounded-2xl border transition-all text-left flex flex-col justify-between relative group ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300 dark:ring-blue-800'
                      : hasReg
                      ? 'bg-teal-50/50 dark:bg-teal-950/40 hover:bg-teal-50 dark:hover:bg-teal-900/40 border-teal-200 dark:border-teal-800/80 text-slate-900 dark:text-slate-100'
                      : hasEvents
                      ? 'bg-slate-50/80 dark:bg-slate-800/50 hover:bg-blue-50/40 dark:hover:bg-slate-800 border-slate-200/80 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                      : 'bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {/* Top Day Number Row */}
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-xs font-mono font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                        isSelected
                          ? 'bg-white text-blue-700'
                          : hasReg
                          ? 'bg-teal-600 dark:bg-teal-500 text-white shadow-2xs'
                          : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {cell.dayNumber}
                    </span>

                    {/* Small tag if registered */}
                    {hasReg && !isSelected && (
                      <span className="hidden sm:inline-block text-[9px] font-bold text-teal-700 dark:text-teal-300 bg-teal-100/70 dark:bg-teal-900/60 px-1 rounded uppercase">
                        Pass ✓
                      </span>
                    )}
                  </div>

                  {/* Bottom preview info */}
                  <div className="w-full truncate text-[10px] leading-tight">
                    {hasReg ? (
                      <span className={`font-semibold truncate block ${isSelected ? 'text-blue-100' : 'text-teal-800 dark:text-teal-300'}`}>
                        {cell.registeredCount} Booked
                      </span>
                    ) : hasEvents ? (
                      <span className={`truncate block font-medium ${isSelected ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                        {cell.events[0].title.slice(0, 10)}...
                      </span>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Calendar Legend */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 gap-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-teal-600 dark:bg-teal-400" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">Registered Pass Confirmed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-600 dark:bg-blue-400" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">Selected Day</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600" />
                <span>Available Event</span>
              </div>
            </div>

            <span className="text-slate-400 dark:text-slate-500 font-mono">Timezone: Asia/Kolkata (IST)</span>
          </div>
        </div>

        {/* Right 5 Columns: Classy "Registered Events in Side" View */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Side Panel Header with Filter Tabs */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-6 space-y-4 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                  Side Schedule Deck
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {filterMode === 'all_registered' ? 'All Registered Passes' : 'Day Schedule'}
                </h3>
              </div>

              {/* Toggle: Selected Day vs All Registered */}
              <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center text-xs font-semibold">
                <button
                  onClick={() => setFilterMode('selected_day')}
                  className={`px-2.5 py-1 rounded-lg transition-colors text-[11px] ${
                    filterMode === 'selected_day'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-2xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Selected Day
                </button>
                <button
                  onClick={() => setFilterMode('all_registered')}
                  className={`px-2.5 py-1 rounded-lg transition-colors text-[11px] ${
                    filterMode === 'all_registered'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-2xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  All Registered ({registeredEventIds.length})
                </button>
              </div>
            </div>

            {/* Context label */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium truncate">
                {filterMode === 'selected_day' ? formattedSelectedDate : 'Full Semester Schedule'}
              </span>
              <span className="text-xs font-mono font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200/50 dark:border-blue-800/50 px-2 py-0.5 rounded-md shrink-0">
                {sideEventsToDisplay.length} Event{sideEventsToDisplay.length === 1 ? '' : 's'}
              </span>
            </div>

            {/* Event List on the side */}
            <div className="space-y-3.5 max-h-[580px] overflow-y-auto pr-1">
              {sideEventsToDisplay.length === 0 ? (
                <div className="py-12 px-4 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                  <CalendarCheck className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2.5" />
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">No events on this date</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                    Select a highlighted date on the calendar, or switch to "All Registered" to view your active passes.
                  </p>
                  <button
                    onClick={() => setFilterMode('all_registered')}
                    className="mt-3.5 px-3.5 py-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-xl transition-colors"
                  >
                    View All Registered Passes ({registeredEventIds.length})
                  </button>
                </div>
              ) : (
                sideEventsToDisplay.map((evt) => {
                  const isRegistered = isEventRegistered(evt.id);

                  return (
                    <div
                      key={evt.id}
                      className={`rounded-2xl border p-4 sm:p-5 transition-all shadow-2xs flex flex-col justify-between group ${
                        isRegistered
                          ? 'bg-white dark:bg-slate-850 border-teal-200/90 dark:border-teal-800/80 hover:border-teal-400'
                          : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:border-blue-300'
                      }`}
                    >
                      <div>
                        {/* Top Badge Row */}
                        <div className="flex items-center justify-between text-xs mb-2">
                          <div className="flex items-center gap-1.5">
                            {isRegistered ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-0.5 rounded-full border border-teal-200 dark:border-teal-800">
                                <CheckCircle2 className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                                REGISTERED PASS
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                                Open Seat
                              </span>
                            )}
                            {evt.is_hackathon && (
                              <span className="text-[10px] font-extrabold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                                Hackathon
                              </span>
                            )}
                          </div>

                          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                            {evt.club_name}
                          </span>
                        </div>

                        {/* Title */}
                        <h4
                          onClick={() => setSelectedEvent(evt)}
                          className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer"
                        >
                          {evt.title}
                        </h4>

                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                          {evt.description}
                        </p>

                        {/* Timing and Venue */}
                        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                          <div className="flex items-center gap-1.5 font-mono">
                            <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{formatDate(evt.start_at)}</span>
                            <span className="text-slate-300 dark:text-slate-600">·</span>
                            <span>{formatTime(evt.start_at)} – {formatTime(evt.end_at)}</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                            <span className="truncate">{evt.venue}</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Action Row */}
                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                        {/* 1-Click Calendar Export */}
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
                            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
                            title="Download .ics Calendar File"
                          >
                            <Download className="w-3.5 h-3.5" />
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
                            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
                            title="Add to Google Calendar"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>

                        {/* Registration Toggle Button */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => toggleRegisterEvent(evt.id)}
                            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all shadow-2xs ${
                              isRegistered
                                ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 hover:bg-red-50 dark:hover:bg-red-950/60 hover:text-red-700 dark:hover:text-red-300 hover:border-red-200 dark:hover:border-red-800'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                          >
                            {isRegistered ? 'Registered ✓' : 'Register Seat'}
                          </button>

                          <button
                            onClick={() => setSelectedEvent(evt)}
                            className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
