import React, { useEffect, useState, useCallback } from "react";
import { API, tc } from "../App.jsx";

function Spinner() {
  return (
    <div className="loading">
      <div className="ld"/><div className="ld"/><div className="ld"/>
    </div>
  );
}

function Pager({ page, pages, total, onPage }) {
  if (!pages || pages <= 1) return (
    <div className="pag"><div className="pag-info">{(total||0).toLocaleString()} records</div><div/></div>
  );
  const start = Math.max(1, page - 3);
  const end   = Math.min(pages, start + 6);
  const nums  = [];
  for (let i = start; i <= end; i++) nums.push(i);
  return (
    <div className="pag">
      <div className="pag-info">{(total||0).toLocaleString()} records — page {page} of {pages}</div>
      <div className="pag-btns">
        {page > 1     && <button className="pag-btn" onClick={() => onPage(page-1)}>‹</button>}
        {nums.map(p   => <button key={p} className={"pag-btn"+(p===page?" on":"")} onClick={() => onPage(p)}>{p}</button>)}
        {page < pages && <button className="pag-btn" onClick={() => onPage(page+1)}>›</button>}
      </div>
    </div>
  );
}

function ResultsTab({ constructorId }) {
  const [data, setData] = useState([]);
  const [pag, setPag]   = useState({});
  const [page, setPage] = useState(1);
  const [loading, setL] = useState(true);

  const load = useCallback(async (p=1) => {
    setL(true);
    try {
      const res  = await fetch(`${API}/constructors/${constructorId}/results?page=${p}&limit=20`);
      const json = await res.json();
      setData(Array.isArray(json) ? json : json.data || []);
      setPag(json.pagination || {});
      setPage(p);
    } catch { setData([]); }
    finally { setL(false); }
  }, [constructorId]);

  useEffect(() => { load(1); }, [load]);

  if (loading) return <Spinner />;
  if (!data.length) return <div className="empty">No results found</div>;

  return (
    <>
      <table className="dtable">
        <thead><tr><th>Race ID</th><th>Points</th><th>Status</th></tr></thead>
        <tbody>
          {data.map((r, i) => (
            <tr key={r._id || i}>
              <td><span className="badge badge-grey">Race {r.raceId}</span></td>
              <td><span className="pts">{r.points}</span></td>
              <td><span className="mono-m">{r.status || "—"}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pager page={page} pages={pag.totalPages} total={pag.total} onPage={load} />
    </>
  );
}

function StandingsTab({ constructorId }) {
  const [data, setData] = useState([]);
  const [loading, setL] = useState(true);

  useEffect(() => {
    fetch(`${API}/constructors/${constructorId}/standings`)
      .then(r => r.json())
      .then(d => { setData(Array.isArray(d) ? d : []); setL(false); })
      .catch(() => setL(false));
  }, [constructorId]);

  if (loading) return <Spinner />;
  if (!data.length) return <div className="empty">No standings found</div>;

  return (
    <table className="dtable">
      <thead><tr><th>Race ID</th><th>Position</th><th>Points</th><th>Wins</th></tr></thead>
      <tbody>
        {data.map((s, i) => (
          <tr key={s._id || i}>
            <td><span className="badge badge-grey">Race {s.raceId}</span></td>
            <td><span className="badge badge-pos">{s.position}</span></td>
            <td><span className="pts">{s.points}</span></td>
            <td><span style={{ color: "var(--teal)" }}>{s.wins}</span></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const TABS = [
  { id: "results",   label: "Results" },
  { id: "standings", label: "Standings" },
];

function ConstructorDetail({ constructor: c, onClose }) {
  const [tab, setTab] = useState("results");

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>

        <div className="modal-header">
          <div style={{
            width: 52, height: 52, borderRadius: 8, flexShrink: 0,
            background: tc(c.constructorId),
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--fd)", fontSize: 22, fontWeight: 900, color: "#fff",
          }}>
            {(c.name||"?")[0]}
          </div>
          <div>
            <div style={{ fontFamily: "var(--fm)", fontSize: 9, color: "var(--red)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>
              Constructor #{c.constructorId} · {c.constructorRef}
            </div>
            <div style={{ fontFamily: "var(--fd)", fontSize: 26, fontWeight: 900, textTransform: "uppercase", letterSpacing: 0.5, lineHeight: 1 }}>
              {c.name}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 8, alignItems: "center" }}>
              <span className="badge badge-grey">{c.nationality}</span>
              {c.url && <a href={c.url} target="_blank" rel="noreferrer" className="btn btn-teal" style={{ fontSize: 10, padding: "3px 10px" }}>Wikipedia ↗</a>}
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-tabs">
          {TABS.map(t => (
            <button key={t.id} className={"tab-btn"+(tab===t.id?" on":"")} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="modal-body">
          {tab === "results"   && <ResultsTab   constructorId={c.constructorId} />}
          {tab === "standings" && <StandingsTab constructorId={c.constructorId} />}
        </div>
      </div>
    </div>
  );
}

const NATS = ["British","Italian","German","American","French","Austrian","Japanese","Swiss","Dutch","Australian"];

export default function ConstructorsPage() {
  const [all, setAll]         = useState([]);
  const [totalAll, setTotalAll] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [search, setSearch]   = useState("");
  const [nat, setNat]         = useState("");
  const [selected, setSelected] = useState(null);

  async function load() {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${API}/constructors`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      setAll(list);
      setTotalAll(list.length);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  const filtered = all.filter(c => {
    const matchNat    = !nat    || c.nationality === nat;
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase());
    return matchNat && matchSearch;
  });

  const nationalities = [...new Set(all.map(c => c.nationality))].sort();

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">F1 Database / Constructors</div>
          <div className="page-title">Constructors</div>
          <div className="page-sub">All F1 teams — click to view results and standings</div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><div className="stat-label">Total</div><div className="stat-value">{totalAll||"—"}</div><div className="stat-sub">Constructors</div></div>
        <div className="stat-card"><div className="stat-label">Showing</div><div className="stat-value">{filtered.length}</div><div className="stat-sub">After filters</div></div>
        <div className="stat-card"><div className="stat-label">Nationality</div><div className="stat-value">{nat||"All"}</div><div className="stat-sub">Active filter</div></div>
      </div>

      <div className="tcard">
        <div className="tcard-toolbar">
          <div className="tcard-title">Constructor list</div>
          <div className="tcontrols">
            <input className="f1-input" style={{ width: 200 }} placeholder="Search team..." value={search} onChange={e => setSearch(e.target.value)} />
            <select className="f1-select" value={nat} onChange={e => setNat(e.target.value)}>
              <option value="">All nationalities</option>
              {nationalities.map(n => <option key={n}>{n}</option>)}
            </select>
            <button className="btn" onClick={load}>↺ Refresh</button>
          </div>
        </div>

        {loading ? <Spinner /> :
         error   ? <div className="err">✕ {error}</div> :
         !filtered.length ? <div className="empty">No constructors found</div> : (
          <table className="dtable">
            <thead><tr><th>Team</th><th>Nationality</th><th>Ref</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c._id || c.constructorId} style={{ cursor: "pointer" }} onClick={() => setSelected(c)}>
                  <td>
                    <div className="dcell">
                      <div style={{
                        width: 34, height: 34, borderRadius: 6, flexShrink: 0,
                        background: tc(c.constructorId),
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "var(--fd)", fontSize: 14, fontWeight: 900, color: "#fff",
                      }}>
                        {(c.name||"?")[0]}
                      </div>
                      <div>
                        <div className="dname">{c.name}</div>
                        <div className="dref">{c.constructorRef}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-grey">{c.nationality}</span></td>
                  <td><span className="mono-m">{c.constructorRef}</span></td>
                  <td>
                    <div className="arow" onClick={e => e.stopPropagation()}>
                      <button className="btn" style={{ fontSize: 11 }} onClick={() => setSelected(c)}>View</button>
                      {c.url && <a href={c.url} target="_blank" rel="noreferrer" className="btn btn-teal" style={{ fontSize: 11, textDecoration: "none" }}>Wiki ↗</a>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selected && <ConstructorDetail constructor={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}