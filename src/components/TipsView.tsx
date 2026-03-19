import { Star, Filter } from 'lucide-react';
import { Match } from '../types';

export default function TipsView({ matches, onMatchClick }: { matches: Match[], onMatchClick: (m: Match) => void }) {
  // Group matches by time
  const groupedMatches = matches.reduce((acc, match) => {
    if (!acc[match.time]) acc[match.time] = [];
    acc[match.time].push(match);
    return acc;
  }, {} as Record<string, Match[]>);

  const sortedTimes = Object.keys(groupedMatches).sort();

  return (
    <div className="bg-[#f1f5f9] min-h-full pb-20">
      {/* Filters */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[#131324] overflow-x-auto hide-scrollbar">
        <button className="px-6 py-1.5 bg-[#facc15] text-black rounded-full text-sm font-medium whitespace-nowrap">Tous</button>
        <button className="px-6 py-1.5 bg-white text-black rounded-full text-sm font-medium whitespace-nowrap">Populaire</button>
        <button className="px-6 py-1.5 bg-white text-black rounded-full text-sm font-medium whitespace-nowrap">Favoris</button>
        <button className="p-2 bg-white text-black rounded-full ml-auto shrink-0">
          <Filter size={16} />
        </button>
      </div>

      {sortedTimes.map(time => {
        const isNewCycle = groupedMatches[time].some(m => m.isNewCycle);
        return (
        <div key={time} className="mb-4">
          {isNewCycle && (
            <div className="bg-blue-600 text-white text-center py-1 font-bold text-sm animate-pulse flex items-center justify-center gap-2">
              <span>🆕</span> NEW CYCLE
            </div>
          )}
          {/* League Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#2e3b55] text-white">
            <div>
              <div className="font-bold text-sm">Virtual Global League</div>
              <div className="text-xs text-gray-300">Slot: {time}</div>
            </div>
            <Star size={20} className="text-gray-300" />
          </div>

          {/* Match List */}
          <div className="bg-white">
            {Object.entries(
              groupedMatches[time].reduce((acc, match) => {
                if (!acc[match.league]) acc[match.league] = [];
                acc[match.league].push(match);
                return acc;
              }, {} as Record<string, Match[]>)
            ).map(([league, leagueMatches]) => (
              <div key={league}>
                <div className="bg-gray-100 px-4 py-1 text-xs font-bold text-gray-600 border-b border-gray-200">
                  {league}
                </div>
                {leagueMatches.map((match, idx) => (
                  <div 
                    key={match.id} 
                    className={`flex items-center px-4 py-3 cursor-pointer ${idx !== leagueMatches.length - 1 ? 'border-b border-gray-100' : ''}`}
                    onClick={() => onMatchClick(match)}
                  >
                    <div className="flex flex-col items-center w-12">
                      <span className="text-sm font-bold text-black">{match.time}</span>
                      <span className={`text-[10px] font-bold ${match.status === 'LIVE' || match.status === 'PLAYING' ? 'text-red-500 animate-pulse' : 'text-[#4ade80]'}`}>
                        {match.status === 'OPEN' ? 'NS' : match.status === 'FINISHED' ? 'FT' : match.status}
                      </span>
                    </div>
                    
                    <div className="flex flex-col flex-1 ml-2">
                      <span className="text-sm text-black">{match.homeTeam.name}</span>
                      <span className="text-sm text-black mt-1">{match.awayTeam.name}</span>
                    </div>
                    
                    <div className="flex flex-col items-center mr-4">
                      <div className="flex gap-1 mb-1">
                        <span className="text-[10px] text-gray-500 w-10 text-center">1</span>
                        <span className="text-[10px] text-gray-500 w-10 text-center">X</span>
                        <span className="text-[10px] text-gray-500 w-10 text-center">2</span>
                      </div>
                      <div className="flex gap-1">
                        <div className={`w-10 py-1 text-center text-xs rounded border ${match.score && match.score.home > match.score.away ? 'border-[#4ade80] text-[#4ade80]' : 'border-gray-200 text-gray-600'}`}>
                          {match.odds.home.toFixed(2)}
                        </div>
                        <div className={`w-10 py-1 text-center text-xs rounded border ${match.score && match.score.home === match.score.away ? 'border-[#4ade80] text-[#4ade80]' : 'border-gray-200 text-gray-600'}`}>
                          {match.odds.draw.toFixed(2)}
                        </div>
                        <div className={`w-10 py-1 text-center text-xs rounded border ${match.score && match.score.home < match.score.away ? 'border-[#4ade80] text-[#4ade80]' : 'border-gray-200 text-gray-600'}`}>
                          {match.odds.away.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end w-8">
                      <span className="text-sm font-bold text-black">{match.score?.home ?? '-'}</span>
                      <span className="text-sm font-bold text-black mt-1">{match.score?.away ?? '-'}</span>
                    </div>
                    
                    <div className="text-[10px] text-gray-400 flex items-center ml-2">
                      cotes &rarr;
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        );
      })}
    </div>
  );
}
