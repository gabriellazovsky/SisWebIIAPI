import { useState, useEffect } from "react";
import { API } from "../App.jsx";

export function useRaceLookup(season) {
  const [lookup, setLookup] = useState({});

  useEffect(() => {
    if (!season) return;
    fetch(`${API}/races?season=${season}&limit=30`)
      .then(r => r.json())
      .then(d => {
        const map = {};
        const list = Array.isArray(d) ? d : [];
        list.forEach(r => { map[r.raceId] = `${r.name} (${r.year} R${r.round})`; });
        setLookup(map);
      })
      .catch(() => {});
  }, [season]);

  function raceName(raceId) {
    return lookup[raceId] || `Race ${raceId}`;
  }

  return raceName;
}

export function Spinner() {
  return (
    <div className="loading">
      <div className="ld"/><div className="ld"/><div className="ld"/>
    </div>
  );
}

export function Pager({ page, pages, total, onPage }) {
  if (!pages || pages <= 1) return (
    <div className="pag">
      <div className="pag-info">{(total||0).toLocaleString()} records</div>
      <div/>
    </div>
  );
  const start = Math.max(1, page - 3);
  const end   = Math.min(pages, start + 6);
  const nums  = [];
  for (let i = start; i <= end; i++) nums.push(i);
  return (
    <div className="pag">
      <div className="pag-info">{(total||0).toLocaleString()} records — page {page} of {pages.toLocaleString()}</div>
      <div className="pag-btns">
        {page > 1     && <button className="pag-btn" onClick={() => onPage(page-1)}>‹</button>}
        {nums.map(p   => <button key={p} className={"pag-btn"+(p===page?" on":"")} onClick={() => onPage(p)}>{p}</button>)}
        {page < pages && <button className="pag-btn" onClick={() => onPage(page+1)}>›</button>}
      </div>
    </div>
  );
}