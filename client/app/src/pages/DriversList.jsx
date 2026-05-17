import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { tc, ini, API } from "../App.jsx";

const NATS = ["British","German","Brazilian","Finnish","Spanish","French","Italian","Austrian","Dutch","American","Australian","Japanese","Swedish","Belgian","South African","Scottish","Swiss","Canadian","New Zealander","Irish","Argentine","Colombian","Mexican","Danish","Thai","Monegasque"];
const PER  = 15;

function Spinner() {
  return <div className="loading"><div className="ld"/><div className="ld"/><div className="ld"/></div>;
}

function Pager({ page, pages, total, onPage }) {
  if (!pages || pages <= 1) return (
    <div className="pag"><div className="pag-info">{(total||0).toLocaleString()} records</div><div /></div>
  );
  const nums = [];
  const start = Math.max(1, page - 3);
  const end   = Math.min(pages, start + 6);
  for (let i = start; i <= end; i++) nums.push(i);
  return (
    <div className="pag">
      <div className="pag-info">{(total||0).toLocaleString()} records — page {page}/{pages}</div>
      <div className="pag-btns">
        {page > 1     && <button className="pag-btn" onClick={() => onPage(page-1)}>‹</button>}
        {nums.map(p   => <button key={p} className={"pag-btn"+(p===page?" on":"")} onClick={() => onPage(p)}>{p}</button>)}
        {page < pages && <button className="pag-btn" onClick={() => onPage(page+1)}>›</button>}
      </div>
    </div>
  );
}

async function fetchRaceMap(raceIds) {
  if (!raceIds.length) return {};
  try {
    const ids = [...new Set(raceIds)];
    const res  = await fetch(`${API}/races?limit=1100`);
    const list = await res.json();
    const map  = {};
    (Array.isArray(list) ? list : []).forEach(r => {
      map[r.raceId] = `${r.name} (${r.year})`;
    });
    return map;
  } catch { return {}; }
}

