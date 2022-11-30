import React, {useState} from 'react';
import {Button, TextField} from "@mui/material"

const SignUp = () => {
    const [first, setFirst] = useState('');
    const [last, setLast] = useState('');
    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    // const [password2, setPassword2] = useState('');


    return (
        <>
            <TextField id="first_name" label="First Name" variant="outlined" required onChange={e => setFirst(e.target.value)}/>
            <TextField id="last_name" label="Last Name" variant="outlined" required onChange={e => setLast(e.target.value)}/>
            <TextField id="email" label="Email" variant="outlined" type="email" required onChange={e => setEmail(e.target.value)}/>
            <TextField id="password" label="Password" variant="outlined" required onChange={e => setPassword1(e.target.value)}/>
            <TextField id="password2" label="Confirm Password" variant="outlined" required  onChange={e => setPassword2(e.target.value)}/>
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

        </>

    )
}

export default SignUp;