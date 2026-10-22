import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Users,
  Clock,
  MapPin,
  Mail,
  Globe,
  MessageSquare,
  ArrowRight,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const ClubsView: React.FC = () => {
  const { clubs, selectedCollege, setSelectedClub } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [recruitmentFilter, setRecruitmentFilter] = useState<string>('all');

  const categories = [
    'All',
    'Technology & Coding',
    'Robotics & Hardware',
    'Design & Creative',
    'Business & E-Cell',
    'Debate & Literary',
    'Cultural & Music',
    'Automobile & SAE',
  ];

  const filteredClubs = useMemo(() => {
    return clubs.filter((c) => {
      // College filter
      if (selectedCollege !== 'All' && c.college !== selectedCollege) return false;

      // Category filter
      if (selectedCategory !== 'All' && c.category !== selectedCategory) return false;

      // Recruitment status filter
      if (recruitmentFilter !== 'all') {
        if (recruitmentFilter === 'recruiting' && c.recruitment_status !== 'open' && c.recruitment_status !== 'closing_soon') {
          return false;
        }
        if (recruitmentFilter === 'closed' && c.recruitment_status !== 'closed') {
          return false;
        }
      }

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = c.name.toLowerCase().includes(q);
        const matchShort = c.short_name.toLowerCase().includes(q);
        const matchDesc = c.description.toLowerCase().includes(q);
        const matchTag = c.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchName && !matchShort && !matchDesc && !matchTag) return false;
      }

      return true;
    });
  }, [clubs, selectedCategory, recruitmentFilter, searchQuery]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setRecruitmentFilter('all');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
          <span>Student Life Directory</span>
          <span aria-hidden="true">·</span>
          <span>KIET Deemed to be University</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Campus Club Directory
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
          Explore recognized student organizations, build competitive teams, attend regular workshops, and find where you belong on campus.
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
              placeholder="Search by club name, skill tag, or keyword..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>

          <div className="sm:w-56">
            <select
              value={recruitmentFilter}
              onChange={(e) => setRecruitmentFilter(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500"
            >
              <option value="all">All Recruitment Statuses</option>
              <option value="recruiting">Actively Recruiting Now</option>
              <option value="closed">Recruitment Closed</option>
            </select>
          </div>
        </div>

        {/* Category buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 shrink-0 mr-1">Sector:</span>
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

        {(searchQuery || selectedCategory !== 'All' || recruitmentFilter !== 'all') && (
          <div className="flex items-center justify-between pt-1 text-xs text-slate-500 dark:text-slate-400">
            <span>Showing {filteredClubs.length} registered clubs</span>
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

      {/* Clubs Grid */}
      {filteredClubs.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
          <Users className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No clubs match your criteria</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms or resetting the sector filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-4 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClubs.map((club) => {
            return (
              <div
                key={club.id}
                onClick={() => setSelectedClub(club)}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-sm transition-all p-5 flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  {/* Top Bar inside card */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div
                      className={`px-2.5 h-10 min-w-10 rounded-xl ${
                        club.id === 'club-tedx'
                          ? 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900'
                          : club.id === 'club-nextgen'
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900'
                          : club.id === 'club-devup'
                          ? 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-900'
                          : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-900'
                      } font-extrabold flex items-center justify-center text-xs tracking-tight border`}
                    >
                      {club.short_name}
                    </div>

                    {/* Recruitment status text label */}
                    <div>
                      {club.recruitment_status === 'closing_soon' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                          <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                          Closing Soon
                        </span>
                      ) : club.recruitment_status === 'open' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800">
                          <CheckCircle2 className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                          Recruiting
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                          Recruitment Closed
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Clean unboxed metadata */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 mb-1">
                    <span>{club.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">{club.member_count} members</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {club.name}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                    {club.tagline}
                  </p>

                  {/* Meeting rhythm */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                      <span className="truncate">{club.meeting_time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                      <span className="truncate">{club.meeting_venue}</span>
                    </div>
                  </div>
                </div>

                {/* Card footer */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 dark:text-slate-500 font-medium">Lead: {club.lead_name}</span>
                  <span className="text-blue-600 dark:text-blue-400 group-hover:underline flex items-center gap-1 font-semibold">
                    <span>View Club</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
