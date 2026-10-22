import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Layers,
  Calendar,
  Briefcase,
  ShieldCheck,
  Plus,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  History,
  Archive,
  Send,
  Building2,
  Users,
  Wallet,
  QrCode,
  UserCheck,
  Sparkles,
  FileCheck,
  MapPin,
  Sliders,
  Lock,
  ArrowLeft,
} from 'lucide-react';
import { EventCategory } from '../../types';
import { formatDate, formatFullDateTime } from '../../utils/dateUtils';

interface VenueBookingRequest {
  id: string;
  venueName: string;
  capacity: number;
  clubName: string;
  eventTitle: string;
  requestedDate: string;
  timeSlot: string;
  equipmentNeeded: string;
  status: 'sanctioned' | 'pending_dean' | 'conflict_hold';
}

interface ClubBudgetGrant {
  id: string;
  clubName: string;
  shortName: string;
  category: string;
  requestedAmount: string;
  purpose: string;
  leadName: string;
  status: 'sanctioned' | 'pending_review' | 'revision_requested';
}

interface ClubApplicant {
  id: string;
  name: string;
  rollNo: string;
  email: string;
  branchYear: string;
  domain: string;
  clubName: string;
  portfolioUrl: string;
  statement: string;
  status: 'pending' | 'shortlisted' | 'selected' | 'rejected';
}

interface CoreMember {
  id: string;
  name: string;
  rollNo: string;
  designation: string;
  branchYear: string;
  email: string;
}

interface CheckInAttendee {
  id: string;
  passCode: string;
  studentName: string;
  rollNo: string;
  eventTitle: string;
  checkedIn: boolean;
  checkedInAt?: string;
}

