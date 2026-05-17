import React, { useState, useCallback } from "react";
import { API, tc, ini } from "../App.jsx";

function Spinner() {
  return (
    <div className="loading">
      <div className="ld" />
      <div className="ld" />
      <div className="ld" />
    </div>
  );
}

export default function StandingsPage() {
  const [season, setSeason] = useState("2024");
  const [drivers, setDrivers] = useState([]);
  const [constructors, setConstructors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [driverMap, setDriverMap] = useState({});
  const [constrMap, setConstrMap] = useState({});
  const [tab, setTab] = useState("drivers");

  const load = useCallback(async () => {
    if (!season) return;

    setLoading(true);
    setError(null);

    try {
      const [dRes, cRes, driversRes, constrsRes] = await Promise.all([
        fetch(`${API}/standings/drivers?season=${season}&limit=100`),
        fetch(`${API}/standings/constructors?season=${season}&limit=100`),
        fetch(`${API}/drivers`),
        fetch(`${API}/constructors`),
      ]);

      const dJson = await dRes.json();
      const cJson = await cRes.json();

      const dList = dJson.data || [];
      const cList = cJson.data || [];

      const dedupeByLatestRace = (list, idField) => {
        const map = {};

        list.forEach((entry) => {
          const id = entry[idField];

          if (!map[id] || entry.raceId > map[id].raceId) {
            map[id] = entry;
          }
        });

        return Object.values(map).sort(
          (a, b) => Number(a.position) - Number(b.position)
        );
      };

      setDrivers(dedupeByLatestRace(dList, "driverId"));
      setConstructors(dedupeByLatestRace(cList, "constructorId"));

      const driversData = await driversRes.json();
      const allDrivers = Array.isArray(driversData)
        ? driversData
        : [];

      const dMap = {};

      allDrivers.forEach((d) => {
        dMap[d.driverId] =
          `${d.forename} ${d.surname}`;
      });

      setDriverMap(dMap);

      const constrsData = await constrsRes.json();
      const allConstrs = Array.isArray(constrsData)
        ? constrsData
        : [];

      const cMap = {};

      allConstrs.forEach((c) => {
        cMap[c.constructorId] = c.name;
      });

      setConstrMap(cMap);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [season]);

  const champion = drivers[0];
  const constrChampion = constructors[0];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">
            F1 Database / Standings
          </div>

          <div className="page-title">
            Standings
          </div>

          <div className="page-sub">
            Driver and constructor championship
            standings by season
          </div>
        </div>
      </div>

      <div className="standings-controls">
        <select
          className="f1-select standings-season-select"
          value={season}
          onChange={(e) =>
            setSeason(e.target.value)
          }
        >
          {Array.from(
            { length: 2024 - 1950 + 1 },
            (_, i) => 2024 - i
          ).map((y) => (
            <option key={y}>
              {y}
            </option>
          ))}
        </select>

        <button
          className="btn btn-primary"
          onClick={load}
        >
          Load {season} standings
        </button>
      </div>

      {champion && !loading && (
        <div className="champions-grid">

          <div className="champion-card driver">
            <div className="champion-icon driver">
              🏆
            </div>

            <div>
              <div className="champion-label driver">
                {season} Driver Champion
              </div>

              <div className="champion-name">
                {driverMap[champion.driverId] ||
                  `Driver ${champion.driverId}`}
              </div>

              <div className="champion-stats">
                <span className="pts">
                  {champion.points} pts
                </span>

                <span className="champion-wins">
                  {champion.wins} wins
                </span>
              </div>
            </div>
          </div>

          {constrChampion && (
            <div className="champion-card constructor">
              <div className="champion-icon constructor">
                🏭
              </div>

              <div>
                <div className="champion-label constructor">
                  {season} Constructor Champion
                </div>

                <div className="champion-name">
                  {constrMap[
                    constrChampion.constructorId
                  ] ||
                    `Constructor ${constrChampion.constructorId}`}
                </div>

                <div className="champion-stats">
                  <span className="pts">
                    {constrChampion.points} pts
                  </span>

                  <span className="champion-wins">
                    {constrChampion.wins} wins
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {loading && <Spinner />}


      {error && (
        <div className="err">
          ✕ {error}
        </div>
      )}

      {!loading &&
        (drivers.length > 0 ||
          constructors.length > 0) && (
          <>
            <div className="standings-tabs">
              <button
                className={
                  "tab-btn" +
                  (tab === "drivers"
                    ? " on"
                    : "")
                }
                onClick={() =>
                  setTab("drivers")
                }
              >
                Driver standings
              </button>

              <button
                className={
                  "tab-btn" +
                  (tab === "constructors"
                    ? " on"
                    : "")
                }
                onClick={() =>
                  setTab("constructors")
                }
              >
                Constructor standings
              </button>
            </div>

            <div className="tcard">
                
              {tab === "drivers" && (
                <table className="dtable">
                  <thead>
                    <tr>
                      <th>Pos</th>
                      <th>Driver</th>
                      <th>Points</th>
                      <th>Wins</th>
                    </tr>
                  </thead>

                  <tbody>
                    {drivers.map((s) => (
                      <tr
                        key={
                          s._id ||
                          s.driverStandingsId
                        }
                        className={
                          s.position === 1
                            ? "driver-row-first"
                            : ""
                        }
                      >
                        <td>
                          <span
                            className={
                              "badge " +
                              (s.position === 1
                                ? "badge-red"
                                : s.position <= 3
                                ? "badge-teal"
                                : "badge-pos")
                            }
                          >
                            {s.position === 1
                              ? "🏆 1"
                              : s.position}
                          </span>
                        </td>

                        <td>
                          <div className="dcell">
                            <div
                              className="avatar driver-avatar-small"
                              style={{
                                background: tc(
                                  s.driverId
                                ),
                              }}
                            >
                              {ini(
                                ...(driverMap[
                                  s.driverId
                                ] || "? ?"
                                ).split(" ")
                              )}
                            </div>

                            <span className="entity-name">
                              {driverMap[
                                s.driverId
                              ] ||
                                `Driver ${s.driverId}`}
                            </span>
                          </div>
                        </td>

                        <td>
                          <span className="pts">
                            {s.points}
                          </span>
                        </td>

                        <td>
                          <span className="champion-wins">
                            {s.wins}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              
              {tab === "constructors" && (
                <table className="dtable">
                  <thead>
                    <tr>
                      <th>Pos</th>
                      <th>Constructor</th>
                      <th>Points</th>
                      <th>Wins</th>
                    </tr>
                  </thead>

                  <tbody>
                    {constructors.map((s) => (
                      <tr
                        key={
                          s._id ||
                          s.constructorStandingsId
                        }
                        className={
                          s.position === 1
                            ? "constructor-row-first"
                            : ""
                        }
                      >
                        <td>
                          <span
                            className={
                              "badge " +
                              (s.position === 1
                                ? "badge-teal"
                                : s.position <= 3
                                ? "badge-grey"
                                : "badge-pos")
                            }
                          >
                            {s.position === 1
                              ? "🏆 1"
                              : s.position}
                          </span>
                        </td>

                        <td>
                          <div className="dcell">
                            <div
                              className="constructor-avatar"
                              style={{
                                background: tc(
                                  s.constructorId
                                ),
                              }}
                            >
                              {(constrMap[
                                s.constructorId
                              ] || "?")[0]}
                            </div>

                            <span className="entity-name">
                              {constrMap[
                                s.constructorId
                              ] ||
                                `Constructor ${s.constructorId}`}
                            </span>
                          </div>
                        </td>

                        <td>
                          <span className="pts">
                            {s.points}
                          </span>
                        </td>

                        <td>
                          <span className="champion-wins">
                            {s.wins}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

      {!loading &&
        !drivers.length &&
        !error && (
          <div className="empty empty-standings">
            Select a season and click Load
          </div>
        )}
    </div>
  );
}