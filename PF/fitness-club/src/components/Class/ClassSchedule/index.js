import React, {useContext, useEffect, useState} from "react";
import {tokenHandle} from "../../../pages/login";
import {useNavigate} from "react-router-dom";
import {Button, IconButton} from "@mui/material";
import {CancelIcon} from '@mui/icons-material/Cancel';
import dayjs from "dayjs";
import {
    Timeline, TimelineConnector, TimelineContent, TimelineDot,
    TimelineItem,
    TimelineOppositeContent,
    timelineOppositeContentClasses,
    TimelineSeparator
} from "@mui/lab";

const ClassSchedule = () => {
    const [classes, setClasses] = useState({});
    const [currMonthClasses, setCurrMonthClasses] = useState({});
    const [currDate, setCurrDate] = useState(dayjs().add(-5, 'hour'));
    const [viewKey, setViewKey] = useState(String(currDate.year()) + "/" + String(currDate.month()));
    const [months, setMonths] = useState([]);
    const navigate = useNavigate();
    const [pageNum, setPageNum] = useState(1);
    const collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});


    const getData = () => {
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

    useEffect(() => {
        getData();
    }, []);

    return (
        <>
            <h2>Class Schedule</h2>
            {(currMonthClasses == null || Object.entries(currMonthClasses).length === 0) &&
                <p> You have no classes scheduled this month. </p>
            }

            <div>
                <Button onClick={paginate} id="page-prev" name="sub" variant="contained">{"<"}</Button>
                <p id="current-month">{viewKey}</p>
                <Button onClick={paginate} id="page-next" name="add" variant="contained">{">"}</Button>
            </div>

            <Timeline
                sx={{
                    [`& .${timelineOppositeContentClasses.root}`]: {
                        flex: 0.2,
                    },
                }}
            >

            {currMonthClasses != null && Object.entries(currMonthClasses).map(([prop, value]) => {
                if (Object.keys(currMonthClasses).indexOf(prop) !== Object.entries(currMonthClasses).length - 1){
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
                                    <TimelineConnector />
                                </TimelineSeparator>
                                <TimelineContent>
                                    <b>Name: </b>{value.name}
                                    <br/>
                                    <b>Coach: </b>${value.coach}
                                    <br/>
                                    <b>Description: </b>{value.description}
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
                                </TimelineContent>
                                <TimelineContent>
                                    <IconButton class={value.class_model}>
                                        <CancelIcon/>
                                    </IconButton>
                                </TimelineContent>
                            </TimelineItem>
                        </>
                    );
                }
            })}

            </Timeline>

        </>
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