import Link from 'next/link';
import {notFound} from 'next/navigation';
import {teams, seasons, summary, opponentBreakdown, fmt, percentage} from '../../../lib/managerStats';

export function generateStaticParams() {return teams.map(t=>({id:t.id}));}
export async function generateMetadata({params}) {const {id}=await params;const t=teams.find(t=>t.id===id);return {title:t?`${t.manager||t.name} | National Fantasy League`:'Manager Profile | National Fantasy League'};}
const initials = name => name ? name.split(' ').map(x=>x[0]).slice(0,2).join('').toUpperCase() : '?';
const headshots = {
  'Dontae Salvatore': '/Managers/Dontae.png',
  'Jaeson Puleo': '/Managers/Jaeson.png',
  'Holden Axelrod': '/Managers/Holden.png',
  'Ayman Mohammed': '/Managers/Ayman.png',
  'Jake Romano': '/Managers/Jake.png',
  'Anthony Peschell': '/Managers/Anthony.png',
  'Damian Gazzaneo': '/Managers/Damian.png',
  'Dylan Supan': '/Managers/Dylan.png',
  'Isaiah Wyatt': '/Managers/Isaiah.png'
};
const navigation=['Home','Standings','Matchups','Records','Rivalries','Teams','Champions','League History'];

export default async function ManagerProfile({params}) {
  const {id}=await params;
  const team = teams.find(t=>t.id===id);
  if (!team) notFound();
  const all=summary(team);
  const years=seasons.filter(y=>all.seasons.includes(y)).map(y=>({year:y,...summary(team,y)}));
  const rivals=opponentBreakdown(team);
  const scores=[...all.weeklyScores].sort((a,b)=>a.season-b.season||a.week-b.week);
  const maxScore=Math.max(1,...scores.map(g=>g.score));
  const matchupHistory=[...all.games].sort((a,b)=>b.season-a.season||b.week-a.week);
  return <>
    <header className="site-header"><div className="masthead shell"><Link href="/" className="manager-brand"><img src="/nfl-logo.png" width="56" height="56" alt="National Fantasy League logo"/><span><strong>NATIONAL FANTASY LEAGUE</strong><small>OFFICIAL LEAGUE ARCHIVE · EST. 2025</small></span></Link><span className="header-pill">2026 SEASON</span></div><nav className="nav shell" aria-label="Main navigation">{navigation.map(tab=><Link className={tab==='Teams'?'active':''} href={`/?view=${encodeURIComponent(tab)}`} key={tab}>{tab}</Link>)}</nav></header>
    <main className="shell content manager-detail">
      <Link className="manager-back" href="/?view=Teams">← Back to all managers</Link>
      <section className="manager-hero panel">
<div className="manager-placeholder manager-portrait">
  {headshots[team.manager] ? (
    <img
      src={headshots[team.manager]}
      alt={`${team.manager} headshot`}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'center 25%',
        borderRadius: '50%',
        display: 'block'
      }}
    />
  ) : (
    initials(team.manager)
  )}
