import React, { useMemo } from 'react';
import { Student, CirculationRecord } from '../types';

interface NoDuesCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  circulations: CirculationRecord[];
  isFacultyView?: boolean;
}

export const NoDuesCertificateModal: React.FC<NoDuesCertificateModalProps> = ({
  isOpen,
  onClose,
  student,
  circulations,
  isFacultyView = false
}) => {
  if (!isOpen) return null;

  const activeBorrows = circulations.filter(
    c => c.usn === student.usn && !c.isReturned
  );

  const calculateDaysRemaining = (dueDateStr: string): { days: number; isOverdue: boolean } => {
    const due = new Date(dueDateStr).getTime();
    const now = new Date().getTime();
    const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    return {
      days: Math.abs(diffDays),
      isOverdue: diffDays < 0
    };
  };

  const totalLateFines = activeBorrows.reduce((acc, curr) => {
    const { days, isOverdue } = calculateDaysRemaining(curr.dueDate);
    return acc + (isOverdue ? days * 10 : 0);
  }, 0);

  const isCleared = activeBorrows.length === 0 && totalLateFines === 0;

  const serialCode = useMemo(() => {
    const seed = `${student.usn}-${Date.now().toString().slice(-6)}`;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash |= 0;
    }
    return `RVU-CSE-${Math.abs(hash).toString(36).toUpperCase()}-${student.usn.slice(-4)}`;
  }, [student.usn]);

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-3 md:p-4 overflow-y-auto">
      <div className="bg-[#162734] border border-[#263e50] rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl p-5 md:p-8 space-y-6 my-auto">
        {/* Printable Section */}
        <div
          id="printableCert"
          className="bg-white text-slate-900 p-6 md:p-8 rounded-2xl space-y-6 border-4 border-[#162734] shadow-md"
        >
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <h3 className="font-cinzel text-2xl font-black tracking-wider text-[#162734]">
                RV UNIVERSITY
              </h3>
              <p className="text-xs uppercase font-bold tracking-widest text-[#94742e] font-serif-italic">
                Go, change the world
              </p>
              <p className="text-[9px] text-slate-500 font-sans tracking-wide">
                AN INITIATIVE OF RV EDUCATIONAL INSTITUTIONS
              </p>
              <p className="text-[11px] text-slate-700 font-medium pt-1">
                Office of the University Librarian & Student Academic Clearance Desk
              </p>
            </div>

            <div className="text-right">
              <div className="inline-block border-2 border-[#162734] px-3 py-1 rounded text-center">
                <span className="text-[9px] font-mono text-slate-500 block uppercase">
                  Institutional Form
                </span>
                <span className="text-xs font-bold font-mono text-slate-900">
                  RVU-LIB-ND-2026
                </span>
              </div>
            </div>
          </div>

          {/* Title Banner */}
          <div className="text-center py-2.5 bg-slate-100 rounded-xl border border-slate-200">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-900 font-sans">
              OFFICIAL INSTITUTIONAL CLEARANCE AUDIT: "NO DUES"
            </span>
          </div>

          {/* Student Dossier */}
          <div className="grid grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <span className="text-slate-500 block text-[10px]">CANDIDATE NAME:</span>
              <strong className="text-sm text-slate-950 font-sans">{student.name}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">UNIVERSITY SEAT NO (USN):</span>
              <strong className="text-sm text-indigo-900">{student.usn}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">DEGREE PROGRAM:</span>
              <span className="text-slate-800">B.Tech Computer Science & Engineering</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">AUDIT TIMESTAMP:</span>
              <span className="text-slate-800">{new Date().toLocaleString()}</span>
            </div>
          </div>

          {/* Audit Verification Result */}
          <div
            className={`p-4 rounded-xl border ${
              isCleared
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-rose-50 border-rose-300 text-rose-950'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{isCleared ? '✅' : '⚠️'}</span>
              <strong className="text-xs tracking-wider uppercase">
                {isCleared
                  ? 'STATUS: OFFICIAL "NO DUES" CLEARED — ZERO OUTSTANDING LIABILITY'
                  : `STATUS: CLEARANCE WITHHELD — ${activeBorrows.length} BOOK(S) / ₹${totalLateFines} FINE PENDING`}
              </strong>
            </div>
            <p className="text-[11px] leading-relaxed">
              {isCleared
                ? 'The candidate has fulfilled all library circulation requirements. Zero physical books, overdue fines (₹0), or academic assets remain pending against this USN record.'
                : `Outstanding physical volumes or overdue penalties (₹10/day) must be settled at the Faculty Desk before clearance: ${activeBorrows
                    .map(b => `"${b.title}"`)
                    .join(', ')}.`}
            </p>
          </div>

          {/* Signatures & Security Serial */}
          <div className="pt-6 border-t border-dashed border-slate-400 flex justify-between items-end text-center text-[10px]">
            <div>
              <div className="w-32 border-b border-slate-500 mx-auto mb-1"></div>
              <span className="text-slate-600 font-sans">Student Signature</span>
            </div>

            <div className="font-mono text-slate-800 border border-slate-300 px-3 py-1.5 rounded-lg bg-slate-50 text-[9px] text-center shadow-xs">
              <span className="text-slate-500 block text-[8px]">SECURITY AUDIT SERIAL:</span>
              <strong className="text-indigo-950 tracking-wider text-[10px]">
                {serialCode}
              </strong>
            </div>

            <div>
              <div className="w-32 border-b border-slate-500 mx-auto mb-1"></div>
              <span className="text-slate-600 font-sans">University Librarian Authority</span>
            </div>
          </div>
        </div>

        {/* Modal Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="text-xs text-slate-400">
            {!isFacultyView && (
              <span className="flex items-center gap-1.5 text-amber-300 font-medium">
                <span>🔒</span> Official PDF Printing is authorized exclusively via Faculty Desk.
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition cursor-pointer"
            >
              Close
            </button>
            {isFacultyView && isCleared && (
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-xl bg-[#cda659] hover:bg-[#b58f44] text-slate-950 font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-lg shadow-amber-500/10 flex items-center gap-1.5"
              >
                <span>🖨️</span> Print Official PDF Certificate
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
