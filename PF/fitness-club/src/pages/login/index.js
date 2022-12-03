import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button } from "@mui/material";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [validLogin, setValid] = useState(true);

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
        }).then(response => response.json()).then(data => {
            if (data.access === undefined){
                setValid(false);
            } else {
                localStorage.setItem("token", data.access);
                localStorage.setItem("refresh", data.refresh);
                navigate('/');
            }
        }).catch(error => {
            console.log(error);
            setValid(false);
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