import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { API } from "../App.jsx";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const redIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [30, 48], iconAnchor: [15, 48], popupAnchor: [1, -40], shadowSize: [41, 41],
});

function FlyTo({ circuit }) {
  const map = useMap();
  useEffect(() => {
    if (circuit?.lat && circuit?.lng) {
      const point = map.project([circuit.lat, circuit.lng], 11);
      point.x += 230;
      const shifted = map.unproject(point, 11);
      map.flyTo(shifted, 11, { duration: 1.4 });
    }
  }, [circuit, map]);
  return null;
}

function CircuitPanel({ circuit, races, loadingRaces, onClose }) {
  return (
    <div className="circuit-panel">
      <div className="circuit-panel-header">
        <div style={{ paddingRight: 36 }}>
          <div style={{ fontFamily: "var(--fm)", fontSize: 9, color: "var(--red)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>
            Circuit #{circuit.circuitId} · {circuit.circuitRef}
          </div>
          <div style={{ fontFamily: "var(--fd)", fontSize: 24, fontWeight: 900, textTransform: "uppercase", letterSpacing: 0.5, lineHeight: 1.1, color: "var(--text)" }}>
            {circuit.name}
          </div>
          <div style={{ fontSize: 13, color: "var(--muted2)", marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}>
            <span>📍</span><span>{circuit.location}, {circuit.country}</span>
          </div>
        </div>
        <button className="modal-close" onClick={onClose}>✕</button>
      </div>

      <div className="circuit-panel-grid">
        {[
          { label: "Latitude",  value: circuit.lat?.toFixed(5), color: "var(--teal)" },
          { label: "Longitude", value: circuit.lng?.toFixed(5), color: "var(--teal)" },
          { label: "Altitude",  value: circuit.alt != null ? `${circuit.alt} m` : "—", color: "var(--text)" },
          { label: "Country",   value: circuit.country, color: "var(--text)" },
        ].map(item => (
          <div key={item.label} className="circuit-panel-infobox">
            <div style={{ fontFamily: "var(--fm)", fontSize: 8, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--muted)", marginBottom: 3 }}>
              {item.label}
            </div>
            <div style={{ fontFamily: "var(--fm)", fontSize: 12, color: item.color, fontWeight: 600 }}>
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {circuit.url && (
        <div style={{ padding: "6px 14px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
          <a href={circuit.url} target="_blank" rel="noreferrer" className="btn btn-teal"
            style={{ width: "100%", justifyContent: "center", fontSize: 10, padding: "5px 10px" }}>
            View on Wikipedia ↗
          </a>
        </div>
      )}

      <div className="circuit-panel-races-header">
        <div style={{ fontFamily: "var(--fd)", fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "var(--muted2)" }}>
          Races held here
        </div>
        {!loadingRaces && <span className="badge badge-red">{races.length}</span>}
      </div>

      <div className="circuit-panel-races-body">
        {loadingRaces ? (
          <div className="loading" style={{ padding: 24 }}>
            <div className="ld"/><div className="ld"/><div className="ld"/>
          </div>
        ) : !races.length ? (
          <div className="empty" style={{ padding: 24 }}>No races found</div>
        ) : (
          <table className="dtable">
            <thead><tr><th>Year</th><th>Round</th><th>Race name</th></tr></thead>
            <tbody>
              {races.map(r => (
                <tr key={r.raceId}>
                  <td><span className="badge badge-red">{r.year}</span></td>
                  <td><span className="mono-m">{r.round}</span></td>
                  <td style={{ fontSize: 12 }}>{r.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default function CircuitsPage() {
  const [circuits, setCircuits]         = useState([]);
  const [filtered, setFiltered]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [search, setSearch]             = useState("");
  const [country, setCountry]           = useState("");
  const [selected, setSelected]         = useState(null);
  const [races, setRaces]               = useState([]);
  const [loadingRaces, setLoadingRaces] = useState(false);

  useEffect(() => {
    fetch(`${API}/circuits`)
      .then(r => r.json())
      .then(d => {
        const list = Array.isArray(d) ? d : [];
        setCircuits(list); setFiltered(list); setLoading(false);
      })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

  useEffect(() => {
    let list = circuits;
    if (country) list = list.filter(c => c.country === country);
    if (search)  list = list.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.location || "").toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(list);
  }, [search, country, circuits]);

  function selectCircuit(c) {
    setSelected(c); setRaces([]); setLoadingRaces(true);
    fetch(`${API}/circuits/${c.circuitId}/races`)
      .then(r => r.json())
      .then(d => { setRaces(Array.isArray(d) ? d.sort((a, b) => b.year - a.year) : []); setLoadingRaces(false); })
      .catch(() => setLoadingRaces(false));
  }

  const countries = [...new Set(circuits.map(c => c.country))].sort();

  return (
    <div style={{ height: "calc(100vh - 52px)", display: "flex", flexDirection: "column", overflow: "hidden" }}>

      <div style={{ padding: "14px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, background: "var(--surface)" }}>
        <div>
          <div className="page-eyebrow">F1 Database / Circuits</div>
          <div style={{ fontFamily: "var(--fd)", fontSize: 28, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1, lineHeight: 1 }}>Circuits</div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 3 }}>{circuits.length} circuits worldwide — click any to explore</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input className="f1-input" style={{ width: 180 }} placeholder="Search circuit..." value={search} onChange={e => setSearch(e.target.value)} />
          <select className="f1-select" value={country} onChange={e => setCountry(e.target.value)}>
            <option value="">All countries</option>
            {countries.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <div style={{ width: 280, flexShrink: 0, overflowY: "auto", borderRight: "1px solid var(--border)", background: "var(--dark2)" }}>
          {loading ? (
            <div className="loading"><div className="ld"/><div className="ld"/><div className="ld"/></div>
          ) : error ? (
            <div className="err">✕ {error}</div>
          ) : !filtered.length ? (
            <div className="empty">No circuits match</div>
          ) : filtered.map(c => (
            <div key={c.circuitId} onClick={() => selectCircuit(c)} style={{
              padding: "11px 14px", borderBottom: "1px solid var(--border)", cursor: "pointer",
              background: selected?.circuitId === c.circuitId ? "rgba(225,6,0,0.07)" : "transparent",
              borderLeft: selected?.circuitId === c.circuitId ? "3px solid var(--red)" : "3px solid transparent",
              transition: "background 0.1s, border-color 0.1s",
            }}>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{c.name}</div>
              <div style={{ fontFamily: "var(--fm)", fontSize: 10, color: "var(--muted)" }}>{c.location}, {c.country}</div>
            </div>
          ))}
        </div>

        <div style={{ flex: 1, position: "relative" }}>
          {!loading && (
            <MapContainer center={[20, 0]} zoom={2} style={{ height: "100%", width: "100%" }} scrollWheelZoom>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filtered.map(c => c.lat && c.lng ? (
                <Marker key={c.circuitId} position={[c.lat, c.lng]}
                  icon={selected?.circuitId === c.circuitId ? redIcon : new L.Icon.Default()}
                  eventHandlers={{ click: () => selectCircuit(c) }}
                >
                  <Popup><strong>{c.name}</strong><br/><span style={{ fontSize: 12, color: "#555" }}>{c.location}, {c.country}</span></Popup>
                </Marker>
              ) : null)}
              {selected && <FlyTo circuit={selected} />}
            </MapContainer>
          )}
          {selected && (
            <CircuitPanel circuit={selected} races={races} loadingRaces={loadingRaces} onClose={() => setSelected(null)} />
          )}
        </div>
      </div>
    </div>
  );
}