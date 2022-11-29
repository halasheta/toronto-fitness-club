import React from 'react';
import {Link, Outlet} from "react-router-dom";

const Navigation = () => {
    return (
        <>
            <nav>
                <Link to="/studios">Studios</Link>
                <Link to="/classes">Classes</Link>
                <Link to="/subscriptions">Subscriptions</Link>
                <Link to="/profile">Profile</Link>
            </nav>
            <Outlet/>
        </>
    )
}

export default Navigation;