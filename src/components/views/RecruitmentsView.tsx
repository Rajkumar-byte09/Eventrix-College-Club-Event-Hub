import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Briefcase,
  Calendar,
  Clock,
  Bookmark,
  ExternalLink,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Users,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { formatDate, getDeadlineLabel } from '../../utils/dateUtils';

export const RecruitmentsView: React.FC = () => {
  const { recruitments, clubs, selectedCollege, setSelectedRecruitment, toggleSaveItem, isItemSaved } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClubId, setSelectedClubId] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Technology & Coding',
    'Robotics & Hardware',
    'Design & Creative',
    'Business & E-Cell',
    'Debate & Literary',
    'Automobile & SAE',
  ];

  const filteredRecruitments = useMemo(() => {
    return recruitments.filter((rec) => {
      if (rec.status === 'pending_approval') return false;

      // College filter
      if (selectedCollege !== 'All' && rec.college !== selectedCollege) return false;

      // Status filter
      if (statusFilter !== 'all') {
        const dl = getDeadlineLabel(rec.deadline);
        if (statusFilter === 'open' && (rec.status === 'closed' || dl.isExpired)) return false;
        if (statusFilter === 'closing_soon' && !dl.isUrgent) return false;
        if (statusFilter === 'closed' && (rec.status !== 'closed' && !dl.isExpired)) return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && rec.category !== selectedCategory) return false;

      // Club filter
      if (selectedClubId !== 'All' && rec.club_id !== selectedClubId) return false;

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = rec.title.toLowerCase().includes(q);
        const matchClub = rec.club_name.toLowerCase().includes(q);
        const matchDesc = rec.role_description.toLowerCase().includes(q);
        const matchElig = rec.eligibility.toLowerCase().includes(q);
        if (!matchTitle && !matchClub && !matchDesc && !matchElig) return false;
      }

      return true;
    }).sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
  }, [recruitments, statusFilter, selectedCategory, selectedClubId, searchQuery]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedClubId('All');
    setStatusFilter('all');
    setSelectedCategory('All');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
          <span>Student Opportunities</span>
          <span aria-hidden="true">·</span>
          <span>KIET Deemed to be University</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Club Recruitment & Application Hub
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
          Browse open board, committee, and subteam roles across student organizations. Save listings and set reminders before deadlines close.
        </p>
      </div>

      {/* Filter bar */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by role title, club, eligibility requirement..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>

          <div className="sm:w-56">
            <select
              value={selectedClubId}
              onChange={(e) => setSelectedClubId(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500"
            >
              <option value="All">All Clubs</option>
              {clubs.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500"
            >
              <option value="all">All Application Statuses</option>
              <option value="open">Active / Open Now</option>
              <option value="closing_soon">Closing Soon (&lt; 3 Days)</option>
              <option value="closed">Closed / Past Deadline</option>
            </select>
          </div>
        </div>

        {/* Category buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 shrink-0 mr-1">Discipline:</span>
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

        {(searchQuery || selectedCategory !== 'All' || selectedClubId !== 'All' || statusFilter !== 'all') && (
          <div className="flex items-center justify-between pt-1 text-xs text-slate-500 dark:text-slate-400">
            <span>Showing {filteredRecruitments.length} opportunities</span>
            <button
              onClick={handleResetFilters}
              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Reset filters
            </button>
          </div>
        )}
      </div>

      {/* Recruitment Cards */}
      {filteredRecruitments.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
          <Briefcase className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No recruitment listings match</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or selecting a different status filter.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-4 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRecruitments.map((rec) => {
            const dl = getDeadlineLabel(rec.deadline);
            const isSaved = isItemSaved('recruitment', rec.id);

            return (
              <div
                key={rec.id}
                className={`bg-white dark:bg-slate-900 rounded-2xl border p-5 sm:p-6 transition-all shadow-2xs hover:border-blue-300 dark:hover:border-blue-500 flex flex-col justify-between ${
                  dl.isExpired
                    ? 'opacity-75 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div>
                  {/* Status row: Open, Closing soon, Closed, Coming soon */}
                  <div className="flex items-center justify-between text-xs mb-2">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{rec.club_name}</span>
                      <span aria-hidden="true">·</span>
                      <span>{rec.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">{rec.available_positions} positions</span>
                    </div>

                    <div>
                      {dl.isExpired || rec.status === 'closed' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-400 bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded">
                          Closed
                        </span>
                      ) : dl.isUrgent || rec.status === 'closing_soon' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                          <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                          Closing Soon · {dl.label}
                        </span>
                      ) : rec.status === 'coming_soon' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                          Coming Soon
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800">
                          <CheckCircle2 className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                          Open for Applications
                        </span>
                      )}
                    </div>
                  </div>

                  <h3
                    onClick={() => setSelectedRecruitment(rec)}
                    className="text-lg font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                  >
                    {rec.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                    {rec.role_description}
                  </p>

                  {/* Eligibility & selection stages preview */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-start gap-2 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                      <Users className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-700 dark:text-slate-200 block text-[11px]">Eligibility</span>
                        <span className="text-slate-600 dark:text-slate-400 line-clamp-1">{rec.eligibility}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                      <Calendar className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-700 dark:text-slate-200 block text-[11px]">Final Deadline</span>
                        <span className="text-slate-600 dark:text-slate-400 font-mono">
                          {formatDate(rec.deadline)} at 11:59 PM (IST)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer action buttons */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                    <span>Opened {formatDate(rec.opens_at)}</span>
                    <span aria-hidden="true">·</span>
                    <span>{rec.selection_steps.length} Selection Stages</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleSaveItem('recruitment', rec.id)}
                      className={`p-2 rounded-lg border text-xs transition-colors ${
                        isSaved
                          ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400'
                          : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                      title={isSaved ? 'Saved' : 'Save opportunity'}
                      aria-label="Save recruitment"
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-blue-600 dark:fill-blue-400' : ''}`} />
                    </button>

                    <button
                      onClick={() => setSelectedRecruitment(rec)}
                      className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      View Details & Steps
                    </button>

                    {!dl.isExpired && rec.status !== 'closed' && (
                      <a
                        href={rec.application_url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <span>Apply</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
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
