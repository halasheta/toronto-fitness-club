import React, {useContext, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import StudiosTable from "../../components/Studio/StudiosTable";
import StudiosAPIContext from "../../contexts/StudiosAPIContext";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";

const Studios = () => {
    const perPage = 5;
    const [page, setPage] = useState(1);
    const [open, setOpen] = useState(false);
    const [filter, setFilter] = useState({});

    const [offset, setOffset] = useState(0);


    const { setStudios } = useContext(StudiosAPIContext);

    let navigate = useNavigate();


    useEffect(() => {
        fetch(`http://localhost:8000/studios/search?offset=${offset}&limit=${perPage}&`
            + new URLSearchParams(filter), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then(response => response.json())
            .then(json => setStudios(json.results))
            .catch(err => console.log(err))
    }, [filter, page, offset])


    const createStudios = () => {
        navigate('/studios/add');
    }

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }




    return (
        <>
            <h1> Studios </h1>
            {/*{ isAdmin &&*/}
            <Button
                variant="outlined"
                onClick={createStudios}>
                +
            </Button>
            {/*}*/}
            <Button variant={"outlined"} onClick={handleOpen}>FILTER</Button>
            <Button variant={"outlined"} onClick={e => setFilter({})}>CLEAR FILTER</Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Filter by...</DialogTitle>
                <DialogContent>
                    <TextField autoFocus id="name" label="Name" variant="standard"
                               onChange={e => setFilter({
                                ...filter,
                                name__icontains: e.target.value})}/>

                    <TextField autoFocus id="amenity-type" label="Amenity type" variant="standard"
                               onChange={e => setFilter({
                                   ...filter,
                                   amenities__type__exact: e.target.value})}/>

                    <TextField autoFocus id="amenity-quantity" type="number"
                               label="Exact amenity quantity" variant="standard"
                               onChange={e => setFilter({
                                   ...filter,
                                   amenities__quantity__exact: e.target.value})}/>

                    <TextField autoFocus id="amenity-quantity-gte" type="number"
                               label="Amenity quantity greater than or equal to.." variant="standard"
                               onChange={e => setFilter({
                                   ...filter,
                                   amenities__quantity__gte: e.target.value})}/>

                    <TextField autoFocus id="class-name" label="Class Name" variant="standard"
                               onChange={e => setFilter({
                                   ...filter,
                                   classes__name__icontains: e.target.value})}/>

                    <TextField autoFocus id="class-coach" label="Class Coach" variant="standard"
                               onChange={e => setFilter({
                                   ...filter,
                                   classes__coach__icontains: e.target.value})}/>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>APPLY</Button>
                </DialogActions>

            </Dialog>
            <StudiosTable perPage={perPage} page={page}></StudiosTable>
            <Button id={'prev-button'}
                variant={"contained"}
                onClick={() => {
                    setPage(Math.max(1, page - 1));
                    setOffset(offset => offset - perPage);
                }}>
                {`<`}
            </Button>
            <Button disabled={true}>{page}</Button>
            <Button id={'next-button'}
                variant={"contained"}
                onClick={() => {
                    setPage(page + 1);
                    setOffset(offset => offset + perPage);
                }}>
                {`>`}
            </Button>



        </>
    )
}

export default Studios;