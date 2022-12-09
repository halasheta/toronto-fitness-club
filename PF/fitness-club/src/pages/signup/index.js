import React, {useState} from 'react';
import {Button, TextField} from "@mui/material"
import {Link, useNavigate} from "react-router-dom";


// display file name
// move errors to each box
// only check errors on signup

const SignUp = () => {
    const [first, setFirst] = useState('');
    const [last, setLast] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    function validate_all(){
        let currErrors = validateEditable(first, last, email, phone);

        if (password1 === ''){
            currErrors["password1"] = "Please enter a password."
        }

        if (password2 === '' || password1 !== password2){
            currErrors["password2"] = "Passwords don't match."
        }

        setErrors(currErrors);
        return (Object.entries(currErrors).length === 0);
    }


    function uploadAvatar (e) {
        setAvatar(e.target.files[0])
    }

    const submitReq = () => {
        if (validate_all()) {

            let form_data = new FormData();
            form_data.append('email', email);
            form_data.append('password', password1);
            form_data.append('password2', password2);
            form_data.append('first_name', first);
            form_data.append('last_name', last);
            form_data.append('phone', phone);
            if (avatar != null){
                form_data.append('avatar', avatar);
            }

            fetch("http://localhost:8000/accounts/signup/", {
                method: 'POST',
                body: form_data,
            }).then(response => {
                if (!response.ok){
                    return Promise.reject(response);
                }
                return response.json()
            })
                .then(response => {
                    console.log(response);
                    navigate("/");

                }).catch(error => {
                    error.email = "Email is already taken.";
                    setErrors(error);
                });
        }
    }

    return (
        <>
            <h1>Sign Up</h1>
            <form>
                <TextField id="first_name" label="First Name" variant="outlined" required onChange={e => setFirst(e.target.value)}
                           error={errors.first !== undefined} helperText={errors.first}/>
                <TextField id="last_name" label="Last Name" variant="outlined" required onChange={e => setLast(e.target.value)}
                           error={errors.last !== undefined} helperText={errors.last}/>
                <TextField id="email" label="Email" variant="outlined" type="email" required onChange={e => setEmail(e.target.value)}
                           error={errors.email !== undefined} helperText={errors.email}/>
                <TextField id="phone" label="Phone" variant="outlined" required onChange={e => setPhone(e.target.value)}
                           error={errors.phone !== undefined} helperText={errors.phone} type="number"/>
                <TextField id="password" label="Password" type="password" variant="outlined" required onChange={e => setPassword1(e.target.value)}
                           error={errors.password1 !== undefined} helperText={errors.password1}/>
                <TextField id="password2" label="Confirm Password" variant="outlined" type="password" required  onChange={e => setPassword2(e.target.value)}
                           error={errors.password2 !== undefined} helperText={errors.password2}/>
                <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="avatar-button-file"
                    type="file"
                    onChange={uploadAvatar}
                />
                <label htmlFor="avatar-button-file">
                    <Button variant="contained" component="span">
                        Upload Avatar
                    </Button>
                </label>

                <Button id="submit-button" variant="contained" onClick={submitReq}>Sign Up</Button>
            </form>

            <br/>
            <Link to="/login">Already have an account? <u>Log in here!</u></Link>

        </>

    )
}

// CREATE TERMINAL
// node cors.js
// create proxy for localhost and call apis with this??????


export default SignUp;

export function validateEditable(first, last, email, phone) {
    let currErrors = {};
    if (first === '') {
        currErrors["first"] = "Please enter a first name.";
    }
    if (last === '') {
        currErrors["last"] = "Please enter a last name.";
    }

    let valid_email = /^((\w|[!#$%&'*+\-\/=?^`{|}~])(\.\w|\.[!#$%&'*+\-\/=?^`{|}~])?){1,64}@([A-Za-z0-9](-?[A-Za-z0-9]|\.?[A-Za-z0-9])*)+$/
    if (email === '' || !valid_email.test(email)) {
        currErrors["email"] = "Please enter a valid email.";
    }

    let valid_phone = /^\d{10}$/
    if (phone === '' || !valid_phone.test(phone)) {
        currErrors["phone"] = "Please enter a valid phone number.";
    }
    return currErrors;
}