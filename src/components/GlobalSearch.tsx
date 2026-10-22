import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  X,
  Zap,
  CalendarDays,
  Users,
  Briefcase,
  ChevronRight,
  Clock,
  MapPin,
  Sparkles,
  Command,
} from 'lucide-react';
import { formatDate, formatTime, getDeadlineLabel } from '../utils/dateUtils';
import { CampusEvent, Club, Recruitment } from '../types';

export const GlobalSearch: React.FC = () => {
  const {
    events,
    clubs,
    recruitments,
    setSelectedEvent,
    setSelectedClub,
    setSelectedRecruitment,
    setActiveTab,
  } = useApp();

  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setIsMobileExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Keyboard shortcut listener (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter results across categories
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return { hackathons: [], events: [], clubs: [], recruitments: [], totalCount: 0 };
    }

    const matchedEvents = events.filter((e) => {
      if (e.status === 'cancelled' || e.status === 'pending_approval') return false;
      const matchTitle = e.title.toLowerCase().includes(q);
      const matchDesc = e.description.toLowerCase().includes(q);
      const matchClub = e.club_name.toLowerCase().includes(q);
      const matchVenue = e.venue.toLowerCase().includes(q);
      const matchCategory = e.category.toLowerCase().includes(q);
      return matchTitle || matchDesc || matchClub || matchVenue || matchCategory;
    });

    const matchedHackathons = matchedEvents.filter(
      (e) => e.is_hackathon || e.category === 'Hackathon & Build Sprint'
    );
    const regularEvents = matchedEvents.filter(
      (e) => !e.is_hackathon && e.category !== 'Hackathon & Build Sprint'
    );

    const matchedClubs = clubs.filter((c) => {
      const matchName = c.name.toLowerCase().includes(q);
      const matchShort = c.short_name.toLowerCase().includes(q);
      const matchDesc = c.description.toLowerCase().includes(q);
      const matchLead = c.lead_name.toLowerCase().includes(q);
      const matchTag = c.tags.some((t) => t.toLowerCase().includes(q));
      return matchName || matchShort || matchDesc || matchLead || matchTag;
    });

    const matchedRecruitments = recruitments.filter((r) => {
      if (r.status === 'pending_approval') return false;
      const matchTitle = r.title.toLowerCase().includes(q);
      const matchDesc = r.role_description.toLowerCase().includes(q);
      const matchClub = r.club_name.toLowerCase().includes(q);
      const matchElig = r.eligibility.toLowerCase().includes(q);
      return matchTitle || matchDesc || matchClub || matchElig;
    });

    const totalCount =
      matchedHackathons.length + regularEvents.length + matchedClubs.length + matchedRecruitments.length;

    return {
      hackathons: matchedHackathons,
      events: regularEvents,
      clubs: matchedClubs,
      recruitments: matchedRecruitments,
      totalCount,
    };
  }, [query, events, clubs, recruitments]);

  const handleSelectHackathonOrEvent = (e: CampusEvent) => {
    setSelectedEvent(e);
    setIsOpen(false);
    setQuery('');
  };

  const handleSelectClub = (c: Club) => {
    setSelectedClub(c);
    setIsOpen(false);
    setQuery('');
  };

  const handleSelectRecruitment = (r: Recruitment) => {
    setSelectedRecruitment(r);
    setIsOpen(false);
    setQuery('');
  };

  const popularSearches = ['InnoHack 2026', 'DroidLabs', 'InnoGeeks', 'ROS2', 'E-Cell'];

  return (
    <div className="relative w-full max-w-lg" ref={containerRef}>
      {/* Search Input Bar in Navbar */}
      <div className="relative flex items-center w-full">
        <Search className="w-3.5 h-3.5 absolute left-3 text-slate-400 dark:text-slate-500 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search events, clubs, InnoHack 2026..."
          className="w-full pl-8 pr-12 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100/80 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 border border-slate-200/90 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500 transition-all font-medium"
        />

        {query ? (
          <button
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="absolute right-2.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-md transition-colors"
            aria-label="Clear query"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <div className="absolute right-2.5 hidden sm:flex items-center gap-0.5 pointer-events-none text-[10px] text-slate-400 dark:text-slate-400 font-mono bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 shadow-2xs">
            <span className="text-[11px]">⌘</span>K
          </div>
        )}
      </div>

      {/* Dropdown Results Card */}
      {isOpen && (
        <div className="absolute left-0 right-0 sm:left-auto sm:right-0 mt-2 w-full sm:w-[460px] max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-3 z-50 animate-in fade-in zoom-in-95 duration-100 overflow-hidden">
          {/* Header */}
          <div className="px-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300">
              {query ? `Search Results (${results.totalCount})` : 'Quick Campus Suggestions'}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">ESC to close</span>
          </div>

          <div className="max-h-[420px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
            {/* If empty query, show quick suggestions */}
            {!query && (
              <div className="p-4 space-y-3">
                <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                  Trending on KIET Campus:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setQuery(term);
                        inputRef.current?.focus();
                      }}
                      className="px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-blue-700 dark:hover:text-blue-300 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>{term}</span>
                    </button>
                  ))}
                </div>

                <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400">
                  Search across <span className="font-semibold text-slate-700 dark:text-slate-200">InnoHack 2026</span>, technical workshops, student clubs, and recruitment drives across Ghaziabad.
                </div>
              </div>
            )}

            {/* If query has no matches */}
            {query && results.totalCount === 0 && (
              <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">
                <Search className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="font-bold text-slate-800 dark:text-slate-200">No results found for "{query}"</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                  Check your spelling or search for "InnoHack", "Robotics", "Coding", or "KIET".
                </p>
              </div>
            )}

            {/* Hackathons Category */}
            {results.hackathons.length > 0 && (
              <div className="p-3">
                <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
                  <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Hackathons ({results.hackathons.length})</span>
                </div>
                <div className="mt-1 space-y-1">
                  {results.hackathons.map((hack) => (
                    <button
                      key={hack.id}
                      onClick={() => handleSelectHackathonOrEvent(hack)}
                      className="w-full text-left p-2 rounded-xl hover:bg-amber-50/50 dark:hover:bg-amber-950/40 transition-colors flex items-center justify-between group"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                            {hack.title}
                          </span>
                          {hack.prize_pool && (
                            <span className="text-[10px] font-extrabold text-amber-800 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-900/60 px-1.5 py-0.2 rounded-md font-mono shrink-0">
                              {hack.prize_pool}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-mono">
                          {formatDate(hack.start_at)} · {hack.venue}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Regular Events Category */}
            {results.events.length > 0 && (
              <div className="p-3">
                <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
                  <CalendarDays className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Events & Workshops ({results.events.length})</span>
                </div>
                <div className="mt-1 space-y-1">
                  {results.events.map((evt) => (
                    <button
                      key={evt.id}
                      onClick={() => handleSelectHackathonOrEvent(evt)}
                      className="w-full text-left p-2 rounded-xl hover:bg-blue-50/50 dark:hover:bg-blue-950/40 transition-colors flex items-center justify-between group"
                    >
                      <div className="min-w-0 pr-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate block">
                          {evt.title}
                        </span>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {evt.club_name} · <span className="font-mono">{formatDate(evt.start_at)}</span>
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Clubs Category */}
            {results.clubs.length > 0 && (
              <div className="p-3">
                <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider">
                  <Users className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  <span>Clubs & Societies ({results.clubs.length})</span>
                </div>
                <div className="mt-1 space-y-1">
                  {results.clubs.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleSelectClub(c)}
                      className="w-full text-left p-2 rounded-xl hover:bg-purple-50/50 dark:hover:bg-purple-950/40 transition-colors flex items-center justify-between group"
                    >
                      <div className="min-w-0 pr-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate block">
                          {c.name}
                        </span>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {c.college} · Lead: {c.lead_name}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Recruitments Category */}
            {results.recruitments.length > 0 && (
              <div className="p-3">
                <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-bold text-teal-800 dark:text-teal-400 uppercase tracking-wider">
                  <Briefcase className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>Recruitments & Calls ({results.recruitments.length})</span>
                </div>
                <div className="mt-1 space-y-1">
                  {results.recruitments.map((rec) => {
                    const dl = getDeadlineLabel(rec.deadline);
                    return (
                      <button
                        key={rec.id}
                        onClick={() => handleSelectRecruitment(rec)}
                        className="w-full text-left p-2 rounded-xl hover:bg-teal-50/50 dark:hover:bg-teal-950/40 transition-colors flex items-center justify-between group"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                              {rec.title}
                            </span>
                            <span className="text-[10px] font-semibold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-900/60 px-1.5 py-0.2 rounded-md font-mono shrink-0">
                              {dl.label}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {rec.club_name} · {rec.available_positions} openings
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 shrink-0" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Quick Footer */}
          {query && results.totalCount > 0 && (
            <div className="px-4 pt-2 pb-1 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
              <span>Click any result to view full details</span>
              <button
                onClick={() => {
                  setActiveTab('events');
                  setIsOpen(false);
                }}
                className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
              >
                Browse All Events →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
