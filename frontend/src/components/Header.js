import React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../apiHelpers/authentication";
import { Nav, NavLink, NavItem, NavbarBrand, Navbar } from "reactstrap";

function Header({ logged, setLogged }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const response = await logout();
    if (response.status === "success") {
      setLogged(false);
      navigate("/");
    } else {
      //TODO: handle Error
    }
  };

  return (
    <Navbar
      style={{ backgroundColor: "rgb(58, 172, 203)" }}
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
          {!logged ? (
            <NavLink href="/login/">Login</NavLink>
          ) : (
            <NavLink onClick={handleLogout}>Logout</NavLink>
          )}
        </NavItem>
      </Nav>
    </Navbar>
  );
}

export default Header;
