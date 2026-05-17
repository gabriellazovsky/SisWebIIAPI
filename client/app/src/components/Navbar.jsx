import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const nav = useNavigate();
  return (
    <header className="topbar">
      <div className="logo" onClick={() => nav("/")}>
        <span className="logo-f1">F1</span>
        <span className="logo-db">Database</span>
      </div>
      <nav className="nav-links">
        <NavLink to="/" end className={({isActive}) => "nav-link" + (isActive ? " active" : "")}>Drivers</NavLink>
        <NavLink to="/create" className={({isActive}) => "nav-link" + (isActive ? " active" : "")}>+ New Driver</NavLink>
      </nav>
      <div className="nav-status">
        <div className="status-dot" />
        <span>API — PORT 5050</span>
      </div>
    </header>
  );
}