import React, {useEffect, useState} from 'react';
import {Outlet, useNavigate, Link} from "react-router-dom";
import {NavLink, Navbar, NavbarBrand, Nav, NavDropdown} from "react-bootstrap";
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
    // TODO: toggle log in/sign up when all else is log-out is hidden and vice versa

    return (
        <div>
            <Navbar bg="dark" variant="dark">
                <NavbarBrand href="/">Toronto Fitness Club</NavbarBrand>
                <Nav className="ml-auto" horizontal>
                    <LinkContainer to="/studios"><NavLink>Studios</NavLink></LinkContainer>

                    <LinkContainer to="/classes"><NavLink>Classes</NavLink></LinkContainer>
                    <LinkContainer to="/subscriptions"><NavLink>Subscriptions</NavLink></LinkContainer>

                    {loggedIn &&
                        <NavDropdown title="Accounts" id="basic-nav-dropdown">
                        <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/payments">Payments</NavDropdown.Item>
                        {/*<LinkContainer to="/payments"><NavDropdown.Item>Payments</NavDropdown.Item></LinkContainer>*/}
                        <NavDropdown.Divider />
                        <NavDropdown.Item onClick={logOut}>Log Out</NavDropdown.Item>
                    </NavDropdown>}

                    {!loggedIn &&
                        <NavDropdown title="Accounts" id="basic-nav-dropdown">
                            <NavDropdown.Item as={Link} to="/login">Log In</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/signup">Sign Up</NavDropdown.Item>
                        </NavDropdown>}

                </Nav>
            </Navbar>



                    {/*<Link to="/studios">Studios</Link>*/}

                    {/*<Link to="/classes">Classes</Link>*/}
                    {/*<Link to="/subscriptions">Subscriptions</Link>*/}
                    {/*<Link to="/profile">Profile</Link>*/}
            <Outlet/>
        </div>
    )
}

export default Layout;