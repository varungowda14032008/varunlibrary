import React, { useState, useEffect } from 'react';
import { Student, Book, CirculationRecord, ToastMessage, Newspaper, Magazine } from './types';
import { INITIAL_STUDENTS, INITIAL_BOOKS, INITIAL_NEWSPAPERS, INITIAL_MAGAZINES } from './data/initialData';
import { Header } from './components/Header';
import { StudentAuth } from './components/StudentAuth';
import { StudentPortal } from './components/StudentPortal';
import { CentralServerModal } from './components/CentralServerModal';
import { NoDuesCertificateModal } from './components/NoDuesCertificateModal';
import { BarcodeScannerModal } from './components/BarcodeScannerModal';
import { LibraryAtmosphere } from './components/LibraryAtmosphere';
import { supabase } from './supabase';

const STORAGE_KEYS = {
  STUDENTS: 'rvu_library_students_v1',
  BOOKS: 'rvu_library_books_v1',
  CIRCULATIONS: 'rvu_library_circulations_v1',
  CURRENT_STUDENT: 'rvu_library_active_session_v1'
};

export default function App() {
  // Persistent Students State
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to read students from storage:', e);
    }
    return INITIAL_STUDENTS;
  });

  // Persistent Books State (merging initial books to ensure CLRS, Dragon Book & Discrete Math are included)
  const [books, setBooks] = useState<Book[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOOKS);
      if (saved) {
        const parsed: Book[] = JSON.parse(saved);
        // Ensure new catalog items are merged
        const existingIds = new Set(parsed.map(b => b.id));
        const merged = [...parsed];
        INITIAL_BOOKS.forEach(initBook => {
          if (!existingIds.has(initBook.id)) {
            merged.push(initBook);
          }
        });
        return merged;
      }
    } catch (e) {
      console.warn('Failed to read books from storage:', e);
    }
    return INITIAL_BOOKS;
  });

  // Persistent Circulations State
  const [circulations, setCirculations] = useState<CirculationRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CIRCULATIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to read circulations from storage:', e);
    }
    // Seed initial active circulation for Demo (e.g. CSE-103)
    return [
      {
        id: "CIRC-101",
        bookId: "CSE-103",
        title: "Database System Concepts (7th Edition)",
        usn: "RVUM26CSE063",
        studentName: "VARUN GOWDA UN",
        studentPhone: "9876543210",
        borrowedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        isReturned: false,
        finePerDay: 10,
        fineAmount: 0,
        finePaid: false
      }
    ];
  });

  // Active Authenticated Student
  const [currentStudent, setCurrentStudent] = useState<Student | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_STUDENT);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to read current student session:', e);
    }
    return null;
  });

  // Daily Newspapers & Research Magazines
  const [newspapers] = useState<Newspaper[]>(INITIAL_NEWSPAPERS);
  const [magazines] = useState<Magazine[]>(INITIAL_MAGAZINES);

  // Modals state
  const [isServerModalOpen, setIsServerModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);
  const [facultyAuditStudent, setFacultyAuditStudent] = useState<Student | null>(null);
  const [isFacultyAuditModalOpen, setIsFacultyAuditModalOpen] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // LocalStorage synchronizers
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CIRCULATIONS, JSON.stringify(circulations));
  }, [circulations]);

  useEffect(() => {
    if (currentStudent) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_STUDENT, JSON.stringify(currentStudent));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_STUDENT);
    }
  }, [currentStudent]);

  // Supabase Initial Hydration
  useEffect(() => {
    let isMounted = true;
    async function syncWithSupabase() {
      try {
        const { data: dbBooks } = await supabase.from('books').select('*');
        if (isMounted && dbBooks && dbBooks.length > 0) {
          setBooks(dbBooks.map((b: any) => ({
            id: b.id,
            title: b.title,
            author: b.author,
            barcode: b.barcode,
            total: b.total,
            available: b.available,
            waitlist: b.waitlist || []
          })));
        }

        const { data: dbStudents } = await supabase.from('students').select('*').order('sl', { ascending: true });
        if (isMounted && dbStudents && dbStudents.length > 0) {
          setStudents(dbStudents.map((s: any) => ({
            sl: s.sl,
            usn: s.usn,
            name: s.name,
            isConfigured: s.is_configured,
            passHash: s.pass_hash || '',
            phone: s.phone
          })));
        }

        const { data: dbCircs } = await supabase.from('circulations').select('*').order('borrowed_at', { ascending: false });
        if (isMounted && dbCircs && dbCircs.length > 0) {
          setCirculations(dbCircs.map((c: any) => ({
            id: c.id,
            bookId: c.book_id,
            title: c.title,
            usn: c.usn,
            studentName: c.student_name,
            studentPhone: c.student_phone || '9876543210',
            borrowedAt: c.borrowed_at,
            dueDate: c.due_date,
            isReturned: c.is_returned,
            returnedAt: c.returned_at,
            finePerDay: c.fine_per_day ?? 10,
            fineAmount: c.fine_amount ?? 0,
            finePaid: c.fine_paid ?? false,
            lastReminderSentAt: c.last_reminder_sent_at
          })));
        }
      } catch (e) {
        // Fallback to local storage if remote tables not yet provisioned
      }
    }
    syncWithSupabase();
    return () => { isMounted = false; };
  }, []);

  const showToast = (message: string, type: ToastMessage['type'] = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents(prev =>
      prev.map(s => (s.usn === updatedStudent.usn ? updatedStudent : s))
    );
    if (currentStudent && currentStudent.usn === updatedStudent.usn) {
      setCurrentStudent(updatedStudent);
    }
    // Async background sync with Supabase
    supabase.from('students').upsert({
      usn: updatedStudent.usn,
      sl: updatedStudent.sl,
      name: updatedStudent.name,
      is_configured: updatedStudent.isConfigured,
      pass_hash: updatedStudent.passHash,
      phone: updatedStudent.phone
    }).then(() => {}, () => {});
  };

  const handleResetStudentPassword = (usn: string) => {
    setStudents(prev =>
      prev.map(s => {
        if (s.usn === usn) {
          return {
            ...s,
            isConfigured: false,
            passHash: ""
          };
        }
        return s;
      })
    );
    supabase.from('students').update({
      is_configured: false,
      pass_hash: ""
    }).eq('usn', usn).then(() => {}, () => {});
    showToast(`Password for ${usn} reset to default ("test").`, 'info');
  };

  const handleIssueBook = (bookId: string) => {
    if (!currentStudent) {
      showToast('Please sign in to issue books.', 'warning');
      return;
    }

    const myActiveBorrows = circulations.filter(
      c => c.usn === currentStudent.usn && !c.isReturned
    );

    if (myActiveBorrows.length >= 2) {
      showToast('Anti-Hoarding Quota exceeded: Max 2 books per student.', 'error');
      return;
    }

    const book = books.find(b => b.id === bookId);
    if (!book) return;

    if (book.available <= 0) {
      showToast('No physical copies currently available on shelf.', 'error');
      return;
    }

    // Decrement shelf count
    setBooks(prev =>
      prev.map(b => (b.id === bookId ? { ...b, available: b.available - 1 } : b))
    );

    // Create 7-day autonomous circulation record
    const now = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    const newCirc: CirculationRecord = {
      id: `CIRC-${Date.now()}`,
      bookId: book.id,
      title: book.title,
      usn: currentStudent.usn,
      studentName: currentStudent.name,
      studentPhone: currentStudent.phone || '9876543210',
      borrowedAt: now.toISOString(),
      dueDate: dueDate.toISOString(),
      isReturned: false,
      finePerDay: 10,
      fineAmount: 0,
      finePaid: false
    };

    setCirculations(prev => [newCirc, ...prev]);
    // Supabase background sync
    supabase.from('circulations').insert({
      id: newCirc.id,
      book_id: newCirc.bookId,
      title: newCirc.title,
      usn: newCirc.usn,
      student_name: newCirc.studentName,
      student_phone: newCirc.studentPhone,
      borrowed_at: newCirc.borrowedAt,
      due_date: newCirc.dueDate,
      is_returned: false,
      fine_per_day: 10,
      fine_amount: 0,
      fine_paid: false
    }).then(() => {}, () => {});

    supabase.from('books').update({
      available: book.available - 1
    }).eq('id', book.id).then(() => {}, () => {});

    showToast(`Issued "${book.title}"! Due in 7 days on ${dueDate.toLocaleDateString()}.`, 'success');
  };

  const handleReturnBook = (circulationId: string) => {
    const circ = circulations.find(c => c.id === circulationId);
    if (!circ) return;

    const returnTime = new Date().toISOString();

    // Mark record as returned
    setCirculations(prev =>
      prev.map(c =>
        c.id === circulationId
          ? { ...c, isReturned: true, returnedAt: returnTime }
          : c
      )
    );

    // Supabase background sync for return
    supabase.from('circulations').update({
      is_returned: true,
      returned_at: returnTime
    }).eq('id', circulationId).then(() => {}, () => {});

    // Restock book count & check waitlist
    setBooks(prev =>
      prev.map(b => {
        if (b.id === circ.bookId) {
          const newWaitlist = [...b.waitlist];
          let nextWaitlistedUsn: string | undefined;

          // If there are people on the FIFO waitlist, advance the first one
          if (newWaitlist.length > 0) {
            nextWaitlistedUsn = newWaitlist.shift();
          }

          if (nextWaitlistedUsn) {
            showToast(
              `Waitlist Alert: Copy of "${b.title}" assigned to FIFO queue candidate ${nextWaitlistedUsn}!`,
              'info'
            );
          }

          const newAvailable = Math.min(b.total, b.available + 1);

          supabase.from('books').update({
            available: newAvailable,
            waitlist: newWaitlist
          }).eq('id', b.id).then(() => {}, () => {});

          return {
            ...b,
            available: newAvailable,
            waitlist: newWaitlist
          };
        }
        return b;
      })
    );

    showToast(`"${circ.title}" successfully returned to shelf (+1 stock).`, 'success');
  };

  const handleJoinWaitlist = (bookId: string) => {
    if (!currentStudent) return;

    const book = books.find(b => b.id === bookId);
    if (!book) return;

    if (book.waitlist.includes(currentStudent.usn)) {
      showToast('You are already on the FIFO waitlist for this title.', 'warning');
      return;
    }

    const updatedWaitlist = [...book.waitlist, currentStudent.usn];

    setBooks(prev =>
      prev.map(b =>
        b.id === bookId
          ? { ...b, waitlist: updatedWaitlist }
          : b
      )
    );

    supabase.from('books').update({
      waitlist: updatedWaitlist
    }).eq('id', bookId).then(() => {}, () => {});

    showToast(`Added ${currentStudent.usn} to FIFO waitlist for "${book.title}".`, 'success');
  };

  const handleBarcodeResolved = (book: Book, action: 'issue' | 'return') => {
    if (!currentStudent) {
      showToast('Please sign in to process barcode circulation.', 'warning');
      return;
    }

    const myActive = circulations.find(
      c => c.usn === currentStudent.usn && c.bookId === book.id && !c.isReturned
    );

    if (myActive) {
      handleReturnBook(myActive.id);
    } else {
      if (book.available > 0) {
        handleIssueBook(book.id);
      } else {
        handleJoinWaitlist(book.id);
      }
    }
  };

  const handleAddBook = (newBook: Book) => {
    setBooks(prev => [newBook, ...prev]);
    supabase.from('books').insert({
      id: newBook.id,
      title: newBook.title,
      author: newBook.author,
      barcode: newBook.barcode,
      total: newBook.total,
      available: newBook.available,
      waitlist: newBook.waitlist
    }).then(() => {}, () => {});
  };

  const handleUpdateBookStock = (bookId: string, delta: number) => {
    setBooks(prev =>
      prev.map(b => {
        if (b.id === bookId) {
          const newTotal = Math.max(1, b.total + delta);
          const newAvail = Math.max(0, Math.min(newTotal, b.available + delta));
          supabase.from('books').update({
            total: newTotal,
            available: newAvail
          }).eq('id', bookId).then(() => {}, () => {});
          return { ...b, total: newTotal, available: newAvail };
        }
        return b;
      })
    );
    showToast(`Updated inventory count for ${bookId}.`, 'info');
  };

  const handleRestoreData = (data: {
    students: Student[];
    books: Book[];
    circulations: CirculationRecord[];
  }) => {
    setStudents(data.students);
    setBooks(data.books);
    setCirculations(data.circulations);
  };

  const toastColors = {
    info: 'bg-indigo-600 border-indigo-400 text-white shadow-indigo-600/30',
    success: 'bg-emerald-600 border-emerald-400 text-white shadow-emerald-600/30',
    error: 'bg-rose-600 border-rose-400 text-white shadow-rose-600/30',
    warning: 'bg-amber-600 border-amber-300 text-white shadow-amber-600/30'
  };

  return (
    <div className="min-h-screen bg-[#101c26] text-slate-100 flex flex-col justify-between selection:bg-[#cda659] selection:text-black relative overflow-x-hidden">
      {/* 3D Living Academic Library Atmosphere */}
      <LibraryAtmosphere />

      {/* Toast Notification Container */}
      <div className="fixed top-16 right-4 md:right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`${toastColors[toast.type]} border px-4 py-3 rounded-2xl shadow-xl text-xs font-semibold flex items-center justify-between pointer-events-auto transition-all duration-300 animate-in slide-in-from-top-2`}
          >
            <span>{toast.message}</span>
            <button
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              className="ml-3 text-white/80 hover:text-white cursor-pointer"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Official Header (Optical scanner moved to Faculty Terminal) */}
      <Header
        currentStudent={currentStudent}
        onOpenServerTerminal={() => setIsServerModalOpen(true)}
        onLogout={() => {
          setCurrentStudent(null);
          showToast('Signed out from Student Desk.', 'info');
        }}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 space-y-6">
        {!currentStudent ? (
          <StudentAuth
            students={students}
            onLogin={student => setCurrentStudent(student)}
            onUpdateStudent={handleUpdateStudent}
            showToast={showToast}
          />
        ) : (
          <StudentPortal
            currentStudent={currentStudent}
            books={books}
            circulations={circulations}
            newspapers={newspapers}
            magazines={magazines}
            onIssueBook={handleIssueBook}
            onReturnBook={handleReturnBook}
            onJoinWaitlist={handleJoinWaitlist}
            onOpenAudit={() => setIsAuditModalOpen(true)}
            showToast={showToast}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#223a4d] bg-[#162734]/80 py-3.5 px-6 text-center text-xs text-slate-400">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="font-cinzel text-xs text-[#cda659] font-bold">RV UNIVERSITY</span>
            <span>•</span>
            <span className="font-serif-italic text-[11px] text-[#d6b774]">Go, change the world</span>
          </div>
          <p className="text-[11px] font-mono text-slate-400">
            Autonomous Smart Campus Circulation Desk • Faculty Operations & Student Kiosk
          </p>
        </div>
      </footer>

      {/* Central Server Modal (Faculty Terminal: Dr. K. S. Rajan & Prof. Meenakshi Sundaram) */}
      <CentralServerModal
        isOpen={isServerModalOpen}
        onClose={() => setIsServerModalOpen(false)}
        students={students}
        books={books}
        circulations={circulations}
        newspapers={newspapers}
        magazines={magazines}
        onAddBook={handleAddBook}
        onUpdateBookStock={handleUpdateBookStock}
        onResetStudentPassword={handleResetStudentPassword}
        onOpenScanner={() => {
          setIsServerModalOpen(false);
          setIsScannerModalOpen(true);
        }}
        onOpenCertificateModal={(student) => {
          setFacultyAuditStudent(student);
          setIsFacultyAuditModalOpen(true);
        }}
        onRestoreData={handleRestoreData}
        showToast={showToast}
      />

      {/* Student View No Dues Clearance Status Modal (Print authority disabled for students) */}
      {currentStudent && (
        <NoDuesCertificateModal
          isOpen={isAuditModalOpen}
          onClose={() => setIsAuditModalOpen(false)}
          student={currentStudent}
          circulations={circulations}
          isFacultyView={false}
        />
      )}

      {/* Faculty View No Dues Clearance Certificate Modal (Official PDF Printing enabled) */}
      {facultyAuditStudent && (
        <NoDuesCertificateModal
          isOpen={isFacultyAuditModalOpen}
          onClose={() => {
            setIsFacultyAuditModalOpen(false);
            setFacultyAuditStudent(null);
          }}
          student={facultyAuditStudent}
          circulations={circulations}
          isFacultyView={true}
        />
      )}

      {/* Optical Barcode & ISBN Scanner Modal (Faculty Terminal Controlled) */}
      <BarcodeScannerModal
        isOpen={isScannerModalOpen}
        onClose={() => setIsScannerModalOpen(false)}
        books={books}
        onBarcodeResolved={handleBarcodeResolved}
        showToast={showToast}
      />
    </div>
  );
}
