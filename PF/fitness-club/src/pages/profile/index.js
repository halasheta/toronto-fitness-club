import React from 'react';
import {Button} from "@mui/material";

const Profile = () => {
    console.log(localStorage.getItem("token"));
    console.log(localStorage.getItem("refresh"));

    fetch("http://localhost:8000/accounts/user/profile/", {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
        }
    }).then(response => response.json()).then(data => {
        console.log(data)
    }).catch(error => {
        console.log(error);
    })

    return (
        <Button id="submit-button" variant="contained" >get profile</Button>
    )
}

export default Profile;