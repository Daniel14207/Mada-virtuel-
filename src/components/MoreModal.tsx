import { LeagueMode } from '../services/virtualLeagueService';

interface MoreModalProps {
  onClose: () => void;
  leagueMode: LeagueMode;
  setLeagueMode: (mode: LeagueMode) => void;
}

export default function MoreModal({ onClose, leagueMode, setLeagueMode }: MoreModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end">
      <div className="bg-[#0f172a] w-full rounded-t-3xl p-6 pb-24 animate-in slide-in-from-bottom-full duration-300">
        <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mb-6"></div>
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">More</h2>
          <button onClick={onClose} className="px-4 py-1.5 rounded-full border border-gray-600 text-sm text-white">
            Fermer
          </button>
        </div>
        
        <div className="space-y-6">
          <div className="bg-[#1e293b] rounded-xl p-4 flex items-center justify-between border border-gray-700">
            <div>
              <h3 className="text-white font-bold text-sm">League Speed</h3>
              <p className="text-gray-400 text-xs mt-1">
                {leagueMode === 'FAST' ? '2 min slots' : '5 min slots'}
              </p>
            </div>
            <div className="flex bg-black/50 rounded-lg p-1">
              <button
                onClick={() => setLeagueMode('FAST')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
                  leagueMode === 'FAST' ? 'bg-[#facc15] text-black' : 'text-gray-400'
                }`}
              >
                FAST
              </button>
              <button
                onClick={() => setLeagueMode('NORMAL')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
                  leagueMode === 'NORMAL' ? 'bg-[#facc15] text-black' : 'text-gray-400'
                }`}
              >
                NORMAL
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-[#facc15] font-bold mb-3">Pronostics 85% de réussite</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl p-4 cursor-pointer">
                <div className="text-black font-bold text-sm mb-4">Matchs et cotes</div>
                <div className="text-green-600 text-xs font-bold">Ouvrir</div>
              </div>
              <div className="bg-white rounded-xl p-4 cursor-pointer">
                <div className="text-black font-bold text-sm mb-4">Matchs du jour</div>
                <div className="text-green-600 text-xs font-bold">Ouvrir</div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-[#facc15] font-bold mb-3">Pronostics sûrs du jour</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl p-4 cursor-pointer">
                <div className="text-black font-bold text-sm mb-4">Over/Under</div>
                <div className="text-green-600 text-xs font-bold">Ouvrir</div>
              </div>
              <div className="bg-white rounded-xl p-4 cursor-pointer">
                <div className="text-black font-bold text-sm mb-4">BTTS</div>
                <div className="text-green-600 text-xs font-bold">Ouvrir</div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-[#facc15] font-bold mb-3">Exclusif VIP</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#1e293b] border border-[#facc15] rounded-xl p-4 cursor-pointer relative">
                <div className="text-white font-bold text-sm mb-4">Over 2.5</div>
                <div className="text-white text-xs font-bold">Ouvrir</div>
                <span className="absolute top-3 right-3 bg-[#facc15] text-black text-[10px] font-bold px-2 py-0.5 rounded">Vip</span>
              </div>
              <div className="bg-[#1e293b] border border-[#facc15] rounded-xl p-4 cursor-pointer relative">
                <div className="text-white font-bold text-sm mb-4">BTTS - Oui</div>
                <div className="text-white text-xs font-bold">Ouvrir</div>
                <span className="absolute top-3 right-3 bg-[#facc15] text-black text-[10px] font-bold px-2 py-0.5 rounded">Vip</span>
              </div>
              <div className="bg-[#1e293b] border border-[#facc15] rounded-xl p-4 cursor-pointer relative">
                <div className="text-white font-bold text-sm mb-4">Under 2.5</div>
                <div className="text-white text-xs font-bold">Ouvrir</div>
                <span className="absolute top-3 right-3 bg-[#facc15] text-black text-[10px] font-bold px-2 py-0.5 rounded">Vip</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
