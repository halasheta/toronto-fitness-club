import React, {useContext, useState} from 'react';
import {Autocomplete, Box, Button, FormControl, Input, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import { tokenHandle } from "../../pages/login";
import { useNavigate } from "react-router-dom";
import $ from 'jquery';
import UserAPIContext from "../../contexts/UserAPIContext";
import Status404 from "../Common/Errors/Status404";

const Subscription = () => {
    let navigate = useNavigate();

    const [duration, setDuration] = useState("");
    const [price, setPrice] = useState(0.00);

    const { isAdmin } = useContext(UserAPIContext);

    

    const submitReq = () => {
        tokenHandle()
            .then(success => {
                if (!success) {
                    // TODO: deal with unauthorized access (when a (non-admin) tries to access it)
                    localStorage.setItem("lastPage", "/subscriptions/add")
                    navigate("/login");
                } else {
                    fetch('http://localhost:8000/subscriptions/new/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem("token")}`,
                        },
                        body: JSON.stringify({
                            duration: duration,
                            price: price
                        })
                    })
                        .then(r => {
                            if (r.ok) {
                                navigate('/subscriptions');
                            } else {
                                return r.json();
                            }
                        })
                        .then(r => {
                            let res = r.valueOf();
                            console.log(res);
                        })
                        .catch(err => console.log(err))
                }
            })

    }


    const durationChange = (event) => {
        setDuration(event.target.value);
    };

    const priceChange = (event) => {
        setPrice(event.target.value);
    };

    // TODO: fix dollar sign https://bytutorial.com/blogs/css3/how-to-add-a-currency-sign-inside-a-textbox-field
    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl>
                <InputLabel id="select-duration-label">Duration</InputLabel>
                <Select
                    labelId="select-duration-label"
                    id="select-duration"
                    value={duration}
                    label="Duration"
                    onChange={durationChange}
                >
                    <MenuItem value={"ANNUAL"}>Annual</MenuItem>
                    <MenuItem value={"BIANNUAL"}>Biannual</MenuItem>
                    <MenuItem value={"MONTHLY"}>Monthly</MenuItem>
                    <MenuItem value={"BIWEEKLY"}>Biweekly</MenuItem>
                    <MenuItem value={"WEEKLY"}>Weekly</MenuItem>
                    <MenuItem value={"DAILY"}>Daily</MenuItem>
                </Select>
                <TextField
                    id="filled-number"
                    label="Price"
                    type="Number"
                    variant="outlined"
                    onChange={priceChange}
                />
            </FormControl>
            <br/>
            <Button id="create-button" variant="outlined" onClick={submitReq}>CREATE</Button>
        </Box>
    );
}


export default Subscription;