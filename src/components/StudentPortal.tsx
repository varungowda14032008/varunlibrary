import React, { useState } from 'react';
import { Student, Book, CirculationRecord, Newspaper, Magazine } from '../types';
import { getBookTheme } from '../utils/bookThemes';
import { PeriodicalsSection } from './PeriodicalsSection';

interface StudentPortalProps {
  currentStudent: Student;
  books: Book[];
  circulations: CirculationRecord[];
  newspapers: Newspaper[];
  magazines: Magazine[];
  onIssueBook: (bookId: string) => void;
  onReturnBook: (circulationId: string) => void;
  onJoinWaitlist: (bookId: string) => void;
  onOpenAudit: () => void;
  showToast: (msg: string, type?: 'info' | 'success' | 'error' | 'warning') => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  currentStudent,
  books,
  circulations,
  newspapers,
  magazines,
  onIssueBook,
  onReturnBook,
  onJoinWaitlist,
  onOpenAudit,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'available' | 'queued'>('all');

  const myBorrows = circulations.filter(
    c => c.usn === currentStudent.usn && !c.isReturned
  );

  const filteredBooks = books.filter(b => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.barcode.includes(searchTerm);

    if (!matchesSearch) return false;

    if (filterType === 'available') return b.available > 0;
    if (filterType === 'queued') return b.available === 0;
    return true;
  });

  const calculateDaysRemaining = (dueDateStr: string): { days: number; isOverdue: boolean } => {
    const due = new Date(dueDateStr).getTime();
    const now = new Date().getTime();
    const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    return {
      days: Math.abs(diffDays),
      isOverdue: diffDays < 0
    };
  };

  // Calculate total unpaid overdue fine across student's active borrowings
  const totalLateFines = myBorrows.reduce((acc, curr) => {
    const { days, isOverdue } = calculateDaysRemaining(curr.dueDate);
    return acc + (isOverdue ? days * 10 : 0);
  }, 0);

  return (
    <section className="space-y-6 relative z-10">
      {/* Student Session Header */}
      <div className="bg-[#162734]/90 backdrop-blur-md border border-[#263e50] rounded-2xl p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <span className="text-[10px] font-mono text-[#cda659] uppercase tracking-wider block font-bold">
            Active Academic Circulation Session
          </span>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mt-0.5">
            <span>{currentStudent.name}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-lg bg-indigo-500/15 border border-indigo-500/40 font-mono text-indigo-300 font-semibold">
              {currentStudent.usn}
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Mobile: {currentStudent.phone} • Computer Science & Engineering
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-[#111f2a]/90 backdrop-blur-sm border border-[#223a4d] px-4 py-2 rounded-xl text-center shadow-inner">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">
              Anti-Hoarding Quota
            </span>
            <span
              className={`text-base font-bold font-mono ${
                myBorrows.length >= 2 ? 'text-amber-400' : 'text-emerald-400'
              }`}
            >
              {myBorrows.length} / 2 Books
            </span>
          </div>

          <div className="bg-[#111f2a]/90 backdrop-blur-sm border border-[#223a4d] px-4 py-2 rounded-xl text-center shadow-inner">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">
              Late Return Fines
            </span>
            <span
              className={`text-base font-bold font-mono ${
                totalLateFines > 0 ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              ₹{totalLateFines} {totalLateFines > 0 ? '(₹10/day due)' : '(Zero Dues)'}
            </span>
          </div>

          <button
            onClick={onOpenAudit}
            className="px-4 py-2.5 rounded-xl bg-[#cda659]/15 hover:bg-[#cda659]/25 border border-[#cda659]/50 text-xs font-bold text-[#d8b568] transition cursor-pointer flex items-center gap-2 shadow-sm"
          >
            <span>🎓</span> View Clearance Status
          </button>
        </div>
      </div>

      {/* Active Borrowings with 7-Day Autonomous Timers & ₹10/day Late Fine */}
      {myBorrows.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Your Active Borrowings (7-Day Return Timers & ₹10/Day Late Fine)
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">
              Quota: {2 - myBorrows.length} issue slot(s) remaining
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myBorrows.map(record => {
              const theme = getBookTheme(record.title, record.bookId);
              const { days, isOverdue } = calculateDaysRemaining(record.dueDate);
              const fineAmount = isOverdue ? days * 10 : 0;

              return (
                <div
                  key={record.id}
                  className={`relative overflow-hidden rounded-2xl border ${theme.borderColor} ${theme.cardBg} backdrop-blur-md p-5 flex flex-col justify-between space-y-3 shadow-xl transition-all`}
                >
                  {/* Tangible Book Spine Accent Stripe */}
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-2 ${theme.spineGradient} shadow-r`}
                  />

                  <div className="pl-3 space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder}`}>
                          {theme.icon} {theme.category}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-slate-300 border border-white/10">
                          {record.bookId}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-md ${
                          isOverdue
                            ? 'bg-rose-500/25 text-rose-300 border border-rose-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}
                      >
                        {isOverdue ? `⚠️ Overdue by ${days}d • Fine: ₹${fineAmount} (₹10/day)` : `⏱️ ${days} days remaining`}
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-base leading-snug drop-shadow-sm">
                      {record.title}
                    </h4>
                    <div className="text-[11px] text-slate-300 space-y-0.5 font-mono">
                      <div>Borrowed: {new Date(record.borrowedAt).toLocaleDateString()}</div>
                      <div>Due Date: {new Date(record.dueDate).toLocaleDateString()}</div>
                      {isOverdue && (
                        <div className="text-rose-300 font-bold pt-0.5">
                          Late Fine Policy: ₹10/day applies past due date.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pl-3 pt-2 border-t border-white/10 flex justify-end">
                    <button
                      onClick={() => onReturnBook(record.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600/40 hover:bg-emerald-600/60 border border-emerald-400/50 text-emerald-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <span>📥</span> Return Book to Shelf (+1 Stock)
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Real-time Physical Shelf Catalog with FIFO Waitlists */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="font-cinzel text-lg font-bold text-white tracking-wide flex items-center gap-2">
              <span>Live Physical Shelf Catalog</span>
              <span className="text-[11px] font-sans px-2.5 py-0.5 rounded-full bg-[#cda659]/15 border border-[#cda659]/30 text-[#d8b568]">
                Distinctive Academic Volumes
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Authentic textbook covers with real-time stock counts. When copies reach 0, checkout shifts to FIFO waitlists.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search title, author, ISBN..."
              className="px-3 py-1.5 rounded-xl bg-[#162734]/90 backdrop-blur-sm border border-[#263e50] text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#cda659]"
            />
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl bg-[#162734]/90 backdrop-blur-sm border border-[#263e50] text-xs text-white focus:outline-none focus:border-[#cda659]"
            >
              <option value="all">All Titles</option>
              <option value="available">Available on Shelf (&gt;0)</option>
              <option value="queued">Waitlist Open (0 Stock)</option>
            </select>
          </div>
        </div>

        {/* Distinctive Tangible Book Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBooks.map(book => {
            const theme = getBookTheme(book.title, book.id);
            const isAlreadyBorrowed = myBorrows.some(b => b.bookId === book.id);
            const isWaitlisted = book.waitlist.includes(currentStudent.usn);
            const waitlistPosition = book.waitlist.indexOf(currentStudent.usn) + 1;
            const isQuotaFull = myBorrows.length >= 2;

            return (
              <div
                key={book.id}
                className={`relative overflow-hidden rounded-2xl border ${theme.borderColor} ${theme.cardBg} backdrop-blur-md p-5 flex flex-col justify-between space-y-4 hover:scale-[1.01] hover:shadow-2xl transition-all duration-300 group`}
              >
                {/* 1. Tangible Cloth Spine Accent Stripe on Left Edge */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-2.5 ${theme.spineGradient} shadow-[2px_0_8px_rgba(0,0,0,0.5)]`}
                >
                  <div className="h-full flex flex-col justify-between py-3 opacity-60">
                    <div className="w-full h-1 bg-[#cda659]/80" />
                    <div className="w-full h-1 bg-[#cda659]/80" />
                    <div className="w-full h-1 bg-[#cda659]/80" />
                  </div>
                </div>

                {/* Ambient Soft Top-Right Glow */}
                <div
                  className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${theme.accentGlow} blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500`}
                />

                <div className="pl-3 space-y-2.5 relative z-10">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder} flex items-center gap-1.5`}
                    >
                      <span>{theme.icon}</span>
                      <span>{theme.category}</span>
                    </span>

                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md border flex items-center gap-1.5 ${
                        book.available > 0
                          ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300'
                          : 'bg-rose-950/70 border-rose-500/50 text-rose-300'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          book.available > 0 ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
                        }`}
                      ></span>
                      {book.available} / {book.total} Copies
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-base text-white leading-snug line-clamp-2 drop-shadow-sm group-hover:text-amber-200 transition-colors">
                      {book.title}
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 line-clamp-1 font-medium">
                      {book.author}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[10px] text-slate-300">
                    <span className="bg-black/50 px-2 py-0.5 rounded border border-white/10">
                      ID: {book.id}
                    </span>
                    <span className="bg-black/50 px-2 py-0.5 rounded border border-white/10">
                      ISBN: {book.barcode}
                    </span>
                    {book.waitlist.length > 0 && (
                      <span className="text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/40">
                        {book.waitlist.length} in FIFO Queue
                      </span>
                    )}
                  </div>
                </div>

                <div className="pl-3 relative z-10 pt-1">
                  {isAlreadyBorrowed ? (
                    <div className="w-full py-2.5 rounded-xl bg-slate-900/80 text-emerald-300 text-xs font-bold text-center border border-emerald-500/30 flex items-center justify-center gap-1.5 shadow-inner">
                      <span>✓</span> Currently Issued to Your Desk
                    </div>
                  ) : book.available > 0 ? (
                    <button
                      onClick={() => onIssueBook(book.id)}
                      disabled={isQuotaFull}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 ${
                        isQuotaFull
                          ? 'bg-slate-900/80 text-slate-500 cursor-not-allowed border border-white/10'
                          : 'bg-[#cda659] hover:bg-[#b58f44] text-slate-950 shadow-lg shadow-amber-500/20 cursor-pointer active:scale-95'
                      }`}
                    >
                      <span>⚡</span>
                      <span>{isQuotaFull ? 'Quota Full (Max 2 Books)' : 'Instant Issue (-1 Count)'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onJoinWaitlist(book.id)}
                      disabled={isWaitlisted}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5 ${
                        isWaitlisted
                          ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-600/50 cursor-default'
                          : 'bg-amber-600/40 hover:bg-amber-600/60 border border-amber-500/50 text-amber-200 cursor-pointer shadow-md'
                      }`}
                    >
                      <span>⏳</span>
                      <span>
                        {isWaitlisted
                          ? `Waitlisted (Queue Position #${waitlistPosition})`
                          : `Join FIFO Waitlist (${book.waitlist.length} ahead)`}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Periodicals & Daily Newspapers Section */}
      <PeriodicalsSection
        newspapers={newspapers}
        magazines={magazines}
      />
    </section>
  );
};
