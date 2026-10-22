export type UserRole = 'student' | 'coordinator' | 'admin';

export type GhaziabadCollege =
  | 'KIET Deemed to be University'
  | 'AKGEC Ghaziabad'
  | 'ABES Engineering College'
  | 'IMS Engineering College'
  | 'RKGIT Ghaziabad'
  | 'ITS Engineering College';

export interface User {
  id: string;
  name: string;
  college_email: string;
  student_roll_no?: string;
  college: GhaziabadCollege;
  role: UserRole;
  avatar: string;
  major?: string;
  year?: string;
  club_id?: string;
  club_name?: string;
  notification_preferences: {
    in_app: boolean;
    email_digest: boolean;
    lead_time_hours: number;
  };
  created_at: string;
}

export type EventCategory =
  | 'Hackathon & Build Sprint'
  | 'Technology & Coding'
  | 'Robotics & Hardware'
  | 'Design & Creative'
  | 'Business & E-Cell'
  | 'Debate & Literary'
  | 'Cultural & Music'
  | 'Automobile & SAE';

export type EventStatus = 'upcoming' | 'updated' | 'cancelled' | 'pending_approval';

export interface CampusEvent {
  id: string;
  title: string;
  description: string;
  club_id: string;
  club_name: string;
  college: GhaziabadCollege;
  category: EventCategory;
  start_at: string; // ISO String
  end_at: string;   // ISO String
  venue: string;
  is_online: boolean;
  online_url?: string;
  registration_url: string;
  status: EventStatus;
  status_note?: string;
  featured?: boolean;
  is_hackathon?: boolean;
  prize_pool?: string;
  team_size?: string;
  tracks?: string[];
  capacity?: number;
  registered_count?: number;
  created_by: string;
  updated_at: string;
}

export type RecruitmentStatus = 'open' | 'closing_soon' | 'closed' | 'coming_soon' | 'pending_approval';

export interface SelectionStep {
  step_number: number;
  title: string;
  description: string;
  timeline?: string;
}

export interface Recruitment {
  id: string;
  club_id: string;
  club_name: string;
  college: GhaziabadCollege;
  title: string;
  role_description: string;
  category: EventCategory;
  opens_at: string;
  deadline: string;
  eligibility: string;
  requirements: string[];
  selection_steps: SelectionStep[];
  application_url: string;
  available_positions: number;
  status: RecruitmentStatus;
  created_by: string;
  updated_at: string;
}

export interface Club {
  id: string;
  name: string;
  short_name: string;
  college: GhaziabadCollege;
  category: EventCategory;
  description: string;
  tagline: string;
  lead_name: string;
  contact_email: string;
  website_url?: string;
  discord_url?: string;
  instagram_url?: string;
  member_count: number;
  meeting_time: string;
  meeting_venue: string;
  recruitment_status: 'open' | 'closing_soon' | 'closed' | 'coming_soon';
  banner_color: string;
  tags: string[];
}

export interface SavedItem {
  id: string;
  user_id: string;
  item_type: 'event' | 'recruitment';
  item_id: string;
  created_at: string;
}

export interface Reminder {
  id: string;
  user_id: string;
  item_type: 'event' | 'recruitment';
  item_id: string;
  item_title: string;
  target_date: string;
  remind_at: string;
  lead_time_label: string;
  channel: 'in_app' | 'email';
  status: 'active' | 'dismissed';
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'deadline' | 'update' | 'approval' | 'announcement';
  timestamp: string;
  is_read: boolean;
  link_type?: 'event' | 'recruitment';
  link_id?: string;
}

export interface ContentAudit {
  id: string;
  author_id: string;
  author_name: string;
  item_type: 'event' | 'recruitment';
  item_title: string;
  action: 'created' | 'submitted' | 'approved' | 'updated' | 'archived' | 'rejected';
  timestamp: string;
  notes?: string;
}
