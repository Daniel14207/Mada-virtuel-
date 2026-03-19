import { X, Activity, Shield, Zap, AlertTriangle } from 'lucide-react';
import { Match } from '../types';

export default function PredictionModal({ match, onClose }: { match: Match, onClose: () => void }) {
  const p = match.prediction;
  if (!p) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-[#131324] border border-blue-900 w-full max-w-md rounded-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-blue-900/50 bg-[#1e1e38]">
          <h2 className="font-bold text-lg text-white flex items-center gap-2">
            <Zap className="text-[#facc15]" size={20} />
            AI Analysis
          </h2>
          <button onClick={onClose} className="p-1 bg-gray-800 rounded-full text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        
        <div className="overflow-y-auto p-4 space-y-6">
          {/* Match Header */}
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-2">{match.league}</div>
            <div className="flex justify-between items-center px-4">
              <div className="w-1/3 text-right font-bold text-white">{match.homeTeam.name}</div>
              <div className="w-1/3 text-center text-2xl font-black text-[#facc15]">VS</div>
              <div className="w-1/3 text-left font-bold text-white">{match.awayTeam.name}</div>
            </div>
          </div>

          {/* Power Scores */}
          <div className="bg-[#1e1e38] rounded-xl p-4">
            <h3 className="text-sm font-bold text-gray-400 mb-3 flex items-center gap-2">
              <Activity size={16} /> Power Comparison
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1 text-gray-300">
                  <span>Win Probability</span>
                </div>
                <div className="flex h-2 rounded-full overflow-hidden">
                  <div style={{ width: `${p.winProbabilities.home}%` }} className="bg-blue-500"></div>
                  <div style={{ width: `${p.winProbabilities.draw}%` }} className="bg-gray-500"></div>
                  <div style={{ width: `${p.winProbabilities.away}%` }} className="bg-red-500"></div>
                </div>
                <div className="flex justify-between text-[10px] mt-1 text-gray-400">
                  <span>{p.winProbabilities.home}%</span>
                  <span>{p.winProbabilities.draw}%</span>
                  <span>{p.winProbabilities.away}%</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t border-gray-700">
                <div className="text-center">
                  <div className="text-xs text-gray-400">Expected Goals</div>
                  <div className="font-bold text-lg text-blue-400">{p.expectedGoals.home}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-400">Expected Goals</div>
                  <div className="font-bold text-lg text-red-400">{p.expectedGoals.away}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Predictions Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/20 border border-blue-800 rounded-xl p-3">
              <div className="text-[10px] text-blue-300 uppercase font-bold mb-1">Match Cible</div>
              <div className="text-xl font-black text-white">{p.matchCible.bestPrediction}</div>
              <div className="text-xs text-gray-300 mt-1">Conf: <span className="text-[#4ade80]">{p.matchCible.confidence}%</span></div>
              <div className="text-xs text-gray-300">Score: {p.matchCible.exactScore}</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-900/50 to-green-800/20 border border-green-800 rounded-xl p-3">
              <div className="text-[10px] text-green-300 uppercase font-bold mb-1">Safe Bets</div>
              <ul className="text-sm font-bold text-white space-y-1">
                {p.safeBets.map((bet, i) => <li key={i}>✓ {bet}</li>)}
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/20 border border-purple-800 rounded-xl p-3">
              <div className="text-[10px] text-purple-300 uppercase font-bold mb-1">Advanced</div>
              <ul className="text-sm font-bold text-white space-y-1">
                {p.advanced.map((bet, i) => <li key={i}>• {bet}</li>)}
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-900/50 to-yellow-800/20 border border-yellow-800 rounded-xl p-3 relative overflow-hidden">
              <div className="absolute -right-2 -top-2 text-yellow-500/20">
                <Shield size={64} />
              </div>
              <div className="text-[10px] text-yellow-300 uppercase font-bold mb-1 relative z-10">VIP Premium</div>
              <ul className="text-sm font-bold text-white space-y-1 relative z-10">
                {p.vip.map((bet, i) => <li key={i}>★ {bet}</li>)}
              </ul>
            </div>
          </div>
          
          {/* Risk Level */}
          <div className={`rounded-xl p-3 flex items-center justify-center gap-2 font-bold border
            ${p.riskLevel === 'SAFE' ? 'bg-green-900/30 border-green-500 text-green-400' : 
              p.riskLevel === 'MEDIUM' ? 'bg-yellow-900/30 border-yellow-500 text-yellow-400' : 
              'bg-red-900/30 border-red-500 text-red-400'}`}
          >
            <AlertTriangle size={18} />
            RISK LEVEL: {p.riskLevel}
          </div>
        </div>
      </div>
    </div>
  );
}
