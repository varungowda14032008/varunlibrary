export interface Student {
  sl: number;
  usn: string;
  name: string;
  isConfigured: boolean;
  passHash: string;
  phone: string;
}

export interface FacultyAccount {
  id: string;
  staffId: string;
  name: string;
  designation: string;
  department: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  barcode: string;
  total: number;
  available: number;
  waitlist: string[]; // array of student USNs
}

export interface CirculationRecord {
  id: string;
  bookId: string;
  title: string;
  usn: string;
  studentName: string;
  studentPhone: string;
  borrowedAt: string;
  dueDate: string;
  isReturned: boolean;
  returnedAt?: string;
  finePerDay: number; // ₹10 per day late fine
  fineAmount: number;
  finePaid: boolean;
  lastReminderSentAt?: string;
}

export interface Newspaper {
  id: string;
  name: string;
  language: string;
  editionDate: string;
  shelfLocation: string;
  copiesAvailable: number;
}

export interface Magazine {
  id: string;
  name: string;
  publisher: string;
  category: string;
  volume: string;
  issue: string;
  monthYear: string;
  shelfLocation: string;
  isAvailable: boolean;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}
