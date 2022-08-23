import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import OrgView from "./pages/OrgView";
import UserDetails from "./pages/UserDetails";

function App() {
  return (
    <>
      <Router basename="/">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/orgview" element={<OrgView />} />
          <Route path="/userdetails" element={<UserDetails />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
