import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import DriversList from "./pages/DriversList.jsx";
import CreateDriver from "./pages/CreateDriver.jsx";
import EditDriver from "./pages/EditDriver.jsx";

export const COLORS = ['#E10600','#00D2BE','#0067FF','#FF8000','#DC0000','#006F62','#B6BABD','#FF2800','#2B4562','#F596C8'];
export const tc  = (id) => COLORS[(id || 0) % COLORS.length];
export const ini = (f='', s='') => ((f[0] || '?') + (s[0] || '?')).toUpperCase();
export const API = 'http://localhost:5050';

const App = () => {
  return (
    <div className="shell">
      <BrowserRouter>
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<DriversList />} />
            <Route path="/create" element={<CreateDriver />} />
            <Route path="/edit/:id" element={<EditDriver />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;