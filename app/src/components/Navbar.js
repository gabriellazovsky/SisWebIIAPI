import React from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
    return (
        <div>
            <nav className="flex justify-between items-center mb-6 bg-gray-800 p-4 text-white">
                <NavLink to="/">
                    <h1 className="text-xl font-bold">F1 Database</h1>
                </NavLink>
                <NavLink to="/create" className="bg-blue-500 px-4 py-2 rounded">
                    Crear Piloto
                </NavLink>
            </nav>
        </div>
    );
}