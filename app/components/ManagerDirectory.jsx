'use client';
import {useMemo, useState} from 'react';
import {teams, summary, percentage, fmt} from '../../lib/managerStats';

const initials = name => name ? name.split(' ').map(x=>x.charAt(0)).slice(0,2).join('').toUpperCase() : '?';

export default function ManagerDirectory() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const items = useMemo(()=>teams.filter(t => (filter==='All' || (filter==='Active' ? t.status==='Active' : t.status!=='Active')) && `${t.name} ${t.manager||''}`.toLowerCase().includes(query.toLowerCase())).sort((a,b)=>{
    const sa=summary(a),sb=summary(b);
    return sb.w-sa.w || sb.pf-sa.pf;
  }),[query,filter]);
  return <div className="manager-directory">
    <div className="manager-intro"><div><h2>Meet the managers</h2><p>Eleven franchises have been part of the NFL since the inaugural 2025 season. Tap a profile to explore its full history.</p></div><span className="manager-count">{teams.length} historical franchises</span></div>
    <div className="manager-toolbar">
      <input aria-label="Search managers or teams" placeholder="Search manager or franchise..." value={query} onChange={e=>setQuery(e.target.value)}/>
      <div className="manager-filter" aria-label="Status filter">{['All','Active','Inactive'].map(x=><button type="button" key={x} className={filter===x?'selected':''} onClick={()=>setFilter(x)}>{x}</button>)}</div>
    </div>
    <div className="manager-cards">{items.map(t=>{const s=summary(t);return <a key={t.id} className="manager-profile-card" href={`/managers/${t.id}`}>
      <div className="manager-profile-card-top"><div className="manager-placeholder" aria-hidden="true">{initials(t.manager)}</div><div className="manager-identity"><h3>{t.manager||'Manager to be confirmed'}</h3><p>{t.name}</p></div></div>
      <span className={`manager-status ${t.status==='Active'?'status-active':''}`}>{t.status}</span>
      <div className="manager-card-stats"><div><b>{s.w}–{s.l}</b><span>CAREER RECORD</span></div><div><b>{percentage(s.w,s.l,s.t)}</b><span>WIN %</span></div><div><b>{s.titles}</b><span>TITLES</span></div></div>
      <span className="manager-profile-link">View full profile <span aria-hidden="true">→</span></span>
    </a>})}</div>
    {!items.length && <p className="manager-empty">No managers match your search.</p>}
  </div>;
}
