import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { EventrixLogo } from './components/EventrixLogo';
import { LoginPage } from './components/views/LoginPage';
import { DashboardView } from './components/views/DashboardView';
import { HackathonsView } from './components/views/HackathonsView';
import { EventsView } from './components/views/EventsView';
import { CalendarView } from './components/views/CalendarView';
import { ClubsView } from './components/views/ClubsView';
import { RecruitmentsView } from './components/views/RecruitmentsView';
import { SavedView } from './components/views/SavedView';
import { StudioView } from './components/views/StudioView';
import { EventDetailModal } from './components/modals/EventDetailModal';
import { RecruitmentDetailModal } from './components/modals/RecruitmentDetailModal';
import { ClubDetailModal } from './components/modals/ClubDetailModal';
import { ProfileSettingsModal } from './components/modals/ProfileSettingsModal';
import { SideCalendarDrawer } from './components/SideCalendarDrawer';
import { MiniSideCalendar } from './components/MiniSideCalendar';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, isLoggedIn, currentUser } = useApp();

  // If user is logged out, render the dedicated KIET Ghaziabad Login Page!
  if (!isLoggedIn) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-slate-950 text-[#1E293B] dark:text-slate-100 transition-colors">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'calendar' && <CalendarView />}
        {activeTab !== 'dashboard' && activeTab !== 'calendar' && (
          <div className="flex flex-col lg:flex-row items-start gap-6">
            <div className="flex-1 min-w-0 w-full">
              {activeTab === 'hackathons' && <HackathonsView />}
              {activeTab === 'events' && <EventsView />}
              {activeTab === 'clubs' && <ClubsView />}
              {activeTab === 'recruitments' && <RecruitmentsView />}
              {activeTab === 'saved' && <SavedView />}
              {activeTab === 'studio' && <StudioView />}
            </div>
            <div className="w-full lg:w-[305px] xl:w-[320px] shrink-0 lg:sticky lg:top-22">
              <MiniSideCalendar />
            </div>
          </div>
        )}
      </main>

      {/* Calm Campus Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 mt-12 text-slate-500 dark:text-slate-400 text-xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <EventrixLogo size="sm" showTagline={false} showBadge={false} />
            <span aria-hidden="true">·</span>
            <span>KIET Deemed to be University, Ghaziabad (Delhi-NCR)</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('hackathons')}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-bold text-blue-600 dark:text-blue-400"
            >
              InnoHack 2026
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
            >
              Events
            </button>
            <button
              onClick={() => setActiveTab('clubs')}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
            >
              Clubs
            </button>
            <button
              onClick={() => setActiveTab('recruitments')}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
            >
              Recruitment
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
            >
              Bookmarks
            </button>
          </div>

          <p className="text-slate-400 dark:text-slate-500 text-[11px]">
            © 2026 Eventrix KIET. Student Organization & Hackathon Network.
          </p>
        </div>
      </footer>

      {/* Interactive Global Modals & Drawers */}
      <EventDetailModal />
      <RecruitmentDetailModal />
      <ClubDetailModal />
      <ProfileSettingsModal />
      <SideCalendarDrawer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
