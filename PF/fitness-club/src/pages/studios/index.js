import React, {useContext, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import StudiosTable from "../../components/Studio/StudiosTable";
import StudiosAPIContext from "../../contexts/StudiosAPIContext";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import UserAPIContext from "../../contexts/UserAPIContext";
import {tokenHandle} from "../login";
 

const Studios = () => {
    const perPage = 5;
    const [page, setPage] = useState(1);
    const [open, setOpen] = useState(false);
    const [total, setTotal] = useState(0);
    const [applied, setApplied] = useState(true);

    const [filter, setFilter] = useState({});

    const [offset, setOffset] = useState(0);

    const { isAdmin } = useContext(UserAPIContext);
    const { setStudios } = useContext(StudiosAPIContext);

    let navigate = useNavigate();


    useEffect(() => {
        tokenHandle().then(success => {
            if (!success) {
                localStorage.setItem("lastPage", "/studios/");
                navigate("/login");
            } else if (applied) {
                fetch(`http://localhost:8000/studios/search?offset=${offset}&limit=${perPage}&`
                    + new URLSearchParams(filter), {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    },
                })
                    .then(response => response.json())
                    .then(json => {
                        setStudios(json.results);
                        setApplied(false);
                        setTotal(json.count);
                    })
                    .catch(err => console.log(err))
            }
        }).catch(err => console.log(err))

    }, [applied, page, offset])


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
            <div className="class-page">
            <h1> Studios </h1>
            </div>
            <div className="filter-buttons">
                { isAdmin &&
                <Button className="Button"
                    variant="outlined"
                    onClick={createStudios}>
                    +
                </Button>
                }
                <div className="fill-remaining-space"></div>
                    <Button className="Button" variant={"outlined"} onClick={handleOpen}>FILTER</Button>
                    <Button className="Button" variant={"outlined"} onClick={e => setFilter({})}>CLEAR FILTER</Button>
            </div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Filter by...</DialogTitle>
                <DialogContent>
                    <TextField autoFocus id="name" label="Name" variant="outlined"
                               onChange={e => setFilter({
                                ...filter,
                                name__icontains: e.target.value})}
                               sx={{ width : 300 }}/>

                    <TextField autoFocus id="amenity-type" label="Amenity type" variant="outlined"
                               onChange={e => setFilter({
                                   ...filter,
                                   amenities__type__exact: e.target.value})}
                               sx={{ width : 300 }}/>

                    <TextField autoFocus id="amenity-quantity" type="number"
                               label="Exact amenity quantity" variant="outlined"
                               onChange={e => setFilter({
                                   ...filter,
                                   amenities__quantity__exact: e.target.value})}
                               sx={{ width : 300 }}/>

                    <TextField autoFocus id="amenity-quantity-gte" type="number"
                               label="Amenity quantity greater than or equal to.." variant="outlined"
                               onChange={e => setFilter({
                                   ...filter,
                                   amenities__quantity__gte: e.target.value})}
                               sx={{ width : 300 }}/>

                    <TextField autoFocus id="class-name" label="Class Name" variant="outlined"
                               onChange={e => setFilter({
                                   ...filter,
                                   classes__name__icontains: e.target.value})}
                               sx={{ width : 300 }}/>

                    <TextField autoFocus id="class-coach" label="Class Coach" variant="outlined"
                               onChange={e => setFilter({
                                   ...filter,
                                   classes__coach__icontains: e.target.value})}
                               sx={{ width : 300 }}/>

                </DialogContent>
                <DialogActions>
                    <Button className="Button" onClick={() => {
                    handleClose();
                    setApplied(true);}
                    }>APPLY</Button>
                </DialogActions>

            </Dialog>
            <StudiosTable perPage={perPage} page={page}></StudiosTable>
            <div className="nav-buttons">
            <Button className="Button" id={'prev-button'}
                variant={"contained"}
                onClick={() => {
                    setPage(Math.max(1, page - 1));
                    setApplied(true);
                    setOffset(offset => offset - perPage);
                }} disabled={page === 1}>
                {`<`}
            </Button>
            <Button className="Button" disabled={true}>{page}</Button>
            <Button className="Button" id={'next-button'}
                variant={"contained"}
                onClick={() => {
                    setPage(page + 1);
                    setApplied(true);
                    setOffset(offset => offset + perPage);
                }} disabled={offset + perPage >= total}>
                {`>`}
            </Button>
            </div>



        </>
    )
}

export default Studios;