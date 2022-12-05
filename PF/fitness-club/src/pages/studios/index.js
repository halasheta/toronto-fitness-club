import React, {useContext, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import StudiosTable from "../../components/Studio/StudiosTable";
import StudiosAPIContext from "../../contexts/StudiosAPIContext";
import {Button} from "@mui/material";

const Studios = () => {
    const perPage = 20;
    const [params, setParams] = useState({page: 1, search: ""})

    const { setStudios } = useContext(StudiosAPIContext);

    let navigate = useNavigate();

    useEffect(() => {
        const {page, search} = params;

        fetch(`http://localhost:8000/studios/search?limit=15`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then(response => response.json())
            .then(json => setStudios(json.results))
            .catch(err => console.log(err))
    }, [params])


    const createStudios = () => {
        navigate('/studios/add');
    }

    return (
        <>
            <h1> Studios </h1>
            <Button
                variant="outlined"
                onClick={createStudios}>
                +
            </Button>
            <StudiosTable perPage={perPage} params={params}></StudiosTable>

        </>
    )
}

export default Studios;