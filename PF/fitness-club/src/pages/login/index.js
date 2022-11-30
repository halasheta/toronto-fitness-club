import React, { useState } from 'react';
import { TextField, Button } from "@mui/material";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const submitReq = () => {
        fetch("http://localhost:8000/accounts/login/", {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
            },
            body: JSON.stringify({
                "email": email,
                "password": password,
            })
        }).then(response => response.json())
        .then(response => {
        
            console.log(response)
        
        }).catch(error => console.log(error));

    }
    return <>
        <TextField id="email" label="Email" variant="outlined" type="email" 
        onChange={e => setEmail(e.target.value)}/>
        <br/>
        <TextField id="password" label="Password" variant="outlined" type="password" 
        onChange={e => setPassword(e.target.value)}/>
        <br/>
        <Button id="login-button" variant="contained" onClick={submitReq}>Log in</Button>
    </>
}

export default Login;