import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const LINKS = [
  { to: "/",             label: "Drivers",      end: true },
  { to: "/constructors", label: "Constructors"             },
  { to: "/circuits",     label: "Circuits"                 },
  { to: "/results",      label: "Results"                  },
];

export default function Navbar() {
  const nav = useNavigate();
  return (
    <header className="topbar">
      <div className="logo" onClick={() => nav("/")}>
        <span className="logo-f1">F1</span>
        <span className="logo-db">Database</span>
      </div>
      <nav className="nav-links">
        {LINKS.map(l => (
          <NavLink key={l.to} to={l.to} end={l.end}
            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
            {l.label}
          </NavLink>
        ))}
      </nav>
      <div className="nav-status">
        <div className="status-dot" />
        <span>API — PORT 5050</span>
      </div>
    </header>
  );
}