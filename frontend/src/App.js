import "./App.css";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";

import Login from "./pages/Login";
import Home from "./pages/Home";
// import SignUp from "./pages/SignUp";
import OrgView from "./pages/OrgView";
import UserDetails from "./pages/UserDetails";
import AddPhone from "./pages/AddPhone";

function App() {
  const [logged, setLogged] = useState(false);
  const [userID, setUserID] = useState("");

  useEffect(() => {
    const cookie = Cookies.get();
    if (cookie.jwt) {
      const decoded = jwt_decode(cookie.jwt);
      console.log(decoded);
      if (decoded && decoded.id) {
        setLogged(true);
        setUserID(decoded.id);
      } else {
        setLogged(false);
      }
    } else {
      setLogged(false);
    }
  }, []);

  return (
    <>
      <Router basename="/">
        <Routes>
          <Route
            path="/"
            element={
              <Home logged={logged} setLogged={setLogged} userID={userID} />
            }
          />
          <Route
            path="/login"
            element={
              <Login logged={logged} setLogged={setLogged} userID={userID} />
            }
          />
          <Route
            path="/addPhone"
            element={
              <AddPhone logged={logged} setLogged={setLogged} userID={userID} />
            }
          />
          {/* <Route path="/signup" element={<SignUp />} /> */}
          <Route
            path="/orgview"
            element={
              <OrgView logged={logged} setLogged={setLogged} userID={userID} />
            }
          />
          <Route
            path="/userdetails"
            element={
              <UserDetails
                logged={logged}
                setLogged={setLogged}
                userID={userID}
              />
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
