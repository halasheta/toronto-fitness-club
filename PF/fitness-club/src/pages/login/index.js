import React, {useContext, useEffect, useState} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button } from "@mui/material";
import UserAPIContext from "../../contexts/UserAPIContext";

import './login.css';
 

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [validLogin, setValid] = useState(true);
    const { isAdmin, subscription, setIsAdmin, setSubscription } = useContext(UserAPIContext);

    let navigate = useNavigate();

    const submitReq = () => {
        fetch("http://localhost:8000/accounts/login/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "email": email,
                "password": password,
            })
        }).then(response => {
            if (!response.ok){
                setValid(false);
                return Promise.reject(response);
            }
            return response.json()
        }).then(async data => {
            if (data.access === undefined) {
                setValid(false);
            } else {
                localStorage.setItem("token", data.access);
                localStorage.setItem("refresh", data.refresh);
                fetch("http://localhost:8000/accounts/user/profile/", {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${data.access}`,
                    }
                }).then(response => {
                    if (!response.ok) {
                        return Promise.reject(response);
                    }
                    return response.json()
                }).then(data => {
                    setIsAdmin(data.is_superuser);
                    setSubscription(String(data.subscription));
                    navigate("/");
                }).catch(err => {
                    console.log(err);
                })
            }
        }).catch(error => {
            console.log(error.status, error.statusText);
        })
    }

    return <div className="login-page">

        <h1>Log In</h1>
        <form>
            <TextField id="email" label="Email" variant="outlined" type="email" error={!validLogin} required
            onChange={e => setEmail(e.target.value)}/>
            <br/>
            <TextField id="password" label="Password" variant="outlined" type="password" required
            onChange={e => setPassword(e.target.value)} error={!validLogin}
                       helperText={!validLogin ? 'Invalid email or password.' : ' '}/>
            <br/>
            <Button className="Button" id="login-button" variant="contained" onClick={submitReq}>Log in</Button>
        </form>
        <br/>
        <Link to="/signup">Don't have an account? <u>Sign up here!</u></Link>
    </div>
}

export default Login;

export async function tokenHandle() {
    return await fetch("http://localhost:8000/accounts/token/refresh/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "refresh": localStorage.getItem("refresh"),
            })
        }).then(response => {
            if (!response.ok) {
                // token refresh didn't work
                return Promise.reject(response);
            } else {
                return response.json();
            }
        }).then(data => {
            localStorage.setItem("token", data.access);
            return true;
        }).catch(response => {
            console.log(response.status, response.statusText);
            return false;
        })
}


