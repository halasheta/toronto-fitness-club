

import React, {useContext, useEffect, useState} from 'react';
import { tokenHandle } from "../../../pages/login";
import {useNavigate, useParams} from "react-router-dom";
import {Button, MenuItem, TextField} from "@mui/material";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DesktopDatePicker} from "@mui/x-date-pickers";
import UserAPIContext from "../../../contexts/UserAPIContext";
import dayjs from "dayjs";

const EditClass = () => {
    let navigate = useNavigate();
    const { id } = useParams();
    const { isAdmin } = useContext(UserAPIContext);

    const [ name, setName ] = useState("");
    const [ coach, setCoach ] = useState("");
    const [ description, setDescription ]  = useState("");
    const [ keywords, setKeywords ] = useState("");
    const [ capacity, setCapacity ]  = useState(0);
    const [ startTime, setStartTime ]  = useState("");
    const [ endTime, setEndTime ] = useState("");
    const [ frequency, setFrequency ] = useState(null);
    const [ frequencyText, setFrequencyText ] = useState("");
    const [ endRecurrence, setEndRecurrence ]  = useState(dayjs().add(-4, 'hour'));
    const [startDate, setStartDate]  = useState(dayjs().add(1, 'hour'));
    const [occurrences, setOccurrences] = useState([]);
    const [ occurrenceOrAll, setOccurrenceOrAll ] = useState("");
    const [ occurrenceOrAllText, setOccurrenceOrAllText ] = useState("");
    const [occurrencesMap, setOccurrencesMap] = useState({});
    const [errors, setErrors] = useState({});

    const mapOccurrences = (data, occurrencesValues) => {
        data.map((occurrence) => {
            occurrencesValues[String(dayjs(occurrence.start_time).format("DD/MM/YYYY"))] = occurrence.id;
            occurrencesValues[occurrence.id] = String(dayjs(occurrence.start_time).format("DD/MM/YYYY"));
        })
        occurrencesValues["all"] = "All";
        occurrencesValues["All"] = "all";
        setOccurrencesMap(occurrencesValues);
    }

    const frequencies = {
        0: 'Once',
        1: 'Daily',
        7: 'Weekly',
        14: 'Biweekly',
        'Once': 0,
        'Daily': 1,
        'Weekly': 7,
        'Biweekly': 14};

    const getData = () => {
        tokenHandle().then(success => {
                if (!success){
                    localStorage.setItem("lastPage", "/classes/edit/")
                    navigate("/login");
                } else {
                    fetch("http://localhost:8000/classes/" + id + "/edit/", {
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
                        console.log(data);
                        setName(data.name);
                        setCoach(data.coach);
                        setDescription(data.description);
                        setKeywords(data.keywords);
                        setCapacity(data.capacity);
                        setStartTime(data.start_time);
                        setFrequency(data.frequency);
                        setFrequencyText(frequencies[data.frequency]);
                        setEndTime(data.end_time);
                        setStartDate(dayjs(data.start_date));
                        setEndRecurrence(dayjs(data.end_recurrence));
                        setOccurrences(data.occurrences);
                        mapOccurrences(data.occurrences, {});
                    }).catch(err => {
                        console.log(err);
                    })
                }
            }
        )
    }

    const requestBody = () => {
        return JSON.stringify({
            studio: id,
            name: name,
            coach: coach,
            description: description,
            keywords: keywords,
            capacity: capacity,
            start_time: startTime,
            end_time: endTime,
            frequency: frequency,
            end_recurrence: endRecurrence.toISOString(),
            start_date: startDate.toISOString()
        })
    }

    const submitReq = () => {
        if (occurrenceOrAll === "" || occurrenceOrAll === undefined || occurrenceOrAll == null){
            let newErrors = errors;
            newErrors["occurrence"] = "This is a required field."
            setErrors(errors);
        } else {
            tokenHandle()
                .then(success => {
                    if (!success) {
                        // TODO: deal with unauthorized access (when a (non-admin) tries to access it)
                        localStorage.setItem("lastPage", "/studios/add");
                        navigate("/login");
                    } else {
                        let params = "";
                        console.log(occurrenceOrAll);
                        if (occurrenceOrAll === "all"){
                            params = "/edit/?all=True"
                        } else {
                            params = "/edit/?occ_id=" + String(occurrenceOrAll)
                        }
                        fetch("http://localhost:8000/classes/" + id + params, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${localStorage.getItem("token")}`,
                            },
                            body: requestBody()
                        })
                            .then(r => {
                                if (r.ok) {
                                    navigate(`/classes/types/`);
                                } else {
                                    return r.json();
                                }
                            })
                            .then(r => {
                                let res = r.valueOf();
                                console.log(res);
                                if (res !== {}){
                                    if (res.non_field_errors !== undefined) {
                                        res.non_field_errors.map((error) => {
                                            if (error.includes("tart date")){
                                                res["start_date"] = error;
                                            } else if (error.includes("nd recurrence")){
                                                res["end_recurrence"] = error;
                                            }
                                        })
                                    }
                                    setErrors(res);
                                }
                            })
                            .catch(err => console.log(err))
                    }
                })
        }

    }

    useEffect(() => {
        getData();
    }, [])

    return (
        <>
            {/*{ isAdmin ? <>*/}
            <h1>Edit a Class</h1>
            <form>
                <TextField id="name" label="Name" variant="outlined"
                           required onChange={e => setName(e.target.value)} value={name}
                           error={errors.name !== undefined} helperText={errors.name}/>

                <br/>

                <TextField id="coach" label="Coach" variant="outlined" value={coach}
                           required onChange={e => setCoach(e.target.value) }
                           error={errors.coach !== undefined} helperText={errors.coach}/>
                <br/>

                <TextField id="description" label="Description" variant="outlined" value={description}
                           required onChange={e => setDescription(e.target.value)} multiline
                           error={errors.description !== undefined} helperText={errors.description}/>
                <br/>

                <TextField id="keywords" label="Keywords (separate with comma)" variant="outlined"
                           required onChange={e => setKeywords(e.target.value)} multiline  value={keywords}
                           error={errors.keywords !== undefined} helperText={errors.keywords}/>
                <br/>

                <TextField type="number" id="capacity" label="Capacity" variant="outlined"
                           required onChange={e => setCapacity(parseInt(e.target.value))}  value={capacity}
                           error={errors.capacity !== undefined} helperText={errors.capacity}/>
                <br/>


                <TextField type="time" id="start-time" label="Start Time" variant="outlined"
                           required onChange={e => setStartTime(e.target.value)}  value={startTime}
                           error={errors.start_time !== undefined} helperText={errors.start_time}/>
                <br/>

                <TextField type="time" id="end-time" label="End Time" variant="outlined"
                           required onChange={e => setEndTime(e.target.value)}  value={endTime}
                           error={errors.end_time !== undefined} helperText={errors.end_time}/>
                <br/>

                <TextField
                    id="select-frequency"
                    value={frequencyText}
                    label="Frequency"
                    variant="outlined"
                    onChange={(e) => {
                        setFrequency(frequencies[e.target.value]);
                        setFrequencyText(e.target.value);
                    }}
                    select
                >
                    <MenuItem value={"Once"}>Once</MenuItem>
                    <MenuItem value={"Daily"}>Daily</MenuItem>
                    <MenuItem value={"Weekly"}>Weekly</MenuItem>
                    <MenuItem value={"Biweekly"}>Biweekly</MenuItem>
                </TextField>
                <br/>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                        label="Start Date" required
                        inputFormat="DD/MM/YYYY"
                        value={startDate}
                        onChange={(newValue) => {
                            setStartDate(newValue);
                        }}
                        error={errors.start_date !== undefined} helperText={errors.start_date}
                        renderInput={(params) => <TextField {...params} />}
                    />
                    <br/>
                    <DesktopDatePicker
                        label="End Date/Recurrence"
                        inputFormat="DD/MM/YYYY"
                        value={endRecurrence}
                        onChange={(newValue) => {
                            setEndRecurrence(newValue);
                        }}
                        error={errors.end_recurrence !== undefined} helperText={errors.end_recurrence}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>

                <TextField
                    id="select-occurrence"
                    value={occurrenceOrAllText}
                    label="Occurrence"
                    variant="outlined"
                    onChange={(e) => {
                        setOccurrenceOrAll(occurrencesMap[e.target.value]);
                        setOccurrenceOrAllText(e.target.value);

                        console.log(occurrenceOrAll);
                    }}
                    error={errors.occurrence !== undefined} helperText={errors.occurrence}
                    select
                >
                    <MenuItem value="All">All</MenuItem>
                    {occurrences != null && occurrences.map((occurrence) => {
                        return (
                            <MenuItem value={String(dayjs(occurrence.start_time).format("DD/MM/YYYY"))}>{String(dayjs(occurrence.start_time).format("DD/MM/YYYY"))}</MenuItem>
                        );
                    })}
                </TextField>



                <Button id="create-button" variant="outlined" onClick={submitReq}>EDIT</Button>
            </form>
            {/*    </>*/}
            {/*    : <Status404/>*/}
            {/*}*/}
        </>
    );
}


export default EditClass;
