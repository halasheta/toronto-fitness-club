import React from 'react';
import { useContext } from "react";
import {Table, Paper, TableContainer, TableHead, TableRow, TableCell, TableBody, Button} from "@mui/material";
import { Link } from "react-router-dom";
import ClassesAPIContext from "../../../contexts/ClassesAPIContext";

const ClassesTable = ({ perPage, page }) => {
    const { classes } = useContext(ClassesAPIContext);

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
            <TableRow>
                <TableCell> # </TableCell>
                <TableCell> Name </TableCell>
                <TableCell> Coach </TableCell>
                <TableCell> Description </TableCell>
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
                    <TableCell>{ clss.keywords }</TableCell>
                    <TableCell>{ clss.capacity }</TableCell>
                    <TableCell>{ clss.start_time }</TableCell>
                    <TableCell>{ clss.end_time }</TableCell>
                    <TableCell><Button>ENROL</Button></TableCell>

                </TableRow>
        ))}
        </TableBody>
            </Table>
        </TableContainer>
    )
}

export default ClassesTable;