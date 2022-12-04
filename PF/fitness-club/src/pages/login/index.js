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
                navigate('/');
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

export async function checkValidToken() {
    let valid = false;
    await fetch("http://localhost:8000/accounts/token/verify/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "token": localStorage.getItem("token"),
        })
    }).then(response => {
        console.log(response.ok);
        if (response.ok === true) {
            // token is valid
            valid = true;
        } else {
            return Promise.reject(response);
        }
    }).catch(response => {
        console.log(response.status, response.statusText);
        valid = false;
    })
    return valid;
}

// export async function tokenHandle() {
//     await fetch("http://localhost:8000/accounts/token/verify/", {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//             "token": localStorage.getItem("token"),
//         })
//     }).then(response => {
//         console.log(response.ok);
//         if (response.ok === true) {
//             // token is valid
//             return true;
//         } else {
//             return Promise.reject(response);
//         }
//     }).catch(async response => {
//         console.log(response.status, response.statusText);
//         return await fetch("http://localhost:8000/accounts/token/refresh/", {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 "refresh": localStorage.getItem("refresh"),
//             })
//         }).then(response => {
//             console.log(response.ok);
//             if (!response.ok) {
//                 // token refresh didn't work
//                 return Promise.reject(response);
//             } else {
//                 return response.json();
//             }
//         }).then(data => {
//             localStorage.setItem("token", data.access);
//             return true;
//         }).catch(response => {
//             console.log(response.status, response.statusText);
//             return false;
//         })
//     })
// }

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
            console.log(response.ok);
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