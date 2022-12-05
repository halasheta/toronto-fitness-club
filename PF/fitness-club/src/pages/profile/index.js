import React, {useContext, useEffect, useState} from 'react';
import {Button, TextField} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {tokenHandle} from "../login";
import {validateEditable} from "../signup";
import UserAPIContext from "../../contexts/UserAPIContext";

const Profile = () => {
    const [first, setFirst] = useState('');
    const [last, setLast] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [errors, setErrors] = useState({});

    let navigate = useNavigate();

    function uploadAvatar (e) {
        let form_data = new FormData();
        form_data.append('email', email);
        form_data.append('avatar', e.target.files[0]);

        fetch("http://localhost:8000/accounts/user/profile/", {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`,
            },
            body: form_data,
        }).then(response => {
            return response.json();
        }).then(data => {
            setAvatar(data.avatar)
        }).catch(err => {
            console.log(err);
        })
    }

    const getData = () => {
        tokenHandle().then(success => {
                if (!success){
                    localStorage.setItem("lastPage", "/profile")
                    navigate("/login");
                } else {
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
                        setFirst(data.first_name)
                        setLast(data.last_name)
                        setEmail(data.email)
                        setAvatar(data.avatar)
                        setPhone(data.phone)
                    }).catch(err => {
                        console.log(err);
                    })
                }
            }
        )
    }

    const updateData = () => {
        let currErrors = validateEditable(first, last, email, phone);
        setErrors(currErrors);
        if (Object.entries(currErrors).length === 0){
            let form_data = new FormData();
            form_data.append('email', email);
            form_data.append('first_name', first);
            form_data.append('last_name', last);
            form_data.append('phone', phone);
            fetch("http://localhost:8000/accounts/user/profile/", {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                },
                body: form_data,
            }).then(response => {
                return response.json();
            }).then(data => {
                setFirst(data.first_name);
                setLast(data.last_name);
                setEmail(data.email);
                setPhone(data.phone);
                setAvatar(data.avatar);

            }).catch(err => {
                console.log(err);
            })
        }
    }

    useEffect(() => {
        getData();
    }, []);

    return <>
        <img alt='profile' src={avatar} width="250"/><input
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
        <TextField id="first_name" label="First Name" variant="outlined" required onChange={e => setFirst(e.target.value)}
            error={errors.first !== undefined} helperText={errors.first} value={first}/>
        <TextField id="last_name" label="Last Name" variant="outlined" required onChange={e => setLast(e.target.value)}
                   error={errors.last !== undefined} helperText={errors.last} value={last}/>
        <TextField id="email" label="Email" variant="outlined" type="email" required onChange={e => setEmail(e.target.value)}
                   error={errors.email !== undefined} helperText={errors.email} value={email}/>
        <TextField id="phone" label="Phone (Numbers only)" variant="outlined" required onChange={e => setPhone(e.target.value)}
                   error={errors.phone !== undefined} helperText={errors.phone} value={phone}/>
        <Button id="toggle-edit-button" variant="contained" onClick={updateData}>Save Changes</Button>
    </>




}

export default Profile;