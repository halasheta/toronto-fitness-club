import React, {useState} from 'react';
import {Button, TextField} from "@mui/material"

const SignUp = () => {
    const [first, setFirst] = useState('');
    const [last, setLast] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [errors, setErrors] = useState({});

    function validate (e){
        let currErrors = {};
        switch (e.target.id){
            case 'first_name':
                if (e.target.value.length > 2) {
                    delete currErrors[first];
                    setFirst(e.target.value);
                }
                else {
                    currErrors[first] = "Please enter a first name."
                }
                break;
            case 'last_name':
                if (e.target.value.length > 2) {
                    delete currErrors[last];
                    setLast(e.target.value);
                }
                else {
                    currErrors[last] = "Please enter a last name."
                }
                break;
            case 'email':
                let valid_email = /^([A-Za-z0-9!#$%&'*+\-\/=?^_`{|}~]|\.[A-Za-z0-9!#$%&'*+\-\/=?^_`{|}~]){1,64}@(([A-Za-z0-9][A-Za-z0-9\-]{0,61}[A-Za-z0-9]{0,1}\.){1,}[A-Za-z]{1,10}|[A-Za-z0-9][A-Za-z0-9\-]{0,61}[A-Za-z0-9]|[A-Za-z0-9]{1,61})$/.test(e.target.value);
                if (valid_email) {
                    delete currErrors[email];
                    setEmail(e.target.value);
                }
                else {
                    currErrors[email] = "Please enter a valid email."
                }
                break;
            case 'phone':
                let valid_phone = /^\d{10}$/.test(e.target.value);
                if (valid_phone){
                    delete currErrors[phone];
                    setPhone(e.target.value);
                }
                else {
                    currErrors[phone] = "Please enter a valid phone (numbers only)."
                }
                break;
            case 'password':
                if (e.target.value.length > 3){
                    delete currErrors[password1];
                    setPassword1(e.target.value);
                }
                else {
                    currErrors[password1] = "Please enter a password."
                }
                break;
            case 'password2':
                console.log(password1);
                console.log(e.target.value);
                let match_pass = password1 === e.target.value;
                if (match_pass){
                    delete currErrors[password2];
                    setPassword2(e.target.value);
                } else {
                    currErrors[password2] = "Passwords don't match."
                }
                break;
            default:
                break;
        }
        setErrors(currErrors);
    }

    const submitReq = () => {
        fetch("http://localhost:8000/accounts/signup/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "email": email,
                "password": password1,
                "password2": password2,
                "first_name": first,
                "last_name": last,
                "phone": phone
            })
        }).then(response => response.json())
            .then(response => {

                console.log(response)

            }).catch(error => console.log(error));
    }

    const required_fields = (first !== "") && (last !== "") && (phone !== "") && (email !== "") && (password1 !== "")
        && (password2 !== "") && (Object.entries(errors).length === 0);

    return (
        <>
            <form>
                <h1>Sign Up</h1>
                <ul>
                    {Object.entries(errors).map(([prop, value]) => {
                        return (
                            <li className='error-message' key={prop}>
                                {value}
                            </li>
                        );
                    })}
                </ul>
                <TextField id="first_name" label="First Name" variant="outlined" required onChange={validate}/>
                <TextField id="last_name" label="Last Name" variant="outlined" required onChange={validate}/>
                <TextField id="email" label="Email" variant="outlined" type="email" required onChange={validate}/>
                <TextField id="phone" label="Phone" variant="outlined" required onChange={validate}/>
                <TextField id="password" label="Password" type="password" variant="outlined" required onChange={validate}/>
                <TextField id="password2" label="Confirm Password" variant="outlined" type="password" required  onChange={validate}/>
                {/*<input*/}
                {/*    accept="image/*"*/}
                {/*    style={{ display: 'none' }}*/}
                {/*    id="raised-button-file"*/}
                {/*    multiple*/}
                {/*    type="file"*/}
                {/*/>*/}
                {/*<label htmlFor="raised-button-file">*/}
                {/*    <Button variant="raised" component="span">*/}
                {/*        Upload*/}
                {/*    </Button>*/}
                {/*</label>*/}

                <Button id="submit-button" variant="contained" onClick={submitReq} disabled={!required_fields}>Sign Up</Button>
            </form>

        </>

    )
}



export default SignUp;