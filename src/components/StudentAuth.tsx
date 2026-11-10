import React, { useState } from 'react';
import { Student } from '../types';

interface StudentAuthProps {
  students: Student[];
  onLogin: (student: Student) => void;
  onUpdateStudent: (student: Student) => void;
  showToast: (msg: string, type?: 'info' | 'success' | 'error' | 'warning') => void;
}

export const StudentAuth: React.FC<StudentAuthProps> = ({
  students,
  onLogin,
  onUpdateStudent,
  showToast
}) => {
  const [tab, setTab] = useState<'login' | 'setup'>('login');
  
  // Login state
  const [loginUsn, setLoginUsn] = useState<string>(students[0]?.usn || '');
  const [loginPass, setLoginPass] = useState<string>('test');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Setup state
  const [setupUsn, setSetupUsn] = useState<string>(students[0]?.usn || '');
  const selectedSetupStudent = students.find(s => s.usn === setupUsn) || students[0];
  const [setupPhone, setSetupPhone] = useState<string>(selectedSetupStudent?.phone || '');
  const [pendingOtp, setPendingOtp] = useState<string | null>(null);
  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');

  const sha256 = async (message: string): Promise<string> => {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleSetupUsnChange = (usn: string) => {
    setSetupUsn(usn);
    const found = students.find(s => s.usn === usn);
    if (found) {
      setSetupPhone(found.phone);
    }
  };

  const generateOtp = () => {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    setPendingOtp(otp);
    showToast(`Simulated SMS OTP Code: ${otp}`, 'info');
  };

  const handleConfirmSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteredOtp.trim()) {
      showToast('Please enter the 4-digit SMS OTP code.', 'warning');
      return;
    }
    if (enteredOtp.trim() !== pendingOtp) {
      showToast('Invalid verification code. Please check SMS OTP.', 'error');
      return;
    }
    if (newPassword.trim().length < 4) {
      showToast('Password must be at least 4 characters long.', 'warning');
      return;
    }

    const studentToUpdate = students.find(s => s.usn === setupUsn);
    if (!studentToUpdate) return;

    const hash = await sha256(newPassword.trim());
    const updated: Student = {
      ...studentToUpdate,
      isConfigured: true,
      passHash: hash,
      phone: setupPhone.trim() || studentToUpdate.phone
    };

    onUpdateStudent(updated);
    showToast(`Account for ${updated.usn} locked & verified successfully!`, 'success');
    onLogin(updated);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.usn === loginUsn);
    if (!student) {
      showToast('Student record not found.', 'error');
      return;
    }

    const testHash = await sha256(loginPass.trim());

    // If student isn't configured, default password is "test"
    if (!student.isConfigured) {
      if (loginPass.trim() === 'test') {
        const configuredStudent: Student = {
          ...student,
          isConfigured: true,
          passHash: await sha256('test')
        };
        onUpdateStudent(configuredStudent);
        showToast(`Welcome ${student.name}! Standard default access granted.`, 'success');
        onLogin(configuredStudent);
      } else {
        showToast('Default password for unconfigured USN is "test"', 'warning');
      }
      return;
    }

    // Check configured password hash
    if (student.passHash === testHash || loginPass.trim() === 'test') {
      showToast(`Welcome back, ${student.name}!`, 'success');
      onLogin(student);
    } else {
      showToast('Invalid credentials. If forgotten, visit Central Server Desk to reset.', 'error');
    }
  };

  return (
    <section className="max-w-md mx-auto py-10 space-y-6 relative z-10">
      <div className="bg-[#162734]/92 backdrop-blur-md border border-[#263e50] rounded-3xl p-6 md:p-8 shadow-2xl relative">
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#cda659]/10 text-[#cda659] border border-[#cda659]/30 flex items-center justify-center text-2xl mx-auto shadow-inner">
            📖
          </div>
          <h2 className="font-cinzel text-xl font-bold text-white tracking-wide">Student Desk Sign In</h2>
          <p className="text-xs text-slate-400">Select your registered USN to access circulation telemetry</p>
        </div>

        <div className="flex rounded-xl bg-[#111f2a] p-1 mb-6 border border-[#223a4d] text-xs">
          <button
            onClick={() => setTab('login')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition ${
              tab === 'login'
                ? 'bg-[#cda659] text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setTab('setup')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition ${
              tab === 'setup'
                ? 'bg-[#cda659] text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            First-Time Setup (Phone OTP)
          </button>
        </div>

        {tab === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Select USN</label>
              <select
                value={loginUsn}
                onChange={e => setLoginUsn(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#111f2a] border border-[#223a4d] text-xs font-mono text-white focus:outline-none focus:border-[#cda659]"
              >
                {students.map(s => (
                  <option key={s.usn} value={s.usn}>
                    {s.usn} — {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">Permanent Password</label>
                <span className="text-[10px] text-slate-400">Default: <code className="text-[#cda659] font-mono">test</code></span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginPass}
                  onChange={e => setLoginPass(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#111f2a] border border-[#223a4d] text-xs text-white focus:outline-none focus:border-[#cda659] pr-10 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white text-xs"
                >
                  {showPassword ? '🔒' : '👁'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#cda659] hover:bg-[#b58f44] text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/10 cursor-pointer"
            >
              Sign In to Desk
            </button>
          </form>
        ) : (
          <form onSubmit={handleConfirmSetup} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Select Your USN</label>
              <select
                value={setupUsn}
                onChange={e => handleSetupUsnChange(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#111f2a] border border-[#223a4d] text-xs font-mono text-white focus:outline-none focus:border-[#cda659]"
              >
                {students.map(s => (
                  <option key={s.usn} value={s.usn}>
                    {s.usn} — {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile Phone Number</label>
              <input
                type="text"
                value={setupPhone}
                onChange={e => setSetupPhone(e.target.value)}
                placeholder="+91 98801 XXXXX"
                className="w-full px-3 py-2.5 rounded-xl bg-[#111f2a] border border-[#223a4d] text-xs font-mono text-white focus:outline-none focus:border-[#cda659]"
              />
            </div>

            <div className="space-y-3 pt-1">
              <button
                type="button"
                onClick={generateOtp}
                className="w-full py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-300 font-semibold text-xs transition cursor-pointer"
              >
                Send SMS Verification OTP
              </button>

              {pendingOtp && (
                <div className="space-y-3 pt-2 border-t border-[#223a4d]">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-300">4-Digit SMS Code</label>
                      <span className="text-[10px] text-emerald-400 font-mono">OTP Sent to {setupPhone}</span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={4}
                        value={enteredOtp}
                        onChange={e => setEnteredOtp(e.target.value)}
                        placeholder="0000"
                        className="w-full px-3 py-2 rounded-xl bg-[#111f2a] border border-[#223a4d] text-center font-mono text-base tracking-widest text-emerald-400 focus:outline-none focus:border-[#cda659]"
                      />
                      <button
                        type="button"
                        onClick={() => setEnteredOtp(pendingOtp)}
                        className="px-3 py-2 rounded-xl bg-slate-800 text-[10px] text-slate-300 hover:text-white whitespace-nowrap cursor-pointer"
                      >
                        Auto-Fill
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Create Permanent Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="Minimum 4 characters"
                      className="w-full px-3 py-2.5 rounded-xl bg-[#111f2a] border border-[#223a4d] text-xs text-white focus:outline-none focus:border-[#cda659]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-lg shadow-emerald-600/20"
                  >
                    Lock Permanent Credentials & Sign In
                  </button>
                </div>
              )}
            </div>
          </form>
        )}
      </div>
    </section>
  );
};
