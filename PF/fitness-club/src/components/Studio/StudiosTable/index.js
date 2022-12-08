import React from 'react';
import { useContext } from "react";
import StudiosAPIContext from "../../../contexts/StudiosAPIContext";
import {Table, Paper, TableContainer, TableHead, TableRow, TableCell, TableBody, Link} from "@mui/material";
import { generatePath } from "react-router-dom";

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
            {studios.map((studio, index) => (
                <TableRow key={studio.id}>
                    <TableCell>{ (page - 1) * perPage + index + 1 }</TableCell>
                    <TableCell>
                        <Link href={generatePath("/studios/:id/profile", {id : studio.id })}
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