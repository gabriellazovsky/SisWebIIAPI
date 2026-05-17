import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API } from "../App.jsx";

const FIELDS = [
  {k:"driverRef", label:"Reference",    ph:"alonso",       required:true},
  {k:"forename",  label:"First name",   ph:"Fernando",     required:true},
  {k:"surname",   label:"Last name",    ph:"Alonso",       required:true},
  {k:"nationality",label:"Nationality", ph:"Spanish",      required:true},
  {k:"number",    label:"Number",       ph:"14"},
  {k:"code",      label:"Code",         ph:"ALO"},
  {k:"dob",       label:"Date of birth",type:"date"},
  {k:"url",       label:"Wikipedia URL",ph:"https://...",  type:"url", full:true},
];

export default function CreateDriver() {
  const nav = useNavigate();
  const [form, setForm]       = useState({driverRef:"",forename:"",surname:"",nationality:"",number:"",code:"",dob:"",url:""});
  const [submitting, setSub]  = useState(false);
  const [error, setError]     = useState("");

  useEffect(() => {
    fetch(`${API}/drivers`).then(r => r.json()).then(data => {
      if (!Array.isArray(data)) return;
      const max = data.map(d => Number(d.driverId)).filter(Number.isInteger).reduce((m,v) => Math.max(m,v), 0);
      setForm(f => ({...f, driverId: max + 1}));
    }).catch(()=>{});
  }, []);

  function set(k, v) { setForm(f => ({...f, [k]: v})); }

  async function submit(e) {
    e.preventDefault(); setSub(true); setError("");
    try {
      const p = { driverRef: form.driverRef.trim(), forename: form.forename.trim(), surname: form.surname.trim(), nationality: form.nationality.trim() };
      if (form.driverId) p.driverId = Number(form.driverId);
      if (form.number)   p.number   = Number(form.number);
      if (form.code)     p.code     = form.code.trim().toUpperCase();
      if (form.dob)      p.dob      = form.dob;
      if (form.url)      p.url      = form.url.trim();
      const res = await fetch(`${API}/drivers`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(p) });
      const data = await res.json().catch(()=>({}));
      if (!res.ok) throw new Error(data.message || "Failed");
      nav("/");
    } catch (err) { setError(err.message); }
    finally { setSub(false); }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">F1 Database / Drivers</div>
          <div className="page-title">New Driver</div>
          <div className="page-sub">Add a new driver to the database</div>
        </div>
        <Link to="/" className="btn">← Back</Link>
      </div>

      <div className="tcard" style={{maxWidth:560}}>
        <div className="tcard-toolbar"><div className="tcard-title">Driver details</div></div>
        <div style={{padding:24}}>
          {error && <div className="form-err">{error}</div>}
          <form onSubmit={submit} className="form-grid">
            {FIELDS.map(f => (
              <label key={f.k} className={"form-field"+(f.full?" full":"")}>
                <span className="form-label">{f.label}{f.required?" *":""}</span>
                <input
                  className="f1-input" style={{width:"100%"}}
                  type={f.type||"text"} placeholder={f.ph}
                  value={form[f.k]||""} required={f.required}
                  onChange={e => set(f.k, e.target.value)}
                />
              </label>
            ))}
            <div className="form-actions">
              <Link to="/" className="btn">Cancel</Link>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? "Creating..." : "Create Driver"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}