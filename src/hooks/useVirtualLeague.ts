import { useState, useEffect, useRef } from 'react';
import { Match } from '../types';
import { 
  getCurrentLeagueState, 
  generateMatchesForSlot, 
  simulateMatchScore,
  getCycleConfig,
  LeagueMode
} from '../services/virtualLeagueService';

export function useVirtualLeague(mode: LeagueMode = 'FAST') {
  const [currentSlot, setCurrentSlot] = useState<number>(0);
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [phase, setPhase] = useState<'OPEN' | 'PLAYING' | 'FINISHED' | 'BREAK'>('OPEN');
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isBreak, setIsBreak] = useState(false);

  // Use refs to avoid stale closures in setInterval
  const liveMatchesRef = useRef<Match[]>([]);
  const currentSlotRef = useRef<number>(0);

  useEffect(() => {
    liveMatchesRef.current = liveMatches;
  }, [liveMatches]);

  useEffect(() => {
    currentSlotRef.current = currentSlot;
  }, [currentSlot]);

  useEffect(() => {
    const updateLeagueState = () => {
      const config = getCycleConfig(mode);
      const state = getCurrentLeagueState(mode);
      
      if (state.isBreak) {
        setIsBreak(true);
        setPhase('BREAK');
        setTimeRemaining(Math.ceil(state.breakTimeRemaining! / 1000));
        setLiveMatches([]);
        
        setUpcomingMatches(prev => {
          if (prev.length > 0 && prev[0].timestamp === state.currentSlotTimestamp) {
            return prev;
          }
          return [
            ...generateMatchesForSlot(state.currentSlotTimestamp, true, 0, state.cycleIndex),
            ...generateMatchesForSlot(state.currentSlotTimestamp + config.SLOT_INTERVAL_MS, false, 1, state.cycleIndex),
            ...generateMatchesForSlot(state.currentSlotTimestamp + 2 * config.SLOT_INTERVAL_MS, false, 2, state.cycleIndex)
          ];
        });
        return;
      }
      
      setIsBreak(false);
      
      if (state.currentSlotTimestamp !== currentSlotRef.current || liveMatchesRef.current.length === 0) {
        setCurrentSlot(state.currentSlotTimestamp);
        const newLiveMatches = generateMatchesForSlot(state.currentSlotTimestamp, state.slotIndex === 0, state.slotIndex, state.cycleIndex);
        setLiveMatches(newLiveMatches);
        liveMatchesRef.current = newLiveMatches;
        
        // Generate upcoming matches
        const upcoming = [];
        for (let i = 1; i <= 3; i++) {
          if (state.slotIndex + i < config.CYCLE_SLOTS) {
            upcoming.push(...generateMatchesForSlot(state.currentSlotTimestamp + i * config.SLOT_INTERVAL_MS, false, state.slotIndex + i, state.cycleIndex));
          }
        }
        setUpcomingMatches(upcoming);
      }
      
      const timeInSlot = state.timeInSlot;
      let currentPhase: 'OPEN' | 'PLAYING' | 'FINISHED' = 'OPEN';
      let remaining = 0;
      
      if (timeInSlot < config.PHASE_BETTING_MS) {
        currentPhase = 'OPEN';
        remaining = Math.ceil((config.PHASE_BETTING_MS - timeInSlot) / 1000);
      } else if (timeInSlot < config.PHASE_BETTING_MS + config.PHASE_PLAYING_MS) {
        currentPhase = 'PLAYING';
        remaining = Math.ceil((config.PHASE_BETTING_MS + config.PHASE_PLAYING_MS - timeInSlot) / 1000);
      } else {
        currentPhase = 'FINISHED';
        remaining = Math.ceil((config.SLOT_INTERVAL_MS - timeInSlot) / 1000);
      }
      
      setPhase(currentPhase);
      setTimeRemaining(remaining);
      
      setLiveMatches(prevMatches => {
        return prevMatches.map((m, i) => {
          const updatedMatch = { ...m, status: currentPhase };
          
          if (currentPhase === 'PLAYING') {
            const progress = (timeInSlot - config.PHASE_BETTING_MS) / config.PHASE_PLAYING_MS;
            const finalScore = simulateMatchScore(m, i);
            updatedMatch.score = {
              home: Math.floor(finalScore.home * progress),
              away: Math.floor(finalScore.away * progress)
            };
          } else if (currentPhase === 'FINISHED') {
            updatedMatch.score = simulateMatchScore(m, i);
          } else {
            updatedMatch.score = undefined;
          }
          
          return updatedMatch;
        });
      });
    };

    updateLeagueState();
    const interval = setInterval(updateLeagueState, 1000);
    return () => clearInterval(interval);
  }, [mode]);

  return { currentSlot, liveMatches, upcomingMatches, phase, timeRemaining, isBreak };
}
