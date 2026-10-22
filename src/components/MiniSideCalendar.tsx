import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Sparkles,
  Ticket,
  Bookmark,
  ArrowUpRight,
} from 'lucide-react';
import { formatTime } from '../utils/dateUtils';

export const MiniSideCalendar: React.FC = () => {
  const {
    events,
    selectedCollege,
    setSelectedEvent,
    setActiveTab,
    setIsSideCalendarOpen,
    registeredEventIds,
    isItemSaved,
    toggleSaveItem,
  } = useApp();

  // Default to October 2026 where our campus events start (or current month if events exist)
  const [currentMonth, setCurrentMonth] = useState<Date>(() => new Date(2026, 9, 1)); // Oct 2026
  const [selectedDayIso, setSelectedDayIso] = useState<string | null>(null);

  const activeEvents = useMemo(() => {
    return events
      .filter((e) => {
        if (e.status === 'cancelled' || e.status === 'pending_approval') return false;
        if (selectedCollege !== 'All' && e.college !== selectedCollege) return false;
        return true;
      })
      .sort((a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime());
  }, [events, selectedCollege]);

  // Map YYYY-MM-DD -> events on that day
  const eventsByDate = useMemo(() => {
    const map = new Map<string, typeof activeEvents>();
    activeEvents.forEach((evt) => {
      const d = new Date(evt.start_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
        d.getDate()
      ).padStart(2, '0')}`;
      const existing = map.get(key) || [];
      existing.push(evt);
      map.set(key, existing);
    });
    return map;
  }, [activeEvents]);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sun

  const handlePrevMonth = () => {
    setSelectedDayIso(null);
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setSelectedDayIso(null);
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const monthLabel = currentMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  // Events to display in the bottom mini-agenda list
  const agendaEvents = useMemo(() => {
    if (selectedDayIso && eventsByDate.has(selectedDayIso)) {
      return eventsByDate.get(selectedDayIso) || [];
    }
    // Otherwise show events in the currently viewed month first, or next upcoming overall
    const inMonth = activeEvents.filter((e) => {
      const d = new Date(e.start_at);
      return d.getFullYear() === year && d.getMonth() === month;
    });
    return (inMonth.length > 0 ? inMonth : activeEvents).slice(0, 4);
  }, [selectedDayIso, eventsByDate, activeEvents, year, month]);

  const monthEventCount = useMemo(() => {
    return activeEvents.filter((e) => {
      const d = new Date(e.start_at);
      return d.getFullYear() === year && d.getMonth() === month;
    }).length;
  }, [activeEvents, year, month]);

  const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <aside
      aria-label="Mini Campus Event Calendar"
      className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden transition-colors"
    >
      {/* Cute Pastel Top Header */}
      <div className="bg-gradient-to-br from-blue-50/90 via-indigo-50/70 to-rose-50/60 dark:from-slate-800/90 dark:via-indigo-950/50 dark:to-slate-900 p-4 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-white dark:bg-slate-800 shadow-2xs border border-blue-100 dark:border-slate-700 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <CalendarIcon className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-xs font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                <span>Campus Pocket Calendar</span>
                <Sparkles className="w-3 h-3 text-amber-500" />
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {monthEventCount} {monthEventCount === 1 ? 'event' : 'events'} in {currentMonth.toLocaleDateString('en-US', { month: 'short' })}
              </p>
            </div>
          </div>

          {/* Month Quick Pills (Oct / Nov) */}
          <div className="flex items-center gap-1 bg-white/80 dark:bg-slate-800/90 p-0.5 rounded-xl border border-slate-200/70 dark:border-slate-700">
            <button
              onClick={handlePrevMonth}
              className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 px-1.5 min-w-[78px] text-center">
              {currentMonth.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Mini Month Switcher Tabs for Oct & Nov 2026 */}
        <div className="flex items-center gap-1.5 mt-2">
          <button
            onClick={() => {
              setSelectedDayIso(null);
              setCurrentMonth(new Date(2026, 9, 1));
            }}
            className={`flex-1 py-1 px-2 rounded-xl text-[10px] font-bold transition-all ${
              month === 9 && year === 2026
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-white/70 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800'
            }`}
          >
            Oct 2026 · Workshops
          </button>
          <button
            onClick={() => {
              setSelectedDayIso(null);
              setCurrentMonth(new Date(2026, 10, 1));
            }}
            className={`flex-1 py-1 px-2 rounded-xl text-[10px] font-bold transition-all ${
              month === 10 && year === 2026
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'bg-white/70 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800'
            }`}
          >
            Nov 2026 · InnoHack
          </button>
        </div>
      </div>

      {/* Compact 7-Column Aesthetic Calendar Grid */}
      <div className="p-3.5">
        <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
          {weekdays.map((day) => (
            <span
              key={day}
              className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500"
            >
              {day}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
            <div key={`empty-${idx}`} className="h-8" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const isoKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const dayEvents = eventsByDate.get(isoKey) || [];
            const hasEvents = dayEvents.length > 0;
            const hasHackathon = dayEvents.some((e) => e.is_hackathon);
            const hasRegistered = dayEvents.some((e) => registeredEventIds.includes(e.id));
            const isSelected = selectedDayIso === isoKey;
            const isToday = isoKey === '2026-10-21';

            return (
              <button
                key={isoKey}
                onClick={() => {
                  if (isSelected) {
                    setSelectedDayIso(null);
                  } else {
                    setSelectedDayIso(isoKey);
                  }
                }}
                className={`relative h-8 rounded-xl flex flex-col items-center justify-center text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white font-extrabold shadow-xs scale-105'
                    : hasHackathon
                    ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/70 hover:bg-amber-100/80 font-bold'
                    : hasEvents
                    ? 'bg-indigo-50/90 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 hover:bg-indigo-100/80 font-bold'
                    : isToday
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white ring-1 ring-slate-300 dark:ring-slate-600'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                }`}
                title={
                  hasEvents
                    ? `${dayEvents.map((e) => e.title).join(' • ')}`
                    : `Oct/Nov ${dayNum}`
                }
              >
                <span className="leading-none">{dayNum}</span>

                {/* Cute Indicator Dots */}
                {hasEvents && (
                  <div className="flex items-center gap-0.5 mt-0.5">
                    {dayEvents.slice(0, 3).map((ev, i) => (
                      <span
                        key={i}
                        className={`w-1 h-1 rounded-full ${
                          isSelected
                            ? 'bg-white'
                            : ev.is_hackathon
                            ? 'bg-amber-500'
                            : hasRegistered
                            ? 'bg-emerald-500'
                            : 'bg-blue-500 dark:bg-blue-400'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend Strip */}
        <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-slate-100 dark:border-slate-800/80 text-[10px] text-slate-400 dark:text-slate-500">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Hackathon
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              Club Event
            </span>
          </div>

          {selectedDayIso && (
            <button
              onClick={() => setSelectedDayIso(null)}
              className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
            >
              Show all
            </button>
          )}
        </div>
      </div>

      {/* Cute Mini Event Agenda List */}
      <div className="px-3.5 pb-3.5 space-y-2">
        <div className="flex items-center justify-between px-0.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {selectedDayIso
              ? `Events on ${new Date(selectedDayIso + 'T00:00:00').toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}`
              : `${currentMonth.toLocaleDateString('en-US', { month: 'short' })} Highlights`}
          </span>
          <button
            onClick={() => setActiveTab('calendar')}
            className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
          >
            <span>Full View</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        {agendaEvents.length === 0 ? (
          <div className="py-5 px-3 text-center rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              No events on this date
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
              Tap a highlighted date square above to preview events!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {agendaEvents.map((evt) => {
              const d = new Date(evt.start_at);
              const isSaved = isItemSaved('event', evt.id);
              const isReg = registeredEventIds.includes(evt.id);

              return (
                <div
                  key={evt.id}
                  onClick={() => setSelectedEvent(evt)}
                  className="p-2.5 rounded-2xl bg-slate-50/90 dark:bg-slate-800/60 hover:bg-blue-50/60 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/70 hover:border-blue-300 dark:hover:border-blue-500/60 transition-all cursor-pointer group flex items-start gap-2.5"
                >
                  {/* Cute Pastel Date Pill */}
                  <div
                    className={`w-10 py-1.5 rounded-xl text-center shrink-0 border ${
                      evt.is_hackathon
                        ? 'bg-amber-50 dark:bg-amber-950/80 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'
                        : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-700 text-blue-600 dark:text-blue-400'
                    }`}
                  >
                    <span className="block text-[9px] font-extrabold uppercase leading-none">
                      {d.toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="block text-sm font-black text-slate-900 dark:text-white leading-tight mt-0.5">
                      {d.getDate()}
                    </span>
                  </div>

                  {/* Event Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 truncate">
                        {evt.club_name.split(' ')[0]}
                      </span>
                      {isReg && (
                        <span className="text-[9px] font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-1.5 py-0.2 rounded">
                          Pass
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1 mt-0.5">
                      {evt.title}
                    </h4>

                    <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                      <span className="inline-flex items-center gap-0.5 font-mono">
                        <Clock className="w-2.5 h-2.5" />
                        {formatTime(evt.start_at)}
                      </span>
                      <span>·</span>
                      <span className="truncate inline-flex items-center gap-0.5">
                        <MapPin className="w-2.5 h-2.5 shrink-0" />
                        {evt.venue.split(',')[0]}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSaveItem('event', evt.id);
                    }}
                    className={`p-1 rounded-lg transition-colors self-center ${
                      isSaved
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-slate-300 dark:text-slate-600 hover:text-slate-500'
                    }`}
                    title={isSaved ? 'Saved' : 'Save event'}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-blue-600 dark:fill-blue-400' : ''}`} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer Pass Drawer Trigger */}
        <button
          onClick={() => setIsSideCalendarOpen(true)}
          className="w-full mt-1 py-2 px-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-xs flex items-center justify-between transition-all"
        >
          <span className="flex items-center gap-1.5">
            <Ticket className="w-3.5 h-3.5" />
            <span>My Event Passes & Reminders</span>
          </span>
          <span className="px-1.5 py-0.2 rounded-md bg-white/20 text-[10px] font-mono">
            {registeredEventIds.length}
          </span>
        </button>
      </div>
    </aside>
  );
};
