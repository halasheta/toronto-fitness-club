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

const ClassesTable = ({ perPage, page }) => {
    const { classes } = useContext(ClassesAPIContext);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('');
    const [currClass, setCurrClass] = useState(0);

    const handleClose = () => {
        setOpen(false);
    }


    const handleSubmit = (e) => {
        let modelId = currClass.id;
        if (value === "class") {
            modelId = currClass.class_model;
        }

        fetch(`http://localhost:8000/classes/enrol/?${value}=${modelId}`, {
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

        $(`enrol-button-${currClass.id}`).attr("disabled", true);
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
                <TableCell> Start Time </TableCell>
                <TableCell> End Time </TableCell>
                <TableCell> Actions </TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {classes !== undefined && classes.map((clss, index) => (
                <TableRow key={clss.id}>
                    <TableCell>{ (page - 1) * perPage + index + 1 }</TableCell>
                    <TableCell>{ clss.name }</TableCell>
                    <TableCell>{ clss.coach }</TableCell>
                    <TableCell>{ clss.description }</TableCell>
                    <TableCell>{ clss.studio.name }</TableCell>
                    <TableCell>{ clss.keywords }</TableCell>
                    <TableCell>{ clss.capacity }</TableCell>
                    <TableCell>{ clss.start_time }</TableCell>
                    <TableCell>{ clss.end_time }</TableCell>
                    <TableCell>
                        <Button id={`enrol-button-${clss.id}`}
                                onClick={e => {
                                        setOpen(true);
                                        setCurrClass(clss);}
                        }>
                            ENROL</Button>
                        <Dialog open={open} onClose={handleClose}>
                            <DialogTitle>Enrol in...</DialogTitle>
                            <DialogContent>
                                <RadioGroup
                                onChange={e => setValue(e.target.value)}>
                                    <FormControlLabel value="occurrence" control={<Radio />}
                                                      label="This class only" />
                                    <FormControlLabel value="class" control={<Radio />}
                                                      label="This and all future occurrences" />
                                </RadioGroup>
                                <Button type={"submit"} variant={"contained"}
                                onClick={handleSubmit}>SUBMIT</Button>
                            </DialogContent>
                        </Dialog>

                    </TableCell>

                </TableRow>
        ))}
        </TableBody>
            </Table>
        </TableContainer>
    )
}

export default ClassesTable;