export const StudioView: React.FC = () => {
  const {
    currentUser,
    events,
    recruitments,
    clubs,
    contentAudits,
    createEvent,
    createRecruitment,
    updateClub,
    approveItem,
    rejectItem,
    cancelEvent,
    archiveRecruitment,
    setSelectedEvent,
    setSelectedRecruitment,
    setActiveTab: setGlobalTab,
  } = useApp();

  const isDean = currentUser.role === 'admin';
  const isClubHead = currentUser.role === 'coordinator';

  type StudioTab =
    | 'queue'
    | 'venues'
    | 'budgets'
    | 'applicants'
    | 'club_roster'
    | 'checkin'
    | 'create_event'
    | 'create_recruitment'
    | 'audit';

  const [activeTab, setActiveTab] = useState<StudioTab>(
    isDean ? 'queue' : 'applicants'
  );

  // Automatically switch default tab when user switches between Dean and Club Head
  useEffect(() => {
    if (isDean && (activeTab === 'applicants' || activeTab === 'club_roster' || activeTab === 'checkin')) {
      setActiveTab('queue');
    } else if (isClubHead && (activeTab === 'queue' || activeTab === 'venues' || activeTab === 'budgets')) {
      setActiveTab('applicants');
    }
  }, [currentUser.role, isDean, isClubHead, activeTab]);

  // ============================================================================
  // DEAN EXCLUSIVE STATE: Auditorium & Venue Allocations + Club Budget Grants
  // ============================================================================
  const [venueRequests, setVenueRequests] = useState<VenueBookingRequest[]>([
    {
      id: 'ven-1',
      venueName: 'Main University Auditorium (Block A)',
      capacity: 600,
      clubName: 'TEDxKIET Official Chapter',
      eventTitle: 'TEDxKIET 2026 Salon: "Uncharted Horizons"',
      requestedDate: 'Nov 8, 2026',
      timeSlot: '02:00 PM – 08:00 PM',
      equipmentNeeded: 'Line-Array Audio, 4 Wireless Lapel Mics, Stage LED Wall',
      status: 'sanctioned',
    },
    {
      id: 'ven-2',
      venueName: 'AI & Cloud Innovation Lab (Block C)',
      capacity: 160,
      clubName: 'NextGen KIET (AI & Emerging Tech Society)',
      eventTitle: 'NextGen AI Build Sprint: Autonomous Agents & RAG Workshop',
      requestedDate: 'Oct 27, 2026',
      timeSlot: '04:30 PM – 07:00 PM',
      equipmentNeeded: 'High-Speed Wi-Fi VLAN, Smart Podium, 20 Extension Boards',
      status: 'pending_dean',
    },
    {
      id: 'ven-3',
      venueName: 'MPC Seminar Hall (CS/IT Block)',
      capacity: 200,
      clubName: 'DevUp Community KIET',
      eventTitle: 'DevUp Weekend Ship-a-Thon: Zero to Production in 12 Hours',
      requestedDate: 'Nov 1, 2026',
      timeSlot: '09:00 AM – 09:00 PM',
      equipmentNeeded: 'Dual Projectors, Overnight Lab Access Pass, Backup UPS',
      status: 'pending_dean',
    },
    {
      id: 'ven-4',
      venueName: 'Main Sports Ground Open Stage',
      capacity: 800,
      clubName: 'KIET Club (Student Cultural & Innovation Council)',
      eventTitle: 'KIET Club Cultural Night & Epoque 2026 Curtain Raiser',
      requestedDate: 'Nov 3, 2026',
      timeSlot: '05:00 PM – 08:30 PM',
      equipmentNeeded: 'Outdoor Concert Truss, Security Barricades, Green Rooms',
      status: 'sanctioned',
    },
  ]);

  const [budgetGrants, setBudgetGrants] = useState<ClubBudgetGrant[]>([
    {
      id: 'bg-1',
      clubName: 'InnoGeeks Technical Club',
      shortName: 'InnoGeeks',
      category: 'Hackathon & Build Sprint',
      requestedAmount: '₹2,50,000',
      purpose: 'InnoHack 2026 National Prize Pool, Cloud Credits & Hardware Kits',
      leadName: 'Priya Verma',
      status: 'sanctioned',
    },
    {
      id: 'bg-2',
      clubName: 'NextGen KIET (AI & Emerging Tech Society)',
      shortName: 'NextGen',
      category: 'Technology & Coding',
      requestedAmount: '₹85,000',
      purpose: 'LLM API Compute Credits, GenAI Sprint Swags & Guest Speaker Travel',
      leadName: 'Rohan Khanna',
      status: 'pending_review',
    },
    {
      id: 'bg-3',
      clubName: 'DevUp Community KIET',
      shortName: 'DevUp',
      category: 'Technology & Coding',
      requestedAmount: '₹65,000',
      purpose: '12-Hour Ship-a-Thon Cloud Hosting Grants & Builder Merch',
      leadName: 'Aditya Pratap Singh',
      status: 'pending_review',
    },
    {
      id: 'bg-4',
      clubName: 'TEDxKIET Official Chapter',
      shortName: 'TEDx',
      category: 'Debate & Literary',
      requestedAmount: '₹1,20,000',
      purpose: 'TEDx Stage Scenography, Speaker Hospitality & Multi-Cam Recording',
      leadName: 'Ishita Bhardwaj',
      status: 'sanctioned',
    },
    {
      id: 'bg-5',
      clubName: 'KIET Club (Student Cultural & Innovation Council)',
      shortName: 'KIET Club',
      category: 'Cultural & Music',
      requestedAmount: '₹1,80,000',
      purpose: 'Epoque 2026 Curtain Raiser Sound Production & Inter-College Trophies',
      leadName: 'Karanveer Rathi',
      status: 'pending_review',
    },
  ]);

  // ============================================================================
  // CLUB HEAD EXCLUSIVE STATE: Applicant Pipeline, Club Roster, & Pass Check-In
  // ============================================================================
  const [selectedManagedClubId, setSelectedManagedClubId] = useState<string>(
    currentUser.club_id || 'club-innogeeks'
  );
  const managedClub =
    clubs.find((c) => c.id === selectedManagedClubId) || clubs[0];

  const [editMeetingTime, setEditMeetingTime] = useState(managedClub.meeting_time);
  const [editMeetingVenue, setEditMeetingVenue] = useState(managedClub.meeting_venue);
  const [editRecStatus, setEditRecStatus] = useState<
    'open' | 'closing_soon' | 'closed' | 'coming_soon'
  >(managedClub.recruitment_status);
  const [clubSavedMsg, setClubSavedMsg] = useState('');

  useEffect(() => {
    setEditMeetingTime(managedClub.meeting_time);
    setEditMeetingVenue(managedClub.meeting_venue);
    setEditRecStatus(managedClub.recruitment_status);
  }, [managedClub]);

  const [applicants, setApplicants] = useState<ClubApplicant[]>([
    {
      id: 'app-1',
      name: 'Riya Gupta',
      rollNo: '2400290100045',
      email: 'riya.2428cse@kiet.edu',
      branchYear: 'B.Tech CSE · 2nd Year',
      domain: 'Generative AI & Full-Stack Web',
      clubName: 'NextGen KIET / InnoGeeks',
      portfolioUrl: 'github.com/riyagupta-kiet',
      statement: 'Built an RAG chatbot for AKTU syllabus notes using LangChain and Next.js. Excited to mentor freshers!',
      status: 'pending',
    },
    {
      id: 'app-2',
      name: 'Kunal Kashyap',
      rollNo: '2400290130082',
      email: 'kunal.2428it@kiet.edu',
      branchYear: 'B.Tech IT · 2nd Year',
      domain: 'DevOps, Docker & Backend Go',
      clubName: 'DevUp Community KIET',
      portfolioUrl: 'github.com/kunalkashyap-dev',
      statement: 'Deployed 3 full-stack microservices on AWS EC2 and led my 1st-year hackathon team to top 5.',
      status: 'shortlisted',
    },
    {
      id: 'app-3',
      name: 'Sneha Nair',
      rollNo: '2300290100164',
      email: 'sneha.2327cse@kiet.edu',
      branchYear: 'B.Tech CSE (AI) · 3rd Year',
      domain: 'Speaker Curation & Editorial Lead',
      clubName: 'TEDxKIET Official Chapter',
      portfolioUrl: 'behance.net/snehanair-kiet',
      statement: 'Anchored 4 university conclaves and curated speaker dossiers for TBI KIET startup summit.',
      status: 'selected',
    },
    {
      id: 'app-4',
      name: 'Yashvardhan Chauhan',
      rollNo: '2500290120019',
      email: 'yash.2529csit@kiet.edu',
      branchYear: 'B.Tech CSIT · 1st Year',
      domain: 'UI/UX Design & Frontend React',
      clubName: 'KIET Club / InnoGeeks',
      portfolioUrl: 'figma.com/@yashkiet',
      statement: 'Designed interactive mobile prototypes and event posters for Epoque cultural fest.',
      status: 'pending',
    },
  ]);

  const [coreRoster, setCoreRoster] = useState<CoreMember[]>([
    {
      id: 'cm-1',
      name: 'Priya Verma',
      rollNo: '2200290130089',
      designation: 'President & Club Lead',
      branchYear: 'B.Tech IT · 3rd Year',
      email: 'priya.verma@kiet.edu',
    },
    {
      id: 'cm-2',
      name: 'Rohan Khanna',
      rollNo: '2200290100112',
      designation: 'NextGen AI & Technical Secretary',
      branchYear: 'B.Tech CSE · 3rd Year',
      email: 'rohan.khanna@kiet.edu',
    },
    {
      id: 'cm-3',
      name: 'Aditya Pratap Singh',
      rollNo: '2200290100054',
      designation: 'DevUp Full-Stack & Hackathon Lead',
      branchYear: 'B.Tech CSE · 3rd Year',
      email: 'aditya.singh@kiet.edu',
    },
    {
      id: 'cm-4',
      name: 'Ishita Bhardwaj',
      rollNo: '2300290150031',
      designation: 'Public Relations & Sponsorship Head',
      branchYear: 'B.Tech CSIT · 3rd Year',
      email: 'ishita.bhardwaj@kiet.edu',
    },
  ]);

  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRoll, setNewMemberRoll] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('Core Technical Coordinator');
  const [newMemberBranch, setNewMemberBranch] = useState('B.Tech CSE · 2nd Year');

  const [passSearchInput, setPassSearchInput] = useState('');
  const [attendees, setAttendees] = useState<CheckInAttendee[]>([
    {
      id: 'att-1',
      passCode: 'INNO-2026-409',
      studentName: 'Aarav Sharma (Team: NeuralNinjas KIET)',
      rollNo: '2300290120042',
      eventTitle: 'InnoHack 2026: 36-Hour National Flagship Hackathon',
      checkedIn: true,
      checkedInAt: '09:14 AM',
    },
    {
      id: 'att-2',
      passCode: 'NEXT-2026-118',
      studentName: 'Ananya Verma',
      rollNo: '2300290100089',
      eventTitle: 'NextGen AI Build Sprint: Autonomous Agents & RAG Workshop',
      checkedIn: false,
    },
    {
      id: 'att-3',
      passCode: 'DEVUP-2026-305',
      studentName: 'Devansh Mishra',
      rollNo: '2300290130054',
      eventTitle: 'DevUp Weekend Ship-a-Thon: Zero to Production in 12 Hours',
      checkedIn: false,
    },
    {
      id: 'att-4',
      passCode: 'TEDX-2026-712',
      studentName: 'Vikramaditya Rao',
      rollNo: '2400290150091',
      eventTitle: 'TEDxKIET 2026 Salon: "Uncharted Horizons"',
      checkedIn: true,
      checkedInAt: '02:40 PM',
    },
  ]);

  // ============================================================================
  // SHARED EVENT / RECRUITMENT CREATION FORM STATES
  // ============================================================================
  const [eventTitle, setEventTitle] = useState('');
  const [eventCategory, setEventCategory] = useState<EventCategory>('Technology & Coding');
  const [eventClubId, setEventClubId] = useState(currentUser.club_id || clubs[0].id);
  const [eventStartDate, setEventStartDate] = useState('2026-11-02T18:00');
  const [eventEndDate, setEventEndDate] = useState('2026-11-02T20:00');
  const [eventVenue, setEventVenue] = useState('');
  const [eventIsOnline, setEventIsOnline] = useState(false);
  const [eventOnlineUrl, setEventOnlineUrl] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventRegUrl, setEventRegUrl] = useState('https://forms.kiet.edu/register');
  const [eventCapacity, setEventCapacity] = useState('100');
  const [eventErrors, setEventErrors] = useState<string[]>([]);
  const [eventSuccess, setEventSuccess] = useState('');
  const [eventPreviewOpen, setEventPreviewOpen] = useState(false);

  const [recTitle, setRecTitle] = useState('');
  const [recCategory, setRecCategory] = useState<EventCategory>('Technology & Coding');
  const [recClubId, setRecClubId] = useState(currentUser.club_id || clubs[0].id);
  const [recDeadline, setRecDeadline] = useState('2026-11-15T23:59');
  const [recEligibility, setRecEligibility] = useState('Open to all 1st and 2nd year students of KIET Deemed to be University.');
  const [recDescription, setRecDescription] = useState('');
  const [recPositions, setRecPositions] = useState('8');
  const [recAppUrl, setRecAppUrl] = useState('https://forms.kiet.edu/apply');
  const [recRequirement1, setRecRequirement1] = useState('Valid KIET University Roll Number & @kiet.edu email');
  const [recRequirement2, setRecRequirement2] = useState('Short 150-word statement of interest or GitHub link');
  const [recRequirement3, setRecRequirement3] = useState('Available for weekly evening club syncs');
  const [recErrors, setRecErrors] = useState<string[]>([]);
  const [recSuccess, setRecSuccess] = useState('');
  const [recPreviewOpen, setRecPreviewOpen] = useState(false);

  // Strict Student Role Block: Student account cannot access Dean or Club Head features
  if (currentUser.role === 'student') {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 text-center border border-slate-200 dark:border-slate-800 shadow-2xs max-w-xl mx-auto my-8">
        <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Restricted to Club Heads & Dean Administration
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
          Your current account (<span className="font-bold text-slate-700 dark:text-slate-200">{currentUser.name} · Student</span>) only has access to Student features. Switch to the <span className="font-semibold">Club Lead</span> or <span className="font-semibold">Dean</span> demo account in the menu to unlock organizer and governance portals.
        </p>
        <button
          onClick={() => setGlobalTab('dashboard')}
          className="mt-5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Student Dashboard</span>
        </button>
      </div>
    );
  }

  // Pending approval items
  const pendingEvents = events.filter((e) => e.status === 'pending_approval');
  const pendingRecruitments = recruitments.filter((r) => r.status === 'pending_approval');
  const totalPending = pendingEvents.length + pendingRecruitments.length;

  const handleSaveClubSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateClub(managedClub.id, {
      meeting_time: editMeetingTime,
      meeting_venue: editMeetingVenue,
      recruitment_status: editRecStatus,
    });
    setClubSavedMsg(`Updated ${managedClub.short_name} settings across the live campus portal!`);
    setTimeout(() => setClubSavedMsg(''), 3000);
  };

  const handleAddCoreMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim() || !newMemberRoll.trim()) return;
    setCoreRoster((prev) => [
      ...prev,
      {
        id: `cm-${Date.now()}`,
        name: newMemberName.trim(),
        rollNo: newMemberRoll.trim(),
        designation: newMemberRole,
        branchYear: newMemberBranch,
        email: `${newMemberName.trim().toLowerCase().replace(/\s+/g, '.')}@kiet.edu`,
      },
    ]);
    setNewMemberName('');
    setNewMemberRoll('');
  };

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEventErrors([]);
    setEventSuccess('');

    const errors: string[] = [];
    if (!eventTitle.trim()) errors.push('Event title is required.');
    if (!eventVenue.trim()) errors.push('Venue location is required.');
    if (!eventDescription.trim()) errors.push('Event description is required.');

    const start = new Date(eventStartDate).getTime();
    const end = new Date(eventEndDate).getTime();
    if (end <= start) {
      errors.push('Event end time must be after the start time.');
    }

    if (errors.length > 0) {
      setEventErrors(errors);
      return;
    }

    const hostClub = clubs.find((c) => c.id === eventClubId) || clubs[0];

    createEvent({
      title: eventTitle.trim(),
      description: eventDescription.trim(),
      club_id: hostClub.id,
      club_name: hostClub.name,
      college: hostClub.college,
      category: eventCategory,
      start_at: new Date(eventStartDate).toISOString(),
      end_at: new Date(eventEndDate).toISOString(),
      venue: eventVenue.trim(),
      is_online: eventIsOnline,
      online_url: eventIsOnline ? eventOnlineUrl : undefined,
      registration_url: eventRegUrl.trim(),
      status: isDean ? 'upcoming' : 'pending_approval',
      capacity: Number(eventCapacity) || 100,
      registered_count: 0,
      created_by: currentUser.name,
    });

    setEventSuccess(
      isDean
        ? 'Event sanctioned & published immediately to the live student feed!'
        : 'Event proposal submitted to Dr. Manoj Goel (Dean Student Welfare) for approval!'
    );

    setEventTitle('');
    setEventVenue('');
    setEventDescription('');
  };

  const handleRecSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRecErrors([]);
    setRecSuccess('');

    const errors: string[] = [];
    if (!recTitle.trim()) errors.push('Role title is required.');
    if (!recDescription.trim()) errors.push('Role overview description is required.');
    if (!recEligibility.trim()) errors.push('Eligibility criteria is required.');

    if (errors.length > 0) {
      setRecErrors(errors);
      return;
    }

    const hostClub = clubs.find((c) => c.id === recClubId) || clubs[0];
    const requirements = [recRequirement1, recRequirement2, recRequirement3].filter(
      (r) => r.trim().length > 0
    );

    createRecruitment({
      club_id: hostClub.id,
      club_name: hostClub.name,
      college: hostClub.college,
      title: recTitle.trim(),
      role_description: recDescription.trim(),
      category: recCategory,
      opens_at: new Date().toISOString(),
      deadline: new Date(recDeadline).toISOString(),
      eligibility: recEligibility.trim(),
      requirements,
      selection_steps: [
        { step_number: 1, title: 'Application Form Submission', description: 'Initial resume & statement review.', timeline: 'By Deadline' },
        { step_number: 2, title: 'Skills Review & Chat', description: 'Brief 20-min informal discussion.', timeline: 'Week after deadline' },
        { step_number: 3, title: 'Final Team Offers', description: 'Onboarding into club subteam.', timeline: 'Within 10 days' },
      ],
      application_url: recAppUrl.trim(),
      available_positions: Number(recPositions) || 5,
      status: isDean ? 'open' : 'pending_approval',
      created_by: currentUser.name,
    });

    setRecSuccess(
      isDean
        ? 'Recruitment call published immediately to the live student hub!'
        : 'Recruitment drive submitted to Dean Student Welfare approval queue!'
    );

    setRecTitle('');
    setRecDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Role-Specific Executive Banner */}
      <div
        className={`rounded-3xl p-6 sm:p-7 text-white shadow-md border ${
          isDean
            ? 'bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 border-purple-800/60'
            : 'bg-gradient-to-r from-teal-950 via-cyan-950 to-slate-900 border-teal-800/60'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span
                className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${
                  isDean
                    ? 'bg-purple-500/20 text-purple-200 border-purple-400/30'
                    : 'bg-teal-500/20 text-teal-200 border-teal-400/30'
                }`}
              >
                {isDean
                  ? 'DEAN STUDENT WELFARE · UNIVERSITY GOVERNANCE PORTAL'
                  : `HEAD OF CLUB STUDIO · ${managedClub.short_name.toUpperCase()}`}
              </span>
              <span className="text-xs text-slate-300">·</span>
              <span className="text-xs text-slate-300 font-medium">
                Not visible on Student Accounts
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {isDean
                ? 'Dean Administration & Campus Sanction Hub'
                : 'Club Head Operations & Recruitment Studio'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-200/90 mt-1 max-w-2xl">
              {isDean
                ? 'Exclusive Dean privileges: Sanction pending club events, allocate campus auditoriums, approve annual club budgets, and inspect university compliance logs.'
                : 'Exclusive Club Head privileges: Shortlist student recruitment applicants, manage club core roster & meeting timings, scan event passes, and submit proposals to the Dean.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 shrink-0">
            {isDean ? (
              <>
                <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/15 text-center">
                  <span className="block text-xl font-black text-amber-300 font-mono">
                    {totalPending}
                  </span>
                  <span className="text-[10px] text-purple-200 font-semibold uppercase">
                    Pending Proposals
                  </span>
                </div>
                <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/15 text-center">
                  <span className="block text-xl font-black text-emerald-300 font-mono">
                    ₹6.65L
                  </span>
                  <span className="text-[10px] text-purple-200 font-semibold uppercase">
                    Club Grant Pool
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/15 text-center">
                  <span className="block text-xl font-black text-cyan-300 font-mono">
                    {applicants.length}
                  </span>
                  <span className="text-[10px] text-teal-200 font-semibold uppercase">
                    Club Applicants
                  </span>
                </div>
                <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/15 text-center">
                  <span className="block text-xl font-black text-amber-300 font-mono">
                    {attendees.filter((a) => a.checkedIn).length}/{attendees.length}
                  </span>
                  <span className="text-[10px] text-teal-200 font-semibold uppercase">
                    Passes Checked In
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Role-Specific Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-5 text-xs font-semibold overflow-x-auto">
        {isDean && (
          <>
            <button
              onClick={() => setActiveTab('queue')}
              className={`pb-3 flex items-center gap-1.5 transition-colors relative whitespace-nowrap cursor-pointer ${
                activeTab === 'queue'
                  ? 'text-purple-600 dark:text-purple-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-purple-600 dark:after:bg-purple-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Dean Approval Queue</span>
              <span className="ml-1 text-[10px] font-mono bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 px-1.5 py-0.2 rounded-full">
                {totalPending}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('venues')}
              className={`pb-3 flex items-center gap-1.5 transition-colors relative whitespace-nowrap cursor-pointer ${
                activeTab === 'venues'
                  ? 'text-purple-600 dark:text-purple-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-purple-600 dark:after:bg-purple-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Auditorium & Venue Sanctions</span>
            </button>

            <button
              onClick={() => setActiveTab('budgets')}
              className={`pb-3 flex items-center gap-1.5 transition-colors relative whitespace-nowrap cursor-pointer ${
                activeTab === 'budgets'
                  ? 'text-purple-600 dark:text-purple-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-purple-600 dark:after:bg-purple-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <Wallet className="w-4 h-4" />
              <span>Club Budget & Grants</span>
            </button>
          </>
        )}

        {isClubHead && (
          <>
            <button
              onClick={() => setActiveTab('applicants')}
              className={`pb-3 flex items-center gap-1.5 transition-colors relative whitespace-nowrap cursor-pointer ${
                activeTab === 'applicants'
                  ? 'text-teal-600 dark:text-teal-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-teal-600 dark:after:bg-teal-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Recruitment Applicants</span>
              <span className="ml-1 text-[10px] font-mono bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 px-1.5 py-0.2 rounded-full">
                {applicants.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('club_roster')}
              className={`pb-3 flex items-center gap-1.5 transition-colors relative whitespace-nowrap cursor-pointer ${
                activeTab === 'club_roster'
                  ? 'text-teal-600 dark:text-teal-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-teal-600 dark:after:bg-teal-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>My Club Roster & Settings</span>
            </button>

            <button
              onClick={() => setActiveTab('checkin')}
              className={`pb-3 flex items-center gap-1.5 transition-colors relative whitespace-nowrap cursor-pointer ${
                activeTab === 'checkin'
                  ? 'text-teal-600 dark:text-teal-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-teal-600 dark:after:bg-teal-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>Event Pass Check-In Desk</span>
            </button>
          </>
        )}

        <button
          onClick={() => setActiveTab('create_event')}
          className={`pb-3 flex items-center gap-1.5 transition-colors relative whitespace-nowrap cursor-pointer ${
            activeTab === 'create_event'
              ? 'text-blue-600 dark:text-blue-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 dark:after:bg-blue-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>{isDean ? 'Direct Event Broadcast' : 'Propose New Event'}</span>
        </button>

        <button
          onClick={() => setActiveTab('create_recruitment')}
          className={`pb-3 flex items-center gap-1.5 transition-colors relative whitespace-nowrap cursor-pointer ${
            activeTab === 'create_recruitment'
              ? 'text-blue-600 dark:text-blue-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 dark:after:bg-blue-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>{isDean ? 'Publish Recruitment' : 'Launch Recruitment Drive'}</span>
        </button>

        {isDean && (
          <button
            onClick={() => setActiveTab('audit')}
            className={`pb-3 flex items-center gap-1.5 transition-colors relative whitespace-nowrap cursor-pointer ${
              activeTab === 'audit'
                ? 'text-purple-600 dark:text-purple-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-purple-600 dark:after:bg-purple-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Governance Audit Trail</span>
          </button>
        )}
      </div>

      {/* ===================================================================== */}
      {/* DEAN TAB 1: UNIVERSITY APPROVAL QUEUE                                 */}
      {/* ===================================================================== */}
      {isDean && activeTab === 'queue' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Pending Club Proposals Awaiting Dean Sanction ({totalPending})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
              Events and recruitment drives submitted by KIET Club Leads require your digital approval before appearing on student feeds.
            </p>

            {totalPending === 0 ? (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                <CheckCircle2 className="w-8 h-8 text-teal-600 dark:text-teal-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-900 dark:text-white">All caught up!</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  There are no pending club events or recruitment notices waiting in the Dean queue.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingEvents.map((pe) => (
                  <div
                    key={pe.id}
                    className="p-5 rounded-2xl border border-purple-200 dark:border-purple-800/70 bg-purple-50/40 dark:bg-purple-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-xs text-purple-800 dark:text-purple-300 font-semibold mb-1">
                        <span className="uppercase tracking-wider text-[10px] bg-purple-200/70 dark:bg-purple-900/80 px-2 py-0.5 rounded">
                          Pending Event Proposal
                        </span>
                        <span>·</span>
                        <span>{pe.club_name}</span>
                        <span>·</span>
                        <span>Submitted by {pe.created_by}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">{pe.title}</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-xl">{pe.description}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-2 font-mono">
                        <span>{formatFullDateTime(pe.start_at)}</span>
                        <span>·</span>
                        <span className="font-sans">Venue: {pe.venue}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={() => approveItem('event', pe.id)}
                        className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Sanction & Publish</span>
                      </button>
                      <button
                        onClick={() => rejectItem('event', pe.id, 'Did not meet auditorium scheduling policy.')}
                        className="px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/50 text-red-600 dark:text-red-400 border border-slate-200 dark:border-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                ))}

                {pendingRecruitments.map((pr) => (
                  <div
                    key={pr.id}
                    className="p-5 rounded-2xl border border-purple-200 dark:border-purple-800/70 bg-purple-50/40 dark:bg-purple-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-xs text-purple-800 dark:text-purple-300 font-semibold mb-1">
                        <span className="uppercase tracking-wider text-[10px] bg-purple-200/70 dark:bg-purple-900/80 px-2 py-0.5 rounded">
                          Pending Recruitment Drive
                        </span>
                        <span>·</span>
                        <span>{pr.club_name}</span>
                        <span>·</span>
                        <span>Submitted by {pr.created_by}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">{pr.title}</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-xl">{pr.role_description}</p>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-mono">
                        Deadline: {formatDate(pr.deadline)} · {pr.available_positions} open spots
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={() => approveItem('recruitment', pr.id)}
                        className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve Drive</span>
                      </button>
                      <button
                        onClick={() => rejectItem('recruitment', pr.id, 'Incomplete selection timeline.')}
                        className="px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/50 text-red-600 dark:text-red-400 border border-slate-200 dark:border-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Live Content Moderation Table */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4 transition-colors">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Active Campus Listings Oversight
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Dean authority to cancel active events or close recruitment drives across KIET.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Live Campus Events
                </span>
                {events
                  .filter((e) => e.status !== 'pending_approval')
                  .slice(0, 5)
                  .map((evt) => (
                    <div
                      key={evt.id}
                      className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="min-w-0">
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 block">
                          {evt.club_name} · {evt.status.toUpperCase()}
                        </span>
                        <p className="font-bold text-slate-900 dark:text-white truncate">{evt.title}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => setSelectedEvent(evt)}
                          className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium cursor-pointer"
                        >
                          Inspect
                        </button>
                        {evt.status !== 'cancelled' && (
                          <button
                            onClick={() => cancelEvent(evt.id)}
                            className="px-2.5 py-1 bg-red-50 dark:bg-red-950/50 hover:bg-red-100 text-red-600 dark:text-red-400 rounded-lg font-medium cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>

              <div className="space-y-2.5">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Live Recruitment Drives
                </span>
                {recruitments
                  .filter((r) => r.status !== 'pending_approval')
                  .slice(0, 5)
                  .map((rec) => (
                    <div
                      key={rec.id}
                      className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="min-w-0">
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 block">
                          {rec.club_name} · {rec.status.toUpperCase()}
                        </span>
                        <p className="font-bold text-slate-900 dark:text-white truncate">{rec.title}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => setSelectedRecruitment(rec)}
                          className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium cursor-pointer"
                        >
                          Inspect
                        </button>
                        {rec.status !== 'closed' && (
                          <button
                            onClick={() => archiveRecruitment(rec.id)}
                            className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-400 rounded-lg font-medium flex items-center gap-1 cursor-pointer"
                          >
                            <Archive className="w-3 h-3" />
                            Close
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* DEAN TAB 2: AUDITORIUM & VENUE BOOKING SANCTIONS (DEAN EXCLUSIVE)     */}
      {/* ===================================================================== */}
      {isDean && activeTab === 'venues' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-5 transition-colors">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Campus Auditorium & Seminar Hall Allocations
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Exclusive Dean control to sanction or hold physical venue bookings and AV equipment requests across KIET.
            </p>
          </div>

          <div className="space-y-3.5">
            {venueRequests.map((req) => (
              <div
                key={req.id}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${
                        req.status === 'sanctioned'
                          ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                          : req.status === 'pending_dean'
                          ? 'bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                          : 'bg-red-50 dark:bg-red-950/70 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
                      }`}
                    >
                      {req.status === 'sanctioned'
                        ? 'Hall Sanctioned'
                        : req.status === 'pending_dean'
                        ? 'Awaiting Dean Sign-Off'
                        : 'On Hold / Conflict'}
                    </span>
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      {req.clubName}
                    </span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                      Capacity: {req.capacity} seats
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                    <span>{req.venueName}</span>
                  </h3>

                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                    Event: {req.eventTitle} ({req.requestedDate} · {req.timeSlot})
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    AV & Security Requirements: {req.equipmentNeeded}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() =>
                      setVenueRequests((prev) =>
                        prev.map((v) =>
                          v.id === req.id ? { ...v, status: 'sanctioned' } : v
                        )
                      )
                    }
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      req.status === 'sanctioned'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Sanction Venue
                  </button>
                  <button
                    onClick={() =>
                      setVenueRequests((prev) =>
                        prev.map((v) =>
                          v.id === req.id ? { ...v, status: 'conflict_hold' } : v
                        )
                      )
                    }
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                      req.status === 'conflict_hold'
                        ? 'bg-red-600 text-white'
                        : 'bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/50 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Hold Slot
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* DEAN TAB 3: CLUB BUDGET & GRANT ALLOCATION (DEAN EXCLUSIVE)           */}
      {/* ===================================================================== */}
      {isDean && activeTab === 'budgets' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-5 transition-colors">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              University Student Council & Club Grant Sanctions (2026–27)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Review and sanction annual club seed budgets, hackathon prize pools, and speaker hospitality grants.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {budgetGrants.map((grant) => (
              <div
                key={grant.id}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-extrabold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/70 px-2.5 py-0.5 rounded-md border border-purple-200 dark:border-purple-800">
                      {grant.shortName}
                    </span>
                    <span className="text-lg font-black text-slate-900 dark:text-white font-mono">
                      {grant.requestedAmount}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {grant.clubName}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    {grant.purpose}
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5">
                    Club Lead: {grant.leadName} · {grant.category}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/70 dark:border-slate-700/70 flex items-center justify-between">
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                      grant.status === 'sanctioned'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                        : grant.status === 'pending_review'
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                        : 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300'
                    }`}
                  >
                    {grant.status.replace('_', ' ')}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() =>
                        setBudgetGrants((prev) =>
                          prev.map((g) =>
                            g.id === grant.id ? { ...g, status: 'sanctioned' } : g
                          )
                        )
                      }
                      className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      Approve Grant
                    </button>
                    <button
                      onClick={() =>
                        setBudgetGrants((prev) =>
                          prev.map((g) =>
                            g.id === grant.id
                              ? { ...g, status: 'revision_requested' }
                              : g
                          )
                        )
                      }
                      className="px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      Ask Revision
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* CLUB HEAD TAB 1: RECRUITMENT APPLICANT PIPELINE (CLUB HEAD EXCLUSIVE) */}
      {/* ===================================================================== */}
      {isClubHead && activeTab === 'applicants' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-5 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Student Recruitment Applications & Shortlisting Pipeline
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Exclusive Club Head portal to review student applications, inspect GitHub/portfolios, and shortlist or induct members.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="px-2.5 py-1 rounded-xl bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 font-bold">
                {applicants.filter((a) => a.status === 'selected').length} Selected
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-bold">
                {applicants.filter((a) => a.status === 'shortlisted').length} Shortlisted
              </span>
            </div>
          </div>

          <div className="space-y-3.5">
            {applicants.map((app) => (
              <div
                key={app.id}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                        app.status === 'selected'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                          : app.status === 'shortlisted'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                          : app.status === 'rejected'
                          ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
                          : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                      }`}
                    >
                      {app.status}
                    </span>
                    <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
                      {app.domain}
                    </span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                      Roll: {app.rollNo}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2.5">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {app.name}
                    </h3>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {app.branchYear} · {app.email}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                    "{app.statement}"
                  </p>
                  <p className="text-[11px] font-mono text-blue-600 dark:text-blue-400">
                    Portfolio: {app.portfolioUrl} · Applied to: {app.clubName}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    onClick={() =>
                      setApplicants((prev) =>
                        prev.map((a) =>
                          a.id === app.id ? { ...a, status: 'shortlisted' } : a
                        )
                      )
                    }
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Shortlist for Interview
                  </button>
                  <button
                    onClick={() =>
                      setApplicants((prev) =>
                        prev.map((a) =>
                          a.id === app.id ? { ...a, status: 'selected' } : a
                        )
                      )
                    }
                    className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Induct to Club
                  </button>
                  <button
                    onClick={() =>
                      setApplicants((prev) =>
                        prev.map((a) =>
                          a.id === app.id ? { ...a, status: 'rejected' } : a
                        )
                      )
                    }
                    className="px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/50 text-slate-500 hover:text-red-600 border border-slate-200 dark:border-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Pass
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* CLUB HEAD TAB 2: MY CLUB ROSTER & LIVE SETTINGS (CLUB HEAD EXCLUSIVE) */}
      {/* ===================================================================== */}
      {isClubHead && activeTab === 'club_roster' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Live Club Settings Editor */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Manage Club Settings & Schedule
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Update your club's live recruitment status, weekly meeting schedule, and lab venue.
            </p>

            {clubSavedMsg && (
              <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-800 text-xs font-semibold text-teal-800 dark:text-teal-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>{clubSavedMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveClubSettings} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Select KIET Club to Manage
                </label>
                <select
                  value={selectedManagedClubId}
                  onChange={(e) => setSelectedManagedClubId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-900 dark:text-white"
                >
                  {clubs.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.short_name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Club Recruitment Status
                </label>
                <select
                  value={editRecStatus}
                  onChange={(e) => setEditRecStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-900 dark:text-white"
                >
                  <option value="open">Actively Recruiting (Open)</option>
                  <option value="closing_soon">Closing Soon (Urgent Badge)</option>
                  <option value="closed">Recruitment Closed</option>
                  <option value="coming_soon">Coming Soon</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Weekly Meeting Schedule
                </label>
                <input
                  type="text"
                  value={editMeetingTime}
                  onChange={(e) => setEditMeetingTime(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Meeting Lab / Campus Venue
                </label>
                <input
                  type="text"
                  value={editMeetingVenue}
                  onChange={(e) => setEditMeetingVenue(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Save Live Club Settings
              </button>
            </form>
          </div>

          {/* Right: Core Committee Roster Manager */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Core Committee & Student Coordinator Roster ({coreRoster.length})
            </h2>

            <form
              onSubmit={handleAddCoreMember}
              className="grid grid-cols-1 sm:grid-cols-4 gap-2 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-xs"
            >
              <input
                type="text"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                placeholder="Student Name"
                className="px-2.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
              <input
                type="text"
                value={newMemberRoll}
                onChange={(e) => setNewMemberRoll(e.target.value)}
                placeholder="Roll No (230029...)"
                className="px-2.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
              <input
                type="text"
                value={newMemberRole}
                onChange={(e) => setNewMemberRole(e.target.value)}
                placeholder="Designation / Role"
                className="px-2.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Lead</span>
              </button>
            </form>

            <div className="space-y-2.5">
              {coreRoster.map((cm) => (
                <div
                  key={cm.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">{cm.name}</span>
                      <span className="text-[10px] font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/70 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800">
                        {cm.designation}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                      Roll: {cm.rollNo} · {cm.branchYear} · {cm.email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* CLUB HEAD TAB 3: EVENT PASS CHECK-IN DESK (CLUB HEAD EXCLUSIVE)       */}
      {/* ===================================================================== */}
      {isClubHead && activeTab === 'checkin' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-5 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Venue Door Pass Verification & Attendance Desk
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Verify student Hackathon & Workshop Pass IDs (e.g. INNO-2026-409) and mark live lab attendance.
              </p>
            </div>
            <input
              type="text"
              value={passSearchInput}
              onChange={(e) => setPassSearchInput(e.target.value)}
              placeholder="Search Pass ID or Student Name..."
              className="px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white sm:w-64"
            />
          </div>

          <div className="space-y-3">
            {attendees
              .filter(
                (a) =>
                  !passSearchInput.trim() ||
                  a.passCode.toLowerCase().includes(passSearchInput.toLowerCase()) ||
                  a.studentName.toLowerCase().includes(passSearchInput.toLowerCase())
              )
              .map((att) => (
                <div
                  key={att.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-extrabold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                        {att.passCode}
                      </span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {att.studentName}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        ({att.rollNo})
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {att.eventTitle}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      setAttendees((prev) =>
                        prev.map((x) =>
                          x.id === att.id
                            ? {
                                ...x,
                                checkedIn: !x.checkedIn,
                                checkedInAt: !x.checkedIn ? 'Just now' : undefined,
                              }
                            : x
                        )
                      )
                    }
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 ${
                      att.checkedIn
                        ? 'bg-emerald-600 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>
                      {att.checkedIn
                        ? `Checked In (${att.checkedInAt})`
                        : 'Mark Checked In'}
                    </span>
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* CREATE EVENT TAB (Shared with Role-Specific Workflow)                 */}
      {/* ===================================================================== */}
      {activeTab === 'create_event' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form
            onSubmit={handleEventSubmit}
            className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-5 transition-colors"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {isDean ? 'Direct University Event Broadcast' : 'Draft & Submit Club Event Proposal'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isDean
                    ? 'Published directly to the live KIET student feed with Dean endorsement.'
                    : 'Submitted to the Dean Student Welfare approval queue for venue & calendar sanction.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEventPreviewOpen(!eventPreviewOpen)}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{eventPreviewOpen ? 'Hide Preview' : 'Preview Card'}</span>
              </button>
            </div>

            {eventErrors.length > 0 && (
              <div className="p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-700 dark:text-red-300 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                  <span>Please resolve the following validation issues:</span>
                </div>
                <ul className="list-disc pl-5 space-y-0.5">
                  {eventErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {eventSuccess && (
              <div className="p-4 bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 rounded-xl text-xs text-teal-800 dark:text-teal-200 flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                <span>{eventSuccess}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="e.g., NextGen AI Agentic Workflows Workshop"
                  className="w-full px-3.5 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Host Organization *
                </label>
                <select
                  value={eventClubId}
                  onChange={(e) => setEventClubId(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
                >
                  {clubs.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Event Category *
                </label>
                <select
                  value={eventCategory}
                  onChange={(e) => setEventCategory(e.target.value as EventCategory)}
                  className="w-full px-3.5 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
                >
                  <option value="Hackathon & Build Sprint">Hackathon & Build Sprint</option>
                  <option value="Technology & Coding">Technology & Coding</option>
                  <option value="Robotics & Hardware">Robotics & Hardware</option>
                  <option value="Design & Creative">Design & Creative</option>
                  <option value="Business & E-Cell">Business & E-Cell</option>
                  <option value="Debate & Literary">Debate & Literary</option>
                  <option value="Cultural & Music">Cultural & Music</option>
                  <option value="Automobile & SAE">Automobile & SAE</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Start Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={eventStartDate}
                  onChange={(e) => setEventStartDate(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  End Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={eventEndDate}
                  onChange={(e) => setEventEndDate(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Campus Venue / Room *
                </label>
                <input
                  type="text"
                  value={eventVenue}
                  onChange={(e) => setEventVenue(e.target.value)}
                  placeholder="e.g., Main Auditorium / MPC Seminar Hall, KIET"
                  className="w-full px-3.5 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Seat Capacity
                </label>
                <input
                  type="number"
                  value={eventCapacity}
                  onChange={(e) => setEventCapacity(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Event Description & Prerequisites *
                </label>
                <textarea
                  rows={4}
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  placeholder="Describe the agenda, speaker details, and any student prerequisites..."
                  className="w-full px-3.5 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isDean ? 'Sanction & Publish Immediately' : 'Submit Event Proposal to Dean'}</span>
              </button>
            </div>
          </form>

          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
                Live Feed Card Preview
              </h3>
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-2">
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {clubs.find((c) => c.id === eventClubId)?.name} · {eventCategory}
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {eventTitle || 'Untitled Campus Event'}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                  {eventDescription || 'Event description will appear here...'}
                </p>
                <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono pt-1">
                  Venue: {eventVenue || 'TBD'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* CREATE RECRUITMENT TAB                                                */}
      {/* ===================================================================== */}
      {activeTab === 'create_recruitment' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form
            onSubmit={handleRecSubmit}
            className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-5 transition-colors"
          >
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {isDean ? 'Publish Official Club Recruitment Call' : 'Launch Club Recruitment Drive'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Specify role responsibilities, eligibility criteria, and deadline for KIET students.
              </p>
            </div>

            {recErrors.length > 0 && (
              <div className="p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-700 dark:text-red-300">
                {recErrors.map((err, i) => (
                  <p key={i}>• {err}</p>
                ))}
              </div>
            )}

            {recSuccess && (
              <div className="p-4 bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 rounded-xl text-xs text-teal-800 dark:text-teal-200 flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                <span>{recSuccess}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Role / Position Title *
                </label>
                <input
                  type="text"
                  value={recTitle}
                  onChange={(e) => setRecTitle(e.target.value)}
                  placeholder="e.g., NextGen AI Research Fellow / DevUp Core Maintainer"
                  className="w-full px-3.5 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Recruiting Club *
                </label>
                <select
                  value={recClubId}
                  onChange={(e) => setRecClubId(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
                >
                  {clubs.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Application Deadline *
                </label>
                <input
                  type="datetime-local"
                  value={recDeadline}
                  onChange={(e) => setRecDeadline(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Role Description *
                </label>
                <textarea
                  rows={3}
                  value={recDescription}
                  onChange={(e) => setRecDescription(e.target.value)}
                  placeholder="What will selected members build, organize, or learn?"
                  className="w-full px-3.5 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isDean ? 'Publish Recruitment Immediately' : 'Submit Recruitment for Approval'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ===================================================================== */}
      {/* DEAN TAB 5: GOVERNANCE AUDIT TRAIL                                    */}
      {/* ===================================================================== */}
      {isDean && activeTab === 'audit' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4 transition-colors">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              University Governance & Moderation Audit Trail
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Complete chronological log of all event sanctions, club submissions, and Dean moderation actions.
            </p>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {contentAudits.map((aud) => (
              <div key={aud.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">{aud.author_name}</span>
                    <span className="text-slate-400">·</span>
                    <span className="uppercase font-mono text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                      {aud.action} {aud.item_type}
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 font-medium mt-0.5">{aud.item_title}</p>
                  {aud.notes && <p className="text-slate-400 dark:text-slate-500 text-[11px] mt-0.5">Note: {aud.notes}</p>}
                </div>
                <span className="text-slate-400 dark:text-slate-500 font-mono text-[11px] shrink-0">
                  {formatFullDateTime(aud.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
