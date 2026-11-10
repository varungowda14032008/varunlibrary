-- ==============================================================================
-- SMART CAMPUS LIBRARY DESK - RV UNIVERSITY
-- Supabase PostgreSQL Schema & Cohort Seed Script
-- Run this complete script in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/xkilcguoujcvtwskkgeb/sql
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. DROP EXISTING TABLES (IF RE-INITIALIZING)
DROP TABLE IF EXISTS circulations CASCADE;
DROP TABLE IF EXISTS books CASCADE;
DROP TABLE IF EXISTS students CASCADE;

-- 3. CREATE STUDENTS TABLE (51 B.Tech CSE Cohort Records)
CREATE TABLE students (
  sl INT NOT NULL,
  usn TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  is_configured BOOLEAN DEFAULT FALSE,
  pass_hash TEXT DEFAULT '',
  phone TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 4. CREATE BOOKS TABLE (Physical Shelf Stock & Waitlists)
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

-- 5. CREATE CIRCULATIONS TABLE (Autonomous 7-Day Borrowings & Returns)
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
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 6. ENABLE ROW LEVEL SECURITY (RLS) & PUBLIC ACCESS POLICIES
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
CREATE POLICY "Allow public update circulations" ON circulations FOR UPDATE USING (true);

-- 7. ENABLE REALTIME SYNC (Optional, enables live multi-kiosk sync)
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE students, books, circulations;
COMMIT;

-- 8. SEED STUDENTS TABLE (All 51 RV University B.Tech CSE Students)
INSERT INTO students (sl, usn, name, is_configured, pass_hash, phone) VALUES
(1, 'RVUM26CSE122', 'NAVEEN KUMAR B', false, '', '+91 98801 12201'),
(2, 'RVUM26CSE114', 'NIKHIL', false, '', '+91 98801 11402'),
(3, 'RVUM26CSE104', 'PRAGATI AMAR GARUDKAR', false, '', '+91 98801 10403'),
(4, 'RVUM26CSE103', 'SONAM PANDEY', false, '', '+91 98801 10304'),
(5, 'RVUM26CSE016', 'ULLAS U', true, '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', '+91 98801 01605'),
(6, 'RVUM26CSE012', 'VAAGESH CHANDRA VALLAMKONDA', false, '', '+91 98801 01206'),
(7, 'RVUM26CSE063', 'VARUN GOWDA UN', true, '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', '+91 98801 06307'),
(8, 'RVUM26CSE070', 'VARUN RM', false, '', '+91 98801 07008'),
(9, 'RVUM26CSE039', 'VEDANTH G', false, '', '+91 98801 03909'),
(10, 'RVUM26CSE090', 'VEJENDLA RISHIV', false, '', '+91 98801 09010'),
(11, 'RVUM26CSE033', 'VIVAAN NAYAK', false, '', '+91 98801 03311'),
(12, 'RVUM26CSE047', 'VIVIN PREMSAGAR K', false, '', '+91 98801 04712'),
(13, 'RVUM26CSE031', 'YAJAT VINAY GHULE', false, '', '+91 98801 03113'),
(14, 'RVUM26CSE179', 'YAKSHA M', false, '', '+91 98801 17914'),
(15, 'RVUM26CSE135', 'A CHARAN TEJ', false, '', '+91 98801 13515'),
(16, 'RVUM26CSE170', 'AMRUTH C N', false, '', '+91 98801 17016'),
(17, 'RVUM26CSE116', 'ANANYA RANGAPPA LANGATI', false, '', '+91 98801 11617'),
(18, 'RVUM26CSE120', 'BENAKA S', false, '', '+91 98801 12018'),
(19, 'RVUM26CSE133', 'DARSHAN M PAWAR', false, '', '+91 98801 13319'),
(20, 'RVUM26CSE142', 'DEEKSHA P', false, '', '+91 98801 14220'),
(21, 'RVUM26CSE136', 'DHAWAN D GOWDA', false, '', '+91 98801 13621'),
(22, 'RVUM26CSE174', 'DHIREN M', false, '', '+91 98801 17422'),
(23, 'RVUM26CSE124', 'DHRUV R P', false, '', '+91 98801 12423'),
(24, 'RVUM26CSE127', 'HAMSINI M D', false, '', '+91 98801 12724'),
(25, 'RVUM26CSE126', 'HEMANTH KUMAR R', false, '', '+91 98801 12625'),
(26, 'RVUM26CSE176', 'JAYANTH C S', false, '', '+91 98801 17626'),
(27, 'RVUM26CSE165', 'JAYANTH.V', false, '', '+91 98801 16527'),
(28, 'RVUM26CSE159', 'JITHYA SHREE C', false, '', '+91 98801 15928'),
(29, 'RVUM26CSE111', 'KKHUSHAL KESHAV', false, '', '+91 98801 11129'),
(30, 'RVUM26CSE141', 'MALLIKARJUNA', false, '', '+91 98801 14130'),
(31, 'RVUM26CSE125', 'MANOJ L', false, '', '+91 98801 12531'),
(32, 'RVUM26CSE112', 'MANYATHA S', false, '', '+91 98801 11232'),
(33, 'RVUM26CSE128', 'NESARA M', false, '', '+91 98801 12833'),
(34, 'RVUM26CSE109', 'NIVEDITHA M', false, '', '+91 98801 10934'),
(35, 'RVUM26CSE131', 'POOJA S', false, '', '+91 98801 13135'),
(36, 'RVUM26CSE140', 'POORVI', false, '', '+91 98801 14036'),
(37, 'RVUM26CSE138', 'PRAJWAL PRABHAKAR KAPASHI', false, '', '+91 98801 13837'),
(38, 'RVUM26CSE144', 'RAHUL S', false, '', '+91 98801 14438'),
(39, 'RVUM26CSE119', 'ROOPESH K L', false, '', '+91 98801 11939'),
(40, 'RVUM26CSE130', 'RUCHITHA R GOWDA', false, '', '+91 98801 13040'),
(41, 'RVUM26CSE163', 'SAI RAKSHITH', false, '', '+91 98801 16341'),
(42, 'RVUM26CSE113', 'SAIPRASAD', false, '', '+91 98801 11342'),
(43, 'RVUM26CSE129', 'SAMARTH S SHETTY', false, '', '+91 98801 12943'),
(44, 'RVUM26CSE095', 'SANATAWHEED MAHAMMAD YUSUF BETAGERI', false, '', '+91 98801 09544'),
(45, 'RVUM26CSE123', 'SHISHIR D', false, '', '+91 98801 12345'),
(46, 'RVUM26CSE132', 'SHUDANSHU BORDOLOI', false, '', '+91 98801 13246'),
(47, 'RVUM26CSE171', 'SUDHARSAN SRINIVASAN', false, '', '+91 98801 17147'),
(48, 'RVUM26CSE115', 'SUKANYA', false, '', '+91 98801 11548'),
(49, 'RVUM26CSE177', 'SURPARAJU GNANA RUPINI', false, '', '+91 98801 17749'),
(50, 'RVUM26CSE172', 'TANAY R MAAKAM', false, '', '+91 98801 17250'),
(51, 'RVUM26CSE143', 'VIKAS MAHADEV PATTAR', false, '', '+91 98801 14351')
ON CONFLICT (usn) DO NOTHING;

-- 9. SEED PHYSICAL BOOKS TABLE (Core Computer Science Textbooks)
INSERT INTO books (id, title, author, barcode, total, available, waitlist) VALUES
('CSE-101', 'Introduction to Algorithms (CLRS 4th Edition)', 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein', '9780262046305', 5, 5, '{}'),
('CSE-102', 'Operating System Concepts (10th Edition)', 'Abraham Silberschatz, Peter B. Galvin, Greg Gagne', '9781119456339', 4, 4, '{}'),
('CSE-103', 'Database System Concepts (7th Edition)', 'Abraham Silberschatz, Henry F. Korth, S. Sudarshan', '9780078022159', 4, 3, '{}'),
('CSE-104', 'Computer Networking: A Top-Down Approach (8th Edition)', 'James F. Kurose, Keith W. Ross', '9780136681557', 3, 3, '{}'),
('CSE-105', 'Computer Organization and Architecture', 'William Stallings', '9780134997193', 4, 4, '{}'),
('CSE-106', 'Introduction to the Theory of Computation', 'Michael Sipser', '9781133187790', 3, 0, ARRAY['RVUM26CSE122']),
('CSE-107', 'Compilers: Principles, Techniques, and Tools (Dragon Book 2nd Edition)', 'Alfred V. Aho, Monica S. Lam, Ravi Sethi, Jeffrey D. Ullman', '9780321486813', 4, 3, '{}'),
('CSE-108', 'Discrete Mathematics and Its Applications (8th Edition)', 'Kenneth H. Rosen', '9781259676512', 4, 4, '{}')
ON CONFLICT (id) DO NOTHING;

-- 10. SEED INITIAL SAMPLE CIRCULATION
INSERT INTO circulations (id, book_id, title, usn, student_name, borrowed_at, due_date, is_returned) VALUES
('CIRC-101', 'CSE-103', 'Database System Concepts (7th Edition)', 'RVUM26CSE063', 'VARUN GOWDA UN', NOW() - INTERVAL '2 days', NOW() + INTERVAL '5 days', false)
ON CONFLICT (id) DO NOTHING;
