import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPage from "./components/AdminPage";
import UserPage from "./components/UserPage";
import WelcomePage from "./components/WelcomePage";
import Navigation from "./components/Navigation";
import LoginAdmin from "./components/LoginAdmin";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/" element={<WelcomePage />} />
        <Route path="/loginadmin" element={<LoginAdmin />} />
        <Route path="/navigation" element={<Navigation />} />
        <Route path="/user" element={<UserPage />} />
      </Routes>
    </Router>
  );
};

export default App;
