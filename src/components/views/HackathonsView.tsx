import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  MapPin,
  Users,
  ExternalLink,
  Bookmark,
  Zap,
  CheckCircle2,
  Trophy,
  Code2,
  Plus,
  Trash2,
  UserPlus,
  Edit3,
  ShieldCheck,
  Mail,
  Hash,
  GraduationCap,
  Sparkles,
  X,
} from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

export interface HackathonTeamMember {
  id: string;
  name: string;
  rollNo: string;
  email: string;
  branchYear: string;
  role: string;
  isLeader?: boolean;
}

export interface RegisteredHackathonTeam {
  id: string;
  teamCode: string;
  teamName: string;
  hackathonId: string;
  hackathonTitle: string;
  track: string;
  projectTitle: string;
  college: string;
  members: HackathonTeamMember[];
  registeredAt: string;
}

const STORAGE_KEY_TEAMS = 'eventrix_kiet_v2_hackathon_teams';

const SAMPLE_TEAMMATES: Omit<HackathonTeamMember, 'id' | 'isLeader'>[] = [
  {
    name: 'Ananya Verma',
    rollNo: '2300290100089',
    email: 'ananya.2327cse@kiet.edu',
    branchYear: 'CSE (AI & ML) · 3rd Year',
    role: 'AI/ML & Backend Engineer',
  },
  {
    name: 'Devansh Mishra',
    rollNo: '2300290130054',
    email: 'devansh.2327it@kiet.edu',
    branchYear: 'IT · 3rd Year',
    role: 'Frontend & UI/UX Designer',
  },
  {
    name: 'Komal Singh',
    rollNo: '2400290110112',
    email: 'komal.2428csit@kiet.edu',
    branchYear: 'CSIT · 2nd Year',
    role: 'Cloud, DevOps & Pitch',
  },
];

