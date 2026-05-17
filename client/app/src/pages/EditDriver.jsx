import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { API } from "../App.jsx";

const FIELDS = [
  {k:"driverRef",  label:"Reference",    required:true},
  {k:"forename",   label:"First name",   required:true},
  {k:"surname",    label:"Last name",    required:true},
  {k:"nationality",label:"Nationality",  required:true},
  {k:"number",     label:"Number"},
  {k:"code",       label:"Code"},
  {k:"dob",        label:"Date of birth", type:"date"},
  {k:"url",        label:"Wikipedia URL", type:"url", full:true},
];

export default function EditDriver() {
  const { id }    = useParams();
  const nav       = useNavigate();
  const [form, setForm]     = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSub]  = useState(false);
  const [error, setError]     = useState("");

  useEffect(() => {
    fetch(`${API}/drivers/${id}`)
      .then(r => r.json())
      .then(data => {
        setForm({
          driverRef:   data.driverRef   || "",
          forename:    data.forename    || "",
          surname:     data.surname     || "",
          nationality: data.nationality || "",
          number:      data.number      ?? "",
          code:        data.code        || "",
          dob:         data.dob ? String(data.dob).slice(0,10) : "",
          url:         data.url         || "",
        });
        setLoading(false);
      })
      .catch(e => { setError(e.message); setLoading(false); });
  }, [id]);

  function set(k, v) { setForm(f => ({...f, [k]: v})); }

  async function submit(e) {
    e.preventDefault(); setSub(true); setError("");
    try {
      const p = { driverRef: form.driverRef.trim(), forename: form.forename.trim(), surname: form.surname.trim(), nationality: form.nationality.trim() };
      if (form.number !== "") p.number = Number(form.number);
      if (form.code)          p.code   = form.code.trim().toUpperCase();
      if (form.dob)           p.dob    = form.dob;
      if (form.url)           p.url    = form.url.trim();
      const res = await fetch(`${API}/drivers/${id}`, { method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify(p) });
      const data = await res.json().catch(()=>({}));
      if (!res.ok) throw new Error(data.message || "Failed");
      nav("/");
    } catch (err) { setError(err.message); }
    finally { setSub(false); }
  }

  if (loading) return <div className="loading" style={{height:"60vh"}}><div className="ld"/><div className="ld"/><div className="ld"/><span>Loading driver...</span></div>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="page-eyebrow">F1 Database / Drivers</div>
          <div className="page-title">Edit Driver</div>
          <div className="page-sub">ID: {id}</div>
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
                  type={f.type||"text"}
                  value={form[f.k]||""} required={f.required}
                  onChange={e => set(f.k, e.target.value)}
                />
              </label>
            ))}
            <div className="form-actions">
              <Link to="/" className="btn">Cancel</Link>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}