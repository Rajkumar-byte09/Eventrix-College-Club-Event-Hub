import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Bell, Mail, Shield, Check, RotateCcw } from 'lucide-react';

export const ProfileSettingsModal: React.FC = () => {
  const {
    currentUser,
    isProfileModalOpen,
    setIsProfileModalOpen,
    updatePreferences,
    resetToDefaults,
  } = useApp();

  const [inApp, setInApp] = useState(currentUser.notification_preferences.in_app);
  const [emailDigest, setEmailDigest] = useState(currentUser.notification_preferences.email_digest);
  const [leadTime, setLeadTime] = useState(currentUser.notification_preferences.lead_time_hours);
  const [isSaved, setIsSaved] = useState(false);

  if (!isProfileModalOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePreferences({
      in_app: inApp,
      email_digest: emailDigest,
      lead_time_hours: leadTime,
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      setIsProfileModalOpen(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-700"
            />
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{currentUser.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{currentUser.college_email}</p>
              <span className="inline-block mt-0.5 text-[11px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded capitalize">
                {currentUser.role}
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsProfileModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-6 space-y-6">
          {/* Academic Info */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
              Campus Profile
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-100 dark:border-slate-800 col-span-2">
                <span className="text-slate-400 dark:text-slate-500 block text-[10px]">Affiliated Institution</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{currentUser.college}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 dark:text-slate-500 block text-[10px]">Academic Major</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{currentUser.major || 'Undeclared'}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 dark:text-slate-500 block text-[10px]">Class Standing / Roll No</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {currentUser.year} {currentUser.student_roll_no ? `· ${currentUser.student_roll_no}` : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
              Notification & Reminder Settings
            </h4>

            <div className="space-y-3">
              <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={inApp}
                  onChange={(e) => setInApp(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1 text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
                    <Bell className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>In-App Deadline Alerts</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                    Display badge alerts and banner reminders for your saved events and recruitments.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={emailDigest}
                  onChange={(e) => setEmailDigest(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1 text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
                    <Mail className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    <span>Daily Morning Campus Digest</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                    Receive a summary of today's club meetings and closing opportunities to {currentUser.college_email}.
                  </p>
                </div>
              </label>

              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Default Reminder Lead Time
                </label>
                <select
                  value={leadTime}
                  onChange={(e) => setLeadTime(Number(e.target.value))}
                  className="w-full text-xs px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value={2}>2 hours before deadline / start</option>
                  <option value={12}>12 hours before deadline / start</option>
                  <option value={24}>24 hours (1 day) before deadline / start</option>
                  <option value={48}>48 hours (2 days) before deadline / start</option>
                </select>
              </div>
            </div>
          </div>

          {/* Reset button */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset all demo data back to fresh sample values?')) {
                  resetToDefaults();
                  setIsProfileModalOpen(false);
                }
              }}
              className="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Demo Data
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                {isSaved ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>Save Preferences</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
