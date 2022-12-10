import React, {useEffect, useState} from 'react';
import {Outlet, useNavigate, Link} from "react-router-dom";
import {NavLink, Navbar, NavbarBrand, Nav, NavDropdown, NavItem} from "react-bootstrap";
import {LinkContainer} from 'react-router-bootstrap';
import {tokenHandle} from "../login";
 


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
                        <NavDropdown.Item as={Link} to="/classes"> View Classes by Occurrence</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/classes/types/"> View Classes by Type</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/classes/schedule">Class Schedule</NavDropdown.Item>
                    </NavDropdown>

                    <NavDropdown title="Studios" id="nav-dropdown-logged-in" flip align="right">
                        <NavDropdown.Item as={Link} to="/studios"> View All Studios</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/studios/map">Studios near me</NavDropdown.Item>
                    </NavDropdown>

                    {loggedIn &&
                        <NavDropdown title="Accounts" id="nav-dropdown-logged-in"  flip alignRight>
                        <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/payments">Payments</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item onClick={logOut}>Log Out</NavDropdown.Item>
                    </NavDropdown>}

                    {!loggedIn &&
                        <NavDropdown title="Accounts" id="nav-dropdown-not-logged-in" flip alignRight>
                            <NavDropdown.Item as={Link} to="/login">Log In</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/signup">Sign Up</NavDropdown.Item>
                        </NavDropdown>}

                </Nav>
            </Navbar>
            <Outlet/>
        </div>
    )
}

export default Layout;