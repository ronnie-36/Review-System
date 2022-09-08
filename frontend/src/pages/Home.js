import React from "react";
import "./css/Home.css";
import Header from "../components/Header";
import OrgSearch from "../components/OrgSearch";

function Home({ logged, setLogged, org, setOrg }) {
  return (
    <>
      <Header logged={logged} setLogged={setLogged} />

      <div className="d-flex flex-column align-items-center mt-3">
        <div className="fw-bold mb-3">
          Search and Select an Organization on the Map
        </div>
        <OrgSearch org={org} setOrg={setOrg} />
      </div>
    </>
  );
}

export default Home;
