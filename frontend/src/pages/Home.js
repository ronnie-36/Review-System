import React from "react";
import { Navbar, NavbarBrand, NavLink, Nav, NavItem } from "reactstrap";
import "./Home.css";
import { FaSearch } from "react-icons/fa";
import OrgainsationCard from "../components/OrgainsationCard";
import Orgdata from "./orgTemp.json";

function Home() {
  const [inputText, setInputText] = React.useState("");
  const [searchResult, setSearchResult] = React.useState([]);

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
  // console.log(inputText);

  console.log(searchResult);

  return (
    <>
      <Navbar
        style={{ backgroundColor: "#ff7100" }}
        className="navbar__homepage"
      >
        <NavbarBrand>Review System</NavbarBrand>
        <Nav className="ml-auto" navbar>
          <NavItem
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              padding: "5px",
            }}
          >
            <i
              className="bx bx-user"
              style={{ paddingRight: "10px", cursor: "pointer" }}
            ></i>
            <NavLink href="/login/">Login</NavLink>
          </NavItem>
        </Nav>
      </Navbar>

      {/* search bar */}
      <div className="search__bar">
        <input
          className="search__bar__comp"
          value={inputText}
          onChange={(e) => searchHandle(e)}
        ></input>
        <div className="searchbar__Icon">
          <FaSearch />
        </div>
      </div>

      {/* displayig the search results */}
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
        {searchResult.length === 0 && <h2>No results found</h2>}
      </div>
    </>
  );
}

export default Home;
