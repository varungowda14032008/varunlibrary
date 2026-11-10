import React, { useMemo } from 'react';

export const LibraryAtmosphere: React.FC = () => {
  // Pre-generate stable positions and animation delays for dust motes
  const dustMotes = useMemo(() => {
    return Array.from({ length: 32 }).map((_, i) => ({
      id: i,
      left: `${(i * 3.1) % 100}%`,
      top: `${(i * 4.7 + 5) % 100}%`,
      size: `${2 + (i % 4) * 1.2}px`,
      duration: `${14 + (i % 10) * 2}s`,
      delay: `${(i * 0.8) % 12}s`,
      pulseDuration: `${3 + (i % 5) * 1.2}s`,
      color: i % 3 === 0 ? 'bg-[#cda659]' : i % 3 === 1 ? 'bg-emerald-300' : 'bg-rose-300'
    }));
  }, []);

  // Floating Open Tomes with spines, bookmarks, and page lines
  const floatingTomes = useMemo(() => [
    {
      id: 'tome-1',
      left: '7%',
      duration: '26s',
      delay: '0s',
      scale: 1.05,
      coverColor: '#064e3b', // Deep Scholar's Emerald
      trimColor: '#10b981',
      bookmarkColor: '#f59e0b',
      title: 'CLRS'
    },
    {
      id: 'tome-2',
      left: '84%',
      duration: '31s',
      delay: '4s',
      scale: 0.95,
      coverColor: '#881337', // University Burgundy Wine
      trimColor: '#f43f5e',
      bookmarkColor: '#cda659',
      title: 'DBMS'
    },
    {
      id: 'tome-3',
      left: '28%',
      duration: '29s',
      delay: '11s',
      scale: 0.9,
      coverColor: '#78350f', // Antique Amber Gold
      trimColor: '#f59e0b',
      bookmarkColor: '#10b981',
      title: 'OS'
    },
    {
      id: 'tome-4',
      left: '68%',
      duration: '34s',
      delay: '17s',
      scale: 1.1,
      coverColor: '#064e3b', // Scholar's Emerald
      trimColor: '#34d399',
      bookmarkColor: '#f43f5e',
      title: 'LOGIC'
    },
    {
      id: 'tome-5',
      left: '46%',
      duration: '33s',
      delay: '7s',
      scale: 0.85,
      coverColor: '#4c0519', // Deep Wine
      trimColor: '#fb7185',
      bookmarkColor: '#cda659',
      title: 'NET'
    }
  ], []);

  // Translucent Fluttering Parchment Pages
  const parchmentPages = useMemo(() => [
    { id: 'p-1', left: '18%', duration: '24s', delay: '2s', rot: '12deg', scale: 0.95 },
    { id: 'p-2', left: '58%', duration: '27s', delay: '8s', rot: '-16deg', scale: 1.05 },
    { id: 'p-3', left: '76%', duration: '22s', delay: '14s', rot: '22deg', scale: 0.85 },
    { id: 'p-4', left: '38%', duration: '28s', delay: '19s', rot: '-10deg', scale: 1.0 }
  ], []);

  // Floating Academic & CS Glyphs
  const csGlyphs = useMemo(() => [
    { id: 'g-1', char: 'λ', left: '12%', duration: '22s', delay: '1s', color: 'text-emerald-400/50', size: 'text-2xl' },
    { id: 'g-2', char: 'Σ', left: '22%', duration: '25s', delay: '5s', color: 'text-amber-300/40', size: 'text-xl' },
    { id: 'g-3', char: '∫', left: '34%', duration: '28s', delay: '9s', color: 'text-rose-400/40', size: 'text-2xl' },
    { id: 'g-4', char: 'O(1)', left: '52%', duration: '24s', delay: '3s', color: 'text-emerald-300/50', size: 'text-sm font-mono' },
    { id: 'g-5', char: '{ ; }', left: '64%', duration: '30s', delay: '12s', color: 'text-amber-400/50', size: 'text-base font-mono' },
    { id: 'g-6', char: 'π', left: '78%', duration: '26s', delay: '7s', color: 'text-rose-300/40', size: 'text-xl' },
    { id: 'g-7', char: 'Ω', left: '88%', duration: '27s', delay: '15s', color: 'text-emerald-400/40', size: 'text-xl' },
    { id: 'g-8', char: '01', left: '42%', duration: '23s', delay: '18s', color: 'text-amber-300/40', size: 'text-xs font-mono' },
    { id: 'g-9', char: '✦', left: '92%', duration: '21s', delay: '10s', color: 'text-[#cda659]/60', size: 'text-lg' },
    { id: 'g-10', char: '⚡', left: '5%', duration: '29s', delay: '16s', color: 'text-amber-400/50', size: 'text-sm' },
    { id: 'g-11', char: '∀x', left: '60%', duration: '25s', delay: '21s', color: 'text-emerald-300/40', size: 'text-xs font-mono' }
  ], []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* 1. Undulating Scholar's Emerald Green Aurora (#10b981 / #059669) - Top-Left & Center */}
      <div
        className="absolute -top-[15%] -left-[10%] w-[65vw] h-[65vw] max-w-[850px] max-h-[850px] rounded-full bg-gradient-to-br from-emerald-600/35 via-emerald-800/20 to-transparent blur-[110px] animate-aura-emerald"
      />

      {/* 2. Royal Burgundy Wine Aurora (#f43f5e / #e11d48 / #881337) - Top-Right & Center */}
      <div
        className="absolute -top-[12%] -right-[12%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full bg-gradient-to-bl from-rose-700/30 via-red-950/25 to-transparent blur-[120px] animate-aura-burgundy"
      />

      {/* 3. Antique Gold / Amber Light Pool (#f59e0b / #d97706) - Lower Canvas */}
      <div
        className="absolute -bottom-[20%] left-[20%] w-[70vw] h-[55vw] max-w-[900px] max-h-[700px] rounded-full bg-gradient-to-t from-amber-600/20 via-[#cda659]/15 to-transparent blur-[130px] animate-aura-gold"
      />

      {/* 4. Active Continuous Color Wave Gradient Sweep (25s Loop) */}
      <div
        className="absolute inset-0 opacity-20 mix-blend-screen animate-wave-sweep bg-gradient-to-r from-emerald-900/0 via-emerald-600/15 via-[#cda659]/15 via-rose-800/15 to-emerald-900/0"
      />

      {/* 5. Architectural Bookshelf Silhouette Grid & Arches */}
      <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#cda659_1px,transparent_1px)] [background-size:36px_36px]" />
      
      {/* Architectural Cathedral Arch & Shelf Pillars Overlay */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.035] text-[#cda659]" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <defs>
          <pattern id="shelfGrid" width="240" height="180" patternUnits="userSpaceOnUse">
            <line x1="0" y1="178" x2="240" y2="178" stroke="currentColor" strokeWidth="2.5" />
            <line x1="12" y1="0" x2="12" y2="180" stroke="currentColor" strokeWidth="1.5" />
            <line x1="228" y1="0" x2="228" y2="180" stroke="currentColor" strokeWidth="1.5" />
            {/* Gothic Arched Top */}
            <path d="M12 40 Q120 0 228 40" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
            {/* Stylized Book Spine Silhouettes on Shelf */}
            <rect x="24" y="60" width="12" height="118" fill="currentColor" opacity="0.3" rx="1.5" />
            <rect x="40" y="70" width="16" height="108" fill="currentColor" opacity="0.4" rx="1.5" />
            <rect x="60" y="52" width="10" height="126" fill="currentColor" opacity="0.35" rx="1.5" />
            <rect x="74" y="66" width="14" height="112" fill="currentColor" opacity="0.45" rx="1.5" />
            <rect x="150" y="58" width="15" height="120" fill="currentColor" opacity="0.3" rx="1.5" />
            <rect x="169" y="74" width="12" height="104" fill="currentColor" opacity="0.4" rx="1.5" />
            <rect x="185" y="62" width="18" height="116" fill="currentColor" opacity="0.35" rx="1.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#shelfGrid)" />
      </svg>

      {/* 6. Floating Open Tomes & Books */}
      {floatingTomes.map(tome => (
        <div
          key={tome.id}
          className="absolute"
          style={{
            left: tome.left,
            animation: `floatDriftUpward ${tome.duration} ease-in-out infinite`,
            animationDelay: tome.delay,
            transform: `scale(${tome.scale})`
          }}
        >
          <div className="relative w-24 h-16 drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]">
            <svg viewBox="0 0 120 75" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Outer Tome Binding Cover */}
              <path
                d="M4 12 C30 18, 54 22, 60 25 C66 22, 90 18, 116 12 L114 62 C88 68, 66 71, 60 74 C54 71, 32 68, 6 62 Z"
                fill={tome.coverColor}
                stroke={tome.trimColor}
                strokeWidth="1.5"
              />
              {/* Spine Stitching & Back Shadow */}
              <path d="M58 24 L58 74 C60 74.5, 62 74.5, 62 74 L62 24 Z" fill="#111f2a" opacity="0.8" />

              {/* Left Open Page Cluster */}
              <path
                d="M8 15 C32 20, 54 23, 58 25 L58 71 C54 69, 32 66, 10 61 Z"
                fill="#f8fafc"
                opacity="0.92"
                stroke="#cbd5e1"
                strokeWidth="0.8"
              />
              <path
                d="M12 18 C34 22, 53 25, 57 26 L57 70 C53 68, 34 65, 14 61 Z"
                fill="#f1f5f9"
                opacity="0.95"
              />

              {/* Right Open Page Cluster */}
              <path
                d="M112 15 C88 20, 66 23, 62 25 L62 71 C66 69, 88 66, 110 61 Z"
                fill="#f8fafc"
                opacity="0.92"
                stroke="#cbd5e1"
                strokeWidth="0.8"
              />
              <path
                d="M108 18 C86 22, 67 25, 63 26 L63 70 C67 68, 86 65, 106 61 Z"
                fill="#f1f5f9"
                opacity="0.95"
              />

              {/* Manuscript Page Lines (Text Filaments) */}
              <g stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" opacity="0.6">
                {/* Left Page Lines */}
                <line x1="18" y1="26" x2="48" y2="31" />
                <line x1="18" y1="33" x2="50" y2="38" />
                <line x1="18" y1="40" x2="46" y2="45" />
                <line x1="18" y1="47" x2="49" y2="52" />
                <line x1="18" y1="54" x2="42" y2="58" />

                {/* Right Page Lines */}
                <line x1="72" y1="31" x2="102" y2="26" />
                <line x1="70" y1="38" x2="102" y2="33" />
                <line x1="74" y1="45" x2="102" y2="40" />
                <line x1="71" y1="52" x2="102" y2="47" />
                <line x1="78" y1="58" x2="102" y2="54" />
              </g>

              {/* Fluttering Golden Silk Ribbon Bookmark */}
              <path
                d="M60 25 Q64 45 56 60 Q52 70 58 78 Q62 82 56 86"
                stroke={tome.bookmarkColor}
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                className="drop-shadow-sm"
              />
            </svg>
          </div>
        </div>
      ))}

      {/* 7. Fluttering Translucent Parchment Pages */}
      {parchmentPages.map(page => (
        <div
          key={page.id}
          className="absolute"
          style={{
            left: page.left,
            animation: `parchmentFlutter ${page.duration} ease-in-out infinite`,
            animationDelay: page.delay,
            transform: `scale(${page.scale}) rotate(${page.rot})`
          }}
        >
          <div className="w-14 h-18 bg-[#fdfbf7]/80 backdrop-blur-xs rounded-sm border border-[#e2d9c8] p-1.5 shadow-md flex flex-col justify-between relative overflow-hidden">
            {/* Dog-eared Folded Corner */}
            <div className="absolute top-0 right-0 w-3 h-3 bg-amber-100 border-b border-l border-amber-300 transform" />
            <div className="space-y-1 pt-1 opacity-70">
              <div className="w-full h-0.5 bg-slate-600 rounded" />
              <div className="w-4/5 h-0.5 bg-slate-500 rounded" />
              <div className="w-full h-0.5 bg-slate-600 rounded" />
              <div className="w-3/4 h-0.5 bg-slate-500 rounded" />
              <div className="w-5/6 h-0.5 bg-slate-600 rounded" />
              <div className="w-2/3 h-0.5 bg-amber-700/60 rounded" />
            </div>
            <div className="text-[6px] font-mono text-slate-500 text-right">rvu.edu</div>
          </div>
        </div>
      ))}

      {/* 8. Floating Academic & CS Glyphs */}
      {csGlyphs.map(glyph => (
        <div
          key={glyph.id}
          className={`absolute ${glyph.color} ${glyph.size} font-serif select-none drop-shadow-[0_0_8px_rgba(205,166,89,0.3)]`}
          style={{
            left: glyph.left,
            animation: `glyphFloat ${glyph.duration} ease-in-out infinite`,
            animationDelay: glyph.delay
          }}
        >
          {glyph.char}
        </div>
      ))}

      {/* 9. Golden Library Dust Motes (Sunbeams Filtering Effect) */}
      {dustMotes.map(mote => (
        <div
          key={mote.id}
          className={`absolute rounded-full ${mote.color}`}
          style={{
            left: mote.left,
            top: mote.top,
            width: mote.size,
            height: mote.size,
            animation: `dustPulse ${mote.pulseDuration} ease-in-out infinite`,
            animationDelay: mote.delay,
            filter: 'blur(0.4px)',
            boxShadow: '0 0 6px rgba(245, 158, 11, 0.6)'
          }}
        />
      ))}
    </div>
  );
};
