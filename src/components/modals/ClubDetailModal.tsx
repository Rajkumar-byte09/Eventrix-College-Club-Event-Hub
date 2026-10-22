import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Users,
  MapPin,
  Clock,
  Mail,
  Globe,
  MessageSquare,
  Instagram,
  Calendar,
  Briefcase,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

export const ClubDetailModal: React.FC = () => {
  const {
    selectedClub,
    setSelectedClub,
    events,
    recruitments,
    setSelectedEvent,
    setSelectedRecruitment,
  } = useApp();

  if (!selectedClub) return null;

  const clubEvents = events.filter((e) => e.club_id === selectedClub.id);
  const clubRecruitments = recruitments.filter((r) => r.club_id === selectedClub.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col transition-colors">
        {/* Banner header */}
        <div className={`p-6 pb-5 text-white ${selectedClub.banner_color} relative`}>
          <button
            onClick={() => setSelectedClub(null)}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-black/20 hover:bg-black/30 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-bold text-xl border border-white/20 shadow-xs">
              {selectedClub.short_name.substring(0, 3)}
            </div>
            <div className="flex-1 pr-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded backdrop-blur-md font-medium">
                  {selectedClub.category}
                </span>
                <span className="text-xs text-white/80">·</span>
                <span className="text-xs text-white/90 font-medium">
                  {selectedClub.member_count} active members
                </span>
              </div>
              <h2 className="text-xl font-bold leading-tight">{selectedClub.name}</h2>
              <p className="text-xs text-white/90 mt-1 line-clamp-2">{selectedClub.tagline}</p>
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700 dark:text-slate-300 text-sm">
          {/* Meeting Schedule & Lead */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 flex items-start gap-3">
              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Regular Meetings
                </p>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  {selectedClub.meeting_time}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{selectedClub.meeting_venue}</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 flex items-start gap-3">
              <Users className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Club Leadership
                </p>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  {selectedClub.lead_name} (Lead)
                </p>
                <a
                  href={`mailto:${selectedClub.contact_email}`}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mt-0.5"
                >
                  <Mail className="w-3 h-3" />
                  <span>{selectedClub.contact_email}</span>
                </a>
              </div>
            </div>
          </div>

          {/* About description */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
              About the Club
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm whitespace-pre-line">
              {selectedClub.description}
            </p>
          </div>

          {/* Social / Official Links */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
              Official Channels & Links
            </h3>
            <div className="flex flex-wrap gap-2 text-xs">
              {selectedClub.website_url && (
                <a
                  href={selectedClub.website_url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Globe className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>Club Website</span>
                </a>
              )}
              {selectedClub.discord_url && (
                <a
                  href={selectedClub.discord_url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-medium flex items-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                  <span>Discord Community</span>
                </a>
              )}
              {selectedClub.instagram_url && (
                <a
                  href={selectedClub.instagram_url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Instagram className="w-3.5 h-3.5 text-pink-500" />
                  <span>Instagram</span>
                </a>
              )}
              <a
                href={`mailto:${selectedClub.contact_email}`}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-medium flex items-center gap-1.5 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                <span>Contact Coordinator</span>
              </a>
            </div>
          </div>

          {/* Active Recruitments */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              Open Recruitment Calls ({clubRecruitments.length})
            </h3>
            {clubRecruitments.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 italic p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                No active recruitment applications open at this time. Check back next term.
              </p>
            ) : (
              <div className="space-y-2">
                {clubRecruitments.map((rec) => (
                  <div
                    key={rec.id}
                    onClick={() => {
                      setSelectedClub(null);
                      setSelectedRecruitment(rec);
                    }}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50/30 dark:hover:bg-blue-950/30 transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">{rec.title}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Deadline: {formatDate(rec.deadline)} · {rec.available_positions} open positions
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Events */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              Upcoming Events & Workshops ({clubEvents.length})
            </h3>
            {clubEvents.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 italic p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                No upcoming events scheduled right now.
              </p>
            ) : (
              <div className="space-y-2">
                {clubEvents.map((evt) => (
                  <div
                    key={evt.id}
                    onClick={() => {
                      setSelectedClub(null);
                      setSelectedEvent(evt);
                    }}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50/30 dark:hover:bg-blue-950/30 transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">{evt.title}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {formatDate(evt.start_at)} · {evt.venue}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
