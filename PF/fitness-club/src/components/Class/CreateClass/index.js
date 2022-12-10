import {Autocomplete, Button, InputLabel, MenuItem, Select, TextareaAutosize, TextField} from "@mui/material";
import React, {useContext, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import UserAPIContext from "../../../contexts/UserAPIContext";
import {tokenHandle} from "../../../pages/login";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Status404 from "../../Common/Errors/Status404";
import {DesktopDatePicker} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import './style.css';
import {theme} from "../../../themes/main";
import {ThemeProvider} from "@mui/material/styles";
 

const CreateClass = () => {
    const { isAdmin } = useContext(UserAPIContext);

    const navigate = useNavigate();

    const { id } = useParams();

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

    const [errors, setErrors] = useState({});

    const requestBody = () => {
        console.log(id);
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
            end_recurrence: (endRecurrence.add(23, "h")).toISOString(),
            start_date: startDate.toISOString()
        })
    }

    const frequencyChange = (event) => {
        if (event.target.value === "Once"){
            setFrequency(0);
        } else if (event.target.value === "Daily"){
            setFrequency(1);
        } else if (event.target.value === "Weekly"){
            setFrequency(7);
        } else if (event.target.value === "Biweekly"){
            setFrequency(14);
        }
        setFrequencyText(event.target.value);
    };

    const validateAll = () => {
        let currErrors = {};

        if (name === ""){
            currErrors.name = "Please enter a valid name."
        }
        if (coach === ""){
            currErrors.coach = "Please enter a valid coach."
        }
        if (description === ""){
            currErrors.description = "Please enter a valid description."
        }
        if (keywords === ""){
            currErrors.keywords = "Please enter valid keywords."
        }
        if (capacity < 1){
            currErrors.capacity = "Please enter a valid capacity."
        }
        if (startTime === ""){
            currErrors.start_time = "Please enter a valid start time."
        }
        if (endTime === ""){
            currErrors.end_time = "Please enter a valid end time."
        }
        if (frequency == null){
            currErrors.frequency = "Please choose a valid frequency."
        }
        if (endRecurrence === ""){
            currErrors.end_recurrence = "Please choose a valid end date/recurrence."
        }
        if (startDate === ""){
            currErrors.start_date = "Please choose a valid start date."
        }

        setErrors(currErrors);
        console.log(currErrors);
        return Object.entries(currErrors).length === 0;
    }

    const submitReq = () => {
        let received = validateAll();

        if (received === true){
            tokenHandle()
                .then(success => {
                    if (!success) {
                        // TODO: deal with unauthorized access (when a (non-admin) tries to access it)
                        localStorage.setItem("lastPage", "/studios/"+id+"/classes/add/");
                        navigate("/login");
                    } else {
                        fetch('http://localhost:8000/classes/new/', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${localStorage.getItem("token")}`,
                            },
                            body: requestBody()
                        })
                            .then(r => {
                                if (r.ok) {
                                    navigate('/studios/' + id + "/profile/");
                                } else {
                                    return r.json();
                                }
                            })
                            .then(r => {
                                let res = r.valueOf();
                                console.log(res);
                                if (res !== {}){
                                    setErrors(res);
                                }
                            })
                            .catch(err => console.log(err))
                    }
                })
        }

    }


    return(
        <>
            <ThemeProvider theme={theme}>
            <div className={"create-class-page"}>
            { isAdmin ? <>
            <h1>Create a Class</h1>
            <form>
                <TextField id="name" label="Name" variant="outlined"
                           required onChange={e => setName(e.target.value)}
                           sx={{ width: 400 }}
                           error={errors.name !== undefined} helperText={errors.name}/>

                <br/>

                <TextField id="coach" label="Coach" variant="outlined"
                           required onChange={e => setCoach(e.target.value)}
                           sx={{ width: 400 }}
                           error={errors.coach !== undefined} helperText={errors.coach}/>
                <br/>

                <TextField id="description" label="Description" variant="outlined"
                           required onChange={e => setDescription(e.target.value)} multiline
                           sx={{ width: 400 }}
                           error={errors.description !== undefined} helperText={errors.description}/>
                <br/>

                <TextField id="keywords" label="Keywords (separate with comma)" variant="outlined"
                                  required onChange={e => setKeywords(e.target.value)} multiline
                           sx={{ width: 400 }}
                                  error={errors.keywords !== undefined} helperText={errors.keywords}/>
                <br/>

                <TextField type="number" id="capacity" label="Capacity" variant="outlined"
                           required onChange={e => setCapacity(parseInt(e.target.value))}
                           sx={{ width: 400 }}
                           error={errors.capacity !== undefined} helperText={errors.capacity}/>
                <br/>


                <TextField type="time" id="start-time" label="Start Time" variant="outlined"
                           required onChange={e => setStartTime(e.target.value)}
                           sx={{ width: 400 }}
                           error={errors.start_time !== undefined} helperText={errors.start_time}/>
                <br/>

                <TextField type="time" id="end-time" label="End Time" variant="outlined"
                           required onChange={e => setEndTime(e.target.value)}
                           sx={{ width: 400 }}
                           error={errors.end_time !== undefined} helperText={errors.end_time}/>
                <br/>

                <TextField
                    id="select-frequency"
                    value={frequencyText}
                    sx={{ width: 400 }}
                    label="Frequency"
                    variant="outlined"
                    onChange={frequencyChange}
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
                        renderInput={(params) => <TextField {...params} sx={{ width: 400 }}/>}
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
                        renderInput={(params) => <TextField {...params} sx={{ width: 400 }}/>}
                    />
                </LocalizationProvider>

                <br/>


                <Button color={"primary"} className="Button" id="create-button" variant="outlined" onClick={submitReq}>CREATE</Button>
            </form>
                </>
                : <Status404/>
            }
            </div>
            </ThemeProvider>
        </>
    );
}


export default CreateClass;
