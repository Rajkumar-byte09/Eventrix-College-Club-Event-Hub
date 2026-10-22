import { EventCategory } from '../types';

export const formatDate = (isoString: string): string => {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return isoString;
  }
};

export const formatTime = (isoString: string): string => {
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return '';
  }
};

export const formatFullDateTime = (isoString: string): string => {
  try {
    const d = new Date(isoString);
    return `${d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })} at ${formatTime(isoString)}`;
  } catch {
    return isoString;
  }
};

export const getDaysRemaining = (isoDeadline: string): number => {
  try {
    const now = new Date().getTime();
    const target = new Date(isoDeadline).getTime();
    const diff = target - now;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  } catch {
    return 0;
  }
};

export const getDeadlineLabel = (isoDeadline: string): { label: string; isUrgent: boolean; isExpired: boolean } => {
  const days = getDaysRemaining(isoDeadline);
  if (days < 0) {
    return { label: 'Deadline passed', isUrgent: false, isExpired: true };
  }
  if (days === 0) {
    return { label: 'Closes today', isUrgent: true, isExpired: false };
  }
  if (days === 1) {
    return { label: 'Closes tomorrow', isUrgent: true, isExpired: false };
  }
  if (days <= 4) {
    return { label: `Closes in ${days} days`, isUrgent: true, isExpired: false };
  }
  return { label: `${days} days left`, isUrgent: false, isExpired: false };
};

export const getCategoryStyles = (category: EventCategory): { bg: string; text: string; border: string } => {
  switch (category) {
    case 'Hackathon & Build Sprint':
      return { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' };
    case 'Technology & Coding':
      return { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' };
    case 'Robotics & Hardware':
      return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
    case 'Design & Creative':
      return { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' };
    case 'Business & E-Cell':
      return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
    case 'Debate & Literary':
      return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' };
    case 'Cultural & Music':
      return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' };
    case 'Automobile & SAE':
      return { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' };
    default:
      return { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' };
  }
};

export const downloadIcsCalendar = (title: string, description: string, venue: string, startIso: string, endIso: string) => {
  const formatIcsDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const icsData = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Eventrix//KIET Campus Hub//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `SUMMARY:${title}`,
    `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
    `LOCATION:${venue}`,
    `DTSTART:${formatIcsDate(startIso)}`,
    `DTEND:${formatIcsDate(endIso)}`,
    `STATUS:CONFIRMED`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const getGoogleCalendarUrl = (title: string, description: string, venue: string, startIso: string, endIso: string) => {
  const formatGCalDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
  const params = new URLSearchParams({
    text: title,
    dates: `${formatGCalDate(startIso)}/${formatGCalDate(endIso)}`,
    details: description,
    location: venue,
  });

  return `${baseUrl}&${params.toString()}`;
};
