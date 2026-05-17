import React, { useState, useCallback } from "react";
import { API, tc, ini } from "../App.jsx";

function Spinner() {
  return <div className="loading"><div className="ld"/><div className="ld"/><div className="ld"/></div>;
}

export default function StandingsPage() {
  const [season, setSeason]       = useState("2024");
  const [drivers, setDrivers]     = useState([]);
  const [constructors, setConstructors] = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [driverMap, setDriverMap] = useState({});
  const [constrMap, setConstrMap] = useState({});
  const [tab, setTab]             = useState("drivers");

  const load = useCallback(async () => {
    if (!season) return;
    setLoading(true); setError(null);
    try {
      const [dRes, cRes, driversRes, constrsRes] = await Promise.all([
        fetch(`${API}/standings/drivers?season=${season}&limit=100`),
        fetch(`${API}/standings/constructors?season=${season}&limit=100`),
        fetch(`${API}/drivers?limit=1000`),
        fetch(`${API}/constructors`),
      ]);
      const dJson  = await dRes.json();
      const cJson  = await cRes.json();
      const dList  = dJson.data  || [];
      const cList  = cJson.data  || [];

      const dedupeByLatestRace = (list, idField) => {
        const map = {};
        list.forEach(entry => {
          const id = entry[idField];
          if (!map[id] || entry.raceId > map[id].raceId) map[id] = entry;
        });
        return Object.values(map).sort((a, b) => a.position - b.position);
      };

      setDrivers(dedupeByLatestRace(dList, "driverId"));
      setConstructors(dedupeByLatestRace(cList, "constructorId"));

      const driversData = await driversRes.json();
      const allDrivers = Array.isArray(driversData) ? driversData : [];
      const dMap = {};
      allDrivers.forEach(d => {
        const key = parseInt(d.driverId, 10);
        if (!isNaN(key)) dMap[key] = `${d.forename} ${d.surname}`;
      });
      setDriverMap(dMap);

      const constrsData = await constrsRes.json();
      const allConstrs = Array.isArray(constrsData) ? constrsData : [];
      const cMap = {};
      allConstrs.forEach(c => {
        const key = parseInt(c.constructorId, 10);
        if (!isNaN(key)) cMap[key] = c.name;
      });
      setConstrMap(cMap);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [season]);

  const champion = drivers[0];
  const constrChampion = constructors[0];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">F1 Database / Standings</div>
          <div className="page-title">Standings</div>
          <div className="page-sub">Driver and constructor championship standings by season</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24, alignItems: "center" }}>
        <select className="f1-select" value={season} onChange={e => setSeason(e.target.value)} style={{ width: 120 }}>
          {Array.from({ length: 2024 - 1950 + 1 }, (_, i) => 2024 - i).map(y => (
            <option key={y}>{y}</option>
          ))}
        </select>
        <button className="btn btn-primary" onClick={load}>Load {season} standings</button>
      </div>

      {champion && !loading && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
          <div style={{ background: "var(--surface)", border: "2px solid var(--red)", borderRadius: 8, padding: 20, display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ background: "var(--red)", borderRadius: "50%", width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--fd)", fontSize: 22, fontWeight: 900, color: "#fff", flexShrink: 0 }}>
              🏆
            </div>
            <div>
              <div style={{ fontFamily: "var(--fm)", fontSize: 9, color: "var(--red)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>{season} Driver Champion</div>
              <div style={{ fontFamily: "var(--fd)", fontSize: 24, fontWeight: 900, textTransform: "uppercase" }}>
                {driverMap[parseInt(champion.driverId,10)] || `Driver ${champion.driverId}`}
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
                <span className="pts">{champion.points} pts</span>
                <span style={{ color: "var(--teal)", fontSize: 13 }}>{champion.wins} wins</span>
              </div>
            </div>
          </div>

          {constrChampion && (
            <div style={{ background: "var(--surface)", border: "2px solid var(--teal)", borderRadius: 8, padding: 20, display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ background: "var(--teal)", borderRadius: "50%", width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--fd)", fontSize: 22, fontWeight: 900, color: "#fff", flexShrink: 0 }}>
                🏭
              </div>
              <div>
                <div style={{ fontFamily: "var(--fm)", fontSize: 9, color: "var(--teal)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>{season} Constructor Champion</div>
                <div style={{ fontFamily: "var(--fd)", fontSize: 24, fontWeight: 900, textTransform: "uppercase" }}>
                  {constrMap[parseInt(constrChampion.constructorId,10)] || `Constructor ${constrChampion.constructorId}`}
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
                  <span className="pts">{constrChampion.points} pts</span>
                  <span style={{ color: "var(--teal)", fontSize: 13 }}>{constrChampion.wins} wins</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {loading && <Spinner />}
      {error   && <div className="err">✕ {error}</div>}

      {!loading && (drivers.length > 0 || constructors.length > 0) && (
        <>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <button className={"tab-btn"+(tab==="drivers"?" on":"")} onClick={() => setTab("drivers")}>Driver standings</button>
            <button className={"tab-btn"+(tab==="constructors"?" on":"")} onClick={() => setTab("constructors")}>Constructor standings</button>
          </div>

          <div className="tcard">
            {tab === "drivers" && (
              <table className="dtable">
                <thead><tr><th>Pos</th><th>Driver</th><th>Points</th><th>Wins</th></tr></thead>
                <tbody>
                  {drivers.map(s => (
                    <tr key={s._id || s.driverStandingsId} style={{ background: s.position === 1 ? "rgba(225,6,0,0.04)" : undefined }}>
                      <td>
                        <span className={"badge "+(s.position===1?"badge-red":s.position<=3?"badge-teal":"badge-pos")}>
                          {s.position === 1 ? "🏆 1" : s.position}
                        </span>
                      </td>
                      <td>
                        <div className="dcell">
                          <div className="avatar" style={{ background: tc(parseInt(s.driverId,10)), width: 28, height: 28, fontSize: 10 }}>
                            {ini(...(driverMap[parseInt(s.driverId,10)]||"? ?").split(" "))}
                          </div>
                          <span style={{ fontWeight: 600 }}>{driverMap[parseInt(s.driverId,10)] || `Driver ${s.driverId}`}</span>
                        </div>
                      </td>
                      <td><span className="pts">{s.points}</span></td>
                      <td><span style={{ color: "var(--teal)" }}>{s.wins}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {tab === "constructors" && (
              <table className="dtable">
                <thead><tr><th>Pos</th><th>Constructor</th><th>Points</th><th>Wins</th></tr></thead>
                <tbody>
                  {constructors.map(s => (
                    <tr key={s._id || s.constructorStandingsId} style={{ background: s.position === 1 ? "rgba(0,210,190,0.04)" : undefined }}>
                      <td>
                        <span className={"badge "+(s.position===1?"badge-teal":s.position<=3?"badge-grey":"badge-pos")}>
                          {s.position === 1 ? "🏆 1" : s.position}
                        </span>
                      </td>
                      <td>
                        <div className="dcell">
                          <div style={{ width: 28, height: 28, borderRadius: 4, background: tc(parseInt(s.constructorId,10)), display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--fd)", fontSize: 12, fontWeight: 700, color: "#fff" }}>
                            {(constrMap[parseInt(s.constructorId,10)]||"?")[0]}
                          </div>
                          <span style={{ fontWeight: 600 }}>{constrMap[parseInt(s.constructorId,10)] || `Constructor ${s.constructorId}`}</span>
                        </div>
                      </td>
                      <td><span className="pts">{s.points}</span></td>
                      <td><span style={{ color: "var(--teal)" }}>{s.wins}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {!loading && !drivers.length && !error && (
        <div className="empty" style={{ padding: "48px 24px" }}>Select a season and click Load</div>
      )}
    </div>
  );
}