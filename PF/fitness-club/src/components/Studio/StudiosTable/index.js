import React from 'react';
import { useContext } from "react";
import StudiosAPIContext from "../../../contexts/StudiosAPIContext";
import {Table, Paper, TableContainer, TableHead, TableRow, TableCell, TableBody} from "@mui/material";

const StudiosTable = ({ perPage, params }) => {
    const { studios } = useContext(StudiosAPIContext);

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
            <TableRow>
                <TableCell> # </TableCell>
                <TableCell> Name </TableCell>
                <TableCell> Address </TableCell>
                <TableCell> Postal Code </TableCell>
                <TableCell> Phone </TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {studios.map((studio, index) => (
                <TableRow key={studio.id}>
                    <TableCell>{ (params.page - 1) * perPage + index + 1 }</TableCell>
                    <TableCell>{ studio.name }</TableCell>
                    <TableCell>{ studio.address }</TableCell>
                    <TableCell>{ studio.postal_code }</TableCell>
                    <TableCell>{ studio.phone }</TableCell>
            </TableRow>
        ))}
        </TableBody>
            </Table>
        </TableContainer>
    )
}

export default StudiosTable;