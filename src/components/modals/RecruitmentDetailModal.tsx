import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Calendar,
  Clock,
  ExternalLink,
  Bookmark,
  Bell,
  Building,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ListOrdered,
  Users,
} from 'lucide-react';
import { formatDate, getDeadlineLabel } from '../../utils/dateUtils';

export const RecruitmentDetailModal: React.FC = () => {
  const {
    selectedRecruitment,
    setSelectedRecruitment,
    setSelectedClub,
    clubs,
    toggleSaveItem,
    isItemSaved,
    toggleReminder,
    hasReminder,
  } = useApp();

  const [showReminderMenu, setShowReminderMenu] = useState(false);

  if (!selectedRecruitment) return null;

  const isSaved = isItemSaved('recruitment', selectedRecruitment.id);
  const isReminded = hasReminder('recruitment', selectedRecruitment.id);
  const deadlineInfo = getDeadlineLabel(selectedRecruitment.deadline);
  const hostClub = clubs.find((c) => c.id === selectedRecruitment.club_id);

  const handleOpenClub = () => {
    if (hostClub) {
      setSelectedClub(hostClub);
    }
  };

  const handleSetReminder = (leadTime: string) => {
    toggleReminder(
      'recruitment',
      selectedRecruitment.id,
      selectedRecruitment.title,
      selectedRecruitment.deadline,
      leadTime
    );
    setShowReminderMenu(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col transition-colors">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2 mb-2">
              {/* Textual status tags */}
              {selectedRecruitment.status === 'closing_soon' || deadlineInfo.isUrgent ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  Closing Soon · {deadlineInfo.label}
                </span>
              ) : selectedRecruitment.status === 'open' ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-0.5 rounded border border-teal-200 dark:border-teal-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  Applications Open
                </span>
              ) : selectedRecruitment.status === 'closed' || deadlineInfo.isExpired ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                  Recruitment Closed
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                  Coming Soon
                </span>
              )}

              <span className="text-xs text-slate-400 dark:text-slate-500">·</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {selectedRecruitment.available_positions} positions open
              </span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-snug">
              {selectedRecruitment.title}
            </h2>

            <button
              onClick={handleOpenClub}
              className="mt-1 flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold transition-colors cursor-pointer"
            >
              <Building className="w-3.5 h-3.5" />
              <span>Organized by {selectedRecruitment.club_name}</span>
            </button>
          </div>

          <button
            onClick={() => setSelectedRecruitment(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700 dark:text-slate-300 text-sm">
          {/* Timeline & Dates strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 flex items-start gap-3">
              <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Application Window</p>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  Opened {formatDate(selectedRecruitment.opens_at)}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Closes {formatDate(selectedRecruitment.deadline)} at 11:59 PM (IST)
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 flex items-start gap-3">
              <Clock className={`w-4 h-4 shrink-0 mt-0.5 ${deadlineInfo.isUrgent ? 'text-amber-600 dark:text-amber-400' : 'text-teal-600 dark:text-teal-400'}`} />
              <div>
                <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Deadline Status</p>
                <p className={`text-xs font-semibold mt-0.5 ${deadlineInfo.isUrgent ? 'text-amber-800 dark:text-amber-300' : 'text-slate-800 dark:text-slate-200'}`}>
                  {deadlineInfo.label}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {deadlineInfo.isExpired ? 'Submissions are no longer accepted' : 'Online form submission'}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
              Role Overview
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm whitespace-pre-line">
              {selectedRecruitment.role_description}
            </p>
          </div>

          {/* Eligibility */}
          <div className="p-3.5 bg-blue-50/50 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900/60">
            <h4 className="text-xs font-semibold text-blue-900 dark:text-blue-300 mb-1 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              Eligibility Criteria
            </h4>
            <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
              {selectedRecruitment.eligibility}
            </p>
          </div>

          {/* Required Documents / Tasks checklist */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              Application Requirements & Materials
            </h3>
            <ul className="space-y-2">
              {selectedRecruitment.requirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Selection Process Stages */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <ListOrdered className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              Selection Process Stages
            </h3>
            <div className="space-y-3 relative before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {selectedRecruitment.selection_steps.map((step) => (
                <div key={step.step_number} className="relative pl-8">
                  <div className="absolute left-1.5 top-0.5 w-3.5 h-3.5 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center text-[9px] font-bold ring-4 ring-white dark:ring-slate-900">
                    {step.step_number}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{step.title}</span>
                      {step.timeline && (
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">({step.timeline})</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 transition-colors">
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSaveItem('recruitment', selectedRecruitment.id)}
              className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer ${
                isSaved
                  ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-blue-600 text-blue-600 dark:fill-blue-400 dark:text-blue-400' : ''}`} />
              <span>{isSaved ? 'Saved' : 'Save Listing'}</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowReminderMenu(!showReminderMenu)}
                className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isReminded
                    ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <Bell className={`w-3.5 h-3.5 ${isReminded ? 'fill-amber-500 text-amber-600 dark:text-amber-400' : ''}`} />
                <span>{isReminded ? 'Reminder Set' : 'Set Deadline Reminder'}</span>
              </button>

              {showReminderMenu && (
                <div className="absolute left-0 bottom-full mb-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-2 z-50 text-xs transition-colors">
                  <p className="px-2 py-1 font-semibold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider">
                    Deadline Reminder
                  </p>
                  <button
                    onClick={() => handleSetReminder('24 hours before deadline')}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer"
                  >
                    24 hours before deadline
                  </button>
                  <button
                    onClick={() => handleSetReminder('3 days before deadline')}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer"
                  >
                    3 days before deadline
                  </button>
                  <button
                    onClick={() => handleSetReminder('6 hours before deadline')}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer"
                  >
                    6 hours before deadline
                  </button>
                  {isReminded && (
                    <button
                      onClick={() => handleSetReminder('remove')}
                      className="w-full text-left px-2 py-1.5 rounded hover:bg-red-50 dark:hover:bg-red-950/50 text-red-600 dark:text-red-400 border-t border-slate-100 dark:border-slate-700 mt-1 cursor-pointer"
                    >
                      Turn off reminder
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div>
            {selectedRecruitment.status === 'closed' || deadlineInfo.isExpired ? (
              <span className="px-4 py-2 text-xs font-semibold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 rounded-lg inline-block">
                Applications Closed
              </span>
            ) : (
              <a
                href={selectedRecruitment.application_url}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Open Application Form</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
