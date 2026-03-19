import { Team, Match } from '../types';
import { generatePrediction } from './predictionService';

function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

const leaguesData = {
  "English League": [
    "Arsenal", "Chelsea", "Liverpool", "Man City", "Man Utd", "Tottenham", "Aston Villa", "Newcastle"
  ],
  "Champions League": [
    "Real Madrid", "Barcelona", "Bayern", "PSG", "Juventus", "Inter", "AC Milan", "Dortmund"
  ],
  "Africa Cup": [
    "Senegal", "Egypt", "Morocco", "Nigeria", "Cameroon", "Algeria", "Ivory Coast", "Ghana"
  ],
  "Italian League": [
    "Juventus", "Inter", "AC Milan", "Napoli", "Roma", "Lazio", "Atalanta", "Fiorentina"
  ],
  "Spanish League": [
    "Real Madrid", "Barcelona", "Atletico", "Sevilla", "Valencia", "Villarreal", "Betis", "Sociedad"
  ],
  "French League": [
    "PSG", "Marseille", "Lyon", "Monaco", "Lille", "Rennes", "Nice", "Lens"
  ],
  "German League": [
    "Bayern", "Dortmund", "Leipzig", "Leverkusen", "Wolfsburg", "Monchengladbach", "Frankfurt", "Stuttgart"
  ],
  "Portuguese League": [
    "Benfica", "Porto", "Sporting", "Braga", "Vitoria", "Boavista", "Maritimo", "Rio Ave"
  ]
};

export const virtualTeams: Team[] = Object.entries(leaguesData).flatMap(([league, teams]) => 
  teams.map((name, index) => {
    const quality = seededRandom(index + name.length);
    return {
      id: `t_${league}_${index}`,
      name,
      league,
      stats: {
        matches: 30,
        wins: Math.floor(10 + quality * 15),
        draws: Math.floor(5 + seededRandom(index + 100) * 10),
        losses: Math.floor(15 - quality * 15),
        goalsScored: Math.floor(30 + quality * 50),
        goalsConceded: Math.floor(50 - quality * 30),
        last5: Array(5).fill(0).map((_, i) => {
          const r = seededRandom(index + i * 10);
          return r > 0.5 ? (r > 0.75 ? 'W' : 'D') : 'L';
        })
      }
    };
  })
);

export type LeagueMode = 'FAST' | 'NORMAL';

export const getCycleConfig = (mode: LeagueMode) => {
  const SLOT_INTERVAL_MS = mode === 'FAST' ? 2 * 60 * 1000 : 5 * 60 * 1000;
  const CYCLE_SLOTS = 20;
  const JUMP_MS = 5 * 60 * 1000; // 5 minutes jump after slot 20
  const CYCLE_DURATION_MS = (CYCLE_SLOTS - 1) * SLOT_INTERVAL_MS + JUMP_MS;
  
  const PHASE_BETTING_MS = mode === 'FAST' ? 40 * 1000 : 60 * 1000;
  const PHASE_PLAYING_MS = mode === 'FAST' ? 60 * 1000 : 3 * 60 * 1000;
  const PHASE_RESULT_MS = mode === 'FAST' ? 20 * 1000 : 60 * 1000;

  return {
    SLOT_INTERVAL_MS,
    CYCLE_SLOTS,
    JUMP_MS,
    CYCLE_DURATION_MS,
    PHASE_BETTING_MS,
    PHASE_PLAYING_MS,
    PHASE_RESULT_MS
  };
};

export function getCurrentLeagueState(mode: LeagueMode = 'FAST') {
  const config = getCycleConfig(mode);
  const now = Date.now();
  const cycleIndex = Math.floor(now / config.CYCLE_DURATION_MS);
  const timeInCycle = now % config.CYCLE_DURATION_MS;
  
  const activeCycleTime = config.CYCLE_SLOTS * config.SLOT_INTERVAL_MS;
  
  if (timeInCycle < activeCycleTime) {
    const slotIndex = Math.floor(timeInCycle / config.SLOT_INTERVAL_MS);
    const currentSlotTimestamp = cycleIndex * config.CYCLE_DURATION_MS + slotIndex * config.SLOT_INTERVAL_MS;
    return {
      isBreak: false,
      currentSlotTimestamp,
      slotIndex,
      cycleIndex,
      timeInSlot: timeInCycle % config.SLOT_INTERVAL_MS
    };
  } else {
    // In break
    const nextCycleTimestamp = (cycleIndex + 1) * config.CYCLE_DURATION_MS;
    return {
      isBreak: true,
      currentSlotTimestamp: nextCycleTimestamp,
      slotIndex: 0,
      cycleIndex: cycleIndex + 1,
      timeInSlot: 0,
      breakTimeRemaining: config.CYCLE_DURATION_MS - timeInCycle
    };
  }
}

