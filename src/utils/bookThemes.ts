export interface BookTheme {
  category: string;
  cardBg: string;
  spineGradient: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  accentGlow: string;
  icon: string;
}

export function getBookTheme(title: string, id: string): BookTheme {
  const t = title.toLowerCase();

  // 1. Introduction to Algorithms (CLRS) - Rich Academic Emerald & Gold
  if (t.includes('algorithm') || t.includes('clrs') || id === 'CSE-101') {
    return {
      category: 'Algorithms & Logic',
      cardBg: 'bg-gradient-to-br from-[#062c21] via-[#0b382b] to-[#071e17]',
      spineGradient: 'bg-gradient-to-b from-[#34d399] via-[#10b981] to-[#047857]',
      borderColor: 'border-emerald-500/50 hover:border-emerald-400 shadow-emerald-950/40',
      badgeBg: 'bg-emerald-500/15',
      badgeText: 'text-emerald-300',
      badgeBorder: 'border-emerald-500/40',
      accentGlow: 'from-emerald-500/20 to-transparent',
      icon: '🌿'
    };
  }

  // 2. Database System Concepts - University Wine & Burgundy
  if (t.includes('database') || t.includes('dbms') || id === 'CSE-103') {
    return {
      category: 'Data Systems & Relational Architecture',
      cardBg: 'bg-gradient-to-br from-[#330f1c] via-[#421425] to-[#220912]',
      spineGradient: 'bg-gradient-to-b from-[#fb7185] via-[#f43f5e] to-[#881337]',
      borderColor: 'border-rose-500/45 hover:border-rose-400 shadow-rose-950/40',
      badgeBg: 'bg-rose-500/15',
      badgeText: 'text-rose-300',
      badgeBorder: 'border-rose-500/40',
      accentGlow: 'from-rose-500/20 to-transparent',
      icon: '🍷'
    };
  }

  // 3. Operating System Concepts - Royal Sapphire & Deep Azure
  if (t.includes('operating system') || t.includes('silberschatz') || id === 'CSE-102') {
    return {
      category: 'Kernel & Systems Programming',
      cardBg: 'bg-gradient-to-br from-[#0c243c] via-[#0f2c49] to-[#081827]',
      spineGradient: 'bg-gradient-to-b from-[#38bdf8] via-[#0284c7] to-[#0369a1]',
      borderColor: 'border-sky-500/45 hover:border-sky-400 shadow-sky-950/40',
      badgeBg: 'bg-sky-500/15',
      badgeText: 'text-sky-300',
      badgeBorder: 'border-sky-500/40',
      accentGlow: 'from-sky-500/20 to-transparent',
      icon: '⚡'
    };
  }

  // 4. Computer Networking - Academic Indigo & Violet
  if (t.includes('network') || t.includes('kurose') || id === 'CSE-104') {
    return {
      category: 'Protocols & Distributed Systems',
      cardBg: 'bg-gradient-to-br from-[#1b173d] via-[#241f52] to-[#120f2b]',
      spineGradient: 'bg-gradient-to-b from-[#a5b4fc] via-[#6366f1] to-[#3730a3]',
      borderColor: 'border-indigo-500/45 hover:border-indigo-400 shadow-indigo-950/40',
      badgeBg: 'bg-indigo-500/15',
      badgeText: 'text-indigo-300',
      badgeBorder: 'border-indigo-500/40',
      accentGlow: 'from-indigo-500/20 to-transparent',
      icon: '🌐'
    };
  }

  // 5. Compilers (Dragon Book) - Warm Amber & Dragon Fire Gold
  if (t.includes('compiler') || t.includes('dragon') || id === 'CSE-107') {
    return {
      category: 'Compilers & Syntax Analysis',
      cardBg: 'bg-gradient-to-br from-[#351e06] via-[#452808] to-[#221303]',
      spineGradient: 'bg-gradient-to-b from-[#fde047] via-[#f59e0b] to-[#b45309]',
      borderColor: 'border-amber-500/50 hover:border-amber-400 shadow-amber-950/40',
      badgeBg: 'bg-amber-500/15',
      badgeText: 'text-amber-300',
      badgeBorder: 'border-amber-500/40',
      accentGlow: 'from-amber-500/25 to-transparent',
      icon: '🐉'
    };
  }

  // 6. Introduction to the Theory of Computation - Royal Amethyst & Purple
  if (t.includes('computation') || t.includes('sipser') || id === 'CSE-106') {
    return {
      category: 'Automata & Computational Complexity',
      cardBg: 'bg-gradient-to-br from-[#260f38] via-[#36154e] to-[#1a0a27]',
      spineGradient: 'bg-gradient-to-b from-[#d8b4fe] via-[#9333ea] to-[#581c87]',
      borderColor: 'border-purple-500/45 hover:border-purple-400 shadow-purple-950/40',
      badgeBg: 'bg-purple-500/15',
      badgeText: 'text-purple-300',
      badgeBorder: 'border-purple-500/40',
      accentGlow: 'from-purple-500/20 to-transparent',
      icon: '🔮'
    };
  }

  // 7. Discrete Mathematics - Deep Teal & Cyan
  if (t.includes('discrete') || id === 'CSE-108') {
    return {
      category: 'Discrete Structures & Graph Theory',
      cardBg: 'bg-gradient-to-br from-[#052b30] via-[#0a3a41] to-[#041f23]',
      spineGradient: 'bg-gradient-to-b from-[#5eead4] via-[#0d9488] to-[#115e59]',
      borderColor: 'border-teal-500/45 hover:border-teal-400 shadow-teal-950/40',
      badgeBg: 'bg-teal-500/15',
      badgeText: 'text-teal-300',
      badgeBorder: 'border-teal-500/40',
      accentGlow: 'from-teal-500/20 to-transparent',
      icon: '📐'
    };
  }

  // 8. Computer Organization and Architecture - Antique Bronze & Rust Gold
  return {
    category: 'Hardware Architecture & Microprocessors',
    cardBg: 'bg-gradient-to-br from-[#2b1810] via-[#382015] to-[#1c0f0a]',
    spineGradient: 'bg-gradient-to-b from-[#fdba74] via-[#ea580c] to-[#9a3412]',
    borderColor: 'border-orange-500/45 hover:border-orange-400 shadow-orange-950/40',
    badgeBg: 'bg-orange-500/15',
    badgeText: 'text-orange-300',
    badgeBorder: 'border-orange-500/40',
    accentGlow: 'from-orange-500/20 to-transparent',
    icon: '⚙️'
  };
}
