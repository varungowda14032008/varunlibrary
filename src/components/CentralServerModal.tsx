import React, { useState } from 'react';
import { Student, Book, CirculationRecord, FacultyAccount, Newspaper, Magazine } from '../types';
import { INITIAL_FACULTY } from '../data/initialData';

interface CentralServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  books: Book[];
  circulations: CirculationRecord[];
  newspapers: Newspaper[];
  magazines: Magazine[];
  onAddBook: (book: Book) => void;
  onUpdateBookStock: (bookId: string, delta: number) => void;
  onResetStudentPassword: (usn: string) => void;
  onOpenScanner: () => void;
  onOpenCertificateModal: (student: Student) => void;
  onRestoreData: (data: { students: Student[]; books: Book[]; circulations: CirculationRecord[] }) => void;
  showToast: (msg: string, type?: 'info' | 'success' | 'error' | 'warning') => void;
}

export const CentralServerModal: React.FC<CentralServerModalProps> = ({
  isOpen,
  onClose,
  students,
  books,
  circulations,
  newspapers,
  magazines,
  onAddBook,
  onUpdateBookStock,
  onResetStudentPassword,
  onOpenScanner,
  onOpenCertificateModal,
  onRestoreData,
  showToast
}) => {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyAccount>(INITIAL_FACULTY[0]);
  const [adminPin, setAdminPin] = useState<string>('1403');
  const [activeTab, setActiveTab] = useState<'due_alerts' | 'inventory' | 'clearance' | 'cohort' | 'system'>('due_alerts');

  // Ingestion form state
  const [newBarcode, setNewBarcode] = useState<string>('');
  const [newTitle, setNewTitle] = useState<string>('');
  const [newAuthor, setNewAuthor] = useState<string>('');
  const [newCopies, setNewCopies] = useState<number>(3);

  // Searches
  const [vaultSearch, setVaultSearch] = useState<string>('');
  const [inventorySearch, setInventorySearch] = useState<string>('');
  const [clearanceSearch, setClearanceSearch] = useState<string>('');
  const [showSqlModal, setShowSqlModal] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleVerifyLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPin === '1403' || adminPin.toLowerCase() === 'admin') {
      setIsUnlocked(true);
      showToast(`Faculty Terminal unlocked: ${selectedFaculty.name} (${selectedFaculty.staffId})`, 'success');
    } else {
      showToast('Invalid faculty master PIN. Default PIN is 1403.', 'error');
    }
  };

  const handleAddNewBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAuthor.trim()) {
      showToast('Title and author are required.', 'warning');
      return;
    }

    const generatedId = `CSE-${100 + books.length + 1}`;
    const barcodeVal = newBarcode.trim() || `9780${Math.floor(100000000 + Math.random() * 900000000)}`;
    const copiesVal = Number(newCopies) || 1;

    const newBook: Book = {
      id: generatedId,
      title: newTitle.trim(),
      author: newAuthor.trim(),
      barcode: barcodeVal,
      total: copiesVal,
      available: copiesVal,
      waitlist: []
    };

    onAddBook(newBook);
    showToast(`Ingested "${newBook.title}" (${newBook.id}) into shelf stock!`, 'success');
    setNewBarcode('');
    setNewTitle('');
    setNewAuthor('');
    setNewCopies(3);
  };

  const handleExportJSON = () => {
    const data = {
      timestamp: new Date().toISOString(),
      institution: "RV University",
      librarian: selectedFaculty.name,
      staffId: selectedFaculty.staffId,
      students,
      books,
      circulations,
      newspapers,
      magazines
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RVU_Library_Desk_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Database ledger snapshot exported successfully.', 'success');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.students && parsed.books && parsed.circulations) {
          onRestoreData({
            students: parsed.students,
            books: parsed.books,
            circulations: parsed.circulations
          });
          showToast('Database restored successfully from backup JSON.', 'success');
        } else {
          showToast('Invalid backup file format.', 'error');
        }
      } catch (err) {
        showToast('Failed to parse backup JSON file.', 'error');
      }
    };
    reader.readAsText(file);
  };

  // 1-Click WhatsApp Trigger
  const sendWhatsAppReminder = (
    phone: string,
    studentName: string,
    usn: string,
    bookTitle: string,
    dueDateStr: string,
    type: 'due_tomorrow' | 'issue_confirmation' | 'overdue'
  ) => {
    // Clean phone number (strip whitespace, ensure +91)
    let cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length === 10) {
      cleanPhone = `91${cleanPhone}`;
    }

    const formattedDate = new Date(dueDateStr).toLocaleDateString();
    let messageText = '';

    if (type === 'due_tomorrow') {
      messageText = `*RV UNIVERSITY - CENTRAL LIBRARY DESK*\n\nDear *${studentName}* (${usn}),\nThis is a priority circulation reminder that your borrowed physical textbook *"${bookTitle}"* is *DUE TOMORROW* on *${formattedDate}*.\n\nKindly return or renew the book at the Library Desk before 5:00 PM to avoid the late penalty of *₹10/day*.\n\nThank you,\n${selectedFaculty.name}\nCentral Library Services, RV University`;
    } else if (type === 'overdue') {
      messageText = `*RV UNIVERSITY - OVERDUE NOTICE*\n\nDear *${studentName}* (${usn}),\nYour library volume *"${bookTitle}"* was due on *${formattedDate}* and is now *OVERDUE*.\n\nA late return fine of *₹10 per day* is actively accumulating on your account.\nPlease return the volume immediately to clear your institutional record.\n\n${selectedFaculty.name}\nUniversity Central Library`;
    } else {
      messageText = `*RV UNIVERSITY - BOOK ISSUE CONFIRMATION*\n\nDear *${studentName}* (${usn}),\nYou have successfully checked out: *"${bookTitle}"*.\nYour 7-day circulation period expires on: *${formattedDate}*.\n\nPlease keep the book in pristine condition. Late returns incur a fee of ₹10/day.\n\nRegards,\nCentral Library Desk, RV University`;
    }

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(messageText)}`;
    window.open(whatsappUrl, '_blank');
    showToast(`Dispatched WhatsApp notification to ${phone}!`, 'success');
  };

  // Calculate day difference for due date filtering
  const getDueStats = (dueDateStr: string) => {
    const due = new Date(dueDateStr).getTime();
    const now = new Date().getTime();
    const diffHours = (due - now) / (1000 * 60 * 60);
    const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    const isDueTomorrow = diffHours > 0 && diffHours <= 36;
    const isOverdue = diffDays < 0;
    const overdueDays = isOverdue ? Math.abs(diffDays) : 0;
    const fineAmount = overdueDays * 10;
    return { diffDays, isDueTomorrow, isOverdue, overdueDays, fineAmount };
  };

  const activeCirculations = circulations.filter(c => !c.isReturned);
  
  // Circulations due tomorrow or overdue
  const dueTomorrowOrOverdue = activeCirculations.filter(c => {
    const { isDueTomorrow, isOverdue } = getDueStats(c.dueDate);
    return isDueTomorrow || isOverdue;
  });

  const totalCopies = books.reduce((acc, b) => acc + b.total, 0);
  const availableCopies = books.reduce((acc, b) => acc + b.available, 0);
  const totalWaitlisted = books.reduce((acc, b) => acc + b.waitlist.length, 0);

  const filteredBooks = books.filter(
    b => b.title.toLowerCase().includes(inventorySearch.toLowerCase()) ||
         b.author.toLowerCase().includes(inventorySearch.toLowerCase()) ||
         b.barcode.includes(inventorySearch)
  );

  const filteredStudents = students.filter(
    s => s.usn.toLowerCase().includes(vaultSearch.toLowerCase()) ||
         s.name.toLowerCase().includes(vaultSearch.toLowerCase()) ||
         s.phone.includes(vaultSearch)
  );

  const clearanceStudents = students.filter(
    s => s.usn.toLowerCase().includes(clearanceSearch.toLowerCase()) ||
         s.name.toLowerCase().includes(clearanceSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-2 md:p-4">
      <div className="bg-[#14232f] border border-[#cda659]/50 rounded-3xl w-full max-w-5xl max-h-[94vh] flex flex-col overflow-hidden shadow-2xl">
        
        {/* Terminal Header */}
        <div className="px-5 py-3.5 border-b border-[#223a4d] flex items-center justify-between bg-[#0e1922]">
          <div className="flex items-center gap-3">
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-cinzel font-bold text-white text-sm md:text-base tracking-wider">
                  Central Server Desk • Faculty & Librarian Terminal
                </h3>
                <span className="text-[10px] bg-[#cda659]/20 text-[#d8b568] border border-[#cda659]/40 px-2 py-0.5 rounded font-mono font-semibold">
                  Dual-Admin Kiosk
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Active Session: <strong className="text-white">{selectedFaculty.name}</strong> ({selectedFaculty.staffId}) • {selectedFaculty.designation}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-base p-1.5 rounded-lg hover:bg-[#223a4d] transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {!isUnlocked ? (
          /* Faculty Security Gate */
          <div className="p-8 max-w-sm mx-auto w-full space-y-5 my-auto">
            <div className="text-center space-y-1.5">
              <div className="text-4xl">🔐</div>
              <h4 className="font-bold text-white text-base font-cinzel">Faculty Security Gate</h4>
              <p className="text-xs text-slate-400">
                Authorized Access: <code className="text-[#cda659] font-mono">Chief Librarian / Asst. Librarian</code>
              </p>
            </div>

            <form onSubmit={handleVerifyLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Select Faculty Account
                </label>
                <select
                  value={selectedFaculty.id}
                  onChange={e => {
                    const f = INITIAL_FACULTY.find(fac => fac.id === e.target.value);
                    if (f) setSelectedFaculty(f);
                  }}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0e1922] border border-[#223a4d] text-xs text-white focus:outline-none focus:border-[#cda659]"
                >
                  {INITIAL_FACULTY.map(f => (
                    <option key={f.id} value={f.id}>
                      {f.name} — {f.staffId} ({f.designation.slice(0, 24)}...)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">Faculty Master PIN</label>
                  <span className="text-[10px] text-slate-400 font-mono">Default: 1403</span>
                </div>
                <input
                  type="password"
                  value={adminPin}
                  onChange={e => setAdminPin(e.target.value)}
                  placeholder="Enter PIN (1403)"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0e1922] border border-[#223a4d] text-xs text-white font-mono focus:outline-none focus:border-[#cda659]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#cda659] hover:bg-[#b58f44] text-slate-950 font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-lg shadow-amber-500/20"
              >
                Unlock Faculty Desk Controls
              </button>
            </form>
          </div>
        ) : (
          /* Unlocked Faculty Workspace */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Top Faculty Quick Toolbar & Navigation */}
            <div className="bg-[#0e1922] px-4 py-2.5 border-b border-[#223a4d] flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex flex-wrap items-center gap-1.5 font-medium">
                <button
                  onClick={() => setActiveTab('due_alerts')}
                  className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'due_alerts'
                      ? 'bg-[#cda659] text-slate-950 font-bold shadow-md'
                      : 'text-slate-300 hover:bg-[#1a2c3a]'
                  }`}
                >
                  <span>⚠️</span>
                  <span>Due Tomorrow & Reminders</span>
                  {dueTomorrowOrOverdue.length > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-600 text-white font-mono font-bold">
                      {dueTomorrowOrOverdue.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('inventory')}
                  className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'inventory'
                      ? 'bg-[#cda659] text-slate-950 font-bold shadow-md'
                      : 'text-slate-300 hover:bg-[#1a2c3a]'
                  }`}
                >
                  <span>📚</span>
                  <span>Library Books & Stock ({books.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('clearance')}
                  className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'clearance'
                      ? 'bg-[#cda659] text-slate-950 font-bold shadow-md'
                      : 'text-slate-300 hover:bg-[#1a2c3a]'
                  }`}
                >
                  <span>🎓</span>
                  <span>"NO DUES" Clearance & Print</span>
                </button>

                <button
                  onClick={() => setActiveTab('cohort')}
                  className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'cohort'
                      ? 'bg-[#cda659] text-slate-950 font-bold shadow-md'
                      : 'text-slate-300 hover:bg-[#1a2c3a]'
                  }`}
                >
                  <span>👥</span>
                  <span>Cohort Vault (51)</span>
                </button>

                <button
                  onClick={() => setActiveTab('system')}
                  className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'system'
                      ? 'bg-[#cda659] text-slate-950 font-bold shadow-md'
                      : 'text-slate-300 hover:bg-[#1a2c3a]'
                  }`}
                >
                  <span>⚙️</span>
                  <span>Backup & SQL</span>
                </button>
              </div>

              {/* Optical Scanner Button (Faculty Terminal Exclusive) */}
              <button
                onClick={onOpenScanner}
                className="px-3 py-1.5 rounded-xl bg-indigo-600/40 hover:bg-indigo-600/60 border border-indigo-500/50 text-indigo-200 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md"
              >
                <span>📷</span>
                <span>Optical Barcode Scanner</span>
              </button>
            </div>

            {/* Tab Contents Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">

              {/* TAB 1: DUE TOMORROW & 1-CLICK WHATSAPP REMINDERS */}
              {activeTab === 'due_alerts' && (
                <div className="space-y-4">
                  <div className="bg-[#0e1922] border border-[#223a4d] p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <h4 className="font-cinzel font-bold text-white text-base flex items-center gap-2">
                        <span>📲</span> Due Date Dispatcher & 1-Click WhatsApp Reminders
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Send automated WhatsApp messages to students for books due tomorrow or overdue (Fine: ₹10/day).
                      </p>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-xl">
                        Late Fine Policy: ₹10 / day
                      </span>
                    </div>
                  </div>

                  {dueTomorrowOrOverdue.length === 0 ? (
                    <div className="bg-[#0e1922]/60 border border-[#223a4d] rounded-2xl p-8 text-center space-y-2">
                      <div className="text-3xl">🎉</div>
                      <h5 className="font-bold text-white text-sm">No Urgent Due Dates Pending</h5>
                      <p className="text-xs text-slate-400">
                        All student circulations are currently within their standard return timers.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                        <span>Urgent Circulation Alerts ({dueTomorrowOrOverdue.length} items):</span>
                        <span>Click WhatsApp icon to launch instant chat with student</span>
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        {dueTomorrowOrOverdue.map(record => {
                          const student = students.find(s => s.usn === record.usn);
                          const phone = student?.phone || record.studentPhone || '+91 98801 00000';
                          const { isDueTomorrow, isOverdue, overdueDays, fineAmount } = getDueStats(record.dueDate);

                          return (
                            <div
                              key={record.id}
                              className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition ${
                                isOverdue
                                  ? 'bg-rose-950/20 border-rose-500/40'
                                  : 'bg-amber-950/20 border-amber-500/40'
                              }`}
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                                      isOverdue
                                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                                        : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                    }`}
                                  >
                                    {isOverdue ? `⚠️ OVERDUE by ${overdueDays}d` : `⏱️ DUE TOMORROW (24h Alert)`}
                                  </span>

                                  {isOverdue && (
                                    <span className="text-[10px] font-mono font-bold bg-rose-900/60 text-white px-2 py-0.5 rounded">
                                      Accrued Fine: ₹{fineAmount} (₹10/day)
                                    </span>
                                  )}

                                  <span className="text-xs font-mono text-indigo-400 font-bold">
                                    {record.usn}
                                  </span>
                                </div>

                                <h5 className="font-bold text-white text-sm">{record.title}</h5>
                                <p className="text-xs text-slate-300">
                                  Borrower: <strong className="text-white">{record.studentName}</strong> • Phone: <code className="text-[#cda659]">{phone}</code>
                                </p>
                                <p className="text-[11px] text-slate-400 font-mono">
                                  Borrowed: {new Date(record.borrowedAt).toLocaleDateString()} • Return Deadline: {new Date(record.dueDate).toLocaleDateString()}
                                </p>
                              </div>

                              <div className="flex flex-wrap items-center gap-2">
                                <button
                                  onClick={() =>
                                    sendWhatsAppReminder(
                                      phone,
                                      record.studentName,
                                      record.usn,
                                      record.title,
                                      record.dueDate,
                                      isOverdue ? 'overdue' : 'due_tomorrow'
                                    )
                                  }
                                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-md shadow-emerald-700/20"
                                >
                                  <span>💬</span>
                                  <span>1-Click WhatsApp {isOverdue ? 'Fine Notice' : 'Tomorrow Reminder'}</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* All Other Active Borrowings with WhatsApp Issue Confirmation */}
                  <div className="pt-4 border-t border-[#223a4d] space-y-3">
                    <h5 className="font-bold text-white text-xs uppercase tracking-wider text-slate-300">
                      All Active Checked-Out Books ({activeCirculations.length})
                    </h5>

                    <div className="border border-[#223a4d] rounded-2xl overflow-hidden max-h-60 overflow-y-auto">
                      <table className="w-full text-left text-xs text-slate-300">
                        <thead className="bg-[#0e1922] text-[10px] uppercase font-bold text-slate-400 sticky top-0 border-b border-[#223a4d]">
                          <tr>
                            <th className="p-3">USN & Candidate</th>
                            <th className="p-3">Book Title</th>
                            <th className="p-3">Due Date</th>
                            <th className="p-3">Late Fine Status</th>
                            <th className="p-3 text-right">WhatsApp Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#223a4d] font-mono">
                          {activeCirculations.map(record => {
                            const student = students.find(s => s.usn === record.usn);
                            const phone = student?.phone || record.studentPhone || '+91 98801 00000';
                            const { isOverdue, overdueDays, fineAmount } = getDueStats(record.dueDate);

                            return (
                              <tr key={record.id} className="hover:bg-[#0e1922]/50">
                                <td className="p-3">
                                  <div className="font-bold text-indigo-400">{record.usn}</div>
                                  <div className="text-[11px] font-sans text-white">{record.studentName}</div>
                                </td>
                                <td className="p-3 font-sans max-w-xs truncate text-white">
                                  {record.title}
                                </td>
                                <td className="p-3">{new Date(record.dueDate).toLocaleDateString()}</td>
                                <td className="p-3">
                                  {isOverdue ? (
                                    <span className="text-rose-400 font-bold">
                                      ₹{fineAmount} (Overdue {overdueDays}d)
                                    </span>
                                  ) : (
                                    <span className="text-emerald-400">₹0 (On Schedule)</span>
                                  )}
                                </td>
                                <td className="p-3 text-right">
                                  <button
                                    onClick={() =>
                                      sendWhatsAppReminder(
                                        phone,
                                        record.studentName,
                                        record.usn,
                                        record.title,
                                        record.dueDate,
                                        'issue_confirmation'
                                      )
                                    }
                                    className="px-2.5 py-1 rounded-lg bg-emerald-700/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-[11px] font-sans transition cursor-pointer"
                                  >
                                    📲 WhatsApp Notice
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: LIBRARY INVENTORY & PHYSICAL STOCK COUNTS */}
              {activeTab === 'inventory' && (
                <div className="space-y-6">
                  {/* Stock Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-[#0e1922] border border-[#223a4d] p-3.5 rounded-2xl text-center">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Titles in Stock</span>
                      <span className="text-xl font-bold font-mono text-indigo-400">{books.length}</span>
                    </div>
                    <div className="bg-[#0e1922] border border-[#223a4d] p-3.5 rounded-2xl text-center">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Physical Copies</span>
                      <span className="text-xl font-bold font-mono text-amber-400">{totalCopies}</span>
                    </div>
                    <div className="bg-[#0e1922] border border-[#223a4d] p-3.5 rounded-2xl text-center">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Shelf Available</span>
                      <span className="text-xl font-bold font-mono text-emerald-400">{availableCopies}</span>
                    </div>
                    <div className="bg-[#0e1922] border border-[#223a4d] p-3.5 rounded-2xl text-center">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">In Active Circulation</span>
                      <span className="text-xl font-bold font-mono text-rose-400">{totalCopies - availableCopies}</span>
                    </div>
                  </div>

                  {/* Search and Table */}
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-300">
                          Complete Book Inventory & Live Shelf Stock
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          Inspect physical copy counts, barcode identifiers, and adjust inventory quantities.
                        </p>
                      </div>
                      <input
                        type="text"
                        value={inventorySearch}
                        onChange={e => setInventorySearch(e.target.value)}
                        placeholder="Search title, ISBN, author..."
                        className="px-3 py-1.5 rounded-xl bg-[#0e1922] border border-[#223a4d] text-xs text-white focus:outline-none focus:border-[#cda659] w-full sm:w-60"
                      />
                    </div>

                    <div className="border border-[#223a4d] rounded-2xl overflow-hidden max-h-72 overflow-y-auto">
                      <table className="w-full text-left text-xs text-slate-300">
                        <thead className="bg-[#0e1922] text-[10px] uppercase font-bold text-slate-400 sticky top-0 border-b border-[#223a4d]">
                          <tr>
                            <th className="p-3">ID & ISBN</th>
                            <th className="p-3">Book Title & Author</th>
                            <th className="p-3">Available / Total</th>
                            <th className="p-3">Waitlist</th>
                            <th className="p-3 text-right">Quick Stock Adjustment</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#223a4d] font-mono">
                          {filteredBooks.map(b => (
                            <tr key={b.id} className="hover:bg-[#0e1922]/50">
                              <td className="p-3">
                                <span className="font-bold text-indigo-400 block">{b.id}</span>
                                <span className="text-[10px] text-slate-500">{b.barcode}</span>
                              </td>
                              <td className="p-3 font-sans">
                                <strong className="text-white block">{b.title}</strong>
                                <span className="text-xs text-slate-400">{b.author}</span>
                              </td>
                              <td className="p-3">
                                <span className={`font-bold ${b.available > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                  {b.available}
                                </span>
                                <span className="text-slate-500"> / {b.total} Copies</span>
                              </td>
                              <td className="p-3">
                                {b.waitlist.length > 0 ? (
                                  <span className="text-amber-400 font-bold">{b.waitlist.length} Queued</span>
                                ) : (
                                  <span className="text-slate-500">None</span>
                                )}
                              </td>
                              <td className="p-3 text-right">
                                <div className="inline-flex items-center gap-1 font-sans">
                                  <button
                                    onClick={() => onUpdateBookStock(b.id, -1)}
                                    disabled={b.total <= 0}
                                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold disabled:opacity-30 cursor-pointer"
                                    title="Decrease copies"
                                  >
                                    -1
                                  </button>
                                  <button
                                    onClick={() => onUpdateBookStock(b.id, 1)}
                                    className="px-2 py-0.5 rounded bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 text-xs font-bold cursor-pointer"
                                    title="Add copies"
                                  >
                                    +1
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Ingest New Book */}
                  <div className="border border-[#223a4d] bg-[#0e1922]/80 p-5 rounded-2xl space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                      <span>📖</span> Ingest New Book to Library Catalog
                    </h4>
                    <form onSubmit={handleAddNewBook} className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="md:col-span-2">
                          <label className="block text-[11px] text-slate-400 mb-1">
                            Barcode / ISBN (or leave empty to auto-generate)
                          </label>
                          <input
                            type="text"
                            value={newBarcode}
                            onChange={e => setNewBarcode(e.target.value)}
                            placeholder="e.g. 9780262046305"
                            className="w-full px-3 py-2 rounded-xl bg-[#14232f] border border-[#223a4d] text-xs font-mono text-indigo-300 focus:outline-none focus:border-[#cda659]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Copies on Shelf *</label>
                          <input
                            type="number"
                            min={1}
                            max={50}
                            value={newCopies}
                            onChange={e => setNewCopies(parseInt(e.target.value) || 1)}
                            required
                            className="w-full px-3 py-2 rounded-xl bg-[#14232f] border border-[#223a4d] text-xs text-white focus:outline-none focus:border-[#cda659]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Book Title *</label>
                          <input
                            type="text"
                            value={newTitle}
                            onChange={e => setNewTitle(e.target.value)}
                            placeholder="e.g. Computer Graphics: Principles and Practice"
                            required
                            className="w-full px-3 py-2 rounded-xl bg-[#14232f] border border-[#223a4d] text-xs text-white focus:outline-none focus:border-[#cda659]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Author Name(s) *</label>
                          <input
                            type="text"
                            value={newAuthor}
                            onChange={e => setNewAuthor(e.target.value)}
                            placeholder="e.g. John F. Hughes, Andries van Dam"
                            required
                            className="w-full px-3 py-2 rounded-xl bg-[#14232f] border border-[#223a4d] text-xs text-white focus:outline-none focus:border-[#cda659]"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          type="submit"
                          className="px-6 py-2 rounded-xl bg-[#cda659] hover:bg-[#b58f44] text-slate-950 font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                        >
                          Confirm & Ingest to Shelf Stock
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* TAB 3: INSTITUTIONAL NO DUES CLEARANCE & PDF PRINTING (FACULTY ONLY) */}
              {activeTab === 'clearance' && (
                <div className="space-y-4">
                  <div className="bg-[#0e1922] border border-[#223a4d] p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="font-cinzel font-bold text-white text-base flex items-center gap-2">
                        <span>🎓</span> Institutional "NO DUES" Clearance & Certification Authority
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Official Faculty Authority: Inspect student liabilities, confirm zero outstanding fines, and issue printable PDF certificates.
                      </p>
                    </div>

                    <input
                      type="text"
                      value={clearanceSearch}
                      onChange={e => setClearanceSearch(e.target.value)}
                      placeholder="Filter candidate by USN or Name..."
                      className="px-3 py-1.5 rounded-xl bg-[#14232f] border border-[#223a4d] text-xs text-white focus:outline-none focus:border-[#cda659] w-full sm:w-64"
                    />
                  </div>

                  <div className="border border-[#223a4d] rounded-2xl overflow-hidden max-h-80 overflow-y-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-[#0e1922] text-[10px] uppercase font-bold text-slate-400 sticky top-0 border-b border-[#223a4d]">
                        <tr>
                          <th className="p-3">USN</th>
                          <th className="p-3">Candidate Name</th>
                          <th className="p-3">Active Borrowings</th>
                          <th className="p-3">Late Fines (₹10/day)</th>
                          <th className="p-3">Clearance Status</th>
                          <th className="p-3 text-right">Faculty Authority Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#223a4d] font-mono">
                        {clearanceStudents.map(student => {
                          const studentActiveBorrows = circulations.filter(
                            c => c.usn === student.usn && !c.isReturned
                          );
                          const totalFines = studentActiveBorrows.reduce((acc, curr) => {
                            const { isOverdue, overdueDays } = getDueStats(curr.dueDate);
                            return acc + (isOverdue ? overdueDays * 10 : 0);
                          }, 0);
                          const isEligible = studentActiveBorrows.length === 0 && totalFines === 0;

                          return (
                            <tr key={student.usn} className="hover:bg-[#0e1922]/50">
                              <td className="p-3 font-bold text-indigo-400">{student.usn}</td>
                              <td className="p-3 font-sans font-medium text-white">{student.name}</td>
                              <td className="p-3">
                                {studentActiveBorrows.length > 0 ? (
                                  <span className="text-amber-400 font-bold">{studentActiveBorrows.length} Book(s) Held</span>
                                ) : (
                                  <span className="text-emerald-400">0 Books</span>
                                )}
                              </td>
                              <td className="p-3">
                                {totalFines > 0 ? (
                                  <span className="text-rose-400 font-bold">₹{totalFines} Due</span>
                                ) : (
                                  <span className="text-emerald-400">₹0 (Cleared)</span>
                                )}
                              </td>
                              <td className="p-3">
                                {isEligible ? (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
                                    ✓ Eligible for No-Dues
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500/15 text-rose-300 border border-rose-500/30 font-bold">
                                    ✗ Dues Pending
                                  </span>
                                )}
                              </td>
                              <td className="p-3 text-right">
                                <button
                                  onClick={() => onOpenCertificateModal(student)}
                                  className="px-3 py-1 rounded-xl bg-[#cda659] hover:bg-[#b58f44] text-slate-950 font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-sm"
                                >
                                  🖨️ Audit & Print PDF
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: COHORT VAULT (51 STUDENTS) */}
              {activeTab === 'cohort' && (
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                        <span>👥</span> Cohort Account Directory (51 Students Registered)
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Cryptographic SHA-256 Vault. Click to reset student password if requested by student.
                      </p>
                    </div>
                    <input
                      type="text"
                      value={vaultSearch}
                      onChange={e => setVaultSearch(e.target.value)}
                      placeholder="Search USN, Name, Phone..."
                      className="px-3 py-1.5 rounded-xl bg-[#0e1922] border border-[#223a4d] text-xs text-white focus:outline-none focus:border-[#cda659] w-full sm:w-60"
                    />
                  </div>

                  <div className="border border-[#223a4d] rounded-2xl overflow-hidden max-h-72 overflow-y-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-[#0e1922] text-[10px] uppercase font-bold text-slate-400 sticky top-0 border-b border-[#223a4d]">
                        <tr>
                          <th className="p-3">SL</th>
                          <th className="p-3">USN</th>
                          <th className="p-3">Student Name</th>
                          <th className="p-3">Mobile Phone</th>
                          <th className="p-3">Config Status</th>
                          <th className="p-3 text-right">Faculty Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#223a4d] font-mono">
                        {filteredStudents.map(student => (
                          <tr key={student.usn} className="hover:bg-[#0e1922]/50">
                            <td className="p-3 text-slate-500">{student.sl}</td>
                            <td className="p-3 text-indigo-400 font-bold">{student.usn}</td>
                            <td className="p-3 font-sans font-medium text-white">{student.name}</td>
                            <td className="p-3 text-slate-400">{student.phone}</td>
                            <td className="p-3">
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full font-sans font-bold ${
                                  student.isConfigured
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                                }`}
                              >
                                {student.isConfigured ? 'Active / Configured' : 'Default ("test")'}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => onResetStudentPassword(student.usn)}
                                className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-sans font-semibold transition cursor-pointer"
                                title="Reset password to 'test'"
                              >
                                Reset PIN
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 5: BACKUP & SQL DEPLOYMENT */}
              {activeTab === 'system' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#0e1922] border border-[#223a4d] rounded-2xl">
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">
                        Disaster Recovery & Ledger Snapshot
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Export full snapshot of 51 students, book stock, circulations, newspapers, and magazines.
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => setShowSqlModal(true)}
                        className="px-3.5 py-1.5 rounded-xl bg-[#cda659]/20 hover:bg-[#cda659]/30 text-xs font-mono text-[#d8b568] border border-[#cda659]/40 flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <span>⚡</span> Supabase SQL Script
                      </button>
                      <button
                        onClick={handleExportJSON}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <span>💾</span> Export JSON
                      </button>
                      <label className="px-3.5 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-xs font-mono text-indigo-300 border border-indigo-500/40 cursor-pointer flex items-center gap-1.5 transition">
                        <span>📥</span> Restore JSON
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleImportJSON}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </div>

      {/* SQL Script Viewer Dialog */}
      {showSqlModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[60] flex items-center justify-center p-3 md:p-6">
          <div className="bg-[#111f2a] border border-[#cda659]/50 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="px-5 py-4 border-b border-[#223a4d] flex items-center justify-between bg-[#162734]">
              <div className="flex items-center gap-2">
                <span className="text-xl">⚡</span>
                <div>
                  <h4 className="font-cinzel font-bold text-white text-sm">
                    Supabase SQL Editor Deployment Script
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Project: https://supabase.com/dashboard/project/xkilcguoujcvtwskkgeb/sql
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSqlModal(false)}
                className="text-slate-400 hover:text-white text-sm p-1.5 rounded-lg hover:bg-[#223a4d] transition"
              >
                ✕
              </button>
            </div>

            <div className="p-4 md:p-5 overflow-y-auto flex-1 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between bg-[#162734] px-4 py-2.5 rounded-xl border border-[#223a4d]">
                <span className="text-[11px] text-emerald-400 font-bold">
                  ✓ Ready for Supabase SQL Editor
                </span>
                <button
                  onClick={() => {
                    const el = document.getElementById('sqlCodeBlock');
                    if (el) {
                      navigator.clipboard.writeText(el.innerText);
                      showToast('SQL Script copied to clipboard!', 'success');
                    }
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-[#cda659] hover:bg-[#b58f44] text-slate-950 font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                >
                  📋 Copy Entire SQL Script
                </button>
              </div>

              <pre
                id="sqlCodeBlock"
                className="p-4 bg-black/60 rounded-2xl border border-white/10 text-slate-300 text-[11px] leading-relaxed overflow-x-auto whitespace-pre font-mono max-h-[55vh]"
              >
{`-- Run in Supabase SQL Editor (https://supabase.com/dashboard/project/xkilcguoujcvtwskkgeb/sql)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS circulations CASCADE;
DROP TABLE IF EXISTS books CASCADE;
DROP TABLE IF EXISTS students CASCADE;

CREATE TABLE students (
  sl INT NOT NULL,
  usn TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  is_configured BOOLEAN DEFAULT FALSE,
  pass_hash TEXT DEFAULT '',
  phone TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TABLE books (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  barcode TEXT NOT NULL UNIQUE,
  total INT NOT NULL DEFAULT 1 CHECK (total >= 0),
  available INT NOT NULL DEFAULT 1 CHECK (available >= 0),
  waitlist TEXT[] DEFAULT '{}'::TEXT[],
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TABLE circulations (
  id TEXT PRIMARY KEY,
  book_id TEXT NOT NULL REFERENCES books(id) ON UPDATE CASCADE ON DELETE CASCADE,
  title TEXT NOT NULL,
  usn TEXT NOT NULL REFERENCES students(usn) ON UPDATE CASCADE ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  borrowed_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()),
  due_date TIMESTAMPTZ NOT NULL,
  is_returned BOOLEAN DEFAULT FALSE,
  returned_at TIMESTAMPTZ,
  fine_per_day INT DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE circulations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read students" ON students FOR SELECT USING (true);
CREATE POLICY "Allow public insert students" ON students FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update students" ON students FOR UPDATE USING (true);

CREATE POLICY "Allow public read books" ON books FOR SELECT USING (true);
CREATE POLICY "Allow public insert books" ON books FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update books" ON books FOR UPDATE USING (true);
CREATE POLICY "Allow public delete books" ON books FOR DELETE USING (true);

CREATE POLICY "Allow public read circulations" ON circulations FOR SELECT USING (true);
CREATE POLICY "Allow public insert circulations" ON circulations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update circulations" ON circulations FOR UPDATE USING (true);`}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
