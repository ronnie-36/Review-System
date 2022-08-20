import React from 'react';
import {Navbar, NavbarBrand, NavLink, Nav, NavItem} from "reactstrap"
import "./Home.css";
import Footer from './components/Footer';

function Home() {
  return (
    <>
        <Navbar
          style={{'backgroundColor': '#ff7100'}}
          className='navbar__homepage'
        >
          <NavbarBrand>Review System</NavbarBrand>
            <Nav className="ml-auto" navbar>
              <NavItem style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                padding: "5px"
              }}>
                <i class='bx bx-user' style={{paddingRight: "10px", cursor: "pointer"}}></i>
                <NavLink href="/login/">Login</NavLink>
              </NavItem>
            </Nav>
        </Navbar>

        <Footer />
    </>
  )
}

export default Home