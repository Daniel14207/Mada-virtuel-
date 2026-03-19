import { CheckCircle2, TrendingUp, Filter } from 'lucide-react';
import { Match } from '../types';

export default function PremiumView({ matches, onMatchClick }: { matches: Match[], onMatchClick: (m: Match) => void }) {
  // Filter for VIP/High Confidence matches
  const premiumMatches = matches.filter(m => m.prediction && m.prediction.matchCible.confidence > 50);

  // Group matches by time
  const groupedMatches = premiumMatches.reduce((acc, match) => {
    if (!acc[match.time]) acc[match.time] = [];
    acc[match.time].push(match);
    return acc;
  }, {} as Record<string, Match[]>);

  const sortedTimes = Object.keys(groupedMatches).sort();

  return (
    <div className="bg-[#131324] min-h-full p-3 pb-24 relative">
      {sortedTimes.map(time => {
        const isNewCycle = groupedMatches[time].some(m => m.isNewCycle);
        return (
        <div key={time} className="mb-4">
          {isNewCycle && (
            <div className="bg-blue-600 text-white text-center py-1 mb-3 rounded font-bold text-sm animate-pulse flex items-center justify-center gap-2">
              <span>🆕</span> NEW CYCLE
            </div>
          )}
          {groupedMatches[time].map((match) => (
            <div 
              key={match.id} 
              className="bg-[#1e1e38] rounded-lg border border-blue-900/50 mb-4 overflow-hidden cursor-pointer"
              onClick={() => onMatchClick(match)}
            >
              <div className="flex justify-between items-center px-4 py-2 border-b border-blue-900/30">
                <span className="text-xs text-gray-300">{match.league} - Slot {match.time}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  match.status === 'OPEN' ? 'bg-blue-500/20 text-blue-400' : 
                  match.status === 'PLAYING' ? 'bg-green-500/20 text-green-400 animate-pulse' : 
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {match.status}
                </span>
              </div>
              
              <div className="flex justify-between items-center px-4 py-6">
                <span className="text-sm font-medium w-1/3 text-left">{match.homeTeam.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">{match.score?.home ?? '-'}</span>
                  <CheckCircle2 size={20} className="text-[#4ade80] fill-[#4ade80]/20" />
                  <span className="text-lg font-bold">{match.score?.away ?? '-'}</span>
                </div>
                <span className="text-sm font-medium w-1/3 text-right">{match.awayTeam.name}</span>
              </div>
              
              <div className="flex justify-between items-center bg-[#18182f] border-t border-blue-900/30 pl-4">
                <div className="flex items-center gap-2 py-3">
                  <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium text-white">{match.prediction?.vip[0] || 'Over 1.5 Goals'}</span>
                </div>
                <div className="bg-[#facc15] text-black px-4 py-3 flex items-center gap-2 rounded-tl-lg font-bold">
                  <TrendingUp size={16} />
                  <span>{match.prediction?.matchCible.bestPrediction === '1' ? match.odds.home.toFixed(2) : match.prediction?.matchCible.bestPrediction === '2' ? match.odds.away.toFixed(2) : match.odds.draw.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        );
      })}
      
      <button className="fixed bottom-20 right-4 w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 z-30">
        <Filter size={24} className="text-white" />
      </button>
    </div>
  );
}
