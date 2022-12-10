import React, {useContext, useState} from 'react';


import {
    Autocomplete,
    Box,
    Button,
    FormControl,
    Input,
    InputAdornment,
    InputLabel,
    MenuItem, OutlinedInput,
    Select,
    TextField
} from "@mui/material";
import { tokenHandle } from "../../pages/login";
import { useNavigate } from "react-router-dom";
import $ from 'jquery';
import UserAPIContext from "../../contexts/UserAPIContext";
import Status404 from "../Common/Errors/Status404";

const Subscription = () => {
    let navigate = useNavigate();

    const [duration, setDuration] = useState("");
    const [price, setPrice] = useState(0.00);
    const [errors, setErrors] = useState({});

    const { isAdmin } = useContext(UserAPIContext);

    

    const submitReq = () => {
        let currErrors = {};
        if (price < 1){
            currErrors.price = "Please input a valid price."
        }

        if (duration === ""){
            currErrors.duration = "Please select a duration."
        }
        setErrors(currErrors);

        if (Object.entries(currErrors).length === 0){
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
    }


    const durationChange = (event) => {
        setDuration(event.target.value);
    };

    const priceChange = (event) => {
        setPrice(event.target.value);
    };

    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl sx={{ minWidth: 120 }}  helperText={errors.duration}>
                <TextField
                    id="select-duration"
                    value={duration}
                    label="Duration"
                    onChange={durationChange}
                    error={errors.duration !== undefined}
                    select
                >
                    <MenuItem value={"ANNUAL"}>Annual</MenuItem>
                    <MenuItem value={"BIANNUAL"}>Biannual</MenuItem>
                    <MenuItem value={"MONTHLY"}>Monthly</MenuItem>
                    <MenuItem value={"BIWEEKLY"}>Biweekly</MenuItem>
                    <MenuItem value={"WEEKLY"}>Weekly</MenuItem>
                    <MenuItem value={"DAILY"}>Daily</MenuItem>
                </TextField>
            </FormControl>
            <br/>
            <FormControl sx={{ minWidth: 120 }}  >
                <TextField startAdornment={<InputAdornment position="start">$</InputAdornment>}
                           id="filled-number"
                           label="Price"
                           type="Number"
                           variant="outlined"
                           onChange={priceChange}
                           InputProps={{
                               startAdornment: <InputAdornment position="start">$</InputAdornment>,
                           }}
                           error={errors.price !== undefined}
                           helperText={errors.price}>
                </TextField>
                <br/>
            </FormControl>
            <Button className="Button" id="create-button" variant="outlined" onClick={submitReq}>CREATE</Button>
        </Box>
    );
}


export default Subscription;