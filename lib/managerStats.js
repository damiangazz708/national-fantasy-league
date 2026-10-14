import league from '../data/league.json';

export const teams = league.teams;
export const seasons = [2025, 2026];
export const fmt = (n) => (Math.round((Number(n) + Number.EPSILON) * 100) / 100).toFixed(2);
export const percentage = (w, l, t = 0) => (w + l + t ? `${((w + t / 2) / (w + l + t) * 100).toFixed(1)}%` : '—');
export const getManager = id => teams.find(t => t.id === id);
export const activeSeasons = team => seasons.filter(y => league.matchups.some(g => g.season === y && (g.home === team.name || g.away === team.name)) || league.byes.some(g => g.season === y && g.team === team.name));

export function summary(team, year = 'All') {
  const filtered = year === 'All' ? () => true : g => g.season === Number(year);
  const games = league.matchups.filter(g => filtered(g) && (g.home === team.name || g.away === team.name)).map(g => ({
    season: g.season, week: g.week, opponent: g.home === team.name ? g.away : g.home,
    score: g.home === team.name ? g.homeScore : g.awayScore,
    against: g.home === team.name ? g.awayScore : g.homeScore,
  })).map(g => ({...g, result: g.score > g.against ? 'W' : g.score < g.against ? 'L' : 'T', margin: g.score - g.against}));
  const byes = league.byes.filter(b => filtered(b) && b.team === team.name);
  const w = games.filter(g => g.result === 'W').length;
  const l = games.filter(g => g.result === 'L').length;
  const t = games.filter(g => g.result === 'T').length;
  // Bye scores count towards fantasy points, but never wins, losses or points against.
  const pf = games.reduce((s, g) => s + g.score, 0) + byes.reduce((s, b) => s + b.score, 0);
  const pa = games.reduce((s, g) => s + g.against, 0);
  const weeklyScores = [...games.map(g => ({season:g.season,week:g.week,score:g.score,bye:false,opponent:g.opponent})), ...byes.map(b => ({season:b.season,week:b.week,score:b.score,bye:true,opponent:null}))].sort((a,b) => b.season-a.season || b.week-a.week);
  const playoffGames = league.playoffs.filter(g => filtered(g) && (g.home === team.name || g.away === team.name)).map(g => {
    const isHome = g.home === team.name;
    const score = isHome ? g.homeScore : g.awayScore;
    const against = isHome ? g.awayScore : g.homeScore;
    return {...g, score, against, opponent: isHome ? g.away : g.home, result:score>against?'W':score<against?'L':'T'};
  });
  const titles = league.champions.filter(c => filtered(c) && c.champion === team.name).length;
  const finals = league.champions.filter(c => filtered(c) && (c.champion === team.name || c.runnerUp === team.name)).length;
  const scored = weeklyScores.length;
  return {team, games, byes, weeklyScores, w, l, t, pf, pa, pointDiff:pf-pa, avg: scored ? pf/scored : 0, scored, high: weeklyScores.length ? [...weeklyScores].sort((a,b)=>b.score-a.score)[0] : null, bestWin: games.filter(g=>g.result==='W').sort((a,b)=>b.margin-a.margin)[0] || null, playoffGames, playoffW:playoffGames.filter(g=>g.result==='W').length, playoffL:playoffGames.filter(g=>g.result==='L').length, titles, finals, seasons:activeSeasons(team)};
}

export function opponentBreakdown(team) {
  return teams.filter(t => t.id !== team.id).map(other => {
    const h2h = summary(team).games.filter(g => g.opponent === other.name);
    return {other, games:h2h.length, w:h2h.filter(g=>g.result==='W').length,l:h2h.filter(g=>g.result==='L').length, t:h2h.filter(g=>g.result==='T').length};
  }).filter(t=>t.games).sort((a,b)=>b.games-a.games || b.w-a.w);
}
