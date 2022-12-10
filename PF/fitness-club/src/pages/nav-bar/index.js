import React, {useEffect, useState} from 'react';
import {Outlet, useNavigate, Link} from "react-router-dom";
import {NavLink, Navbar, NavbarBrand, Nav, NavDropdown, NavItem} from "react-bootstrap";
import {LinkContainer} from 'react-router-bootstrap';
import {tokenHandle} from "../login";
import "./nav-bar.css"
 


const Layout = () => {
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(false);


    const logOut = () => {
        localStorage.setItem("token", null);
        localStorage.setItem("refresh", null);
        navigate("/login")

    }

    useEffect(() => {
        tokenHandle().then(success => {
            if (!success){
                setLoggedIn(false);
            } else {
                setLoggedIn(true);
            }}
        )
    })

    return (
        <div>
            <Navbar bg="dark" variant="dark">
                <NavbarBrand href="/">Toronto Fitness Club</NavbarBrand>
                <Nav className="ml-auto">
                    <LinkContainer to="/subscriptions"><NavLink>Subscriptions</NavLink></LinkContainer>


                    <NavDropdown title="Classes" id="nav-dropdown-logged-in" flip alignRight>
                        <NavDropdown.Item as={Link} to="/classes" className="dropdown-item"> View Classes by Occurrence</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/classes/types/" className="dropdown-item"> View Classes by Type</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/classes/schedule" className="dropdown-item">Class Schedule</NavDropdown.Item>
                    </NavDropdown>

                    <NavDropdown title="Studios" id="nav-dropdown-logged-in" flip align="right">
                        <NavDropdown.Item as={Link} to="/studios" className="dropdown-item"> View All Studios</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/studios/map" className="dropdown-item">Studios near me</NavDropdown.Item>
                    </NavDropdown>

                    {loggedIn &&
                        <NavDropdown title="Accounts" id="nav-dropdown-logged-in"  flip alignRight>
                        <NavDropdown.Item as={Link} to="/profile" className="dropdown-item">Profile</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/payments" className="dropdown-item">Payments</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item onClick={logOut} className="dropdown-item">Log Out</NavDropdown.Item>
                    </NavDropdown>}

                    {!loggedIn &&
                        <NavDropdown title="Accounts" id="nav-dropdown-not-logged-in" flip alignRight>
                            <NavDropdown.Item as={Link} to="/login" className="dropdown-item">Log In</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/signup" className="dropdown-item">Sign Up</NavDropdown.Item>
                        </NavDropdown>}

                </Nav>
            </Navbar>
            <Outlet/>
        </div>
    )
}

export default Layout;