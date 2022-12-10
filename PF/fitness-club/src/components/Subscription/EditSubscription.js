import React, {useContext, useEffect, useState} from 'react';
import {
    Box,
    Button,
    FormControl,
    InputAdornment,
    MenuItem,
    TextField
} from "@mui/material";
import { tokenHandle } from "../../pages/login";
import {useNavigate, useParams} from "react-router-dom";
import $ from 'jquery';
import UserAPIContext from "../../contexts/UserAPIContext";
import Status404 from "../Common/Errors/Status404";

const EditSubscription = () => {
    let navigate = useNavigate();

    const {id} = useParams();

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
                        localStorage.setItem("lastPage", "/subscriptions/" + String(id) + "/edit/")
                        navigate("/login");
                    } else {
                        fetch('http://localhost:8000/subscriptions/' + id + "/edit/", {
                            method: 'PUT',
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
                                    return Promise.reject(r);
                                }
                            }).catch(err => console.log(err))
                    }
                })
        }
    }

    const getData = () => {
        tokenHandle()
                .then(success => {
                    if (!success) {
                        // TODO: deal with unauthorized access (when a (non-admin) tries to access it)
                        localStorage.setItem("lastPage", "/subscriptions/" + String(id) + "/edit/")
                        navigate("/login");
                    } else {
                        fetch('http://localhost:8000/subscriptions/' + id + "/edit/", {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${localStorage.getItem("token")}`,
                            }
                        })
                            .then(r => {
                                if (!r.ok) {
                                    return Promise.reject(r);
                                } else {
                                    return r.json();
                                }
                            })
                            .then(r => {
                                setPrice(r.price);
                                setDuration(r.duration);
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

    useEffect(() => {
        getData();
    }, [])

    return (
        <>
        <h1>Edit Subscription</h1>
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
                <TextField
                           id="filled-number"
                           label="Price"
                           type="Number"
                           variant="outlined"
                           onChange={priceChange}
                           value={price}
                           InputProps={{
                               startAdornment: <InputAdornment position="start">$</InputAdornment>,
                           }}
                           error={errors.price !== undefined}
                           helperText={errors.price}>
                </TextField>
                <br/>
            </FormControl>
            <Button id="edit-button" variant="outlined" onClick={submitReq}>EDIT</Button>
        </Box>
        </>
    );
}


export default EditSubscription;