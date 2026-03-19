import { Team, Match } from '../types';
import { generatePrediction } from '../services/predictionService';

const teams: Record<string, Team> = {
  palmeiras: { id: '1', name: 'Palmeiras', stats: { matches: 20, wins: 12, draws: 5, losses: 3, goalsScored: 35, goalsConceded: 15, last5: ['W', 'W', 'D', 'W', 'L'] } },
  botafogo: { id: '2', name: 'Botafogo', stats: { matches: 20, wins: 8, draws: 6, losses: 6, goalsScored: 25, goalsConceded: 22, last5: ['D', 'L', 'W', 'D', 'L'] } },
  bahia: { id: '3', name: 'Bahia', stats: { matches: 20, wins: 10, draws: 4, losses: 6, goalsScored: 28, goalsConceded: 20, last5: ['W', 'L', 'W', 'W', 'D'] } },
  bragantino: { id: '4', name: 'Red Bull Bragantino', stats: { matches: 20, wins: 7, draws: 8, losses: 5, goalsScored: 22, goalsConceded: 18, last5: ['D', 'D', 'L', 'W', 'D'] } },
  pasto: { id: '5', name: 'Deportivo Pasto', stats: { matches: 15, wins: 9, draws: 3, losses: 3, goalsScored: 20, goalsConceded: 10, last5: ['W', 'W', 'W', 'D', 'L'] } },
  chico: { id: '6', name: 'Chico FC', stats: { matches: 15, wins: 4, draws: 5, losses: 6, goalsScored: 12, goalsConceded: 18, last5: ['L', 'D', 'L', 'W', 'D'] } },
  athletico: { id: '7', name: 'Athletico', stats: { matches: 20, wins: 9, draws: 5, losses: 6, goalsScored: 24, goalsConceded: 20, last5: ['W', 'L', 'D', 'W', 'W'] } },
  cruzeiro: { id: '8', name: 'Cruzeiro', stats: { matches: 20, wins: 8, draws: 7, losses: 5, goalsScored: 21, goalsConceded: 19, last5: ['D', 'D', 'W', 'L', 'D'] } },
};

export const matches: Match[] = [
  {
    id: 'm1',
    league: 'Brazil - Brasileirão Betano',
    homeTeam: teams.palmeiras,
    awayTeam: teams.botafogo,
    date: '2026-03-19',
    time: '01:00',
    status: 'FT',
    score: { home: 2, away: 1 },
    odds: { home: 1.46, draw: 4.10, away: 7.00 },
  },
  {
    id: 'm2',
    league: 'Brazil - Brasileirão Betano',
    homeTeam: teams.bahia,
    awayTeam: teams.bragantino,
    date: '2026-03-19',
    time: '01:00',
    status: 'FT',
    score: { home: 2, away: 0 },
    odds: { home: 1.61, draw: 3.75, away: 5.50 },
  },
  {
    id: 'm3',
    league: 'Brazil - Brasileirão Betano',
    homeTeam: teams.athletico,
    awayTeam: teams.cruzeiro,
    date: '2026-03-19',
    time: '01:30',
    status: 'FT',
    score: { home: 2, away: 1 },
    odds: { home: 2.10, draw: 3.20, away: 3.60 },
  },
  {
    id: 'm4',
    league: 'Colombia - Primera A',
    homeTeam: teams.pasto,
    awayTeam: teams.chico,
    date: '2026-03-19',
    time: '00:10',
    status: 'FT',
    score: { home: 2, away: 0 },
    odds: { home: 1.40, draw: 4.20, away: 8.50 },
  }
];

matches.forEach(m => {
  m.prediction = generatePrediction(m.homeTeam, m.awayTeam);
});
