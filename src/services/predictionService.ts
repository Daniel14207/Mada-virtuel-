import { Team, MatchPrediction } from '../types';

export function calculateTeamPower(team: Team) {
  const attackStrength = team.stats.goalsScored / team.stats.matches;
  const defenseWeakness = team.stats.goalsConceded / team.stats.matches;
  
  const formScore = team.stats.last5.reduce((acc, result) => {
    if (result === 'W') return acc + 3;
    if (result === 'D') return acc + 1;
    return acc;
  }, 0);
  
  const powerScore = (attackStrength * 0.4) + (formScore * 0.4) - (defenseWeakness * 0.2);
  
  return { attackStrength, defenseWeakness, formScore, powerScore };
}

export function generatePrediction(homeTeam: Team, awayTeam: Team): MatchPrediction {
  const homePower = calculateTeamPower(homeTeam);
  const awayPower = calculateTeamPower(awayTeam);
  
  const totalPower = homePower.powerScore + awayPower.powerScore;
  
  // Base probabilities
  let homeProb = (homePower.powerScore / totalPower) * 100;
  let awayProb = (awayPower.powerScore / totalPower) * 100;
  
  const powerDiff = Math.abs(homePower.powerScore - awayPower.powerScore);
  let drawProb = Math.max(10, 35 - (powerDiff * 2));
  
  const remainingProb = 100 - drawProb;
  homeProb = (homeProb / (homeProb + awayProb)) * remainingProb;
  awayProb = (awayProb / (homeProb + awayProb)) * remainingProb;
  
  const homeXG = homePower.attackStrength * awayPower.defenseWeakness;
  const awayXG = awayPower.attackStrength * homePower.defenseWeakness;
  
  const predictedHomeGoals = Math.round(homeXG);
  const predictedAwayGoals = Math.round(awayXG);
  
  let bestPrediction: '1' | 'X' | '2' = 'X';
  let confidence = drawProb;
  
  if (homeProb > awayProb && homeProb > drawProb) {
    bestPrediction = '1';
    confidence = homeProb;
  } else if (awayProb > homeProb && awayProb > drawProb) {
    bestPrediction = '2';
    confidence = awayProb;
  }
  
  let riskLevel: 'SAFE' | 'MEDIUM' | 'HIGH RISK' = 'HIGH RISK';
  if (confidence > 65) riskLevel = 'SAFE';
  else if (confidence > 45) riskLevel = 'MEDIUM';
  
  const totalXG = homeXG + awayXG;
  
  const safeBets = [];
  if (totalXG > 1.5) safeBets.push('Over 1.5');
  if (totalXG < 4.5) safeBets.push('Under 4.5');
  if (bestPrediction === '1') safeBets.push('1X');
  if (bestPrediction === '2') safeBets.push('X2');
  
  const advanced = [];
  if (homeXG > 0.8 && awayXG > 0.8) advanced.push('BTTS - Yes');
  else advanced.push('BTTS - No');
  if (totalXG > 2.5) advanced.push('Over 2.5');
  if (awayXG < 0.5) advanced.push('Home Clean Sheet');
  
  const vip = [];
  vip.push(`Exact Score: ${predictedHomeGoals}-${predictedAwayGoals}`);
  if (bestPrediction === '1' && homeXG > 1.5) vip.push('1 & Over 1.5');
  if (confidence > 60) vip.push('Combo: ' + bestPrediction + ' & ' + (totalXG > 1.5 ? 'Over 1.5' : 'Under 3.5'));
  
  return {
    matchCible: {
      bestPrediction,
      exactScore: `${predictedHomeGoals}-${predictedAwayGoals}`,
      confidence: Math.round(confidence)
    },
    safeBets,
    advanced,
    vip,
    riskLevel,
    winProbabilities: {
      home: Math.round(homeProb),
      draw: Math.round(drawProb),
      away: Math.round(awayProb)
    },
    expectedGoals: {
      home: Number(homeXG.toFixed(2)),
      away: Number(awayXG.toFixed(2))
    }
  };
}
