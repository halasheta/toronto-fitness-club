import React, {useContext, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import UserAPIContext from "../../contexts/UserAPIContext";
import ClassesAPIContext from "../../contexts/ClassesAPIContext";
import {tokenHandle} from "../login";
import ClassTypeTable from "../../components/Class/ClassTypeTable";

const ClassTypePage = () => {
    const perPage = 5;
    const [page, setPage] = useState(1);
    const [open, setOpen] = useState(false);
    const [filter, setFilter] = useState({});
    const [total, setTotal] = useState(0);
    const [applied, setApplied] = useState(true);


    const [offset, setOffset] = useState(0);

    const { isAdmin } = useContext(UserAPIContext);
    const { setClasses } = useContext(ClassesAPIContext);

    let navigate = useNavigate();


    useEffect(() => {
        tokenHandle().then(success => {
            if (!success) {
                localStorage.setItem("lastPage", "/classes/types/");
                navigate("/login");
            } else {
                fetch(`http://localhost:8000/classes/instances?offset=${offset}&limit=${perPage}&`
                    + new URLSearchParams(filter), {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    },
                })
                    .then(response => response.json())
                    .then(json => {
                        setClasses(json.results);
                        setApplied(false);
                        setTotal(json.count);
                    })
                    .catch(err => console.log(err))
            }
        }).catch(err => console.log(err))

    }, [applied, page, offset])


    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }




    return (
        <>
            <h1> Classes by Type </h1>
            <Button variant={"outlined"} onClick={handleOpen}>FILTER</Button>
            <Button variant={"outlined"} onClick={e => setFilter({})}>CLEAR FILTER</Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Filter by...</DialogTitle>
                <DialogContent>
                    <TextField autoFocus id="name" label="Name" variant="standard"
                               onChange={e => setFilter({
                                   ...filter,
                                   name__icontains: e.target.value})}/>

                    <TextField autoFocus id="coach" label="Coach" variant="standard"
                               onChange={e => setFilter({
                                   ...filter,
                                   coach__icontains: e.target.value})}/>

                    <TextField autoFocus id="keywords" label="Keywords" variant="standard"
                               onChange={e => setFilter({
                                   ...filter,
                                   keywords__icontains: e.target.value})}/>


                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        handleClose();
                        setApplied(true);}
                    }>APPLY</Button>
                </DialogActions>

            </Dialog>
            <ClassTypeTable perPage={perPage} page={page}></ClassTypeTable>
            <Button id={'prev-button'}
                    variant={"contained"}
                    onClick={() => {
                        setPage(Math.max(1, page - 1));
                        setApplied(true);
                        setOffset(offset => offset - perPage);
                    }} disabled={page === 1}>
                {`<`}
            </Button>
            <Button disabled={true}>{page}</Button>
            <Button id={'next-button'}
                    variant={"contained"}
                    onClick={() => {
                        setPage(page + 1);
                        setApplied(true);
                        setOffset(offset => offset + perPage);
                    }} disabled={offset + perPage >= total}>
                {`>`}
            </Button>



        </>
    )
}

export default ClassTypePage;