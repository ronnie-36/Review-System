import React from "react";
import { Button } from "reactstrap";
import "./css/Home.css";
import { FaSearch } from "react-icons/fa";
import OrgainsationCard from "../components/OrgainsationCard";
import Orgdata from "./orgTemp.json";
import { Modal, Form, FormGroup, Label, Input } from "reactstrap";
import Header from "../components/Header";
import OrgSearch from "../components/OrgSearch";

function Home({ logged, setLogged, org, setOrg }) {
  const [inputText, setInputText] = React.useState("");
  const [searchResult, setSearchResult] = React.useState([]);
  const [addOrgDetails, setAddOrgDetails] = React.useState({});
  const [modelOpen, setModelOpen] = React.useState(false);

  let searchHandle = (e) => {
    //convert input text to lower case
    var lowerCase = e.target.value.toLowerCase();
    setInputText(lowerCase);

    const newFilter = Orgdata.filter((value) => {
      return value.name.toLowerCase().includes(lowerCase);
    });

    if (lowerCase === "") {
      setSearchResult([]);
    } else {
      setSearchResult(newFilter);
    }
  };

  const Toggle = () => {
    setModelOpen(!modelOpen);
  };

  const addOrganisation = (e) => {
    e.preventDefault();
    console.log(addOrgDetails);
    setAddOrgDetails({});
    Toggle();
  };
  // console.log(inputText);

  return (
    <>
      <Header logged={logged} setLogged={setLogged} />

      {/* search bar */}
      {/* <div className="search__bar">
        <input
          className="search__bar__comp"
          value={inputText}
          onChange={(e) => searchHandle(e)}
        ></input>
        <div className="searchbar__Icon">
          <FaSearch />
        </div>
      </div> */}
      <div className="d-flex flex-column align-items-center mt-3">
        <div className="fw-bold mb-3">Search and Select an Organization</div>
        <OrgSearch org={org} setOrg={setOrg} />
      </div>

      {/* displayig the search results
      <div className="organisation_cards_search">
        {}
        {searchResult.length > 0 &&
          searchResult.map((ele, index) => {
            return (
              <OrgainsationCard
                name={ele.name}
                rating={ele.rating}
                key={index}
              />
            );
          })}
        {searchResult.length === 0 && (
          <div className="organisation__noresults">
            <h2>No results found</h2>
          </div>
        )}
      </div> */}
    </>
  );
}

export default Home;
