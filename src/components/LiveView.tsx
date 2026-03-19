import { Match } from '../types';
import { Clock, PlayCircle, CheckCircle2 } from 'lucide-react';

export default function LiveView({ 
  matches, 
  phase, 
  timeRemaining,
  isBreak,
  onMatchClick
}: { 
  matches: Match[], 
  phase: string, 
  timeRemaining: number,
  isBreak: boolean,
  onMatchClick: (m: Match) => void 
}) {
  const dateObj = matches.length > 0 && matches[0].timestamp ? new Date(matches[0].timestamp) : new Date();
  const timeStr = `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}`;

  return (
    <div className="bg-[#131324] min-h-full pb-24">
      {/* Live Header */}
      <div className="bg-[#1e1e38] p-4 border-b border-gray-800 sticky top-0 z-10">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            Virtual League
            {!isBreak && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded animate-pulse">LIVE</span>}
          </h2>
          <div className="text-[#facc15] font-mono text-xl font-bold">
            {!isBreak ? timeStr : '--:--'}
          </div>
        </div>
        
        <div className="flex items-center justify-between bg-[#131324] rounded-lg p-3 border border-gray-700">
          <div className="flex items-center gap-3">
            {phase === 'OPEN' && <Clock className="text-blue-400" size={24} />}
            {phase === 'PLAYING' && <PlayCircle className="text-green-400" size={24} />}
            {phase === 'FINISHED' && <CheckCircle2 className="text-gray-400" size={24} />}
            {phase === 'BREAK' && <Clock className="text-yellow-400" size={24} />}
            
            <div>
              <div className="text-xs text-gray-400 uppercase font-bold">Current Phase</div>
              <div className={`font-bold ${
                phase === 'OPEN' ? 'text-blue-400' : 
                phase === 'PLAYING' ? 'text-green-400' : 
                phase === 'BREAK' ? 'text-yellow-400' : 'text-gray-400'
              }`}>
                {phase === 'OPEN' ? 'BETTING OPEN' : 
                 phase === 'PLAYING' ? 'MATCH IN PROGRESS' : 
                 phase === 'BREAK' ? 'LEAGUE BREAK' : 'RESULTS'}
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-xs text-gray-400 uppercase font-bold">Time Left</div>
            <div className="text-xl font-mono text-white">
              {Math.floor(timeRemaining / 60).toString().padStart(2, '0')}:{Math.floor(timeRemaining % 60).toString().padStart(2, '0')}
            </div>
          </div>
        </div>
      </div>

      {isBreak ? (
        <div className="flex flex-col items-center justify-center p-12 text-center mt-10">
          <div className="text-5xl mb-6">☕</div>
          <h3 className="text-xl font-bold text-white mb-3">League Break</h3>
          <p className="text-gray-400 text-sm leading-relaxed">The current cycle has finished. A new cycle of 20 matches will begin shortly. Get ready for the next round of betting!</p>
        </div>
      ) : (
        <div className="p-2 space-y-4">
          {matches.length > 0 && matches[0].isNewCycle && (
            <div className="bg-blue-600 text-white text-center py-2 rounded font-bold text-sm animate-pulse flex items-center justify-center gap-2">
              <span>🆕</span> NEW CYCLE STARTED
            </div>
          )}
          {Object.entries(
            matches.reduce((acc, match) => {
              if (!acc[match.league]) acc[match.league] = [];
              acc[match.league].push(match);
              return acc;
            }, {} as Record<string, Match[]>)
          ).map(([league, leagueMatches]) => (
            <div key={league} className="space-y-2">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2">
                {league}
              </div>
              {leagueMatches.map((match) => (
                <div 
                  key={match.id} 
                  className="bg-[#1e1e38] rounded-lg p-3 border border-gray-800 cursor-pointer hover:border-gray-600 transition-colors"
                  onClick={() => onMatchClick(match)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-400">Slot {match.time}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      phase === 'OPEN' ? 'bg-blue-500/20 text-blue-400' : 
                      phase === 'PLAYING' ? 'bg-green-500/20 text-green-400 animate-pulse' : 
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {phase}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="w-[40%] text-right font-medium text-sm text-white">{match.homeTeam.name}</div>
                    
                    <div className="w-[20%] flex justify-center">
                      {phase === 'OPEN' ? (
                        <div className="text-gray-500 font-bold text-sm">VS</div>
                      ) : (
                        <div className="flex items-center gap-2 bg-[#131324] px-3 py-1 rounded border border-gray-700">
                          <span className="font-bold text-[#facc15]">{match.score?.home ?? 0}</span>
                          <span className="text-gray-500">-</span>
                          <span className="font-bold text-[#facc15]">{match.score?.away ?? 0}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="w-[40%] text-left font-medium text-sm text-white">{match.awayTeam.name}</div>
                  </div>
                  
                  {phase === 'OPEN' && (
                    <div className="flex justify-center gap-2 mt-3">
                      <div className="bg-[#131324] px-4 py-1.5 rounded text-xs border border-gray-700 text-center w-16 text-white">
                        <div className="text-gray-500 mb-0.5">1</div>
                        <div className="font-bold">{match.odds.home.toFixed(2)}</div>
                      </div>
                      <div className="bg-[#131324] px-4 py-1.5 rounded text-xs border border-gray-700 text-center w-16 text-white">
                        <div className="text-gray-500 mb-0.5">X</div>
                        <div className="font-bold">{match.odds.draw.toFixed(2)}</div>
                      </div>
                      <div className="bg-[#131324] px-4 py-1.5 rounded text-xs border border-gray-700 text-center w-16 text-white">
                        <div className="text-gray-500 mb-0.5">2</div>
                        <div className="font-bold">{match.odds.away.toFixed(2)}</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
