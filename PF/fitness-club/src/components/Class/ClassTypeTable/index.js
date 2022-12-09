import React, {useState} from 'react';
import { useContext } from "react";
import {
    Table,
    Paper,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
    Dialog,
    DialogTitle, DialogContent, RadioGroup, FormControlLabel, Radio
} from "@mui/material";
import $ from 'jquery';
import ClassesAPIContext from "../../../contexts/ClassesAPIContext";
import dayjs from "dayjs";
import {Link} from "react-router-dom";
import {LinkContainer} from "react-router-bootstrap";
import {NavDropdown, NavLink} from "react-bootstrap";
import UserAPIContext from "../../../contexts/UserAPIContext";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import {GridActionsCellItem} from "@mui/x-data-grid";

const ClassTypeTable = ({ perPage, page }) => {
    const { setClasses, classes } = useContext(ClassesAPIContext);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('');
    const { isAdmin } = useContext(UserAPIContext);


    const handleClose = () => {
        setOpen(false);
    }

    const handleDelete = (id) => {
        setClasses((prev) => prev.filter((c) => c.id !== id));
        fetch(`http://localhost:8000/classes/${id}/delete?all=1`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`,
            }})
            .then(r => r.json())
            .catch(err => console.log(err))

    }


    const handleSubmit = (id) => {
        fetch(`http://localhost:8000/classes/enrol/?class=${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`,
            }})
            .then(r => {
                if (!r.ok){
                    return Promise.reject(r);
                }
            })
            .catch(err => {
                console.log("User has no active subscription.");
            })

        $(`enrol-button-${id}`).attr("disabled", true);
        handleClose();
    }

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell> # </TableCell>
                        <TableCell> Name </TableCell>
                        <TableCell> Coach </TableCell>
                        <TableCell> Description </TableCell>
                        <TableCell> Studio </TableCell>
                        <TableCell> Keywords </TableCell>
                        <TableCell> Capacity </TableCell>
                        <TableCell> Start Date </TableCell>
                        <TableCell> Start Time </TableCell>
                        <TableCell> End Recurrence </TableCell>
                        <TableCell> End Time </TableCell>
                        <TableCell> Actions </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {classes !== undefined && classes.map((clss, index) => (
                        <TableRow key={clss.id}>
                            <TableCell>{ (page - 1) * perPage + index + 1 }</TableCell>
                            <TableCell>
                                <Link to={"/classes/"+ clss.id + "/edit"}
                                      underline={"hover"}>
                                    { clss.name }
                                </Link>

                            </TableCell>
                            <TableCell>{ clss.coach }</TableCell>
                            <TableCell>{ clss.description }</TableCell>
                            <TableCell>{ clss.studio.name }</TableCell>
                            <TableCell>{ clss.keywords }</TableCell>
                            <TableCell>{ clss.capacity }</TableCell>
                            <TableCell>{ dayjs(clss.start_date).format("DD/MM/YYYY") }</TableCell>
                            <TableCell>{ clss.start_time }</TableCell>
                            <TableCell>{ clss.end_time }</TableCell>
                            <TableCell>{ dayjs(clss.end_recurrence ).format("DD/MM/YYYY") }</TableCell>
                            <TableCell>
                                <Button id={`enrol-button-${clss.id}`}
                                        onClick={() => {
                                            handleSubmit(clss.id);
                                        }}>
                                    ENROL</Button>
                                {/*<Dialog open={open} onClose={handleClose}>*/}
                                {/*    <DialogTitle>Enrol in...</DialogTitle>*/}
                                {/*    <DialogContent>*/}
                                {/*        <RadioGroup*/}
                                {/*            onChange={e => setValue(e.target.value)}>*/}
                                {/*            <FormControlLabel value="occurrence" control={<Radio />}*/}
                                {/*                              label="This class only" />*/}
                                {/*            <FormControlLabel value="class" control={<Radio />}*/}
                                {/*                              label="This and all future occurrences" />*/}
                                {/*        </RadioGroup>*/}
                                {/*        <Button type={"submit"} variant={"contained"}*/}
                                {/*                onClick={handleSubmit}>SUBMIT</Button>*/}
                                {/*    </DialogContent>*/}
                                {/*</Dialog>*/}
                                {isAdmin &&
                                    <GridActionsCellItem
                                        icon={<DeleteIcon />}
                                        label="Delete"
                                        onClick={() => {
                                            handleDelete(clss.id)}}
                                        color="inherit"
                                    />}
                                    {/*// <DeleteIconButton*/}
                                    {/*// id={`delete-button-${clss.id}`}*/}
                                    {/*// onClick={e => {*/}
                                    {/*//     setCurrClass(clss);*/}
                                    {/*//     handleDelete(index);*/}
                                    {/*// }}/>}*/}


                            </TableCell>

                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default ClassTypeTable;