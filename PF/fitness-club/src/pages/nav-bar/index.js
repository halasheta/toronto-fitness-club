import React from 'react';
import {Outlet} from "react-router-dom";
import {NavLink,Navbar, NavbarBrand, Nav} from "react-bootstrap";
import {LinkContainer} from 'react-router-bootstrap';


const Layout = () => {

    return (
        <div>
            <Navbar bg="dark" variant="dark">
                <NavbarBrand href="/">Toronto Fitness Club</NavbarBrand>
                <Nav className="ml-auto" horizontal>
                    <LinkContainer to="/studios"><NavLink>Studios</NavLink></LinkContainer>

                    <LinkContainer to="/classes"><NavLink>Classes</NavLink></LinkContainer>
                    <LinkContainer to="/subscriptions"><NavLink>Subscriptions</NavLink></LinkContainer>
                    <LinkContainer to="/profile"><NavLink>Profile</NavLink></LinkContainer>
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