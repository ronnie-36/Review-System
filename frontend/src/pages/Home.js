import React from "react";
import { Navbar, NavbarBrand, NavLink, Nav, NavItem, Button } from "reactstrap";
import "./Home.css";
import { FaSearch } from "react-icons/fa";
import OrgainsationCard from "../components/OrgainsationCard";
import Orgdata from "./orgTemp.json";
import { Modal, Form, FormGroup, Label, Input } from "reactstrap";

function Home() {
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
        {searchResult.length === 0 && (
          <div className="organisation__noresults">
            <h2>No results found</h2>
            <p onClick={(e) => Toggle()}>add the organisation</p>
          </div>
        )}
      </div>

      <Modal isOpen={modelOpen} toggle={Toggle} className="addOrg__modal">
        <Form>
          <FormGroup>
            <Label for="exampleEmail">Name</Label>
            <Input
              type="text"
              placeholder="name of the organisation"
              value={addOrgDetails.name}
              onChange={(e) => {
                setAddOrgDetails((prev) => ({
                  ...prev,
                  name: e.target.value,
                }));
              }}
            />
            <Label for="exampleEmail">Location</Label>
            <Input
              type="text"
              placeholder="enter the location"
              value={addOrgDetails.location}
              onChange={(e) => {
                setAddOrgDetails((prev) => ({
                  ...prev,
                  location: e.target.value,
                }));
              }}
            />
            <Label for="exampleEmail">email</Label>
            <Input
              type="email"
              placeholder="enter the email address of org"
              value={addOrgDetails.email}
              onChange={(e) => {
                setAddOrgDetails((prev) => ({
                  ...prev,
                  email: e.target.value,
                }));
              }}
            />
            <Label for="exampleEmail">phone number</Label>
            <Input
              type="text"
              placeholder="enter the email address of org"
              value={addOrgDetails.phone}
              onChange={(e) => {
                setAddOrgDetails((prev) => ({
                  ...prev,
                  phone: e.target.value,
                }));
              }}
            />
            <Label for="exampleEmail">website</Label>
            <Input
              type="text"
              placeholder="enter the email address of org"
              value={addOrgDetails.website}
              onChange={(e) => {
                setAddOrgDetails((prev) => ({
                  ...prev,
                  website: e.target.value,
                }));
              }}
            />
          </FormGroup>

          <Button
            onClick={(e) => {
              addOrganisation(e);
            }}
            style={{
              marginLeft: "30%",
            }}
          >
            Add the organisation
          </Button>
        </Form>
      </Modal>
    </>
  );
}

export default Home;