</div>        <div className="manager-hero-copy"><div className="eyebrow">MANAGER PROFILE · EST. {team.firstSeason}</div><h1>{team.manager||'Manager to be confirmed'}</h1><p className="manager-franchise">{team.name}</p><span className={`manager-status ${team.status==='Active'?'status-active':''}`}>{team.status}</span><p>{all.seasons.join(' & ')} season{all.seasons.length===1?'':'s'} recorded · {team.division2026||team.division2025} Division</p></div>
      </section>
      <section className="manager-kpis" aria-label="Career statistics">
        <div className="manager-kpi"><small>CAREER RECORD</small><b>{all.w}–{all.l}</b><span>{percentage(all.w,all.l,all.t)} win rate</span></div>
        <div className="manager-kpi"><small>CAREER POINTS</small><b>{fmt(all.pf)}</b><span>Regular season incl. byes</span></div>
        <div className="manager-kpi"><small>AVERAGE / WEEK</small><b>{fmt(all.avg)}</b><span>{all.scored} scored weeks</span></div>
        <div className="manager-kpi"><small>CHAMPIONSHIPS</small><b>{all.titles}</b><span>{all.finals} title game{all.finals===1?'':'s'}</span></div>
      </section>
      <section className="manager-columns">
        <div className="panel"><div className="panel-heading"><h2>Season-by-season</h2></div><div className="manager-table-clip"><table className="manager-table"><thead><tr><th>YEAR</th><th>W–L</th><th>WIN %</th><th>PF</th><th>AVG</th></tr></thead><tbody>{years.map(y=><tr key={y.year}><td><strong>{y.year}</strong></td><td>{y.w}–{y.l}</td><td>{percentage(y.w,y.l,y.t)}</td><td>{fmt(y.pf)}</td><td>{fmt(y.avg)}</td></tr>)}</tbody></table></div><p className="manager-note">Bye-week points are included in PF and weekly averages but do not count as games played or wins.</p></div>
        <div className="panel"><h2>Career highlights</h2><div className="manager-fact"><span>Highest weekly score</span><strong>{all.high?fmt(all.high.score):'—'}</strong></div><p className="manager-fact-sub">{all.high?`${all.high.season} · Week ${all.high.week}${all.high.bye?' · Bye week':''}`:'No results yet'}</p><div className="manager-fact"><span>Biggest regular-season win</span><strong>{all.bestWin?`+${fmt(all.bestWin.margin)}`:'—'}</strong></div><p className="manager-fact-sub">{all.bestWin?`vs. ${all.bestWin.opponent} · ${all.bestWin.season} Week ${all.bestWin.week}`:'No wins recorded'}</p><div className="manager-fact"><span>Playoff record</span><strong>{all.playoffW}–{all.playoffL}</strong></div><div className="manager-fact"><span>Championship appearances</span><strong>{all.finals}</strong></div></div>
      </section>
      <section className="panel"><div className="panel-heading"><h2>Weekly scoring history</h2><span className="manager-note">2025–2026 regular season</span></div><div className="manager-score-chart">{scores.map(s=><div className="manager-score-col" key={`${s.season}-${s.week}`} title={`${s.season} W${s.week}: ${fmt(s.score)} pts${s.bye?' (bye)':''}`}><span className="manager-score-value">{Math.round(s.score)}</span><div className={`manager-score-bar ${s.bye?'bye-bar':''}`} style={{height:`${Math.max(6,s.score/maxScore*100)}%`}}/><small>{String(s.season).slice(2)}W{s.week}</small></div>)}</div><p className="manager-note">Gray bars represent bye-week scores. Hover or tap bars for exact scores.</p></section>
      <section className="manager-columns"><div className="panel"><h2>Head-to-head opponents</h2><div className="manager-table-clip"><table className="manager-table"><thead><tr><th>OPPONENT</th><th>GAMES</th><th>W–L</th></tr></thead><tbody>{rivals.map(r=><tr key={r.other.id}><td><Link href={`/managers/${r.other.id}`}>{r.other.name}</Link></td><td>{r.games}</td><td>{r.w}–{r.l}</td></tr>)}</tbody></table></div></div><div className="panel"><h2>Postseason history</h2>{all.playoffGames.length ? <div className="manager-playoff-list">{all.playoffGames.map((g,i)=><div className="manager-playoff-game" key={i}><div><strong>{g.season} · {g.round}</strong><span>vs. {g.opponent}</span></div><div><b className={g.result==='W'?'positive':'negative'}>{g.result}</b><small>{fmt(g.score)}–{fmt(g.against)}</small></div></div>)}</div> : <p>No postseason games recorded yet.</p>}{all.titles>0 && <div className="manager-title-award">🏆 {all.titles}× National Fantasy League Champion</div>}</div></section>
      <section className="panel"><div className="panel-heading"><h2>Full regular-season matchup history</h2><span className="manager-note">{matchupHistory.length} games</span></div><div className="manager-table-clip"><table className="manager-table"><thead><tr><th>SEASON</th><th>WEEK</th><th>OPPONENT</th><th>RESULT</th><th>SCORE</th></tr></thead><tbody>{matchupHistory.map((g,i)=><tr key={i}><td>{g.season}</td><td>W{g.week}</td><td>{g.opponent}</td><td><span className={g.result==='W'?'positive':g.result==='L'?'negative':''}>{g.result}</span></td><td>{fmt(g.score)}–{fmt(g.against)}</td></tr>)}</tbody></table></div></section>
    </main><footer className="footer">NATIONAL FANTASY LEAGUE · EST. 2025 · HISTORICAL STATISTICS THROUGH WEEK 5 OF 2026</footer>
  </>;
}
