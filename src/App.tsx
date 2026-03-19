/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import TopBar from './components/TopBar';
import BottomNav from './components/BottomNav';
import DateSelector from './components/DateSelector';
import TipsView from './components/TipsView';
import PremiumView from './components/PremiumView';
import LiveView from './components/LiveView';
import MoreModal from './components/MoreModal';
import PredictionModal from './components/PredictionModal';
import { useVirtualLeague } from './hooks/useVirtualLeague';
import { Match } from './types';
import { LeagueMode } from './services/virtualLeagueService';

export default function App() {
  const [activeTab, setActiveTab] = useState('TIPS');
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [leagueMode, setLeagueMode] = useState<LeagueMode>('FAST');

  const { liveMatches, upcomingMatches, phase, timeRemaining, isBreak } = useVirtualLeague(leagueMode);

  const handleTabChange = (tab: string) => {
    if (tab === 'MORE') {
      setIsMoreOpen(true);
    } else {
      setActiveTab(tab);
    }
  };

  const allMatches = [...liveMatches, ...upcomingMatches];

  return (
    <div className="flex flex-col h-screen bg-[#131324] text-white font-sans overflow-hidden relative">
      <TopBar title={activeTab === 'BEST' ? 'Pronostics premium' : activeTab === 'LIVE' ? 'Live Virtual' : 'Betting Tips'} />
      
      <div className="flex-1 overflow-y-auto pb-16">
        {activeTab !== 'LIVE' && <DateSelector variant={activeTab === 'BEST' ? 'premium' : 'tips'} />}
        
        {activeTab === 'TIPS' && <TipsView matches={allMatches} onMatchClick={setSelectedMatch} />}
        {activeTab === 'BEST' && <PremiumView matches={allMatches} onMatchClick={setSelectedMatch} />}
        {activeTab === 'LIVE' && <LiveView matches={liveMatches} phase={phase} timeRemaining={timeRemaining} isBreak={isBreak} onMatchClick={setSelectedMatch} />}
        
        {['FREE', 'VIP', 'HT-FT'].includes(activeTab) && (
          <div className="p-8 text-center text-gray-400">
            Select TIPS, BEST, or LIVE to see the main views.
          </div>
        )}
      </div>

      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
      
      {isMoreOpen && <MoreModal onClose={() => setIsMoreOpen(false)} leagueMode={leagueMode} setLeagueMode={setLeagueMode} />}
      {selectedMatch && <PredictionModal match={selectedMatch} onClose={() => setSelectedMatch(null)} />}
    </div>
  );
}