export const HackathonsView: React.FC = () => {
  const {
    events,
    currentUser,
    setSelectedEvent,
    toggleSaveItem,
    isItemSaved,
    isEventRegistered,
    toggleRegisterEvent,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'featured' | 'my_teams' | 'schedule' | 'faqs'>('featured');
  const [teamFormOpen, setTeamFormOpen] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);

  // Filter hackathon events
  const hackathons = events.filter((e) => e.is_hackathon || e.category === 'Hackathon & Build Sprint');
  const innoHack = hackathons.find((h) => h.id === 'evt-innohack-2026') || hackathons[0];

  // Default fallback team
  const defaultTeams: RegisteredHackathonTeam[] = [
    {
      id: 'team-default-1',
      teamCode: 'INNO-2026-409',
      teamName: 'NeuralNinjas KIET',
      hackathonId: 'evt-innohack-2026',
      hackathonTitle: 'InnoHack 2026: 36-Hour National Level Hackathon',
      track: 'Generative AI & Autonomous Agents',
      projectTitle: 'CampusPulse AI — Smart Attendance & Lab Resource Optimizer',
      college: currentUser.college || 'KIET Deemed to be University',
      registeredAt: new Date().toISOString(),
      members: [
        {
          id: 'm-1',
          name: currentUser.name,
          rollNo: currentUser.student_roll_no || '2300290100118',
          email: currentUser.college_email,
          branchYear: `${currentUser.major || 'B.Tech CSE'} · ${currentUser.year || '3rd Year'}`,
          role: 'Team Leader & Full-Stack Dev',
          isLeader: true,
        },
        {
          id: 'm-2',
          name: 'Ananya Verma',
          rollNo: '2300290100089',
          email: 'ananya.2327cse@kiet.edu',
          branchYear: 'CSE (AI & ML) · 3rd Year',
          role: 'AI/ML & LLM Pipeline Lead',
        },
        {
          id: 'm-3',
          name: 'Devansh Mishra',
          rollNo: '2300290130054',
          email: 'devansh.2327it@kiet.edu',
          branchYear: 'IT · 3rd Year',
          role: 'Frontend & Product UI Lead',
        },
      ],
    },
  ];

  // Persisted registered hackathon teams (with safe schema validation)
  const [registeredTeams, setRegisteredTeams] = useState<RegisteredHackathonTeam[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TEAMS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((t: Partial<RegisteredHackathonTeam>, idx: number) => ({
            id: t.id || `team-restored-${idx}`,
            teamCode: t.teamCode || `INNO-2026-${400 + idx}`,
            teamName: t.teamName || 'NeuralNinjas KIET',
            hackathonId: t.hackathonId || 'evt-innohack-2026',
            hackathonTitle:
              t.hackathonTitle || 'InnoHack 2026: 36-Hour National Level Hackathon',
            track: t.track || 'Generative AI & Autonomous Agents',
            projectTitle:
              t.projectTitle || 'CampusPulse AI — Smart Attendance & Lab Resource Optimizer',
            college: t.college || currentUser.college || 'KIET Deemed to be University',
            registeredAt: t.registeredAt || new Date().toISOString(),
            members:
              Array.isArray(t.members) && t.members.length > 0
                ? t.members
                : defaultTeams[0].members,
          }));
        }
      }
    } catch (e) {
      console.error(e);
    }
    return defaultTeams;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TEAMS, JSON.stringify(registeredTeams));
    } catch (e) {
      console.error(e);
    }
  }, [registeredTeams]);

  // Form States
  const [selectedHackathonId, setSelectedHackathonId] = useState<string>(
    innoHack?.id || 'evt-innohack-2026'
  );
  const [teamName, setTeamName] = useState('');
  const [teamTrack, setTeamTrack] = useState('Generative AI & LLMs');
  const [projectTitle, setProjectTitle] = useState('');
  const [teamCollege, setTeamCollege] = useState<string>(
    currentUser.college || 'KIET Deemed to be University'
  );
  const [members, setMembers] = useState<HackathonTeamMember[]>([
    {
      id: 'mem-1',
      name: currentUser.name,
      rollNo: currentUser.student_roll_no || '2300290100118',
      email: currentUser.college_email,
      branchYear: `${currentUser.major || 'B.Tech CSE'} · ${currentUser.year || '3rd Year'}`,
      role: 'Team Leader & Full-Stack',
      isLeader: true,
    },
    {
      id: 'mem-2',
      name: '',
      rollNo: '',
      email: '',
      branchYear: 'CSE · 3rd Year',
      role: 'Backend & AI Engineer',
    },
  ]);
  const [formError, setFormError] = useState('');
  const [teamSubmitted, setTeamSubmitted] = useState(false);

  const openNewTeamModal = (hackathonId?: string) => {
    setEditingTeamId(null);
    setSelectedHackathonId(hackathonId || innoHack?.id || 'evt-innohack-2026');
    setTeamName('');
    setTeamTrack('Generative AI & LLMs');
    setProjectTitle('');
    setTeamCollege(currentUser.college || 'KIET Deemed to be University');
    setMembers([
      {
        id: `mem-${Date.now()}-1`,
        name: currentUser.name,
        rollNo: currentUser.student_roll_no || '2300290100118',
        email: currentUser.college_email,
        branchYear: `${currentUser.major || 'B.Tech CSE'} · ${currentUser.year || '3rd Year'}`,
        role: 'Team Leader & Full-Stack',
        isLeader: true,
      },
      {
        id: `mem-${Date.now()}-2`,
        name: '',
        rollNo: '',
        email: '',
        branchYear: 'CSE · 3rd Year',
        role: 'AI/ML & Backend Dev',
      },
    ]);
    setFormError('');
    setTeamSubmitted(false);
    setTeamFormOpen(true);
  };

  const openEditTeamModal = (team: RegisteredHackathonTeam) => {
    setEditingTeamId(team.id);
    setSelectedHackathonId(team.hackathonId);
    setTeamName(team.teamName);
    setTeamTrack(team.track);
    setProjectTitle(team.projectTitle);
    setTeamCollege(team.college);
    setMembers((team.members || defaultTeams[0].members).map((m) => ({ ...m })));
    setFormError('');
    setTeamSubmitted(false);
    setTeamFormOpen(true);
  };

  const handleMemberChange = (
    index: number,
    field: keyof HackathonTeamMember,
    value: string
  ) => {
    setMembers((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [field]: value } : m))
    );
  };

  const handleAddMember = (prefill?: boolean) => {
    if (members.length >= 4) return;
    const sample = SAMPLE_TEAMMATES[(members.length - 1) % SAMPLE_TEAMMATES.length];
    setMembers((prev) => [
      ...prev,
      {
        id: `mem-${Date.now()}-${prev.length + 1}`,
        name: prefill ? sample.name : '',
        rollNo: prefill ? sample.rollNo : '',
        email: prefill ? sample.email : '',
        branchYear: prefill ? sample.branchYear : 'CSE · 2nd Year',
        role: prefill ? sample.role : 'Frontend & UI/UX',
      },
    ]);
  };

  const handleRemoveMember = (index: number) => {
    if (members.length <= 2 || members[index].isLeader) return;
    setMembers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRegisterTeam = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!teamName.trim()) {
      setFormError('Please enter a valid Team Name.');
      return;
    }

    // Validate all member names
    const incompleteMember = members.findIndex((m) => !m.name.trim() || !m.email.trim());
    if (incompleteMember !== -1) {
      setFormError(
        `Please enter both Name and College Email for Team Member #${incompleteMember + 1}.`
      );
      return;
    }

    const targetHackathon =
      hackathons.find((h) => h.id === selectedHackathonId) || innoHack;

    if (editingTeamId) {
      setRegisteredTeams((prev) =>
        prev.map((t) =>
          t.id === editingTeamId
            ? {
                ...t,
                teamName: teamName.trim(),
                hackathonId: selectedHackathonId,
                hackathonTitle: targetHackathon?.title || 'InnoHack 2026',
                track: teamTrack,
                projectTitle:
                  projectTitle.trim() || 'Smart Campus Innovation Prototype',
                college: teamCollege,
                members,
              }
            : t
        )
      );
    } else {
      const randomCode = `INNO-2026-${Math.floor(100 + Math.random() * 899)}`;
      const newTeam: RegisteredHackathonTeam = {
        id: `team-${Date.now()}`,
        teamCode: randomCode,
        teamName: teamName.trim(),
        hackathonId: selectedHackathonId,
        hackathonTitle: targetHackathon?.title || 'InnoHack 2026',
        track: teamTrack,
        projectTitle:
          projectTitle.trim() || 'Next-Gen Campus & Industry Solution',
        college: teamCollege,
        members,
        registeredAt: new Date().toISOString(),
      };
      setRegisteredTeams((prev) => [newTeam, ...prev]);
    }

    // Also ensure the hackathon event is marked registered in the calendar pass drawer
    if (selectedHackathonId && !isEventRegistered(selectedHackathonId)) {
      toggleRegisterEvent(selectedHackathonId);
    }

    setTeamSubmitted(true);
    setTimeout(() => {
      setTeamSubmitted(false);
      setTeamFormOpen(false);
      setActiveTab('my_teams');
    }, 1100);
  };

  const handleDeleteTeam = (teamId: string) => {
    setRegisteredTeams((prev) => prev.filter((t) => t.id !== teamId));
  };

  return (
    <div className="space-y-8">
      {/* Title & Introduction */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
            <span>KIET Deemed to be University</span>
            <span aria-hidden="true">·</span>
            <span>Ghaziabad & Delhi-NCR Hackathon Circuit</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Hackathons & Innovation Build Sprints
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
            Compete for ₹4,00,000+ in total grants and prizes. Register your team, add team member details, and build production prototypes.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0">
          <button
            type="button"
            onClick={() =>
              setActiveTab(activeTab === 'my_teams' ? 'featured' : 'my_teams')
            }
            className={`px-3.5 py-2.5 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer border ${
              activeTab === 'my_teams'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'
            }`}
          >
            <Users className={`w-4 h-4 ${activeTab === 'my_teams' ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`} />
            <span>
              {activeTab === 'my_teams'
                ? `Showing My Teams (${registeredTeams.length})`
                : `My Teams (${registeredTeams.length})`}
            </span>
          </button>

          <button
            type="button"
            onClick={() => openNewTeamModal()}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>Register Your Hackathon Team</span>
          </button>
        </div>
      </div>

      {/* Top Navigation Tabs (Always visible above the fold so My Teams opens immediately!) */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-xs font-semibold overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('featured')}
          className={`pb-3 transition-colors relative whitespace-nowrap cursor-pointer ${
            activeTab === 'featured'
              ? 'text-blue-600 dark:text-blue-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 dark:after:bg-blue-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          All Ghaziabad Hackathons ({hackathons.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('my_teams')}
          className={`pb-3 transition-colors relative whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'my_teams'
              ? 'text-blue-600 dark:text-blue-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 dark:after:bg-blue-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          <span>My Teams & Member Details</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
            {registeredTeams.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('schedule')}
          className={`pb-3 transition-colors relative whitespace-nowrap cursor-pointer ${
            activeTab === 'schedule'
              ? 'text-blue-600 dark:text-blue-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 dark:after:bg-blue-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          Hackathon 36hr Timeline
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('faqs')}
          className={`pb-3 transition-colors relative whitespace-nowrap cursor-pointer ${
            activeTab === 'faqs'
              ? 'text-blue-600 dark:text-blue-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 dark:after:bg-blue-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          Rules & FAQs
        </button>
      </div>

      {/* Featured InnoHack 2026 Hero Card (Shown when on 'featured' tab) */}
      {activeTab === 'featured' && innoHack && (
        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white border border-blue-900/50 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-400 via-transparent to-transparent" />

          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-300 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                <Trophy className="w-3.5 h-3.5" />
                FLAGSHIP 36-HOUR NATIONAL HACKATHON
              </span>
              <span className="text-xs text-blue-200">·</span>
              <span className="text-xs text-blue-200 font-medium">
                Hosted at KIET Deemed to be University, Ghaziabad
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-8 space-y-4">
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                  InnoHack 2026: Code the Future
                </h2>
                <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed max-w-2xl">
                  {innoHack.description}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                    <span className="text-[10px] text-blue-200 block font-semibold uppercase">Prize Pool</span>
                    <span className="text-base sm:text-lg font-bold text-amber-300 font-mono">
                      ₹2,50,000+
                    </span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                    <span className="text-[10px] text-blue-200 block font-semibold uppercase">Sprint Duration</span>
                    <span className="text-base sm:text-lg font-bold text-white font-mono">
                      36 Hours
                    </span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                    <span className="text-[10px] text-blue-200 block font-semibold uppercase">Team Size</span>
                    <span className="text-base sm:text-lg font-bold text-white font-mono">
                      2 - 4 Members
                    </span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                    <span className="text-[10px] text-blue-200 block font-semibold uppercase">Participants</span>
                    <span className="text-base sm:text-lg font-bold text-teal-300 font-mono">
                      {innoHack.registered_count} Registered
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Side Card */}
              <div className="lg:col-span-4 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 space-y-4">
                <div>
                  <span className="text-[11px] text-blue-200 uppercase font-semibold block">Date & Venue</span>
                  <p className="text-sm font-bold text-white mt-1">
                    Nov 6 – Nov 7, 2026
                  </p>
                  <p className="text-xs text-blue-200 mt-0.5">
                    Central Auditorium & Computing Center, KIET Campus
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => openNewTeamModal(innoHack.id)}
                    className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-colors text-center shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Register Team & Add Members</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('my_teams')}
                    className="w-full py-2 bg-white/15 hover:bg-white/20 text-white text-xs font-semibold rounded-xl transition-colors text-center cursor-pointer"
                  >
                    View Registered Team Roster ({registeredTeams.length})
                  </button>
                </div>
              </div>
            </div>

            {innoHack.tracks && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <span className="text-xs font-semibold text-blue-200 uppercase tracking-wider block mb-3">
                  Hackathon Challenge Tracks:
                </span>
                <div className="flex flex-wrap gap-2">
                  {innoHack.tracks.map((track, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-white/10 border border-white/15 rounded-xl text-xs text-white font-medium flex items-center gap-1.5"
                    >
                      <Code2 className="w-3 h-3 text-teal-300" />
                      <span>{track}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 1: All Ghaziabad Hackathons */}
      {activeTab === 'featured' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hackathons.map((hack) => {
            const isSaved = isItemSaved('event', hack.id);

            return (
              <div
                key={hack.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{hack.college}</span>
                    <span className="font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                      {hack.prize_pool || 'Prizes & Grants'}
                    </span>
                  </div>

                  <h3
                    onClick={() => setSelectedEvent(hack)}
                    className="text-lg font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                  >
                    {hack.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                    {hack.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                      <span>{formatDate(hack.start_at)} – {formatDate(hack.end_at)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                      <span className="truncate">{hack.venue}</span>
                    </div>

                    <div className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
                      <Users className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                      <span>Team Size: {hack.team_size || '2 - 4 Members'}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => toggleSaveItem('event', hack.id)}
                    className={`p-2 rounded-xl border text-xs transition-colors cursor-pointer ${
                      isSaved
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400'
                        : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                    title={isSaved ? 'Saved' : 'Bookmark hackathon'}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-blue-600' : ''}`} />
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedEvent(hack)}
                      className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                    >
                      Details & Tracks
                    </button>

                    <button
                      onClick={() => openNewTeamModal(hack.id)}
                      className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Register Team</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Registered Teams & Team Members Roster */}
      {activeTab === 'my_teams' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Registered Hackathon Teams & Member Roster
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                View your confirmed hackathon teams, add or update team member details, and manage participant roles.
              </p>
            </div>
            <button
              onClick={() => openNewTeamModal()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 self-start sm:self-auto shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Register New Team</span>
            </button>
          </div>

          {registeredTeams.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-3xl border border-slate-200 dark:border-slate-800">
              <Users className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                No hackathon teams registered yet
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                Click "Register Your Hackathon Team" to form a 2–4 member squad for InnoHack 2026 or any Ghaziabad sprint.
              </p>
              <button
                onClick={() => openNewTeamModal()}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Create Hackathon Team
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {registeredTeams.map((team) => (
                <div
                  key={team.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden transition-colors"
                >
                  {/* Team Header */}
                  <div className="p-5 sm:p-6 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/70 px-2.5 py-0.5 rounded-md border border-teal-200 dark:border-teal-800">
                          <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                          PASS ID: {team.teamCode}
                        </span>
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-md border border-blue-200 dark:border-blue-800">
                          Track: {team.track}
                        </span>
                        <span className="text-xs text-slate-400 dark:text-slate-500">·</span>
                        <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                          {team.college}
                        </span>
                      </div>

                      <div className="flex items-baseline gap-3 pt-1">
                        <h4 className="text-xl font-extrabold text-slate-900 dark:text-white">
                          {team.teamName}
                        </h4>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          ({team.members.length} / 4 Team Members)
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        <span className="font-semibold text-slate-700 dark:text-slate-200">Hackathon:</span>{' '}
                        {team.hackathonTitle} ·{' '}
                        <span className="font-semibold text-slate-700 dark:text-slate-200">Project:</span>{' '}
                        {team.projectTitle}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
                      <button
                        onClick={() => openEditTeamModal(team)}
                        className="px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span>Add / Edit Members</span>
                      </button>

                      <button
                        onClick={() => handleDeleteTeam(team.id)}
                        className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors cursor-pointer"
                        title="Remove team registration"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Team Members Grid */}
                  <div className="p-5 sm:p-6">
                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                      Team Member Details ({team.members.length} Registered)
                    </h5>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
                      {team.members.map((member, idx) => (
                        <div
                          key={member.id || idx}
                          className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-3"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span
                                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                                  member.isLeader || idx === 0
                                    ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                                    : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                                }`}
                              >
                                {member.isLeader || idx === 0 ? 'Team Leader' : `Member #${idx + 1}`}
                              </span>
                              <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                                #{idx + 1}
                              </span>
                            </div>

                            <p className="text-sm font-bold text-slate-900 dark:text-white">
                              {member.name}
                            </p>
                            <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mt-0.5">
                              {member.role}
                            </p>
                          </div>

                          <div className="pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
                            <div className="flex items-center gap-1.5 font-mono">
                              <Hash className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">Roll: {member.rollNo || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <GraduationCap className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{member.branchYear}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{member.email}</span>
                            </div>
                          </div>
                        </div>
                      ))}

                      {team.members.length < 4 && (
                        <button
                          onClick={() => openEditTeamModal(team)}
                          className="p-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex flex-col items-center justify-center gap-1.5 transition-colors min-h-[140px] cursor-pointer"
                        >
                          <UserPlus className="w-5 h-5" />
                          <span className="text-xs font-bold">Add Team Member</span>
                          <span className="text-[11px] text-slate-400">
                            {4 - team.members.length} slot{4 - team.members.length > 1 ? 's' : ''} available
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Hackathon 36hr Timeline */}
      {activeTab === 'schedule' && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-6 transition-colors">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">InnoHack 2026 Official 36-Hour Schedule</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Venue: Central Computing Labs & Auditorium, KIET Deemed to be University Campus
            </p>
          </div>

          <div className="relative pl-6 border-l-2 border-blue-200 dark:border-blue-800 space-y-6">
            <div className="relative">
              <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-blue-600 ring-4 ring-blue-50 dark:ring-blue-950/60" />
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">Day 1 · 09:00 AM</span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">Check-in, Badges & Networking Breakfast</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">Team verification and kit distribution at KIET Main Gate 1.</p>
            </div>

            <div className="relative">
              <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-blue-600 ring-4 ring-blue-50 dark:ring-blue-950/60" />
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">Day 1 · 11:00 AM</span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">Opening Ceremony & Hacking Commences!</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">Address by Director KIET and release of detailed problem statements.</p>
            </div>

            <div className="relative">
              <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-teal-600 ring-4 ring-teal-50 dark:ring-teal-950/60" />
              <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400">Day 1 · 04:00 PM</span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">Mentorship Review Round 1</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">Industry tech leads review GitHub repositories and system architecture.</p>
            </div>

            <div className="relative">
              <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-indigo-600 ring-4 ring-indigo-50 dark:ring-indigo-950/60" />
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">Day 2 · 12:00 AM (Midnight)</span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">Midnight Energy Refuel & Mini Gaming Challenge</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">Late night pizza, Red Bull snacks, and lightning quizzes in Audi 2.</p>
            </div>

            <div className="relative">
              <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-amber-500 ring-4 ring-amber-50 dark:ring-amber-950/60" />
              <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">Day 2 · 05:00 PM</span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">Code Freeze & Final Jury Demonstrations</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">3-minute live pitch + 2-minute Q&A with evaluation panel.</p>
            </div>

            <div className="relative">
              <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-teal-600 ring-4 ring-teal-50 dark:ring-teal-950/60" />
              <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400">Day 2 · 08:00 PM</span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">Grand Valedictory & Cash Prize Distribution</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">Cheques awarded by Chief Guest and TBI KIET Incubation offers presented.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Rules & FAQs */}
      {activeTab === 'faqs' && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4 text-xs text-slate-700 dark:text-slate-300 transition-colors">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Frequently Asked Questions</h3>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Who is eligible to participate?</h4>
            <p className="mt-1 text-slate-600 dark:text-slate-300">
              Students from any recognized college across Ghaziabad, Delhi-NCR, and national institutions (B.Tech, BCA, MCA, M.Tech). Inter-college teams are welcome!
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Is there any registration fee?</h4>
            <p className="mt-1 text-slate-600 dark:text-slate-300">
              No! Registration for InnoHack 2026 is 100% free of charge. Shortlisted teams receive free meals, hacking spaces, high-speed Wi-Fi, and swags.
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Can 1st year students participate?</h4>
            <p className="mt-1 text-slate-600 dark:text-slate-300">
              Absolutely! There is a special "Best Freshers Team" prize of ₹25,000 to motivate first-year builders at KIET and sister colleges.
            </p>
          </div>
        </div>
      )}

      {/* Comprehensive Team Registration & Member Details Modal */}
      {teamFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {editingTeamId ? 'Update Hackathon Team & Members' : 'Register Your Hackathon Team'}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Add 2 to 4 team members with their name, roll number, email, branch, and role
                  </p>
                </div>
              </div>
              <button
                onClick={() => setTeamFormOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {teamSubmitted ? (
              <div className="p-10 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800 flex items-center justify-center mx-auto text-teal-600 dark:text-teal-400">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                  {editingTeamId ? 'Team Roster Updated!' : 'Hackathon Team Registered Successfully!'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  Your team <span className="font-bold text-slate-800 dark:text-slate-200">{teamName}</span> ({members.length} members) has been registered and synced with your campus event passes.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRegisterTeam} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
                {formError && (
                  <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 font-medium">
                    {formError}
                  </div>
                )}

                {/* Team Metadata */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Select Hackathon *
                    </label>
                    <select
                      value={selectedHackathonId}
                      onChange={(e) => setSelectedHackathonId(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-slate-100"
                    >
                      {hackathons.map((h) => (
                        <option key={h.id} value={h.id}>
                          {h.title} ({h.college})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Team Name *
                    </label>
                    <input
                      type="text"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder="e.g. ByteBuilders KIET"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Problem Track *
                    </label>
                    <select
                      value={teamTrack}
                      onChange={(e) => setTeamTrack(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-slate-100"
                    >
                      <option value="Generative AI & LLMs">Generative AI & LLMs</option>
                      <option value="Smart Campus & IoT">Smart Campus & IoT</option>
                      <option value="HealthTech & Assistive Devices">HealthTech & Assistive Devices</option>
                      <option value="FinTech & Web3 Security">FinTech & Web3 Security</option>
                      <option value="Open Innovation">Open Innovation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Project / Idea Title
                    </label>
                    <input
                      type="text"
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      placeholder="e.g. AI-Powered Lab Assistant for KIET"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Team Members Section */}
                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                        Team Members Details ({members.length} / 4 Members)
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Minimum 2 members and maximum 4 members required per team.
                      </p>
                    </div>

                    {members.length < 4 && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleAddMember(true)}
                          className="px-2.5 py-1.5 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded-lg font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>+ Quick-Fill KIET Teammate</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleAddMember(false)}
                          className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Member #{members.length + 1}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    {members.map((member, index) => (
                      <div
                        key={member.id || index}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                member.isLeader || index === 0
                                  ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                                  : 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                              }`}
                            >
                              {member.isLeader || index === 0
                                ? 'Member #1 · Team Leader'
                                : `Member #${index + 1}`}
                            </span>
                          </div>

                          {members.length > 2 && !member.isLeader && index > 0 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveMember(index)}
                              className="text-red-600 dark:text-red-400 hover:underline text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Remove</span>
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                              Full Name *
                            </label>
                            <input
                              type="text"
                              value={member.name}
                              onChange={(e) =>
                                handleMemberChange(index, 'name', e.target.value)
                              }
                              placeholder="e.g. Rohan Sharma"
                              className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                              University Roll No *
                            </label>
                            <input
                              type="text"
                              value={member.rollNo}
                              onChange={(e) =>
                                handleMemberChange(index, 'rollNo', e.target.value)
                              }
                              placeholder="e.g. 2300290100142"
                              className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                              College Email *
                            </label>
                            <input
                              type="email"
                              value={member.email}
                              onChange={(e) =>
                                handleMemberChange(index, 'email', e.target.value)
                              }
                              placeholder="student@kiet.edu"
                              className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                              Branch & Year
                            </label>
                            <input
                              type="text"
                              value={member.branchYear}
                              onChange={(e) =>
                                handleMemberChange(index, 'branchYear', e.target.value)
                              }
                              placeholder="e.g. CSE (AI & ML) · 3rd Year"
                              className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                              Role / Primary Skill in Team
                            </label>
                            <input
                              type="text"
                              value={member.role}
                              onChange={(e) =>
                                handleMemberChange(index, 'role', e.target.value)
                              }
                              placeholder="e.g. Full-Stack Developer / AI Engineer / UI Designer"
                              className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setTeamFormOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {editingTeamId
                        ? 'Save Team & Member Changes'
                        : `Complete Team Registration (${members.length} Members)`}
                    </span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
