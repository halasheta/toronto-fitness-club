import React, {useContext, useEffect, useState} from "react";
import {tokenHandle} from "../../../pages/login";
import {useNavigate} from "react-router-dom";
import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    IconButton,
    Radio,
    RadioGroup
} from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import dayjs from "dayjs";
import {
    Timeline, TimelineConnector, TimelineContent, TimelineDot,
    TimelineItem,
    TimelineOppositeContent,
    timelineOppositeContentClasses,
    TimelineSeparator
} from "@mui/lab";
import $ from "jquery";
import "./index.css"
import {theme} from "../../../themes/main";
import {ThemeProvider} from "@mui/material/styles";
 

const ClassSchedule = () => {
    const [classes, setClasses] = useState({});
    const [currMonthClasses, setCurrMonthClasses] = useState(null);
    const [currDate, setCurrDate] = useState(dayjs().add(-5, 'hour'));
    const [viewKey, setViewKey] = useState(String(currDate.year()) + "/" + String(currDate.month() + 1));
    const [months, setMonths] = useState([]);
    const navigate = useNavigate();
    const [choice, setChoice] = useState("");
    const collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});
    const [open, setOpen] = useState(false);
    const [currOccurrence, setCurrOccurrence] = useState(null);
    const [currClass, setCurrClass] = useState(null);

    const handleClose = () => {
        setOpen(false);
    }

    const getData = () => {
        console.log(viewKey);
        tokenHandle()
            .then(success => {
                if (!success) {
                    localStorage.setItem("lastPage", "/classes/schedule/");
                    navigate("/login");
                } else {
                    fetch('http://localhost:8000/classes/schedule/?limit=100', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem("token")}`,
                        }
                    })
                        .then(r => {
                            if (!r.ok) {
                                return Promise.reject(r);
                            }
                            return r.json();
                        })
                        .then(data => {
                            parseClasses(data);
                        })
                        .catch(err => console.log(err))
                }
            })
    }

    // need to fill in months with no classes as empty sets

    const dateDiff = (date1, date2) => {
        const date1Val = date1.split("/");
        const date2Val = date2.split("/");

        for (let i = 0; i < 2; i++){
            date1Val[i] = parseInt(date1Val[i]);
            date2Val[i] = parseInt(date2Val[i]);
        }

        if (date1Val[0] === date2Val[0]){
            return date2Val[1] - date1Val[1];
        } else {
            return (12 * (date2Val[0] - date1Val[0] - 1) + date2Val[1] - date1Val[1]);
        }

    }

    const nextDate = (date) => {
        const dateVal = date.split("/");
        dateVal[0] = parseInt(dateVal[0]);
        dateVal[1] = parseInt(dateVal[1]);

        if (dateVal[1] === 12) {
            return String(dateVal[0] + 1) + "/1";
        } else {
            return String(dateVal[0]) + "/" + String(dateVal[1] + 1);
        }
    }

    const pastDate = (date) => {
        const dateVal = date.split("/");
        dateVal[0] = parseInt(dateVal[0]);
        dateVal[1] = parseInt(dateVal[1]);

        if (dateVal[1] === 1) {
            return String(dateVal[0] - 1) + "/12";
        } else {
            return String(dateVal[0]) + "/" + String(dateVal[1] - 1);
        }
    }


    const parseClasses = (data) => {
        let classSet = {};
        // set currMonthClasses to this month's classes
        Object.entries(data.results).map(([prop, value]) => {
            // generate months with values first
            let classDate = dayjs(value.start_time);

            let monthKey = String(classDate.year()) + "/" + String(classDate.month() + 1);
            let secondMonth = nextDate(monthKey);

            if (classSet[monthKey] === undefined) {
                classSet[monthKey] = {};
            }
            if (classSet[secondMonth] === undefined) {
                classSet[secondMonth] = {};
            }
            classSet[monthKey][prop] = value;

        })

        if (classSet[viewKey] === undefined) {
            classSet[viewKey] = {};
        }

        let baseMonths = Object.keys(classSet).sort(collator.compare);
        for (let i = 0; i < (baseMonths.length - 1); i++){
            let j = dateDiff(baseMonths[i], baseMonths[i + 1]);
            let currDate = baseMonths[i];
            for (j; j > 0; j--){
                currDate = nextDate(currDate);
                if (classSet[currDate] === undefined) {
                    classSet[currDate] = {};
                }
            }
        }
        // generate empty months

        setClasses(classSet);
        setMonths(Object.keys(classSet).sort(collator.compare));
        setCurrMonthClasses(classSet[viewKey]);
    }

    const paginate = (event) => {
        // shift pageNum forwards or back
        // set currMonthClasses to this month's classes
        let currKeyPos = months.indexOf(viewKey);
        let updatedClasses = classes;
        let updatedMonths = months;
        if (event.target.name === "add") {
            currKeyPos += 1;
            if (currKeyPos >= months.length) {
                let newMonth = nextDate(viewKey);
                updatedClasses[newMonth] = {};
                setClasses(updatedClasses);
                updatedMonths = Object.keys(updatedClasses).sort(collator.compare);
            }
        } else {
            currKeyPos -= 1;
            if (currKeyPos < 0) {
                // add new month to classes & months
                let newMonth = pastDate(viewKey);
                updatedClasses[newMonth] = {};
                setClasses(updatedClasses);
                updatedMonths = Object.keys(updatedClasses).sort(collator.compare);
                currKeyPos = 0;
            }
        }

        let newKey = updatedMonths[currKeyPos];
        setViewKey(newKey);
        setMonths(updatedMonths);
        setCurrMonthClasses(classes[newKey]);
    }

    const handleSubmit = () => {
        let modelId = currOccurrence;
        if (choice === "class") {
            modelId = currClass;
        }

        fetch(`http://localhost:8000/classes/drop/?${choice}=${modelId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`,
            }})
            .then(r => {
                if (!r.ok){
                    return Promise.reject(r);
                }
                console.log(r);
                getData();
            }).catch(err => console.log(err))
        handleClose();
    }

    useEffect(() => {
        getData();
    }, []);

    return (
        <ThemeProvider theme={theme}>
        <div className="schedule-page">
            <h2>Class Schedule</h2>
            <div className="page-buttons">
                <Button color={"primary"} className="Button" onClick={paginate} id="page-prev" name="sub" variant="contained">{"<"}</Button>
                <Button color={"primary"} className="Button" disabled={true}>{viewKey}</Button>
                <Button color={"primary"} className="Button" onClick={paginate} id="page-next" name="add" variant="contained">{">"}</Button>
            </div>
            {(currMonthClasses != null && Object.entries(currMonthClasses).length === 0) &&
                <p> You have no classes scheduled this month. </p>
            }

            {(currMonthClasses == null) &&
                <p> Loading classes </p>
            }

            <Timeline
                sx={{
                    [`& .${timelineOppositeContentClasses.root}`]: {
                        flex: 0.2,
                    },
                }}
            >

            {currMonthClasses != null && Object.entries(currMonthClasses).map(([prop, value]) => {
                console.log(value);
                if (Object.keys(currMonthClasses).indexOf(prop) !== Object.entries(currMonthClasses).length - 1){
                    return (
                        <>
                            <TimelineItem key={prop}>
                                <TimelineOppositeContent color="textSecondary">
                                    {dayjs(value.start_time).format('MM/DD') + " " +
                                        dayjs(value.start_time).format('HH:mm') + "-" + dayjs(value.end_time).format('HH:mm')
                                    }
                                </TimelineOppositeContent>
                                <TimelineSeparator>
                                    <TimelineDot />
                                    <TimelineConnector />
                                </TimelineSeparator>
                                <TimelineContent>
                                    <b>Name: </b>{value.name}
                                    <br/>
                                    <b>Coach: </b>{value.coach}
                                    <br/>
                                    <b>Description: </b>{value.description}
                                    <br/>
                                    <b>Studio: </b>{value.studio.name}
                                    <p></p>
                                </TimelineContent>

                                <TimelineContent>
                                    <IconButton id={value.id}
                                                onClick={e => {
                                                    setOpen(true);
                                                    setCurrOccurrence(value.id);
                                                    setCurrClass(value.class_model);
                                                }}>
                                        <CancelIcon/>
                                    </IconButton>
                                </TimelineContent>
                            </TimelineItem>
                        </>
                    );
                } else {
                    return (
                        <>
                            <TimelineItem>
                                <TimelineOppositeContent color="textSecondary">
                                    {dayjs(value.start_time).format('MM/DD') + " " +
                                        dayjs(value.start_time).format('HH:mm') + "-" + dayjs(value.end_time).format('HH:mm')
                                    }
                                </TimelineOppositeContent>
                                <TimelineSeparator>
                                    <TimelineDot />
                                </TimelineSeparator>
                                <TimelineContent>
                                    <b>Name: </b>{value.name}
                                    <br/>
                                    <b>Coach: </b>${value.coach}
                                    <br/>
                                    <b>Description: </b>{value.description}
                                    <br/>
                                    <b>Studio: </b>{value.studio.name}
                                </TimelineContent>

                                <TimelineContent>
                                    <IconButton id={value.id}
                                                onClick={e => {
                                                    setOpen(true);
                                                    setCurrOccurrence(value.id);
                                                    setCurrClass(value.class_model);
                                                }}>
                                        <CancelIcon/>
                                    </IconButton>
                                </TimelineContent>
                            </TimelineItem>
                        </>
                    );
                }
            })}

            </Timeline>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Drop ...</DialogTitle>
                <DialogContent>
                    <RadioGroup color={"primary"}
                                onChange={e => setChoice(e.target.value)}>
                        <FormControlLabel value="occurrence" control={<Radio />}
                                          label="This class only" />
                        <FormControlLabel value="class" control={<Radio />}
                                          label="This and all future occurrences" />

                    </RadioGroup>
                    <Button color={"primary"}  className="Button" type={"submit"} variant={"contained"}
                            onClick={handleSubmit}>SUBMIT</Button>
                </DialogContent>
            </Dialog>

        </div>
        </ThemeProvider>
    )
}
// call update Studio for each one?

{/*<div className='class' key={prop}>*/}
{/*    <div>*/}
{/*        <p><b>Name: </b>{value.name}</p>*/}
{/*        <p><b>Coach: </b>${value.coach}</p>*/}
{/*        <p><b>Description: </b>{value.description}</p>*/}
{/*        <p><b>Date: </b>{dayjs(value.start_time).format('DD/MM/YYYY') + " " +*/}
{/*            dayjs(value.start_time).format('HH:mm') + "-" + dayjs(value.end_time).format('HH:mm')*/}
{/*        }</p>*/}
{/*    </div>*/}
{/*    <hr/>*/}
{/*</div>*/}

export default ClassSchedule;