import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Club,
  CampusEvent,
  Recruitment,
  SavedItem,
  Reminder,
  NotificationItem,
  ContentAudit,
  UserRole,
  GhaziabadCollege,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_CLUBS,
  INITIAL_EVENTS,
  INITIAL_RECRUITMENTS,
  INITIAL_SAVED_ITEMS,
  INITIAL_REMINDERS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDITS,
} from '../data/mockData';

export type NavTab = 'dashboard' | 'hackathons' | 'events' | 'calendar' | 'clubs' | 'recruitments' | 'saved' | 'studio';

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (logged: boolean) => void;
  switchRole: (role: UserRole) => void;
  loginAsUser: (user: User) => void;
  logout: () => void;
  
  // College filter
  selectedCollege: GhaziabadCollege | 'All';
  setSelectedCollege: (college: GhaziabadCollege | 'All') => void;

  // Navigation
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;

  // Theme
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;

  // Side calendar panel
  isSideCalendarOpen: boolean;
  setIsSideCalendarOpen: (open: boolean) => void;

  // Registered events state
  registeredEventIds: string[];
  toggleRegisterEvent: (eventId: string) => void;
  isEventRegistered: (eventId: string) => boolean;

  // Data
  clubs: Club[];
  events: CampusEvent[];
  recruitments: Recruitment[];
  savedItems: SavedItem[];
  reminders: Reminder[];
  notifications: NotificationItem[];
  contentAudits: ContentAudit[];

  // Modal / Detail state
  selectedEvent: CampusEvent | null;
  setSelectedEvent: (e: CampusEvent | null) => void;
  selectedRecruitment: Recruitment | null;
  setSelectedRecruitment: (r: Recruitment | null) => void;
  selectedClub: Club | null;
  setSelectedClub: (c: Club | null) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;

  // Operations
  toggleSaveItem: (itemType: 'event' | 'recruitment', itemId: string) => void;
  isItemSaved: (itemType: 'event' | 'recruitment', itemId: string) => boolean;
  toggleReminder: (
    itemType: 'event' | 'recruitment',
    itemId: string,
    itemTitle: string,
    targetDate: string,
    leadTimeLabel?: string
  ) => void;
  hasReminder: (itemType: 'event' | 'recruitment', itemId: string) => boolean;
  
  // Content Management (Publishing & Admin)
  createEvent: (data: Omit<CampusEvent, 'id' | 'updated_at'>) => void;
  updateEvent: (id: string, updates: Partial<CampusEvent>) => void;
  cancelEvent: (id: string, note?: string) => void;
  deleteEvent: (id: string) => void;

  createRecruitment: (data: Omit<Recruitment, 'id' | 'updated_at'>) => void;
  updateRecruitment: (id: string, updates: Partial<Recruitment>) => void;
  archiveRecruitment: (id: string) => void;
  updateClub: (id: string, updates: Partial<Club>) => void;
  
  // Approval workflow
  approveItem: (itemType: 'event' | 'recruitment', id: string) => void;
  rejectItem: (itemType: 'event' | 'recruitment', id: string, notes: string) => void;

  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  updatePreferences: (prefs: User['notification_preferences']) => void;
  resetToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PREFIX = 'eventrix_kiet_v2_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}user`);
    return saved ? JSON.parse(saved) : INITIAL_USERS[0];
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}is_logged_in`);
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [selectedCollege, setSelectedCollege] = useState<GhaziabadCollege | 'All'>('All');
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');

  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}theme`);
    if (saved === 'dark' || saved === 'light') return saved;
    return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}theme`, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const [isSideCalendarOpen, setIsSideCalendarOpen] = useState<boolean>(false);

  const [registeredEventIds, setRegisteredEventIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}registered_event_ids`);
    return saved ? JSON.parse(saved) : ['evt-innohack-2026', 'evt-ros2-workshop'];
  });

  const [clubs, setClubs] = useState<Club[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}clubs`);
    if (!saved) return INITIAL_CLUBS;
    try {
      const parsed: Club[] = JSON.parse(saved);
      const savedMap = new Map(parsed.map((c) => [c.id, c]));
      const merged = INITIAL_CLUBS.map((ic) => savedMap.get(ic.id) || ic);
      const customExtras = parsed.filter((c) => !INITIAL_CLUBS.some((ic) => ic.id === c.id));
      return [...merged, ...customExtras];
    } catch {
      return INITIAL_CLUBS;
    }
  });

  const [events, setEvents] = useState<CampusEvent[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}events`);
    if (!saved) return INITIAL_EVENTS;
    try {
      const parsed: CampusEvent[] = JSON.parse(saved);
      const savedMap = new Map(parsed.map((e) => [e.id, e]));
      const merged = INITIAL_EVENTS.map((ie) => savedMap.get(ie.id) || ie);
      const customExtras = parsed.filter((e) => !INITIAL_EVENTS.some((ie) => ie.id === e.id));
      return [...merged, ...customExtras];
    } catch {
      return INITIAL_EVENTS;
    }
  });

  const [recruitments, setRecruitments] = useState<Recruitment[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}recruitments`);
    if (!saved) return INITIAL_RECRUITMENTS;
    try {
      const parsed: Recruitment[] = JSON.parse(saved);
      const savedMap = new Map(parsed.map((r) => [r.id, r]));
      const merged = INITIAL_RECRUITMENTS.map((ir) => savedMap.get(ir.id) || ir);
      const customExtras = parsed.filter((r) => !INITIAL_RECRUITMENTS.some((ir) => ir.id === r.id));
      return [...merged, ...customExtras];
    } catch {
      return INITIAL_RECRUITMENTS;
    }
  });

  const [savedItems, setSavedItems] = useState<SavedItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}saved_items`);
    return saved ? JSON.parse(saved) : INITIAL_SAVED_ITEMS;
  });

  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}reminders`);
    return saved ? JSON.parse(saved) : INITIAL_REMINDERS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}notifications`);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [contentAudits, setContentAudits] = useState<ContentAudit[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}audits`);
    return saved ? JSON.parse(saved) : INITIAL_AUDITS;
  });

  // Modal states
  const [selectedEvent, setSelectedEvent] = useState<CampusEvent | null>(null);
  const [selectedRecruitment, setSelectedRecruitment] = useState<Recruitment | null>(null);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}user`, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}is_logged_in`, JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}registered_event_ids`, JSON.stringify(registeredEventIds));
  }, [registeredEventIds]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}clubs`, JSON.stringify(clubs));
  }, [clubs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}events`, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}recruitments`, JSON.stringify(recruitments));
  }, [recruitments]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}saved_items`, JSON.stringify(savedItems));
  }, [savedItems]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}reminders`, JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}notifications`, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}audits`, JSON.stringify(contentAudits));
  }, [contentAudits]);

  const toggleRegisterEvent = (eventId: string) => {
    const isAlready = registeredEventIds.includes(eventId);
    const ev = events.find((e) => e.id === eventId);
    if (isAlready) {
      setRegisteredEventIds((prev) => prev.filter((id) => id !== eventId));
    } else {
      setRegisteredEventIds((prev) => [...prev, eventId]);

      if (ev) {
        const notif: NotificationItem = {
          id: `notif-${Date.now()}`,
          user_id: currentUser.id,
          title: `Seat Confirmed: ${ev.title}`,
          message: `Your registration is confirmed. Added to your personal side calendar schedule at ${ev.venue}.`,
          type: 'announcement',
          timestamp: new Date().toISOString(),
          is_read: false,
          link_type: 'event',
          link_id: ev.id,
        };
        setNotifications((prev) => [notif, ...prev]);
      }
    }
  };

  const isEventRegistered = (eventId: string) => {
    return registeredEventIds.includes(eventId);
  };

  const switchRole = (role: UserRole) => {
    const found = INITIAL_USERS.find((u) => u.role === role);
    if (found) {
      setCurrentUser(found);
      setIsLoggedIn(true);
      if (role === 'student' && activeTab === 'studio') {
        setActiveTab('dashboard');
      }
    }
  };

  const loginAsUser = (user: User) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    if (user.role === 'student' && activeTab === 'studio') {
      setActiveTab('dashboard');
    }
  };

  const updateClub = (id: string, updates: Partial<Club>) => {
    setClubs((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  const toggleSaveItem = (itemType: 'event' | 'recruitment', itemId: string) => {
    const exists = savedItems.some(
      (si) => si.user_id === currentUser.id && si.item_type === itemType && si.item_id === itemId
    );

    if (exists) {
      setSavedItems((prev) =>
        prev.filter(
          (si) => !(si.user_id === currentUser.id && si.item_type === itemType && si.item_id === itemId)
        )
      );
    } else {
      const newItem: SavedItem = {
        id: `save-${Date.now()}`,
        user_id: currentUser.id,
        item_type: itemType,
        item_id: itemId,
        created_at: new Date().toISOString(),
      };
      setSavedItems((prev) => [newItem, ...prev]);
    }
  };

  const isItemSaved = (itemType: 'event' | 'recruitment', itemId: string) => {
    return savedItems.some(
      (si) => si.user_id === currentUser.id && si.item_type === itemType && si.item_id === itemId
    );
  };

  const toggleReminder = (
    itemType: 'event' | 'recruitment',
    itemId: string,
    itemTitle: string,
    targetDate: string,
    leadTimeLabel = '24 hours before'
  ) => {
    const existing = reminders.find(
      (r) => r.user_id === currentUser.id && r.item_type === itemType && r.item_id === itemId
    );

    if (existing) {
      setReminders((prev) => prev.filter((r) => r.id !== existing.id));
    } else {
      const newReminder: Reminder = {
        id: `rem-${Date.now()}`,
        user_id: currentUser.id,
        item_type: itemType,
        item_id: itemId,
        item_title: itemTitle,
        target_date: targetDate,
        remind_at: new Date(Date.now() + 86400000).toISOString(),
        lead_time_label: leadTimeLabel,
        channel: 'in_app',
        status: 'active',
      };
      setReminders((prev) => [newReminder, ...prev]);

      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        user_id: currentUser.id,
        title: `Reminder set: ${itemTitle}`,
        message: `You will receive an alert ${leadTimeLabel}. Saved to your personal timetable.`,
        type: 'announcement',
        timestamp: new Date().toISOString(),
        is_read: false,
        link_type: itemType,
        link_id: itemId,
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }
  };

  const hasReminder = (itemType: 'event' | 'recruitment', itemId: string) => {
    return reminders.some(
      (r) => r.user_id === currentUser.id && r.item_type === itemType && r.item_id === itemId
    );
  };

  // Content Management: Events & Hackathons
  const createEvent = (data: Omit<CampusEvent, 'id' | 'updated_at'>) => {
    const isApprovalNeeded = currentUser.role !== 'admin';
    const newEvent: CampusEvent = {
      ...data,
      id: `evt-${Date.now()}`,
      status: isApprovalNeeded ? 'pending_approval' : data.status || 'upcoming',
      created_by: currentUser.name,
      updated_at: new Date().toISOString(),
    };

    setEvents((prev) => [newEvent, ...prev]);

    const audit: ContentAudit = {
      id: `audit-${Date.now()}`,
      author_id: currentUser.id,
      author_name: `${currentUser.name} (${currentUser.role})`,
      item_type: 'event',
      item_title: newEvent.title,
      action: isApprovalNeeded ? 'submitted' : 'created',
      timestamp: new Date().toISOString(),
      notes: isApprovalNeeded
        ? 'Submitted by club coordinator for Dean approval.'
        : 'Published immediately by University Administrator.',
    };
    setContentAudits((prev) => [audit, ...prev]);

    if (isApprovalNeeded) {
      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        user_id: 'user-dean',
        title: 'New Campus Event Submission',
        message: `${currentUser.name} submitted "${newEvent.title}" for review.`,
        type: 'approval',
        timestamp: new Date().toISOString(),
        is_read: false,
        link_type: 'event',
        link_id: newEvent.id,
      };
      setNotifications((prev) => [notif, ...prev]);
    }
  };

  const updateEvent = (id: string, updates: Partial<CampusEvent>) => {
    setEvents((prev) =>
      prev.map((evt) => (evt.id === id ? { ...evt, ...updates, updated_at: new Date().toISOString() } : evt))
    );

    const audit: ContentAudit = {
      id: `audit-${Date.now()}`,
      author_id: currentUser.id,
      author_name: `${currentUser.name} (${currentUser.role})`,
      item_type: 'event',
      item_title: updates.title || 'Event details updated',
      action: 'updated',
      timestamp: new Date().toISOString(),
      notes: 'Details updated.',
    };
    setContentAudits((prev) => [audit, ...prev]);
  };

  const cancelEvent = (id: string, note = 'Cancelled by club organizers.') => {
    setEvents((prev) =>
      prev.map((evt) =>
        evt.id === id
          ? {
              ...evt,
              status: 'cancelled',
              status_note: note,
              updated_at: new Date().toISOString(),
            }
          : evt
      )
    );

    const audit: ContentAudit = {
      id: `audit-${Date.now()}`,
      author_id: currentUser.id,
      author_name: `${currentUser.name} (${currentUser.role})`,
      item_type: 'event',
      item_title: 'Event cancellation marked',
      action: 'updated',
      timestamp: new Date().toISOString(),
      notes: note,
    };
    setContentAudits((prev) => [audit, ...prev]);
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  // Content Management: Recruitments
  const createRecruitment = (data: Omit<Recruitment, 'id' | 'updated_at'>) => {
    const isApprovalNeeded = currentUser.role !== 'admin';
    const newRec: Recruitment = {
      ...data,
      id: `rec-${Date.now()}`,
      status: isApprovalNeeded ? 'pending_approval' : data.status || 'open',
      created_by: currentUser.name,
      updated_at: new Date().toISOString(),
    };

    setRecruitments((prev) => [newRec, ...prev]);

    const audit: ContentAudit = {
      id: `audit-${Date.now()}`,
      author_id: currentUser.id,
      author_name: `${currentUser.name} (${currentUser.role})`,
      item_type: 'recruitment',
      item_title: newRec.title,
      action: isApprovalNeeded ? 'submitted' : 'created',
      timestamp: new Date().toISOString(),
      notes: isApprovalNeeded
        ? 'Submitted for admin review before publication.'
        : 'Published immediately by university admin.',
    };
    setContentAudits((prev) => [audit, ...prev]);

    if (isApprovalNeeded) {
      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        user_id: 'user-dean',
        title: 'New Club Recruitment Notice',
        message: `${currentUser.name} posted recruitment "${newRec.title}".`,
        type: 'approval',
        timestamp: new Date().toISOString(),
        is_read: false,
        link_type: 'recruitment',
        link_id: newRec.id,
      };
      setNotifications((prev) => [notif, ...prev]);
    }
  };

  const updateRecruitment = (id: string, updates: Partial<Recruitment>) => {
    setRecruitments((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates, updated_at: new Date().toISOString() } : r))
    );

    const audit: ContentAudit = {
      id: `audit-${Date.now()}`,
      author_id: currentUser.id,
      author_name: `${currentUser.name} (${currentUser.role})`,
      item_type: 'recruitment',
      item_title: updates.title || 'Recruitment updated',
      action: 'updated',
      timestamp: new Date().toISOString(),
      notes: 'Recruitment details revised.',
    };
    setContentAudits((prev) => [audit, ...prev]);
  };

  const archiveRecruitment = (id: string) => {
    setRecruitments((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'closed',
              updated_at: new Date().toISOString(),
            }
          : r
      )
    );

    const audit: ContentAudit = {
      id: `audit-${Date.now()}`,
      author_id: currentUser.id,
      author_name: `${currentUser.name} (${currentUser.role})`,
      item_type: 'recruitment',
      item_title: 'Opportunity archived',
      action: 'archived',
      timestamp: new Date().toISOString(),
      notes: 'Status changed to Closed / Archived.',
    };
    setContentAudits((prev) => [audit, ...prev]);
  };

  // Approval workflow
  const approveItem = (itemType: 'event' | 'recruitment', id: string) => {
    if (itemType === 'event') {
      setEvents((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status: 'upcoming', updated_at: new Date().toISOString() } : e))
      );
    } else {
      setRecruitments((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'open', updated_at: new Date().toISOString() } : r))
      );
    }

    const audit: ContentAudit = {
      id: `audit-${Date.now()}`,
      author_id: currentUser.id,
      author_name: `${currentUser.name} (Dean/Admin)`,
      item_type: itemType,
      item_title: `ID ${id} post approved`,
      action: 'approved',
      timestamp: new Date().toISOString(),
      notes: 'Verified and approved for publication on Eventrix KIET.',
    };
    setContentAudits((prev) => [audit, ...prev]);
  };

  const rejectItem = (itemType: 'event' | 'recruitment', id: string, notes: string) => {
    if (itemType === 'event') {
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } else {
      setRecruitments((prev) => prev.filter((r) => r.id !== id));
    }

    const audit: ContentAudit = {
      id: `audit-${Date.now()}`,
      author_id: currentUser.id,
      author_name: `${currentUser.name} (Dean/Admin)`,
      item_type: itemType,
      item_title: `ID ${id} rejected`,
      action: 'rejected',
      timestamp: new Date().toISOString(),
      notes,
    };
    setContentAudits((prev) => [audit, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const updatePreferences = (prefs: User['notification_preferences']) => {
    setCurrentUser((prev) => ({
      ...prev,
      notification_preferences: prefs,
    }));
  };

  const resetToDefaults = () => {
    localStorage.clear();
    setCurrentUser(INITIAL_USERS[0]);
    setIsLoggedIn(true);
    setClubs(INITIAL_CLUBS);
    setEvents(INITIAL_EVENTS);
    setRecruitments(INITIAL_RECRUITMENTS);
    setSavedItems(INITIAL_SAVED_ITEMS);
    setReminders(INITIAL_REMINDERS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setContentAudits(INITIAL_AUDITS);
    setSelectedCollege('All');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isLoggedIn,
        setIsLoggedIn,
        switchRole,
        loginAsUser,
        logout,
        selectedCollege,
        setSelectedCollege,
        activeTab,
        setActiveTab,
        theme,
        setTheme,
        toggleTheme,
        isSideCalendarOpen,
        setIsSideCalendarOpen,
        registeredEventIds,
        toggleRegisterEvent,
        isEventRegistered,
        clubs,
        events,
        recruitments,
        savedItems,
        reminders,
        notifications,
        contentAudits,
        selectedEvent,
        setSelectedEvent,
        selectedRecruitment,
        setSelectedRecruitment,
        selectedClub,
        setSelectedClub,
        isProfileModalOpen,
        setIsProfileModalOpen,
        toggleSaveItem,
        isItemSaved,
        toggleReminder,
        hasReminder,
        createEvent,
        updateEvent,
        cancelEvent,
        deleteEvent,
        createRecruitment,
        updateRecruitment,
        archiveRecruitment,
        updateClub,
        approveItem,
        rejectItem,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotifications,
        updatePreferences,
        resetToDefaults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
