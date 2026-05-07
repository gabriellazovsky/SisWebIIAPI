import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import DriversList from "./pages/DriversList.jsx";
import CreateDriver from "./pages/CreateDriver.jsx";
import DriverProfile from "./pages/DriverProfile.jsx";
import EditDriver from "./pages/EditDriver.jsx";

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
