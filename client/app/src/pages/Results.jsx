import React, { useState, useCallback, useRef } from "react";
import { API } from "../App.jsx";

function Spinner() {
  return (
    <div className="loading">
      <div className="ld" />
      <div className="ld" />
      <div className="ld" />
      <span>Loading...</span>
    </div>
  );
}

function Pager({ page, pages, total, onPage }) {
  if (!pages) return null;

  const start = Math.max(1, page - 3);
  const end = Math.min(pages, start + 6);

  const nums = [];

  for (let i = start; i <= end; i++) {
    nums.push(i);
  }

  return (
    <div className="pag">
      <div className="pag-info">
        {(total || 0).toLocaleString()} total records — page {page} of{" "}
        {pages.toLocaleString()}
      </div>

      <div className="pag-btns">
        {page > 1 && (
          <button
            className="pag-btn"
            onClick={() => onPage(page - 1)}
          >
            ‹
          </button>
        )}

        {nums.map((p) => (
          <button
            key={p}
            className={"pag-btn" + (p === page ? " on" : "")}
            onClick={() => onPage(p)}
          >
            {p}
          </button>
        ))}

        {page < pages && (
          <button
            className="pag-btn"
            onClick={() => onPage(page + 1)}
          >
            ›
          </button>
        )}
      </div>
    </div>
  );
}

async function fetchDriverMap() {
  try {
    const res = await fetch(`${API}/drivers`);
    const list = await res.json();
    const map = {};
    (Array.isArray(list) ? list : []).forEach((d) => {
      map[d.driverId] = `${d.forename} ${d.surname}`;
    });
    return map;
  } catch { return {}; }
}

async function fetchRaceMapFull() {
  try {
    const res = await fetch(`${API}/races?limit=1100`);
    const list = await res.json();
    const map = {};
    (Array.isArray(list) ? list : []).forEach((r) => {
      map[r.raceId] = `${r.name} (${r.year})`;
    });
    return map;
  } catch { return {}; }
}

async function fetchConstructorMap() {
  try {
    const res = await fetch(`${API}/constructors`);
    const list = await res.json();
    const map = {};
    (Array.isArray(list) ? list : []).forEach((c) => {
      map[c.constructorId] = c.name;
    });
    return map;
  } catch { return {}; }
}

