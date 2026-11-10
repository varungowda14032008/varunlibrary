import React, { useState } from 'react';
import { Newspaper, Magazine } from '../types';

interface PeriodicalsSectionProps {
  newspapers: Newspaper[];
  magazines: Magazine[];
}

export const PeriodicalsSection: React.FC<PeriodicalsSectionProps> = ({
  newspapers,
  magazines
}) => {
  const [activeTab, setActiveTab] = useState<'newspapers' | 'magazines'>('newspapers');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNewspapers = newspapers.filter(
    n => n.name.toLowerCase().includes(searchQuery.toLowerCase()) || n.language.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMagazines = magazines.filter(
    m => m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.category.toLowerCase().includes(searchQuery.toLowerCase()) || m.publisher.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#162734]/90 backdrop-blur-md border border-[#263e50] rounded-2xl p-5 md:p-6 space-y-5 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#223a4d] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📰</span>
            <h3 className="font-cinzel text-lg font-bold text-white tracking-wide">
              Periodicals & Daily Press Lounge
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Faculty & Student Reading Desk: Daily Newspaper Editions & International Research Magazines
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-xl bg-[#111f2a] p-1 border border-[#223a4d] text-xs">
            <button
              onClick={() => setActiveTab('newspapers')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'newspapers'
                  ? 'bg-[#cda659] text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🗞️</span> Daily Newspapers ({newspapers.length})
            </button>
            <button
              onClick={() => setActiveTab('magazines')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'magazines'
                  ? 'bg-[#cda659] text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>📑</span> Research Magazines ({magazines.length})
            </button>
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search press or magazine..."
            className="px-3 py-1.5 rounded-xl bg-[#111f2a] border border-[#223a4d] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#cda659]"
          />
        </div>
      </div>

      {activeTab === 'newspapers' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNewspapers.map(np => (
            <div
              key={np.id}
              className="bg-[#111f2a]/80 border border-[#223a4d] rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:border-[#cda659]/40 transition shadow-md"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {np.language} Edition
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {np.editionDate}
                  </span>
                </div>
                <h4 className="font-bold text-base text-white font-cinzel">{np.name}</h4>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <span>📍</span> {np.shelfLocation}
                </p>
              </div>

              <div className="pt-2 border-t border-[#223a4d] flex items-center justify-between text-xs">
                <span className="text-emerald-300 font-mono text-[11px] font-semibold">
                  ● {np.copiesAvailable} Fresh Copies In Lounge
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                  In-Library Reading Only
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMagazines.map(mag => (
            <div
              key={mag.id}
              className="bg-[#111f2a]/80 border border-[#223a4d] rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:border-indigo-500/40 transition shadow-md"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                    {mag.category}
                  </span>
                  <span className="text-[10px] font-mono text-amber-300">
                    {mag.monthYear}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white">{mag.name}</h4>
                <p className="text-xs text-slate-400 font-medium">{mag.publisher}</p>
                <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                  <span>{mag.volume}</span>
                  <span>•</span>
                  <span>{mag.issue}</span>
                </div>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <span>📍</span> {mag.shelfLocation}
                </p>
              </div>

              <div className="pt-2 border-t border-[#223a4d] flex items-center justify-between text-xs">
                <span className="text-emerald-300 font-mono text-[11px] font-semibold">
                  ● Available for Reference
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                  Archived Edition
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