export function generateMatchesForSlot(
  timestamp: number, 
  isNewCycle: boolean = false,
  slotIndex: number = 0,
  cycleIndex: number = 0
): Match[] {
  const matches: Match[] = [];
  
  const leagues = Object.keys(leaguesData);
  let matchIndex = 0;

  for (const leagueName of leagues) {
    const leagueTeams = virtualTeams.filter(t => t.league === leagueName);
    
    const n = leagueTeams.length;
    const matchesPerRound = n / 2;
    const matchesPerSlot = 2;
    const slotsPerRound = matchesPerRound / matchesPerSlot;
    
    const round = Math.floor(slotIndex / slotsPerRound);
    const half = slotIndex % slotsPerRound;
    
    const matchups = [];
    
    // Shuffle teams deterministically per cycle
    const shuffledTeams = [...leagueTeams];
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(seededRandom(cycleIndex * 1000 + i + leagueName.length) * (i + 1));
      [shuffledTeams[i], shuffledTeams[j]] = [shuffledTeams[j], shuffledTeams[i]];
    }

    const actualRound = round % (n - 1);
    
    const others = shuffledTeams.slice(1);
    for (let i = 0; i < actualRound; i++) {
      others.unshift(others.pop()!);
    }
    
    const currentOrder = [shuffledTeams[0], ...others];
    
    for (let i = 0; i < matchesPerRound; i++) {
      let home = currentOrder[i];
      let away = currentOrder[n - 1 - i];
      
      // Alternate home/away based on round and cycle
      if ((actualRound + i + cycleIndex) % 2 === 1) {
        [home, away] = [away, home];
      }
      
      matchups.push([home, away]);
    }
    
    const slotMatchups = matchups.slice(half * matchesPerSlot, (half + 1) * matchesPerSlot);
    
    for (const [homeTeam, awayTeam] of slotMatchups) {
      if (!homeTeam || !awayTeam) continue;
      
      const dateObj = new Date(timestamp);
      const timeStr = `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}`;
      
      const match: Match = {
        id: `m_${timestamp}_${matchIndex}`,
        league: leagueName,
        homeTeam,
        awayTeam,
        date: dateObj.toISOString().split('T')[0],
        time: timeStr,
        timestamp,
        status: 'OPEN',
        odds: { home: 0, draw: 0, away: 0 },
        isNewCycle
      };
      
      match.prediction = generatePrediction(homeTeam, awayTeam);
      match.odds = {
        home: Number((100 / match.prediction.winProbabilities.home).toFixed(2)),
        draw: Number((100 / match.prediction.winProbabilities.draw).toFixed(2)),
        away: Number((100 / match.prediction.winProbabilities.away).toFixed(2))
      };
      
      matches.push(match);
      matchIndex++;
    }
  }
  
  return matches;
}

export function simulateMatchScore(match: Match, seedOffset: number): { home: number, away: number } {
  const homeXG = match.prediction!.expectedGoals.home;
  const awayXG = match.prediction!.expectedGoals.away;
  
  const generateGoals = (xg: number, seed: number) => {
    let goals = 0;
    let r = seededRandom(seed);
    if (xg < 0.5) {
      if (r < 0.6) goals = 0;
      else if (r < 0.9) goals = 1;
      else goals = 2;
    } else if (xg < 1.5) {
      if (r < 0.3) goals = 0;
      else if (r < 0.7) goals = 1;
      else if (r < 0.9) goals = 2;
      else goals = 3;
    } else {
      if (r < 0.1) goals = 0;
      else if (r < 0.4) goals = 1;
      else if (r < 0.7) goals = 2;
      else if (r < 0.9) goals = 3;
      else goals = 4;
    }
    return goals;
  };

  return {
    home: generateGoals(homeXG, (match.timestamp || 0) + seedOffset),
    away: generateGoals(awayXG, (match.timestamp || 0) + seedOffset + 1)
  };
}
