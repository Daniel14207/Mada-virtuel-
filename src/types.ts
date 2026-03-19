export interface Team {
  id: string;
  name: string;
  league?: string;
  stats: {
    matches: number;
    wins: number;
    draws: number;
    losses: number;
    goalsScored: number;
    goalsConceded: number;
    last5: ('W' | 'D' | 'L')[];
  };
}

export interface MatchPrediction {
  matchCible: {
    bestPrediction: '1' | 'X' | '2';
    exactScore: string;
    confidence: number;
  };
  safeBets: string[];
  advanced: string[];
  vip: string[];
  riskLevel: 'SAFE' | 'MEDIUM' | 'HIGH RISK';
  winProbabilities: {
    home: number;
    draw: number;
    away: number;
  };
  expectedGoals: {
    home: number;
    away: number;
  };
}

export interface Match {
  id: string;
  league: string;
  homeTeam: Team;
  awayTeam: Team;
  date: string;
  time: string;
  timestamp?: number;
  status: 'NS' | 'LIVE' | 'FT' | 'OPEN' | 'PLAYING' | 'FINISHED' | 'BREAK';
  score?: { home: number; away: number };
  odds: { home: number; draw: number; away: number };
  prediction?: MatchPrediction;
  isNewCycle?: boolean;
}
