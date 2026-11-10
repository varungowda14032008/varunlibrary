import { Student, Book, FacultyAccount, Newspaper, Magazine } from '../types';

export const INITIAL_STUDENTS: Student[] = [
  { sl: 1, usn: "RVUM26CSE122", name: "NAVEEN KUMAR B", isConfigured: false, passHash: "", phone: "+91 98801 12201" },
  { sl: 2, usn: "RVUM26CSE114", name: "NIKHIL", isConfigured: false, passHash: "", phone: "+91 98801 11402" },
  { sl: 3, usn: "RVUM26CSE104", name: "PRAGATI AMAR GARUDKAR", isConfigured: false, passHash: "", phone: "+91 98801 10403" },
  { sl: 4, usn: "RVUM26CSE103", name: "SONAM PANDEY", isConfigured: false, passHash: "", phone: "+91 98801 10304" },
  { sl: 5, usn: "RVUM26CSE016", name: "ULLAS U", isConfigured: true, passHash: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08", phone: "+91 98801 01605" },
  { sl: 6, usn: "RVUM26CSE012", name: "VAAGESH CHANDRA VALLAMKONDA", isConfigured: false, passHash: "", phone: "+91 98801 01206" },
  { sl: 7, usn: "RVUM26CSE063", name: "VARUN GOWDA UN", isConfigured: true, passHash: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08", phone: "+91 98801 06307" },
  { sl: 8, usn: "RVUM26CSE070", name: "VARUN RM", isConfigured: false, passHash: "", phone: "+91 98801 07008" },
  { sl: 9, usn: "RVUM26CSE039", name: "VEDANTH G", isConfigured: false, passHash: "", phone: "+91 98801 03909" },
  { sl: 10, usn: "RVUM26CSE090", name: "VEJENDLA RISHIV", isConfigured: false, passHash: "", phone: "+91 98801 09010" },
  { sl: 11, usn: "RVUM26CSE033", name: "VIVAAN NAYAK", isConfigured: false, passHash: "", phone: "+91 98801 03311" },
  { sl: 12, usn: "RVUM26CSE047", name: "VIVIN PREMSAGAR K", isConfigured: false, passHash: "", phone: "+91 98801 04712" },
  { sl: 13, usn: "RVUM26CSE031", name: "YAJAT VINAY GHULE", isConfigured: false, passHash: "", phone: "+91 98801 03113" },
  { sl: 14, usn: "RVUM26CSE179", name: "YAKSHA M", isConfigured: false, passHash: "", phone: "+91 98801 17914" },
  { sl: 15, usn: "RVUM26CSE135", name: "A CHARAN TEJ", isConfigured: false, passHash: "", phone: "+91 98801 13515" },
  { sl: 16, usn: "RVUM26CSE170", name: "AMRUTH C N", isConfigured: false, passHash: "", phone: "+91 98801 17016" },
  { sl: 17, usn: "RVUM26CSE116", name: "ANANYA RANGAPPA LANGATI", isConfigured: false, passHash: "", phone: "+91 98801 11617" },
  { sl: 18, usn: "RVUM26CSE120", name: "BENAKA S", isConfigured: false, passHash: "", phone: "+91 98801 12018" },
  { sl: 19, usn: "RVUM26CSE133", name: "DARSHAN M PAWAR", isConfigured: false, passHash: "", phone: "+91 98801 13319" },
  { sl: 20, usn: "RVUM26CSE142", name: "DEEKSHA P", isConfigured: false, passHash: "", phone: "+91 98801 14220" },
  { sl: 21, usn: "RVUM26CSE136", name: "DHAWAN D GOWDA", isConfigured: false, passHash: "", phone: "+91 98801 13621" },
  { sl: 22, usn: "RVUM26CSE174", name: "DHIREN M", isConfigured: false, passHash: "", phone: "+91 98801 17422" },
  { sl: 23, usn: "RVUM26CSE124", name: "DHRUV R P", isConfigured: false, passHash: "", phone: "+91 98801 12423" },
  { sl: 24, usn: "RVUM26CSE127", name: "HAMSINI M D", isConfigured: false, passHash: "", phone: "+91 98801 12724" },
  { sl: 25, usn: "RVUM26CSE126", name: "HEMANTH KUMAR R", isConfigured: false, passHash: "", phone: "+91 98801 12625" },
  { sl: 26, usn: "RVUM26CSE176", name: "JAYANTH C S", isConfigured: false, passHash: "", phone: "+91 98801 17626" },
  { sl: 27, usn: "RVUM26CSE165", name: "JAYANTH.V", isConfigured: false, passHash: "", phone: "+91 98801 16527" },
  { sl: 28, usn: "RVUM26CSE159", name: "JITHYA SHREE C", isConfigured: false, passHash: "", phone: "+91 98801 15928" },
  { sl: 29, usn: "RVUM26CSE111", name: "KKHUSHAL KESHAV", isConfigured: false, passHash: "", phone: "+91 98801 11129" },
  { sl: 30, usn: "RVUM26CSE141", name: "MALLIKARJUNA", isConfigured: false, passHash: "", phone: "+91 98801 14130" },
  { sl: 31, usn: "RVUM26CSE125", name: "MANOJ L", isConfigured: false, passHash: "", phone: "+91 98801 12531" },
  { sl: 32, usn: "RVUM26CSE112", name: "MANYATHA S", isConfigured: false, passHash: "", phone: "+91 98801 11232" },
  { sl: 33, usn: "RVUM26CSE128", name: "NESARA M", isConfigured: false, passHash: "", phone: "+91 98801 12833" },
  { sl: 34, usn: "RVUM26CSE109", name: "NIVEDITHA M", isConfigured: false, passHash: "", phone: "+91 98801 10934" },
  { sl: 35, usn: "RVUM26CSE131", name: "POOJA S", isConfigured: false, passHash: "", phone: "+91 98801 13135" },
  { sl: 36, usn: "RVUM26CSE140", name: "POORVI", isConfigured: false, passHash: "", phone: "+91 98801 14036" },
  { sl: 37, usn: "RVUM26CSE138", name: "PRAJWAL PRABHAKAR KAPASHI", isConfigured: false, passHash: "", phone: "+91 98801 13837" },
  { sl: 38, usn: "RVUM26CSE144", name: "RAHUL S", isConfigured: false, passHash: "", phone: "+91 98801 14438" },
  { sl: 39, usn: "RVUM26CSE119", name: "ROOPESH K L", isConfigured: false, passHash: "", phone: "+91 98801 11939" },
  { sl: 40, usn: "RVUM26CSE130", name: "RUCHITHA R GOWDA", isConfigured: false, passHash: "", phone: "+91 98801 13040" },
  { sl: 41, usn: "RVUM26CSE163", name: "SAI RAKSHITH", isConfigured: false, passHash: "", phone: "+91 98801 16341" },
  { sl: 42, usn: "RVUM26CSE113", name: "SAIPRASAD", isConfigured: false, passHash: "", phone: "+91 98801 11342" },
  { sl: 43, usn: "RVUM26CSE129", name: "SAMARTH S SHETTY", isConfigured: false, passHash: "", phone: "+91 98801 12943" },
  { sl: 44, usn: "RVUM26CSE095", name: "SANATAWHEED MAHAMMAD YUSUF BETAGERI", isConfigured: false, passHash: "", phone: "+91 98801 09544" },
  { sl: 45, usn: "RVUM26CSE123", name: "SHISHIR D", isConfigured: false, passHash: "", phone: "+91 98801 12345" },
  { sl: 46, usn: "RVUM26CSE132", name: "SHUDANSHU BORDOLOI", isConfigured: false, passHash: "", phone: "+91 98801 13246" },
  { sl: 47, usn: "RVUM26CSE171", name: "SUDHARSAN SRINIVASAN", isConfigured: false, passHash: "", phone: "+91 98801 17147" },
  { sl: 48, usn: "RVUM26CSE115", name: "SUKANYA", isConfigured: false, passHash: "", phone: "+91 98801 11548" },
  { sl: 49, usn: "RVUM26CSE177", name: "SURPARAJU GNANA RUPINI", isConfigured: false, passHash: "", phone: "+91 98801 17749" },
  { sl: 50, usn: "RVUM26CSE172", name: "TANAY R MAAKAM", isConfigured: false, passHash: "", phone: "+91 98801 17250" },
  { sl: 51, usn: "RVUM26CSE143", name: "VIKAS MAHADEV PATTAR", isConfigured: false, passHash: "", phone: "+91 98801 14351" }
];

export const INITIAL_FACULTY: FacultyAccount[] = [
  {
    id: "FAC-01",
    staffId: "RVU-FAC-LIB01",
    name: "Dr. K. S. Rajan",
    designation: "Chief University Librarian & Head of Information Services",
    department: "University Central Library"
  },
  {
    id: "FAC-02",
    staffId: "RVU-FAC-LIB02",
    name: "Prof. Meenakshi Sundaram",
    designation: "Senior Assistant Librarian & Digital Circulation Desk",
    department: "Department of Library & Information Science"
  }
];

export const INITIAL_BOOKS: Book[] = [
  { 
    id: "CSE-101", 
    title: "Introduction to Algorithms (CLRS 4th Edition)", 
    author: "Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein", 
    barcode: "9780262046305", 
    total: 5, 
    available: 5, 
    waitlist: [] 
  },
  { 
    id: "CSE-102", 
    title: "Operating System Concepts (10th Edition)", 
    author: "Abraham Silberschatz, Peter B. Galvin, Greg Gagne", 
    barcode: "9781119456339", 
    total: 4, 
    available: 4, 
    waitlist: [] 
  },
  { 
    id: "CSE-103", 
    title: "Database System Concepts (7th Edition)", 
    author: "Abraham Silberschatz, Henry F. Korth, S. Sudarshan", 
    barcode: "9780078022159", 
    total: 4, 
    available: 3, 
    waitlist: [] 
  },
  { 
    id: "CSE-104", 
    title: "Computer Networking: A Top-Down Approach (8th Edition)", 
    author: "James F. Kurose, Keith W. Ross", 
    barcode: "9780136681557", 
    total: 3, 
    available: 3, 
    waitlist: [] 
  },
  { 
    id: "CSE-105", 
    title: "Computer Organization and Architecture", 
    author: "William Stallings", 
    barcode: "9780134997193", 
    total: 4, 
    available: 4, 
    waitlist: [] 
  },
  { 
    id: "CSE-106", 
    title: "Introduction to the Theory of Computation", 
    author: "Michael Sipser", 
    barcode: "9781133187790", 
    total: 3, 
    available: 0, 
    waitlist: ["RVUM26CSE122"] 
  },
  { 
    id: "CSE-107", 
    title: "Compilers: Principles, Techniques, and Tools (Dragon Book 2nd Edition)", 
    author: "Alfred V. Aho, Monica S. Lam, Ravi Sethi, Jeffrey D. Ullman", 
    barcode: "9780321486813", 
    total: 4, 
    available: 3, 
    waitlist: [] 
  },
  { 
    id: "CSE-108", 
    title: "Discrete Mathematics and Its Applications (8th Edition)", 
    author: "Kenneth H. Rosen", 
    barcode: "9781259676512", 
    total: 4, 
    available: 4, 
    waitlist: [] 
  }
];

export const INITIAL_NEWSPAPERS: Newspaper[] = [
  { id: "NP-01", name: "The Hindu", language: "English", editionDate: new Date().toISOString().slice(0, 10), shelfLocation: "Main Reading Lounge - Stand A-1", copiesAvailable: 3 },
  { id: "NP-02", name: "Deccan Herald", language: "English", editionDate: new Date().toISOString().slice(0, 10), shelfLocation: "Newspaper Stand A-2", copiesAvailable: 3 },
  { id: "NP-03", name: "The Economic Times", language: "English", editionDate: new Date().toISOString().slice(0, 10), shelfLocation: "Periodicals Gallery - Rack B-1", copiesAvailable: 2 },
  { id: "NP-04", name: "The Times of India", language: "English", editionDate: new Date().toISOString().slice(0, 10), shelfLocation: "Main Reading Lounge - Stand A-3", copiesAvailable: 3 },
  { id: "NP-05", name: "Prajavani", language: "Kannada", editionDate: new Date().toISOString().slice(0, 10), shelfLocation: "Regional Reading Desk - Stand B-2", copiesAvailable: 2 },
  { id: "NP-06", name: "The Indian Express", language: "English", editionDate: new Date().toISOString().slice(0, 10), shelfLocation: "Reading Hall - Stand A-4", copiesAvailable: 2 }
];

export const INITIAL_MAGAZINES: Magazine[] = [
  { id: "MAG-01", name: "IEEE Computer", publisher: "IEEE Computer Society", category: "Computer Science & Engineering", volume: "Vol. 59", issue: "Issue 4", monthYear: "April 2026", shelfLocation: "Periodicals Rack P-1", isAvailable: true },
  { id: "MAG-02", name: "Communications of the ACM (CACM)", publisher: "Association for Computing Machinery", category: "Computing Research & Systems", volume: "Vol. 69", issue: "Issue 3", monthYear: "March 2026", shelfLocation: "Periodicals Rack P-2", isAvailable: true },
  { id: "MAG-03", name: "MIT Technology Review", publisher: "MIT Technology Review Inc.", category: "Emerging Tech & AI", volume: "Vol. 129", issue: "Issue 2", monthYear: "March/April 2026", shelfLocation: "Periodicals Rack P-3", isAvailable: true },
  { id: "MAG-04", name: "Open Source For You (OSFY)", publisher: "EFY Enterprises", category: "Linux & FOSS Architectures", volume: "Vol. 24", issue: "Issue 1", monthYear: "April 2026", shelfLocation: "Periodicals Rack P-4", isAvailable: true },
  { id: "MAG-05", name: "Harvard Business Review (HBR)", publisher: "Harvard Business Publishing", category: "Technology Strategy & Leadership", volume: "Vol. 104", issue: "Issue 2", monthYear: "April 2026", shelfLocation: "Periodicals Rack P-5", isAvailable: true }
];
