import React from 'react';
import {Outlet} from "react-router-dom";
import {NavLink, Navbar, NavbarBrand, Nav} from "react-bootstrap";

const Layout = () => {

    return (
        <div>
            <Navbar bg="dark" variant="dark">
                <NavbarBrand href="/">Toronto Fitness Club</NavbarBrand>
                <Nav className="ml-auto" horizontal>
                    <NavLink href="/studios">Studios</NavLink>

                    <NavLink href="/classes">Classes</NavLink>
                    <NavLink href="/subscriptions">Subscriptions</NavLink>
                    <NavLink href="/profile">Profile</NavLink>
                </Nav>
            </Navbar>
            <Outlet/>
        </div>
    )
}

export default Layout;