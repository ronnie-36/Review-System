import "./App.css";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/Login";
import Home from "./pages/Home";
import OrgView from "./pages/OrgView";
import UserDetails from "./pages/UserDetails";
import AddPhone from "./pages/AddPhone";
import { checkLogin } from "./apiHelpers/authentication";
import { ToastContainer } from "react-toastify";
import { Spinner } from "reactstrap";

function App() {
  const [logged, setLogged] = useState(false);
  const [userID, setUserID] = useState(localStorage.getItem("user"));
  const [org, setOrg] = useState(JSON.parse(localStorage.getItem("org")));
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const temp = JSON.parse(localStorage.getItem("org"));
    setOrg(temp);

    const cookie = Cookies.get();
    if (cookie.jwt) {
      const decoded = jwt_decode(cookie.jwt);
      if (decoded && decoded.id) {
        (async () => {
          const response = await checkLogin();
          if (response.status !== "success") {
            setLogged(false);
            localStorage.setItem("user", null);
          } else {
            setLogged(true);
            setUserID(decoded.id);
            localStorage.setItem("user", decoded.id);
          }
        })();
      } else {
        setLogged(false);
        localStorage.setItem("user", null);
      }
    } else {
      setLogged(false);
      localStorage.setItem("user", null);
    }
    setAuthLoading(false);
  }, []);

  return (
    <>
      {authLoading ? (
        <div className="vw-100 vh-100 d-flex justify-content-center align-items-center">
          <Spinner>Loading...</Spinner>
        </div>
      ) : (
        <Router basename="/">
          <ToastContainer />
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  logged={logged}
                  setLogged={setLogged}
                  userID={userID}
                  org={org}
                  setOrg={setOrg}
                />
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
                <AddPhone
                  logged={logged}
                  setLogged={setLogged}
                  userID={userID}
                />
              }
            />
            <Route
              path="/orgview"
              element={
                <OrgView
                  logged={logged}
                  setLogged={setLogged}
                  userID={userID}
                  org={org}
                />
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
      )}
    </>
  );
}

export default App;
