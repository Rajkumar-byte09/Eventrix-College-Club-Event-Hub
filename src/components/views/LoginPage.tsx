import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Sparkles,
  Award,
  Calendar,
  Lock,
  Mail,
  UserCheck,
  Sun,
  Moon,
} from 'lucide-react';
import { GHAZIABAD_COLLEGES, INITIAL_USERS } from '../../data/mockData';
import { GhaziabadCollege } from '../../types';
import { EventrixLogo } from '../EventrixLogo';

export const LoginPage: React.FC = () => {
  const { loginAsUser, setIsLoggedIn, setCurrentUser, setSelectedCollege, setActiveTab, theme, toggleTheme } = useApp();

  const [selectedCol, setSelectedCol] = useState<GhaziabadCollege>('KIET Deemed to be University');
  const [identifier, setIdentifier] = useState('aarav.sharma@kiet.edu');
  const [password, setPassword] = useState('kiet@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!identifier.trim()) {
      setErrorMsg('Please enter your University Roll No. or Campus Email.');
      return;
    }

    // Check if matches known demo user
    const matched = INITIAL_USERS.find(
      (u) =>
        u.college_email.toLowerCase() === identifier.trim().toLowerCase() ||
        (u.student_roll_no && u.student_roll_no === identifier.trim())
    );

    if (matched) {
      loginAsUser(matched);
      setSelectedCollege(matched.college);
    } else {
      // Create student session for this college
      const namePart = identifier.includes('@')
        ? identifier.split('@')[0].replace('.', ' ')
        : `Student ${identifier.slice(-4)}`;

      loginAsUser({
        id: `user-${Date.now()}`,
        name: namePart.charAt(0).toUpperCase() + namePart.slice(1),
        college_email: identifier.includes('@') ? identifier : `${identifier}@kiet.edu`,
        student_roll_no: identifier.replace(/[^0-9]/g, '') || '2300290120999',
        college: selectedCol,
        role: 'student',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        major: 'B.Tech Engineering',
        year: '1st Year',
        notification_preferences: { in_app: true, email_digest: true, lead_time_hours: 24 },
        created_at: new Date().toISOString(),
      });
      setSelectedCollege(selectedCol);
    }
  };

  const handleQuickPersona = (index: number) => {
    const targetUser = INITIAL_USERS[index];
    loginAsUser(targetUser);
    setSelectedCollege(targetUser.college);
    if (targetUser.role === 'admin' || targetUser.role === 'coordinator') {
      setActiveTab('studio');
    } else {
      setActiveTab('dashboard');
    }
  };

  const handleGuestEntry = () => {
    loginAsUser(INITIAL_USERS[0]);
    setSelectedCollege('KIET Deemed to be University');
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 flex flex-col justify-between transition-colors text-slate-800 dark:text-slate-100">
      {/* Top Bar for Login */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-3.5 px-4 sm:px-8 flex items-center justify-between transition-colors">
        <EventrixLogo size="lg" />

        <div className="flex items-center gap-3">
          {/* Theme switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/90 dark:border-slate-700 transition-all flex items-center justify-center"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          <button
            onClick={handleGuestEntry}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline flex items-center gap-1"
          >
            <span>Explore as Guest</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Login Card Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden transition-colors">
          
          {/* Left Hero Column: KIET & Ghaziabad College Branding */}
          <div className="lg:col-span-5 bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 p-6 sm:p-8 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <div className="mb-6">
                <EventrixLogo size="md" variant="light" showTagline={false} />
              </div>

              <span className="text-xs font-semibold text-blue-200 uppercase tracking-widest block mb-1">
                Centralized Campus Gateway
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
                KIET Deemed to be University
              </h2>
              <p className="text-xs text-blue-100/90 mt-2 leading-relaxed">
                Empowering students of KIET & Ghaziabad engineering institutions with real-time club recruitment, InnoHack 2026 registration, and academic deadlines.
              </p>

              {/* Ghaziabad Partner Colleges Strip */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <span className="text-[11px] text-blue-200 font-semibold uppercase tracking-wider block mb-2.5">
                  Ghaziabad Colleges Network
                </span>
                <div className="space-y-1.5 text-xs text-blue-100">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span className="font-semibold text-white">KIET Deemed to be University (Host)</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-200/80">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-400/70 shrink-0" />
                    <span>Ajay Kumar Garg Engg. College (AKGEC)</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-200/80">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-400/70 shrink-0" />
                    <span>ABES Engineering College</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-200/80">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-400/70 shrink-0" />
                    <span>IMS & RKGIT Ghaziabad</span>
                  </div>
                </div>
              </div>
            </div>

            {/* InnoHack Spotlight badge */}
            <div className="mt-8 relative z-10 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-amber-300 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  InnoHack 2026 Live
                </span>
                <span className="font-mono text-[10px] text-white/80">₹2.5 Lakh Prize</span>
              </div>
              <p className="text-[11px] text-white/90">
                Registrations now open for 36-hour national build sprint at KIET.
              </p>
            </div>
          </div>

          {/* Right Column: Sign In Form & 1-Click Persona Access */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Sign in to your account</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Use your college roll number or official email ID
                  </p>
                </div>
                <span className="text-[11px] font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-1 rounded-full border border-teal-200 dark:border-teal-800">
                  Fall 2026 Active
                </span>
              </div>

              {/* 1-Click Fast Persona Switcher */}
              <div className="mb-6 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    Instant 1-Click Demo Login
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">Click to enter as:</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickPersona(0)}
                    className="p-2 bg-white dark:bg-slate-800 hover:border-blue-400 dark:hover:border-blue-500 border border-slate-200 dark:border-slate-700 rounded-xl text-left transition-all shadow-2xs group"
                  >
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                      Aarav Sharma
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">KIET Student (CSE)</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickPersona(1)}
                    className="p-2 bg-white dark:bg-slate-800 hover:border-blue-400 dark:hover:border-blue-500 border border-slate-200 dark:border-slate-700 rounded-xl text-left transition-all shadow-2xs group"
                  >
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                      Priya Verma
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Club Lead (InnoGeeks)</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickPersona(2)}
                    className="p-2 bg-white dark:bg-slate-800 hover:border-blue-400 dark:hover:border-blue-500 border border-slate-200 dark:border-slate-700 rounded-xl text-left transition-all shadow-2xs group"
                  >
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                      Dr. Manoj Goel
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Dean / Admin</p>
                  </button>
                </div>
              </div>

              {errorMsg && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-700 dark:text-red-300">
                  {errorMsg}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSignIn} className="space-y-4">
                {/* College Selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Select Your Institution in Ghaziabad
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <select
                      value={selectedCol}
                      onChange={(e) => setSelectedCol(e.target.value as GhaziabadCollege)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500 font-medium"
                    >
                      {GHAZIABAD_COLLEGES.map((col) => (
                        <option key={col} value={col}>
                          {col}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Email / Roll No */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    College Email ID or Student University Roll No.
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="aarav.sharma@kiet.edu or 2300290120042"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>
                    <span className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                      Forgot Password?
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-9 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 dark:focus:border-blue-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      aria-label="Toggle password"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 mt-2"
                >
                  <span>Sign In to Eventrix KIET</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Campus SSO Footer */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>KIET Campus NetID & ERP Integration</span>
              </div>

              <button
                type="button"
                onClick={handleGuestEntry}
                className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold"
              >
                Skip Login & Enter as Guest →
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-slate-400 dark:text-slate-500 border-t border-slate-200 dark:border-slate-800">
        © 2026 Eventrix · KIET Deemed to be University, Ghaziabad, Delhi-NCR, NH-58, 201206.
      </footer>
    </div>
  );
};