function ResultsTab({ driverId }) {
  const [data, setData]     = useState([]);
  const [pag, setPag]       = useState({});
  const [page, setPage]     = useState(1);
  const [loading, setL]     = useState(true);
  const [raceMap, setRaceMap] = useState({});

  const load = useCallback(async (p=1) => {
    setL(true);
    try {
      const res  = await fetch(`${API}/drivers/${driverId}/results?page=${p}&limit=20`);
      const json = await res.json();
      const list = json.data || [];
      setData(list); setPag(json.pagination || {}); setPage(p);
      const map = await fetchRaceMap(list.map(r => r.raceId));
      setRaceMap(map);
    } catch { setData([]); }
    finally { setL(false); }
  }, [driverId]);

  useEffect(() => { load(1); }, [load]);

  if (loading) return <Spinner />;
  if (!data.length) return <div className="empty">No results found</div>;

  return (
    <>
      <table className="dtable">
        <thead><tr><th>Race</th><th>Grid</th><th>Pos</th><th>Points</th><th>Laps</th><th>Time</th></tr></thead>
        <tbody>
          {data.map(r => (
            <tr key={r._id || r.resultId}>
              <td style={{ fontSize: 12 }}>{raceMap[r.raceId] || `Race ${r.raceId}`}</td>
              <td><span className="mono-m">{r.grid}</span></td>
              <td><span className="badge badge-pos">{r.positionText || r.position || "—"}</span></td>
              <td><span className="pts">{r.points}</span></td>
              <td><span className="mono-m">{r.laps}</span></td>
              <td><span className="mono">{r.time || "—"}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pager page={page} pages={pag.totalPages} total={pag.total} onPage={load} />
    </>
  );
}

function StandingsTab({ driverId }) {
  const [data, setData]       = useState([]);
  const [loading, setL]       = useState(true);
  const [raceMap, setRaceMap] = useState({});

  useEffect(() => {
    fetch(`${API}/drivers/${driverId}/standings`)
      .then(r => r.json())
      .then(async d => {
        const list = Array.isArray(d) ? d : [];
        setData(list);
        const map = await fetchRaceMap(list.map(s => s.raceId));
        setRaceMap(map);
        setL(false);
      })
      .catch(() => setL(false));
  }, [driverId]);

  if (loading) return <Spinner />;
  if (!data.length) return <div className="empty">No standings found</div>;

  return (
    <table className="dtable">
      <thead><tr><th>Race</th><th>Pos</th><th>Points</th><th>Wins</th></tr></thead>
      <tbody>
        {data.map(s => (
          <tr key={s._id || s.driverStandingsId}>
            <td style={{ fontSize: 12 }}>{raceMap[s.raceId] || `Race ${s.raceId}`}</td>
            <td><span className="badge badge-pos">{s.position}</span></td>
            <td><span className="pts">{s.points}</span></td>
            <td><span style={{ color: "var(--teal)" }}>{s.wins}</span></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function QualifyingTab({ driverId }) {
  const [data, setData]       = useState([]);
  const [loading, setL]       = useState(true);
  const [raceMap, setRaceMap] = useState({});

  useEffect(() => {
    fetch(`${API}/drivers/${driverId}/qualifying`)
      .then(r => r.json())
      .then(async d => {
        const list = Array.isArray(d) ? d : [];
        setData(list);
        const map = await fetchRaceMap(list.map(q => q.raceId));
        setRaceMap(map);
        setL(false);
      })
      .catch(() => setL(false));
  }, [driverId]);

  if (loading) return <Spinner />;
  if (!data.length) return <div className="empty">No qualifying data found</div>;

  return (
    <table className="dtable">
      <thead><tr><th>Race</th><th>Pos</th><th>Q1</th><th>Q2</th><th>Q3</th></tr></thead>
      <tbody>
        {data.map((q, i) => (
          <tr key={q._id || q.qualifyId || i}>
            <td style={{ fontSize: 12 }}>{raceMap[q.raceId] || `Race ${q.raceId}`}</td>
            <td><span className="badge badge-pos">{q.position}</span></td>
            <td><span className="mono">{q.q1 || "—"}</span></td>
            <td><span className="mono">{q.q2 || "—"}</span></td>
            <td><span className="mono">{q.q3 || "—"}</span></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function LapTimesTab({ driverId }) {
  const [data, setData]       = useState([]);
  const [pag, setPag]         = useState({});
  const [page, setPage]       = useState(1);
  const [raceId, setRaceId]   = useState("");
  const [loading, setL]       = useState(false);
  const [raceMap, setRaceMap] = useState({});

  const load = useCallback(async (p=1) => {
    setL(true);
    try {
      let url = `${API}/drivers/${driverId}/lap-times?page=${p}&limit=30`;
      if (raceId) url += `&raceId=${raceId}`;
      const res  = await fetch(url);
      const json = await res.json();
      const list = json.data || [];
      setData(list); setPag(json.pagination || {}); setPage(p);
      if (list.length) {
        const map = await fetchRaceMap(list.map(l => l.raceId));
        setRaceMap(prev => ({ ...prev, ...map }));
      }
    } catch { setData([]); }
    finally { setL(false); }
  }, [driverId, raceId]);

  useEffect(() => { load(1); }, [driverId]);

  return (
    <>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", gap: 8 }}>
        <input className="f1-input" style={{ width: 130 }} placeholder="Filter by Race ID"
          value={raceId} onChange={e => setRaceId(e.target.value)}
          onKeyDown={e => e.key === "Enter" && load(1)} />
        <button className="btn btn-teal" onClick={() => load(1)}>Search</button>
      </div>
      {loading ? <Spinner /> : !data.length ? (
        <div className="empty">No lap times — filter by Race ID</div>
      ) : (
        <>
          <table className="dtable">
            <thead><tr><th>Race</th><th>Lap</th><th>Pos</th><th>Time</th><th>Ms</th></tr></thead>
            <tbody>
              {data.map((l, i) => (
                <tr key={l._id || i}>
                  <td style={{ fontSize: 12 }}>{raceMap[l.raceId] || `Race ${l.raceId}`}</td>
                  <td><span className="mono-m">{l.lap}</span></td>
                  <td><span className="badge badge-pos">{l.position}</span></td>
                  <td><span className="mono">{l.time}</span></td>
                  <td><span className="mono-m">{l.milliseconds?.toLocaleString()}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pager page={page} pages={pag.totalPages} total={pag.total} onPage={load} />
        </>
      )}
    </>
  );
}

function PitStopsTab({ driverId }) {
  const [data, setData]       = useState([]);
  const [pag, setPag]         = useState({});
  const [page, setPage]       = useState(1);
  const [loading, setL]       = useState(true);
  const [raceMap, setRaceMap] = useState({});

  const load = useCallback(async (p=1) => {
    setL(true);
    try {
      const res  = await fetch(`${API}/drivers/${driverId}/pit-stops?page=${p}&limit=25`);
      const json = await res.json();
      const list = json.data || [];
      setData(list); setPag(json.pagination || {}); setPage(p);
      if (list.length) {
        const map = await fetchRaceMap(list.map(p => p.raceId));
        setRaceMap(prev => ({ ...prev, ...map }));
      }
    } catch { setData([]); }
    finally { setL(false); }
  }, [driverId]);

  useEffect(() => { load(1); }, [load]);

  if (loading) return <Spinner />;
  if (!data.length) return <div className="empty">No pit stop data found</div>;

  return (
    <>
      <table className="dtable">
        <thead><tr><th>Race</th><th>Stop</th><th>Lap</th><th>Duration</th><th>Ms</th></tr></thead>
        <tbody>
          {data.map((p, i) => (
            <tr key={p._id || i}>
              <td style={{ fontSize: 12 }}>{raceMap[p.raceId] || `Race ${p.raceId}`}</td>
              <td><span className="badge badge-red">{p.stop}</span></td>
              <td><span className="mono-m">{p.lap}</span></td>
              <td><span className="pts">{p.duration}s</span></td>
              <td><span className="mono-m">{p.milliseconds?.toLocaleString()}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pager page={page} pages={pag.totalPages} total={pag.total} onPage={load} />
    </>
  );
}

const TABS = [
  { id: "results",    label: "Results"    },
  { id: "standings",  label: "Standings"  },
  { id: "qualifying", label: "Qualifying" },
  { id: "lap-times",  label: "Lap Times"  },
  { id: "pit-stops",  label: "Pit Stops"  },
];

function DriverProfile({ driver, onClose }) {
  const [tab, setTab] = useState("results");
  return (
    <div className="page" style={{ paddingTop: 0 }}>
      <button className="back-link" onClick={onClose}>← Back to list</button>

      <div className="profile-header">
        <div className="profile-avatar" style={{ background: tc(driver.driverId) }}>
          {ini(driver.forename, driver.surname)}
        </div>
        <div>
          <div className="profile-name">{driver.forename} {driver.surname}</div>
          <div className="profile-meta">
            {driver.code     && <span className="badge badge-red">{driver.code}</span>}
            {driver.number   && <span className="badge badge-grey">#{driver.number}</span>}
            <span className="badge badge-grey">{driver.nationality}</span>
            {driver.dob      && <span className="mono-m">{String(driver.dob).slice(0, 10)}</span>}
            {driver.url      && <a href={driver.url} target="_blank" rel="noreferrer" className="btn btn-teal" style={{ padding: "3px 10px", fontSize: 11 }}>Wiki ↗</a>}
          </div>
          <div className="mono-m" style={{ marginTop: 8 }}>ID: {driver.driverId} · ref: {driver.driverRef}</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <Link to={`/edit/${driver.driverId}`} className="btn">Edit</Link>
        </div>
      </div>

      <div className="profile-tabs">
        {TABS.map(t => (
          <button key={t.id} className={"tab-btn" + (tab === t.id ? " on" : "")} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="tcard">
        {tab === "results"    && <ResultsTab   driverId={driver.driverId} />}
        {tab === "standings"  && <StandingsTab driverId={driver.driverId} />}
        {tab === "qualifying" && <QualifyingTab driverId={driver.driverId} />}
        {tab === "lap-times"  && <LapTimesTab  driverId={driver.driverId} />}
        {tab === "pit-stops"  && <PitStopsTab  driverId={driver.driverId} />}
      </div>
    </div>
  );
}

export default function DriversList() {
  const [all, setAll]           = useState([]);
  const [search, setSearch]     = useState("");
  const [nat, setNat]           = useState("");
  const [page, setPage]         = useState(1);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [selected, setSelected] = useState(null);

  async function load() {
    setLoading(true); setError(null);
    try {
      let url = `${API}/drivers`;
      if (nat) url += `?nationality=${encodeURIComponent(nat)}`;
      const res  = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setAll(Array.isArray(data) ? data : []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [nat]);

  async function del(e, d) {
    e.stopPropagation();
    if (!window.confirm(`Delete ${d.forename} ${d.surname}?`)) return;
    await fetch(`${API}/drivers/${d.driverId}`, { method: "DELETE" });
    setAll(prev => prev.filter(x => x.driverId !== d.driverId));
    if (selected?.driverId === d.driverId) setSelected(null);
  }

  if (selected) return <DriverProfile driver={selected} onClose={() => setSelected(null)} />;

  const filtered = all.filter(d =>
    !search || `${d.forename} ${d.surname}`.toLowerCase().includes(search.toLowerCase())
  );
  const pages = Math.ceil(filtered.length / PER);
  const slice = filtered.slice((page - 1) * PER, page * PER);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">F1 Database / Drivers</div>
          <div className="page-title">Drivers</div>
          <div className="page-sub">All Formula 1 drivers — 1950 to 2020. Click a row to view profile.</div>
        </div>
        <Link to="/create" className="btn btn-primary">+ New Driver</Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><div className="stat-label">Total drivers</div><div className="stat-value">{all.length || "—"}</div><div className="stat-sub">In database</div></div>
        <div className="stat-card"><div className="stat-label">Showing</div><div className="stat-value">{filtered.length}</div><div className="stat-sub">After filters</div></div>
        <div className="stat-card"><div className="stat-label">Nationality</div><div className="stat-value">{nat || "All"}</div><div className="stat-sub">Active filter</div></div>
        <div className="stat-card"><div className="stat-label">Page</div><div className="stat-value">{page} / {pages || 1}</div><div className="stat-sub">Current page</div></div>
      </div>

      <div className="tcard">
        <div className="tcard-toolbar">
          <div className="tcard-title">Driver list</div>
          <div className="tcontrols">
            <input className="f1-input" style={{ width: 200 }} placeholder="Search name..."
              value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
            <select className="f1-select" value={nat} onChange={e => { setNat(e.target.value); setPage(1); }}>
              <option value="">All nationalities</option>
              {NATS.map(n => <option key={n}>{n}</option>)}
            </select>
            <button className="btn" onClick={load}>↺ Refresh</button>
          </div>
        </div>

        {loading ? <Spinner /> :
         error   ? <div className="err">✕ API unreachable<span>{error}</span></div> :
         !slice.length ? <div className="empty">No drivers match your filters</div> : (
          <table className="dtable">
            <thead><tr><th>#</th><th>Driver</th><th>Code</th><th>Nationality</th><th>Born</th><th>Actions</th></tr></thead>
            <tbody>
              {slice.map(d => (
                <tr key={d._id || d.driverId} style={{ cursor: "pointer" }} onClick={() => setSelected(d)}>
                  <td><span style={{ fontFamily: "var(--fm)", fontSize: 13, color: "var(--muted)", minWidth: 28, display: "inline-block", textAlign: "right" }}>{d.number || "—"}</span></td>
                  <td>
                    <div className="dcell">
                      <div className="avatar" style={{ background: tc(d.driverId) }}>{ini(d.forename, d.surname)}</div>
                      <div><div className="dname">{d.forename} {d.surname}</div><div className="dref">{d.driverRef}</div></div>
                    </div>
                  </td>
                  <td>{d.code ? <span className="badge badge-red">{d.code}</span> : <span style={{ color: "var(--muted)" }}>—</span>}</td>
                  <td><span className="badge badge-grey">{d.nationality}</span></td>
                  <td><span className="mono-m">{d.dob ? String(d.dob).slice(0, 10) : "—"}</span></td>
                  <td>
                    <div className="arow" onClick={e => e.stopPropagation()}>
                      <Link to={`/edit/${d.driverId}`} className="btn" style={{ fontSize: 11 }}>Edit</Link>
                      <button className="btn btn-danger" style={{ fontSize: 11, padding: "6px 10px" }} onClick={e => del(e, d)}>✕</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="pag">
          <div className="pag-info">{filtered.length.toLocaleString()} drivers</div>
          <div className="pag-btns">
            {page > 1 && <button className="pag-btn" onClick={() => setPage(p => p - 1)}>‹</button>}
            {Array.from({ length: Math.min(pages, 7) }, (_, i) => {
              const p = Math.max(1, page - 3) + i;
              if (p > pages) return null;
              return <button key={p} className={"pag-btn" + (p === page ? " on" : "")} onClick={() => setPage(p)}>{p}</button>;
            })}
            {page < pages && <button className="pag-btn" onClick={() => setPage(p => p + 1)}>›</button>}
          </div>
        </div>
      </div>
    </div>
  );
}