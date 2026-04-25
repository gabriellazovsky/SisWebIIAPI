import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar.js";
import DriversList from "./pages/DriversList.js";
import CreateDriver from "./pages/CreateDriver.js";
import DriverProfile from "./pages/DriverProfile.js";
import EditDriver from "./pages/EditDriver.js";

const App = () => {
    return (
        <BrowserRouter>
            <Navbar />
            <div className="p-4">
                <Routes>
                    <Route exact path="/" element={<DriversList />} />
                    <Route path="/create" element={<CreateDriver />} />
                    <Route path="/driver/:id" element={<DriverProfile />} />
                    <Route path="/edit/:id" element={<EditDriver />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
};

export default App;