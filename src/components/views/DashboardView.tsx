import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  CalendarDays,
  Briefcase,
  AlertCircle,
  Bookmark,
  ArrowRight,
  Clock,
  MapPin,
  Building,
  Sparkles,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  Bell,
  Zap,
  Award,
  Building2,
  Users,
  ShieldCheck,
  Wallet,
  UserCheck,
  QrCode,
  Sliders,
} from 'lucide-react';
import { formatDate, formatTime, getDeadlineLabel } from '../../utils/dateUtils';
import { MiniSideCalendar } from '../MiniSideCalendar';

export const DashboardView: React.FC = () => {
  const {
    currentUser,
    clubs,
    events,
    recruitments,
    savedItems,
    selectedCollege,
    setSelectedCollege,
    setActiveTab,
    setSelectedEvent,
    setSelectedRecruitment,
    toggleSaveItem,
    isItemSaved,
    approveItem,
  } = useApp();

  const pendingEvents = events.filter((e) => e.status === 'pending_approval');
  const pendingRecruitments = recruitments.filter((r) => r.status === 'pending_approval');
  const totalPendingApprovals = pendingEvents.length + pendingRecruitments.length;

  // Filter events by selected college if any
  const displayedEvents = events.filter((e) => {
    if (e.status === 'cancelled' || e.status === 'pending_approval') return false;
    if (selectedCollege !== 'All' && e.college !== selectedCollege) return false;
    return true;
  });

  const displayedRecruitments = recruitments.filter((r) => {
    if (r.status === 'pending_approval') return false;
    if (selectedCollege !== 'All' && r.college !== selectedCollege) return false;
    return true;
  });

  const hackathons = displayedEvents.filter((e) => e.is_hackathon || e.category === 'Hackathon & Build Sprint');
  const openRecruitments = displayedRecruitments.filter((r) => r.status === 'open' || r.status === 'closing_soon');

  // Urgent deadlines: recruitments closing in <= 4 days
  const urgentRecruitments = displayedRecruitments
    .filter((r) => {
      if (r.status === 'closed') return false;
      const dl = getDeadlineLabel(r.deadline);
      return dl.isUrgent && !dl.isExpired;
    })
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

  // Next upcoming events in chronological order
  const upcomingChronological = [...displayedEvents].sort(
    (a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime()
  ).slice(0, 4);

  const mySavedItems = savedItems.filter((s) => s.user_id === currentUser.id);

  return (
    <div className="space-y-6">
      {/* ===================================================================== */}
      {/* DEAN EXCLUSIVE DASHBOARD CONSOLE (HIDDEN FROM STUDENTS & CLUB HEADS)  */}
      {/* ===================================================================== */}
      {currentUser.role === 'admin' && (
        <div className="bg-gradient-to-br from-purple-950 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 border border-purple-700/60 shadow-lg space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider bg-purple-500/25 text-purple-200 border border-purple-400/30 px-2.5 py-0.5 rounded-md">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
                  Dean Student Welfare · Exclusive Governance Console
                </span>
                <span className="text-xs text-purple-200/80">·</span>
                <span className="text-xs text-purple-200/80">Hidden on Student Accounts</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                University Approvals, Auditorium Allocations & Club Grant Sanctions
              </h2>
              <p className="text-xs text-purple-100/85 mt-1 max-w-2xl">
                Review pending proposals from NextGen, DevUp, TEDxKIET, and InnoGeeks, allocate Main Auditorium slots, and sanction annual club budgets.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('studio')}
              className="px-4 py-2.5 bg-white hover:bg-purple-50 text-purple-950 text-xs font-extrabold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-start lg:self-auto shrink-0 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-purple-700" />
              <span>Open Full Dean Administration Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-white/10">
            <div
              onClick={() => setActiveTab('studio')}
              className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between text-xs text-purple-200 font-semibold">
                <span>Approval Queue</span>
                <ShieldCheck className="w-4 h-4 text-amber-300" />
              </div>
              <p className="text-2xl font-black text-white font-mono mt-1">{totalPendingApprovals}</p>
              <span className="text-[11px] text-amber-300 font-semibold">Proposals awaiting sign-off →</span>
            </div>

            <div
              onClick={() => setActiveTab('studio')}
              className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between text-xs text-purple-200 font-semibold">
                <span>Venue Bookings</span>
                <Building2 className="w-4 h-4 text-cyan-300" />
              </div>
              <p className="text-2xl font-black text-white font-mono mt-1">4 Halls</p>
              <span className="text-[11px] text-cyan-300 font-semibold">Main Audi, MPC, TBI, SAC →</span>
            </div>

            <div
              onClick={() => setActiveTab('studio')}
              className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between text-xs text-purple-200 font-semibold">
                <span>Club Grant Pool</span>
                <Wallet className="w-4 h-4 text-emerald-300" />
              </div>
              <p className="text-2xl font-black text-white font-mono mt-1">₹6.65L</p>
              <span className="text-[11px] text-emerald-300 font-semibold">Sanction club budgets →</span>
            </div>

            <div
              onClick={() => setActiveTab('clubs')}
              className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between text-xs text-purple-200 font-semibold">
                <span>Recognized Clubs</span>
                <Users className="w-4 h-4 text-purple-300" />
              </div>
              <p className="text-2xl font-black text-white font-mono mt-1">{clubs.length}</p>
              <span className="text-[11px] text-purple-200 font-semibold">Active campus societies →</span>
            </div>
          </div>

          {totalPendingApprovals > 0 && (
            <div className="pt-3 border-t border-white/10 space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 block">
                Quick Dean Action: Pending Club Submissions
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {pendingEvents.map((pe) => (
                  <div
                    key={pe.id}
                    className="p-3.5 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-amber-300 uppercase block">
                        Event Proposal · {pe.club_name}
                      </span>
                      <p className="text-xs font-bold text-white truncate">{pe.title}</p>
                    </div>
                    <button
                      onClick={() => approveItem('event', pe.id)}
                      className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold rounded-xl shrink-0 cursor-pointer"
                    >
                      Approve
                    </button>
                  </div>
                ))}
                {pendingRecruitments.map((pr) => (
                  <div
                    key={pr.id}
                    className="p-3.5 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-cyan-300 uppercase block">
                        Recruitment Proposal · {pr.club_name}
                      </span>
                      <p className="text-xs font-bold text-white truncate">{pr.title}</p>
                    </div>
                    <button
                      onClick={() => approveItem('recruitment', pr.id)}
                      className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold rounded-xl shrink-0 cursor-pointer"
                    >
                      Approve
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* CLUB HEAD EXCLUSIVE DASHBOARD CONSOLE (HIDDEN FROM STUDENTS & DEAN)   */}
      {/* ===================================================================== */}
      {currentUser.role === 'coordinator' && (
        <div className="bg-gradient-to-br from-teal-950 via-cyan-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 border border-teal-700/60 shadow-lg space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider bg-teal-500/25 text-teal-200 border border-teal-400/30 px-2.5 py-0.5 rounded-md">
                  <UserCheck className="w-3.5 h-3.5 text-teal-300" />
                  Head of Club Command Suite · {currentUser.club_name || 'InnoGeeks KIET'}
                </span>
                <span className="text-xs text-teal-200/80">·</span>
                <span className="text-xs text-teal-200/80">Hidden on Student Accounts</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Manage Club Recruitment Pipeline, Core Roster & Event Check-In
              </h2>
              <p className="text-xs text-teal-100/85 mt-1 max-w-2xl">
                Shortlist student applicants for your club, update weekly lab meeting schedules, scan event passes at the door, and submit new proposals to the Dean.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('studio')}
              className="px-4 py-2.5 bg-teal-400 hover:bg-teal-300 text-slate-950 text-xs font-extrabold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-start lg:self-auto shrink-0 cursor-pointer"
            >
              <Sliders className="w-4 h-4" />
              <span>Open Club Head Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-white/10">
            <div
              onClick={() => setActiveTab('studio')}
              className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between text-xs text-teal-200 font-semibold">
                <span>Applicant Pipeline</span>
                <UserCheck className="w-4 h-4 text-cyan-300" />
              </div>
              <p className="text-2xl font-black text-white font-mono mt-1">34</p>
              <span className="text-[11px] text-cyan-300 font-semibold">Shortlist & induct →</span>
            </div>

            <div
              onClick={() => setActiveTab('studio')}
              className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between text-xs text-teal-200 font-semibold">
                <span>Club Settings</span>
                <Sliders className="w-4 h-4 text-amber-300" />
              </div>
              <p className="text-2xl font-black text-white font-mono mt-1">185</p>
              <span className="text-[11px] text-amber-300 font-semibold">Manage roster & venue →</span>
            </div>

            <div
              onClick={() => setActiveTab('studio')}
              className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between text-xs text-teal-200 font-semibold">
                <span>Pass Check-In Desk</span>
                <QrCode className="w-4 h-4 text-emerald-300" />
              </div>
              <p className="text-2xl font-black text-white font-mono mt-1">Live</p>
              <span className="text-[11px] text-emerald-300 font-semibold">Verify student passes →</span>
            </div>

            <div
              onClick={() => setActiveTab('studio')}
              className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between text-xs text-teal-200 font-semibold">
                <span>Submit to Dean</span>
                <CalendarDays className="w-4 h-4 text-teal-300" />
              </div>
              <p className="text-2xl font-black text-white font-mono mt-1">+ New</p>
              <span className="text-[11px] text-teal-200 font-semibold">Propose event / drive →</span>
            </div>
          </div>
        </div>
      )}

      {/* InnoHack 2026 Spotlight Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-5 sm:p-6 border border-blue-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-md">
                Featured National Hackathon
              </span>
              <span className="text-xs text-blue-200">·</span>
              <span className="text-xs text-blue-200">Hosted by KIET Deemed to be University</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold mt-0.5">
              InnoHack 2026 · 36-Hour National Build Sprint (₹2,50,000 Prize Pool)
            </h2>
            <p className="text-xs text-blue-200/90 mt-0.5">
              Join top engineers from Ghaziabad & Delhi-NCR. Form teams of 2-4 and code for the future.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('hackathons')}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 fill-slate-950" />
            <span>View Hackathons</span>
          </button>
        </div>
      </div>

      {/* Welcome Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
              <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{currentUser.college}</span>
              <span aria-hidden="true">·</span>
              <span>Ghaziabad, Delhi-NCR</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Welcome back, {currentUser.name.split(' ')[0]}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
              Stay ahead of club recruitment drives, campus workshops, and hackathon schedules without missing critical opportunities.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('calendar')}
              className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors whitespace-nowrap flex items-center gap-1.5"
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Side Calendar</span>
            </button>
            <button
              onClick={() => setActiveTab('hackathons')}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors whitespace-nowrap flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>InnoHack Portal</span>
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-colors whitespace-nowrap"
            >
              All Events
            </button>
          </div>
        </div>

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div
            onClick={() => setActiveTab('hackathons')}
            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50/50 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/80 hover:border-blue-300 dark:hover:border-blue-500 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Live Hackathons</span>
              <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2 font-mono tabular-nums">
              {hackathons.length}
            </p>
            <span className="text-[11px] text-blue-600 dark:text-blue-400 group-hover:underline flex items-center gap-1 mt-1 font-semibold">
              Explore sprints <ArrowRight className="w-3 h-3" />
            </span>
          </div>

          <div
            onClick={() => setActiveTab('events')}
            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-teal-50/50 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/80 hover:border-teal-300 dark:hover:border-teal-500 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Campus Events</span>
              <CalendarDays className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2 font-mono tabular-nums">
              {displayedEvents.length}
            </p>
            <span className="text-[11px] text-teal-700 dark:text-teal-400 group-hover:underline flex items-center gap-1 mt-1 font-semibold">
              View schedule <ArrowRight className="w-3 h-3" />
            </span>
          </div>

          <div
            onClick={() => setActiveTab('recruitments')}
            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-amber-50/50 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/80 hover:border-amber-300 dark:hover:border-amber-500 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Club Recruitments</span>
              <Briefcase className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2 font-mono tabular-nums">
              {openRecruitments.length}
            </p>
            <span className="text-[11px] text-amber-800 dark:text-amber-300 group-hover:underline flex items-center gap-1 mt-1 font-semibold">
              Apply to teams <ArrowRight className="w-3 h-3" />
            </span>
          </div>

          <div
            onClick={() => setActiveTab('saved')}
            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50/50 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/80 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Bookmarks</span>
              <Bookmark className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2 font-mono tabular-nums">
              {mySavedItems.length}
            </p>
            <span className="text-[11px] text-indigo-700 dark:text-indigo-400 group-hover:underline flex items-center gap-1 mt-1 font-semibold">
              View bookmarks <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* Urgent Deadlines Alert Section */}
      {urgentRecruitments.length > 0 && (
        <div className="bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 rounded-3xl p-5 sm:p-6 transition-colors">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
              <h2 className="text-sm font-bold text-amber-950 dark:text-amber-200">
                Application Deadlines Approaching (Closing Soon)
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('recruitments')}
              className="text-xs font-bold text-amber-800 dark:text-amber-300 hover:text-amber-950 dark:hover:text-amber-100 hover:underline flex items-center gap-1"
            >
              <span>All recruitments</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {urgentRecruitments.map((rec) => {
              const dl = getDeadlineLabel(rec.deadline);
              const isSaved = isItemSaved('recruitment', rec.id);

              return (
                <div
                  key={rec.id}
                  className="bg-white dark:bg-slate-850 p-4 rounded-2xl border border-amber-200/90 dark:border-amber-800/60 shadow-2xs hover:border-amber-400 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-extrabold text-amber-800 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-900/60 px-2 py-0.5 rounded-md text-[10px]">
                        {dl.label.toUpperCase()}
                      </span>
                      <span className="text-slate-400 dark:text-slate-500 text-[11px]">{rec.club_name}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{rec.title}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">{rec.role_description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      Closes {formatDate(rec.deadline)}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleSaveItem('recruitment', rec.id)}
                        className={`p-1.5 rounded-lg border text-xs transition-colors ${
                          isSaved ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400' : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                        title={isSaved ? 'Saved' : 'Save opportunity'}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-blue-600' : ''}`} />
                      </button>
                      <button
                        onClick={() => setSelectedRecruitment(rec)}
                        className="px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main 2-Column Split: Next Events & Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left Column (2 spans): Next Chronological Events */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Upcoming Events & Workshops</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Sorted chronologically across KIET & Ghaziabad colleges</p>
            </div>
            <button
              onClick={() => setActiveTab('events')}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1"
            >
              <span>See all ({displayedEvents.length})</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {upcomingChronological.map((evt) => {
              const isSaved = isItemSaved('event', evt.id);

              return (
                <div
                  key={evt.id}
                  className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-blue-300 dark:hover:border-blue-500 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="flex items-start gap-3.5 flex-1">
                    {/* Date Block */}
                    <div className="shrink-0 w-13 text-center py-2 px-1 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-750 font-mono">
                      <span className="block text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">
                        {new Date(evt.start_at).toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                      <span className="block text-base font-extrabold text-slate-900 dark:text-white">
                        {new Date(evt.start_at).getDate()}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{evt.club_name}</span>
                        <span aria-hidden="true">·</span>
                        <span>{evt.category}</span>
                        {evt.is_hackathon && (
                          <span className="text-amber-800 dark:text-amber-300 font-bold bg-amber-50 dark:bg-amber-950/70 px-1.5 py-0.2 rounded text-[10px]">
                            Hackathon
                          </span>
                        )}
                      </div>

                      <h3
                        onClick={() => setSelectedEvent(evt)}
                        className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer truncate"
                      >
                        {evt.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                          <span>{formatTime(evt.start_at)}</span>
                        </div>
                        <span aria-hidden="true">·</span>
                        <div className="flex items-center gap-1 font-sans">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                          <span className="truncate max-w-[200px]">{evt.venue}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => toggleSaveItem('event', evt.id)}
                      className={`p-2 rounded-xl border text-xs transition-colors ${
                        isSaved ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400' : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                      title={isSaved ? 'Remove bookmark' : 'Save event'}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-blue-600' : ''}`} />
                    </button>
                    <button
                      onClick={() => setSelectedEvent(evt)}
                      className="px-3.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
                    >
                      Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Cute Aesthetic Side Calendar & Quick Shortcuts */}
        <div className="space-y-4">
          <MiniSideCalendar />

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
            <h2 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
              Campus Shortcuts
            </h2>

            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('hackathons')}
                className="w-full text-left p-3 rounded-2xl hover:bg-blue-50/50 dark:hover:bg-blue-950/40 border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 transition-all flex items-center justify-between text-xs group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      InnoHack 2026 Portal
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">Team formation & tracks</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              </button>

              <button
                onClick={() => setActiveTab('clubs')}
                className="w-full text-left p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 transition-all flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">KIET Club Directory</span>
                    <span className="text-slate-500 dark:text-slate-400">NextGen, DevUp, TEDx, KIET Club</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              </button>

              <button
                onClick={() => setActiveTab('recruitments')}
                className="w-full text-left p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 transition-all flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">Open Recruitment Calls</span>
                    <span className="text-slate-500 dark:text-slate-400">Join committee subteams</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              </button>
            </div>
          </div>

          {/* KIET Ghaziabad Info Box */}
          <div className="bg-slate-50 dark:bg-slate-900/60 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>KIET Deemed to be University</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              Delhi-NCR, Meerut Road (NH-58), Ghaziabad, Uttar Pradesh 201206. Contact Dean Student Welfare for club registration & auditorium approvals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
