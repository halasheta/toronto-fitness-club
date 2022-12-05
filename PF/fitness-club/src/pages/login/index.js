import React, {useContext, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button } from "@mui/material";
import StudiosAPIContext from "../../contexts/StudiosAPIContext";
import UserAPIContext from "../../contexts/UserAPIContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [validLogin, setValid] = useState(true);
    const { setIsAdmin, setSubscription } = useContext(UserAPIContext);

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
        }).then(data => {
            if (data.access === undefined){
                setValid(false);
            } else {
                localStorage.setItem("token", data.access);
                localStorage.setItem("refresh", data.refresh);
                fetch("http://localhost:8000/accounts/user/profile/", {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    }
                }) .then(response => {
                    if (!response.ok){
                        return Promise.reject(response);
                    }
                    return response.json()
                }).then(data => {
                    setIsAdmin(data.is_superuser);
                    setSubscription(data.subscription);
                    navigate("/");
                }).catch(err => {
                    console.log(err);
                })
            }
        }).catch(error => {
            console.log(error.status, error.statusText);
        })
    }


    return <>
        <TextField id="email" label="Email" variant="outlined" type="email" 
        onChange={e => setEmail(e.target.value)}/>
        <br/>
        <TextField id="password" label="Password" variant="outlined" type="password"
        onChange={e => setPassword(e.target.value)} error={!validLogin}
                   helperText={!validLogin ? 'Invalid email or password.' : ' '}/>
        <br/>
        <Button id="login-button" variant="contained" onClick={submitReq}>Log in</Button>
    </>
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


