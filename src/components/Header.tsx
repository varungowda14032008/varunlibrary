import React from 'react';
import { Student } from '../types';

interface HeaderProps {
  currentStudent: Student | null;
  onOpenServerTerminal: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentStudent,
  onOpenServerTerminal,
  onLogout
}) => {
  return (
    <header className="px-4 md:px-6 py-3 border-b border-[#223a4d] bg-[#162734]/95 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* RV University Crest & Motto Lockup */}
        <div className="flex items-center gap-3 bg-[#111f2a]/90 px-3.5 py-1.5 rounded-2xl border border-[#cda659]/40 shadow-lg">
          <svg className="h-10 w-10 md:h-11 md:w-11 flex-shrink-0" viewBox="0 0 160 170" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M80 14 C80 6, 85 2, 80 0 C75 2, 80 6, 80 14 Z" stroke="#cda659" strokeWidth="3" fill="#cda659"/>
            <path d="M68 20 C64 12, 56 12, 60 22 C64 24, 68 22, 68 20 Z" stroke="#cda659" strokeWidth="2.5" fill="none"/>
            <path d="M92 20 C96 12, 104 12, 100 22 C96 24, 92 22, 92 20 Z" stroke="#cda659" strokeWidth="2.5" fill="none"/>
            <path d="M52 30 C46 24, 40 28, 48 35 C52 34, 54 32, 52 30 Z" stroke="#cda659" strokeWidth="2.5" fill="none"/>
            <path d="M108 30 C114 24, 120 28, 112 35 C108 34, 106 32, 108 30 Z" stroke="#cda659" strokeWidth="2.5" fill="none"/>
            <path d="M42 42 Q80 34 80 48 Q80 34 118 42" stroke="#cda659" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
            <path d="M40 50 Q80 42 80 56 Q80 42 120 50" stroke="#cda659" strokeWidth="3" fill="none"/>
            <path d="M38 58 Q80 50 80 64 Q80 50 122 58" stroke="#cda659" strokeWidth="3" fill="none"/>
            <path d="M38 58 L38 96 Q80 88 80 102 Q80 88 122 96 L122 58" stroke="#cda659" strokeWidth="3.5" fill="none"/>
            <line x1="80" y1="48" x2="80" y2="102" stroke="#cda659" strokeWidth="3.5"/>
            <path d="M52 94 C52 74, 108 74, 108 94" stroke="#cda659" strokeWidth="2.5" fill="none"/>
            <path d="M60 95 C60 82, 100 82, 100 95" stroke="#cda659" strokeWidth="2" fill="none"/>
            <path d="M68 96 C68 89, 92 89, 92 96" stroke="#cda659" strokeWidth="1.8" fill="none"/>
            <g stroke="#cda659" strokeWidth="2.5" strokeLinecap="round">
              <line x1="80" y1="92" x2="80" y2="114" />
              <line x1="72" y1="94" x2="68" y2="115" />
              <line x1="88" y1="94" x2="92" y2="115" />
              <line x1="64" y1="97" x2="56" y2="117" />
              <line x1="96" y1="97" x2="104" y2="117" />
              <line x1="56" y1="102" x2="46" y2="120" />
              <line x1="104" y1="102" x2="114" y2="120" />
            </g>
            <path d="M38 96 C38 126, 80 134, 80 134 C80 134, 122 126, 122 96" stroke="#cda659" strokeWidth="3" fill="none"/>
            <path d="M44 98 C44 121, 80 128, 80 128 C80 128, 116 121, 116 98" stroke="#cda659" strokeWidth="1.8" fill="none"/>
            <path d="M30 126 L46 123 L44 136 L30 142 L34 134 Z" fill="#111f2a" stroke="#cda659" strokeWidth="2"/>
            <path d="M130 126 L114 123 L116 136 L130 142 L126 134 Z" fill="#111f2a" stroke="#cda659" strokeWidth="2"/>
            <path d="M42 124 Q80 136 118 124 L114 140 Q80 152 46 140 Z" fill="#111f2a" stroke="#cda659" strokeWidth="2.5"/>
            <circle cx="62" cy="132" r="1.5" fill="#cda659" />
            <line x1="56" y1="130" x2="68" y2="130" stroke="#cda659" strokeWidth="1.5" />
            <polygon points="80,129 82,133 86,133 83,135 84,139 80,136 76,139 77,135 74,133 78,133" fill="#cda659"/>
            <circle cx="98" cy="132" r="1.5" fill="#cda659" />
            <line x1="92" y1="130" x2="104" y2="130" stroke="#cda659" strokeWidth="1.5" />
          </svg>

          <div className="leading-none border-l border-[#2e4759] pl-3 flex flex-col justify-center">
            <div className="font-cinzel text-sm md:text-base tracking-[0.08em] font-black text-[#cda659] leading-tight">RV</div>
            <div className="font-cinzel text-[11px] md:text-xs tracking-[0.14em] font-extrabold text-[#cda659] leading-tight mt-0.5">UNIVERSITY</div>
            <div className="w-full h-[1.5px] bg-[#cda659] my-1 opacity-90"></div>
            <div className="font-serif-italic text-[10px] text-[#d6b774] tracking-wide">Go, change the world</div>
            <div className="text-[7px] md:text-[7.5px] tracking-[0.16em] uppercase text-slate-400 font-sans mt-0.5 opacity-80">AN INITIATIVE OF RV EDUCATIONAL INSTITUTIONS</div>
          </div>
        </div>

        <span className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-[#cda659]/10 text-[#d8b568] border border-[#cda659]/30 uppercase tracking-wider font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Active Kiosk Firewall Shield
        </span>
      </div>

      {/* Active User & Faculty Terminal Trigger */}
      <div className="flex items-center gap-2 md:gap-3">
        {currentStudent && (
          <div className="text-xs bg-[#111f2a] border border-[#263e50] px-3 py-1.5 rounded-xl font-mono flex items-center gap-1.5 shadow-sm">
            <span className="text-slate-400">USN:</span> 
            <span className="text-emerald-400 font-bold">{currentStudent.usn}</span>
          </div>
        )}

        <button
          onClick={onOpenServerTerminal}
          className="px-3.5 py-1.5 rounded-xl bg-[#cda659] hover:bg-[#b58f44] text-slate-950 font-bold text-xs transition shadow-lg shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer"
        >
          <span>⚡</span> <span className="hidden sm:inline">Faculty / Server</span> Terminal
        </button>

        {currentStudent && (
          <button
            onClick={onLogout}
            className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-xs font-semibold text-rose-300 transition cursor-pointer"
          >
            Exit Desk
          </button>
        )}
      </div>
    </header>
  );
};
