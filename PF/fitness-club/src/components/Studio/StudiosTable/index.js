import React from 'react';
import { useContext } from "react";
import StudiosAPIContext from "../../../contexts/StudiosAPIContext";
import {Table, Paper, TableContainer, TableHead, TableRow, TableCell, TableBody} from "@mui/material";
import { Link } from "react-router-dom";

const StudiosTable = ({ perPage, page }) => {
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
            {studios !== undefined && studios.map((studio, index) => (
                <TableRow key={studio.id}>
                    <TableCell>{ (page - 1) * perPage + index + 1 }</TableCell>
                    <TableCell>
                        <Link to={"/studios/"+ studio.id + "/profile"}
                              underline={"hover"}>
                            { studio.name }
                        </Link>

                    </TableCell>
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