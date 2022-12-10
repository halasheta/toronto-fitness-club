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
    Button, Box, Typography, Modal
} from "@mui/material";
import $ from 'jquery';
import ClassesAPIContext from "../../../contexts/ClassesAPIContext";
import dayjs from "dayjs";
import {Link, useNavigate} from "react-router-dom";
import {LinkContainer} from "react-router-bootstrap";
import {NavDropdown, NavLink} from "react-bootstrap";
import UserAPIContext from "../../../contexts/UserAPIContext";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import {GridActionsCellItem} from "@mui/x-data-grid";
 

const ClassTypeTable = ({ perPage, page }) => {
    const { setClasses, classes } = useContext(ClassesAPIContext);
    const [open, setOpen] = useState(false);
    const { isAdmin } = useContext(UserAPIContext);
    const [modalHeader, setModalHeader] = useState("Success");
    const [modalMessage, setModalMessage] = useState("You have been successfully subscribed.");
    const navigate = useNavigate();
    const {classTypes, setClassTypes} = useContext(UserAPIContext);

    const [modalOpen, setModalOpen] = useState(false);
    const openModal = () => setModalOpen(true);
    const closeModal = () => {
        setModalOpen(false);
        navigate("/subscriptions");
    };

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

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
                let updated = classTypes;
                updated.push(id);
                setClassTypes(updated);
                $("#"+`enrol-button-${id}`).attr("disabled", true);
            })
            .catch(err => {
                setModalHeader("Error");
                setModalMessage("User has no active subscription. Please choose a subscription plan.");
                openModal();
            })


    }

    return (
        <>
        <Modal
            open={modalOpen}
            onClose={closeModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    {modalHeader}
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    {modalMessage}
                </Typography>
            </Box>
        </Modal>
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
                            <TableCell>{ dayjs(clss.end_recurrence ).format("DD/MM/YYYY") }</TableCell>
                            <TableCell>{ clss.end_time }</TableCell>
                            <TableCell>
                                <Button className="Button" id={`enrol-button-${clss.id}`}
                                        disabled={classTypes.indexOf(clss.id) !== -1}
                                        onClick={() => {
                                            handleSubmit(clss.id);
                                        }}>
                                    ENROL</Button>
                                {isAdmin &&
                                    <GridActionsCellItem
                                        icon={<DeleteIcon />}
                                        label="Delete"
                                        onClick={() => {
                                            handleDelete(clss.id)}}
                                        color="inherit"
                                    />}
                                {isAdmin &&
                                    <Button className="Button" id={`edit-button-${clss.id}`}
                                            onClick={e => {
                                                navigate(`/classes/${clss.id}/edit//`);}
                                            }>
                                        EDIT</Button>
                                }


                            </TableCell>

                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        </>
    )
}

export default ClassTypeTable;