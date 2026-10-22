import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Calendar,
  Clock,
  MapPin,
  Bookmark,
  RotateCcw,
  AlertTriangle,
  Building,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { formatDate, formatTime } from '../../utils/dateUtils';
import { EventCategory } from '../../types';

export const EventsView: React.FC = () => {
  const { events, clubs, selectedCollege, setSelectedEvent, toggleSaveItem, isItemSaved } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedClubId, setSelectedClubId] = useState<string>('All');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'weekend' | 'week'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const categories = [
    'All',
    'Hackathon & Build Sprint',
    'Technology & Coding',
    'Robotics & Hardware',
    'Design & Creative',
    'Business & E-Cell',
    'Debate & Literary',
    'Cultural & Music',
    'Automobile & SAE',
  ];

  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      // Exclude pending_approval from general view
      if (evt.status === 'pending_approval') return false;

      // College filter
      if (selectedCollege !== 'All' && evt.college !== selectedCollege) return false;

      // Status filter
      if (statusFilter !== 'all' && evt.status !== statusFilter) return false;

      // Category filter
      if (selectedCategory !== 'All' && evt.category !== selectedCategory) return false;

      // Club filter
      if (selectedClubId !== 'All' && evt.club_id !== selectedClubId) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = evt.title.toLowerCase().includes(q);
        const matchClub = evt.club_name.toLowerCase().includes(q);
        const matchVenue = evt.venue.toLowerCase().includes(q);
        const matchDesc = evt.description.toLowerCase().includes(q);
        if (!matchTitle && !matchClub && !matchVenue && !matchDesc) return false;
      }

      // Date range filter
      if (dateFilter !== 'all') {
        const evtDate = new Date(evt.start_at);
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const diffDays = Math.floor((evtDate.getTime() - startOfToday.getTime()) / (1000 * 60 * 60 * 24));

        if (dateFilter === 'today' && diffDays !== 0) return false;
        if (dateFilter === 'week' && (diffDays < 0 || diffDays > 7)) return false;
        if (dateFilter === 'weekend') {
          const dayOfWeek = evtDate.getDay();
          // Saturday is 6, Sunday is 0
          if (dayOfWeek !== 0 && dayOfWeek !== 6) return false;
        }
      }

      return true;
    }).sort((a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime());
  }, [events, searchQuery, selectedCategory, selectedClubId, dateFilter, statusFilter]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedClubId('All');
    setDateFilter('all');
    setStatusFilter('all');
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCategory !== 'All' ||
    selectedClubId !== 'All' ||
    dateFilter !== 'all' ||
    statusFilter !== 'all';

  return (
    <div className="space-y-6">
      {/* Title & Introduction */}
      <div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
          <span>Campus Activities</span>
          <span aria-hidden="true">·</span>
          <span>Fall 2026 Semester</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Campus Events & Workshops
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
          Discover guest seminars, hands-on maker labs, pitch nights, and student assemblies. Filter by host club, topic, or date.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by event title, host club, venue, or keyword..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>

          {/* Club Dropdown Filter */}
          <div className="sm:w-64">
            <select
              value={selectedClubId}
              onChange={(e) => setSelectedClubId(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500"
            >
              <option value="All">All Host Clubs</option>
              {clubs.map((club) => (
                <option key={club.id} value={club.id}>
                  {club.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Selector */}
          <div className="sm:w-44">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as any)}
              className="w-full text-xs px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500"
            >
              <option value="all">Any Upcoming Date</option>
              <option value="today">Happening Today</option>
              <option value="week">Next 7 Days</option>
              <option value="weekend">This Weekend</option>
            </select>
          </div>

          {/* Status selector */}
          <div className="sm:w-36">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="upcoming">Confirmed</option>
              <option value="updated">Updated</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Category Pill Filters (functional interactive buttons) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 shrink-0 mr-1">Topic:</span>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-1 text-xs text-slate-500 dark:text-slate-400">
            <span>
              Showing {filteredEvents.length} matching event{filteredEvents.length === 1 ? '' : 's'}
            </span>
            <button
              onClick={handleResetFilters}
              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* Events Grid / List */}
      {filteredEvents.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
          <Calendar className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No events found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search query, selecting another category, or resetting your filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-4 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEvents.map((evt) => {
            const isSaved = isItemSaved('event', evt.id);

            return (
              <div
                key={evt.id}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-blue-300 dark:hover:border-blue-500 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Status & Category row */}
                  <div className="flex items-center justify-between text-xs mb-2">
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      <span className="font-medium text-slate-700 dark:text-slate-300">{evt.club_name}</span>
                      <span aria-hidden="true">·</span>
                      <span>{evt.category}</span>
                    </div>

                    {evt.status === 'cancelled' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/60 px-2 py-0.5 rounded border border-red-200 dark:border-red-800">
                        <AlertTriangle className="w-3 h-3 text-red-600 dark:text-red-400" />
                        Cancelled
                      </span>
                    ) : evt.status === 'updated' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                        Updated
                      </span>
                    ) : null}
                  </div>

                  <h3
                    onClick={() => setSelectedEvent(evt)}
                    className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer"
                  >
                    {evt.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                    {evt.description}
                  </p>

                  {/* Schedule details */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                      <span>{formatDate(evt.start_at)}</span>
                      <span className="text-slate-300 dark:text-slate-600">|</span>
                      <span>{formatTime(evt.start_at)} – {formatTime(evt.end_at)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                      <span className="truncate">{evt.venue}</span>
                    </div>
                  </div>
                </div>

                {/* Footer action buttons */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    Updated {formatDate(evt.updated_at)}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleSaveItem('event', evt.id)}
                      className={`p-2 rounded-lg border text-xs transition-colors ${
                        isSaved
                          ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400'
                          : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                      title={isSaved ? 'Saved' : 'Save event'}
                      aria-label="Save event"
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-blue-600' : ''}`} />
                    </button>

                    <button
                      onClick={() => setSelectedEvent(evt)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