export default function ResultsPage() {
  const [data, setData] = useState([]);
  const [pag, setPag] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const [driverMap, setDriverMap] = useState({});
  const [raceMap, setRaceMap] = useState({});
  const [constructorMap, setConstructorMap] = useState({});
  const mapsLoaded = useRef(false);

  const [season, setSeason] = useState("");
  const [raceId, setRaceId] = useState("");
  const [driverId, setDriverId] = useState("");
  const [constructorId, setConstructorId] = useState("");
  const [position, setPosition] = useState("");
  const [page, setPage] = useState(1);

  const load = useCallback(
    async (p = 1) => {
      setLoading(true);
      setError(null);
      setHasSearched(true);

      try {
        let url = `${API}/results?page=${p}&limit=25`;

        if (season) url += `&season=${season}`;
        if (raceId) url += `&raceId=${raceId}`;
        if (driverId) url += `&driverId=${driverId}`;
        if (constructorId)
          url += `&constructorId=${constructorId}`;
        if (position) url += `&position=${position}`;

        const res = await fetch(url);
        const json = await res.json();

        setData(json.data || []);
        setPag(json.pagination || {});
        setPage(p);

        if (!mapsLoaded.current) {
          mapsLoaded.current = true;
          const [dm, rm, cm] = await Promise.all([
            fetchDriverMap(),
            fetchRaceMapFull(),
            fetchConstructorMap(),
          ]);
          setDriverMap(dm);
          setRaceMap(rm);
          setConstructorMap(cm);
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    },
    [season, raceId, driverId, constructorId, position]
  );

  function clear() {
    setSeason("");
    setRaceId("");
    setDriverId("");
    setConstructorId("");
    setPosition("");

    setData([]);
    setPag({});
    setHasSearched(false);
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">
            F1 Database / Results
          </div>

          <div className="page-title">
            Results
          </div>

          <div className="page-sub">
            Race results — 25,000+ records,
            paginated
          </div>
        </div>
      </div>

      {pag.total && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">
              Total records
            </div>

            <div className="stat-value">
              {pag.total?.toLocaleString() || "—"}
            </div>

            <div className="stat-sub">
              Matching filters
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">
              Pages
            </div>

            <div className="stat-value">
              {pag.totalPages?.toLocaleString() || "—"}
            </div>

            <div className="stat-sub">
              At 25 per page
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">
              This page
            </div>

            <div className="stat-value">
              {data.length}
            </div>

            <div className="stat-sub">
              Records shown
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">
              Season
            </div>

            <div className="stat-value">
              {season || "All"}
            </div>

            <div className="stat-sub">
              Active filter
            </div>
          </div>
        </div>
      )}

      <div className="tcard">
        <div className="tcard-toolbar">
          <div className="tcard-title">
            Search results
          </div>

          <div className="tcontrols">
            <input
              className="f1-input results-input-season"
              placeholder="Season"
              value={season}
              onChange={(e) =>
                setSeason(e.target.value)
              }
            />

            <input
              className="f1-input results-input-race"
              placeholder="Race ID"
              value={raceId}
              onChange={(e) =>
                setRaceId(e.target.value)
              }
            />

            <input
              className="f1-input results-input-driver"
              placeholder="Driver ID"
              value={driverId}
              onChange={(e) =>
                setDriverId(e.target.value)
              }
            />

            <input
              className="f1-input results-input-constructor"
              placeholder="Constructor ID"
              value={constructorId}
              onChange={(e) =>
                setConstructorId(e.target.value)
              }
            />

            <input
              className="f1-input results-input-position"
              placeholder="Position"
              value={position}
              onChange={(e) =>
                setPosition(e.target.value)
              }
            />

            <button
              className="btn btn-primary"
              onClick={() => load(1)}
            >
              Search
            </button>

            <button
              className="btn"
              onClick={clear}
            >
              Clear
            </button>
          </div>
        </div>

        {!hasSearched ? (
          <div className="empty results-empty">
            Enter filters above and click Search
            to load results
          </div>
        ) : loading ? (
          <Spinner />
        ) : error ? (
          <div className="err">
            ✕ {error}
          </div>
        ) : !data.length ? (
          <div className="empty">
            No results found for these filters
          </div>
        ) : (
          <>
            <table className="dtable">
              <thead>
                <tr>
                  <th>Result ID</th>
                  <th>Race</th>
                  <th>Driver</th>
                  <th>Constructor</th>
                  <th>Grid</th>
                  <th>Position</th>
                  <th>Points</th>
                  <th>Laps</th>
                  <th>Time</th>
                  <th>Fastest Lap</th>
                </tr>
              </thead>

              <tbody>
                {data.map((r, i) => (
                  <tr
                    key={
                      r._id ||
                      r.resultId ||
                      i
                    }
                  >
                    <td>
                      <span className="mono-m">
                        {r.resultId}
                      </span>
                    </td>

                    <td style={{ fontSize: 12 }}>
                      {raceMap[r.raceId] || (
                        <span className="badge badge-grey">
                          Race {r.raceId}
                        </span>
                      )}
                    </td>

                    <td>
                      <span className="mono-m">
                        {driverMap[r.driverId] || `Driver ${r.driverId}`}
                      </span>
                    </td>

                    <td>
                      <span className="mono-m">
                        {constructorMap[r.constructorId] || `Constructor ${r.constructorId}`}
                      </span>
                    </td>

                    <td className="results-grid-muted">
                      {r.grid}
                    </td>

                    <td>
                      <span className="badge badge-pos">
                        {r.positionText ||
                          r.position ||
                          "—"}
                      </span>
                    </td>

                    <td>
                      <span className="pts">
                        {r.points}
                      </span>
                    </td>

                    <td className="results-grid-muted">
                      {r.laps}
                    </td>

                    <td>
                      <span className="mono">
                        {r.time || "—"}
                      </span>
                    </td>

                    <td>
                      <span className="mono">
                        {r.fastestLapTime ||
                          "—"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Pager
              page={page}
              pages={pag.totalPages}
              total={pag.total}
              onPage={load}
            />
          </>
        )}
      </div>
    </div>
  );
}