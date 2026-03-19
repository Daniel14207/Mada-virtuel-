import { CheckCircle2, TrendingUp, Filter } from 'lucide-react';
import { Match } from '../types';
import { TeamLogo, LeagueLogo } from './Logos';

export default function PremiumView({ matches, onMatchClick }: { matches: Match[], onMatchClick: (m: Match) => void }) {
  // Filter for VIP/High Confidence matches
  const premiumMatches = matches.filter(m => m.prediction && m.prediction.matchCible.confidence > 50);

  // Group matches by league
  const groupedByLeague = premiumMatches.reduce((acc, match) => {
    if (!acc[match.league]) acc[match.league] = [];
    acc[match.league].push(match);
    return acc;
  }, {} as Record<string, Match[]>);

  const sortedLeagues = Object.keys(groupedByLeague).sort();

  return (
    <div className="bg-[#131324] min-h-full p-3 pb-24 relative">
      {sortedLeagues.map(league => {
        const leagueMatches = groupedByLeague[league];
        
        // Group by time within league
        const groupedByTime = leagueMatches.reduce((acc, match) => {
          if (!acc[match.time]) acc[match.time] = [];
          acc[match.time].push(match);
          return acc;
        }, {} as Record<string, Match[]>);
        
        const sortedTimes = Object.keys(groupedByTime).sort();

        return (
        <div key={league} className="mb-6">
          <div className="text-sm font-bold text-gray-400 uppercase tracking-wider px-2 bg-[#2e3b55] py-2 rounded mb-3 flex items-center gap-2">
            <LeagueLogo name={league} />
            {league}
          </div>
          
          {sortedTimes.map(time => {
            const timeMatches = groupedByTime[time];
            const isNewCycle = timeMatches.some(m => m.isNewCycle);
            
            return (
            <div key={time} className="mb-4">
              {isNewCycle && (
                <div className="bg-blue-600 text-white text-center py-1 mb-3 rounded font-bold text-sm animate-pulse flex items-center justify-center gap-2">
                  <span>🆕</span> NEW CYCLE
                </div>
              )}
              {timeMatches.map((match) => (
                <div 
                  key={match.id} 
                  className="bg-[#1e1e38] rounded-lg border border-blue-900/50 mb-4 overflow-hidden cursor-pointer"
                  onClick={() => onMatchClick(match)}
                >
                  <div className="flex justify-between items-center px-4 py-2 border-b border-blue-900/30">
                    <span className="text-xs text-gray-300">Slot {match.time}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      match.status === 'OPEN' ? 'bg-blue-500/20 text-blue-400' : 
                      match.status === 'PLAYING' ? 'bg-green-500/20 text-green-400 animate-pulse' : 
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {match.status}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center px-4 py-6">
                    <div className="flex items-center justify-end gap-2 w-[40%]">
                      <TeamLogo name={match.homeTeam.name} />
                      <span className="text-sm font-medium text-right">{match.homeTeam.name}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 w-[20%]">
                      <span className="text-lg font-bold">{match.score?.home ?? '-'}</span>
                      <CheckCircle2 size={20} className="text-[#4ade80] fill-[#4ade80]/20" />
                      <span className="text-lg font-bold">{match.score?.away ?? '-'}</span>
                    </div>
                    <div className="flex items-center justify-start gap-2 w-[40%]">
                      <span className="text-sm font-medium text-left">{match.awayTeam.name}</span>
                      <TeamLogo name={match.awayTeam.name} />
                    </div>
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
        </div>
        );
      })}
      
      <button className="fixed bottom-20 right-4 w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 z-30">
        <Filter size={24} className="text-white" />
      </button>
    </div>
  );
}
