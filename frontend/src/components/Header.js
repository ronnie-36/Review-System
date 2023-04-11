import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../apiHelpers/authentication";
import { Nav, NavLink, NavItem, NavbarBrand, Navbar } from "reactstrap";
import "./css/Header.css";
import { toast } from "react-toastify";

function Header({ logged, setLogged }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const response = await logout();
    if (response.status === "success") {
      setLogged(false);
      localStorage.setItem("user", null);
      navigate("/");
      toast.success("Logged Out successfully");
    } else {
      toast.error("Unable to Logout");
    }
  };

  return (
    <Navbar
      style={{ backgroundColor: "rgb(58, 172, 203)" }}
      className="navbar__homepage"
    >
      <NavbarBrand href="/" className="me-auto">
        AntiCor
      </NavbarBrand>
      <Nav className="ml-auto" navbar>
        <NavItem
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            padding: "5px",
          }}
        >
          {logged && (
            <Link className="me-3 customlink" to="/userdetails">
              My Reviews
            </Link>
          )}
          {!logged ? (
            <NavLink href="/login/">Login</NavLink>
          ) : (
            <NavLink style={{ cursor: "pointer" }} onClick={handleLogout}>
              Logout
            </NavLink>
          )}
        </NavItem>
      </Nav>
    </Navbar>
  );
}

export default Header;
