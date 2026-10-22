import React, { useState, useRef, useEffect } from 'react';
import { useApp, NavTab } from '../context/AppContext';
import {
  Menu,
  X,
  Compass,
  CalendarDays,
  Users,
  Briefcase,
  Bookmark,
  Bell,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Layers,
  LogOut,
  UserCheck,
  ChevronRight,
  Shield,
  Zap,
  Building2,
  Ticket,
  Sliders,
  Sun,
  Moon,
} from 'lucide-react';
import { formatDate } from '../utils/dateUtils';
import { GHAZIABAD_COLLEGES } from '../data/mockData';
import { GhaziabadCollege } from '../types';
import { GlobalSearch } from './GlobalSearch';
import { EventrixLogo } from './EventrixLogo';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    isLoggedIn,
    switchRole,
    logout,
    selectedCollege,
    setSelectedCollege,
    activeTab,
    setActiveTab,
    theme,
    setTheme,
    toggleTheme,
    setIsSideCalendarOpen,
    registeredEventIds,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setIsProfileModalOpen,
    setSelectedEvent,
    setSelectedRecruitment,
    events,
    recruitments,
    savedItems,
  } = useApp();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifSection, setShowNotifSection] = useState(false);

  const drawerRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // Close drawer on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems: { id: NavTab; label: string; icon: React.FC<{ className?: string }>; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Compass },
    { id: 'hackathons', label: 'InnoHack 2026 & Sprints', icon: Zap, badge: '₹2.5L Prize' },
    { id: 'events', label: 'Campus Events & Workshops', icon: CalendarDays },
    { id: 'calendar', label: 'Calendar & Side Timetable', icon: Clock },
    { id: 'clubs', label: 'Clubs & Student Societies', icon: Users },
    { id: 'recruitments', label: 'Club Recruitment Drives', icon: Briefcase },
    { id: 'saved', label: 'Bookmarks', icon: Bookmark },
  ];

  if (currentUser.role === 'admin') {
    navItems.unshift({
      id: 'studio',
      label: 'Dean Administration & Sanctions',
      icon: Shield,
      badge: 'Dean Only',
    });
  } else if (currentUser.role === 'coordinator') {
    navItems.unshift({
      id: 'studio',
      label: 'Club Head Operations Studio',
      icon: Layers,
      badge: 'Club Lead',
    });
  }

  const handleNavClick = (tabId: NavTab) => {
    setActiveTab(tabId);
    setIsMenuOpen(false);
  };

  const handleNotificationClick = (n: typeof notifications[0]) => {
    markNotificationRead(n.id);
    setIsMenuOpen(false);
    if (n.link_type === 'event' && n.link_id) {
      const ev = events.find((e) => e.id === n.link_id);
      if (ev) {
        setSelectedEvent(ev);
        setActiveTab('events');
      }
    } else if (n.link_type === 'recruitment' && n.link_id) {
      const rec = recruitments.find((r) => r.id === n.link_id);
      if (rec) {
        setSelectedRecruitment(rec);
        setActiveTab('recruitments');
      }
    }
  };

  return (
    <>
      {/* Minimalist, Clean Top Bar with Brand, Search, Theme Toggle, and 3-Line Menu */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
            
            {/* 1. Left: Brand Wordmark & Custom Emblem */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                onClick={() => setActiveTab('dashboard')}
                className="flex items-center text-left focus:outline-none"
                aria-label="Go to Eventrix Dashboard"
              >
                <EventrixLogo size="md" />
              </button>
            </div>

            {/* 2. Center: Global Search Bar */}
            <div className="flex-1 flex justify-center max-w-xl mx-auto min-w-0">
              <GlobalSearch />
            </div>

            {/* 3. Right: Quick Theme Toggle & Three-Line Hamburger Menu Button */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Quick Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/90 dark:border-slate-700 transition-all flex items-center justify-center focus:outline-none"
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-90 duration-200" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-600 animate-in spin-in-90 duration-200" />
                )}
              </button>

              {/* Three-Line Menu Button */}
              <button
                onClick={() => setIsMenuOpen(true)}
                className="p-2 sm:px-3 sm:py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/90 dark:border-slate-700 transition-all flex items-center gap-2 focus:outline-none"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-5 h-5 text-slate-800 dark:text-slate-200" />
                <span className="hidden sm:inline-block text-xs font-bold text-slate-800 dark:text-slate-200">Menu</span>
                
                {/* Subtle notification indicator dot */}
                {(unreadCount > 0 || registeredEventIds.length > 0) && (
                  <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400" />
                )}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Slide-out Menu Drawer containing ALL navigation, college filters, and tools */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 dark:bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            ref={drawerRef}
            className="w-full max-w-sm sm:max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between animate-in slide-in-from-right duration-200 text-slate-800 dark:text-slate-100"
          >
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[190px]">
                    {currentUser.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[190px]">
                    {currentUser.college_email}
                  </p>
                  <span className="inline-block mt-0.5 text-[10px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 px-2 py-0.2 rounded capitalize">
                    {currentUser.role} · {currentUser.college}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Drawer Content */}
            <div className="p-5 overflow-y-auto space-y-5 flex-1 text-xs">
              
              {/* Theme Selector Widget inside Drawer */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    {theme === 'dark' ? (
                      <Moon className="w-4 h-4 text-blue-400" />
                    ) : (
                      <Sun className="w-4 h-4 text-amber-500" />
                    )}
                    <span className="font-bold text-xs">Appearance Theme</span>
                  </div>
                  <div className="flex items-center p-0.5 bg-slate-200/80 dark:bg-slate-700/80 rounded-xl">
                    <button
                      onClick={() => setTheme('light')}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                        theme === 'light'
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                      Light
                    </button>
                    <button
                      onClick={() => setTheme('dark')}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                        theme === 'dark'
                          ? 'bg-slate-900 text-white shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Moon className="w-3.5 h-3.5 text-blue-400" />
                      Dark
                    </button>
                  </div>
                </div>
              </div>

              {/* College Filter inside Drawer */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/80">
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  Filter by Ghaziabad College
                </label>
                <select
                  value={selectedCollege}
                  onChange={(e) => setSelectedCollege(e.target.value as any)}
                  className="w-full text-xs font-semibold px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="All">All Ghaziabad Colleges</option>
                  {GHAZIABAD_COLLEGES.map((col) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
                </select>
              </div>

              {/* Passes & Side Calendar quick action */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsSideCalendarOpen(true);
                  }}
                  className="p-3 bg-teal-50 dark:bg-teal-950/40 hover:bg-teal-100 dark:hover:bg-teal-900/40 border border-teal-200/80 dark:border-teal-800/60 rounded-2xl text-left transition-colors flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between text-teal-700 dark:text-teal-400 mb-1">
                    <Ticket className="w-4 h-4" />
                    <span className="font-mono font-bold text-xs bg-teal-200/60 dark:bg-teal-900/80 px-1.5 py-0.2 rounded-full">
                      {registeredEventIds.length}
                    </span>
                  </div>
                  <span className="font-bold text-teal-900 dark:text-teal-100 block">Registered Passes</span>
                  <span className="text-[10px] text-teal-700 dark:text-teal-400 mt-0.5">Open side drawer</span>
                </button>

                <button
                  onClick={() => handleNavClick('calendar')}
                  className="p-3 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200/80 dark:border-blue-800/60 rounded-2xl text-left transition-colors flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between text-blue-700 dark:text-blue-400 mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="font-mono font-bold text-[10px]">IST</span>
                  </div>
                  <span className="font-bold text-blue-900 dark:text-blue-100 block">Side Calendar</span>
                  <span className="text-[10px] text-blue-700 dark:text-blue-400 mt-0.5">Month schedule</span>
                </button>
              </div>

              {/* Navigation Links */}
              <div>
                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2 px-1">
                  Campus Navigation
                </span>
                <div className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-xs font-bold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-400'}`} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge ? (
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md uppercase ${
                              isActive ? 'bg-white/20 text-white' : 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300'
                            }`}
                          >
                            {item.badge}
                          </span>
                        ) : (
                          <ChevronRight
                            className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-300 dark:text-slate-600'}`}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notifications Accordion in Drawer */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
                <button
                  onClick={() => setShowNotifSection(!showNotifSection)}
                  className="w-full text-left px-1 py-1 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    Campus Alerts ({unreadCount} unread)
                  </span>
                  <ChevronRight
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                      showNotifSection ? 'rotate-90' : ''
                    }`}
                  />
                </button>

                {showNotifSection && (
                  <div className="mt-2 space-y-1.5 max-h-48 overflow-y-auto">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-semibold block pb-1 px-1"
                      >
                        Mark all as read
                      </button>
                    )}
                    {notifications.slice(0, 4).map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleNotificationClick(n)}
                        className="p-2.5 bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50/50 dark:hover:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700/80 cursor-pointer"
                      >
                        <p className="font-bold text-slate-900 dark:text-slate-100 truncate">{n.title}</p>
                        <p className="text-slate-500 dark:text-slate-400 text-[11px] line-clamp-1 mt-0.5">{n.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Switch Demo Persona */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2 px-1">
                  Switch Persona
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => {
                      switchRole('student');
                      setIsMenuOpen(false);
                    }}
                    className={`p-2 rounded-xl text-left border transition-all ${
                      currentUser.role === 'student'
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-bold'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750'
                    }`}
                  >
                    <p className="text-xs truncate font-bold">Aarav</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-400 truncate">Student</p>
                  </button>

                  <button
                    onClick={() => {
                      switchRole('coordinator');
                      setActiveTab('studio');
                      setIsMenuOpen(false);
                    }}
                    className={`p-2 rounded-xl text-left border transition-all ${
                      currentUser.role === 'coordinator'
                        ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 font-bold'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750'
                    }`}
                  >
                    <p className="text-xs truncate font-bold">Priya</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-400 truncate">Club Head</p>
                  </button>

                  <button
                    onClick={() => {
                      switchRole('admin');
                      setActiveTab('studio');
                      setIsMenuOpen(false);
                    }}
                    className={`p-2 rounded-xl text-left border transition-all ${
                      currentUser.role === 'admin'
                        ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-bold'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750'
                    }`}
                  >
                    <p className="text-xs truncate font-bold">Dr. Goel</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-400 truncate">Dean</p>
                  </button>
                </div>
              </div>

            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsProfileModalOpen(true);
                }}
                className="px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5"
              >
                <Sliders className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>Account Settings</span>
              </button>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  logout();
                }}
                className="px-3.5 py-2 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
