import React, {useEffect, useState} from 'react';
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
    DialogTitle, DialogContent, RadioGroup, FormControlLabel, Radio, Box, Typography, Modal
} from "@mui/material";
import $ from 'jquery';
import ClassesAPIContext from "../../../contexts/ClassesAPIContext";
import {GridActionsCellItem} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import UserAPIContext from "../../../contexts/UserAPIContext";
import {useNavigate} from "react-router-dom";
import dayjs from "dayjs";

const ClassesTable = ({ perPage, page }) => {
    const { setClasses, classes } = useContext(ClassesAPIContext);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("occurrence");
    const [currClass, setCurrClass] = useState(0);
    const { isAdmin } = useContext(UserAPIContext);
    const [modalHeader, setModalHeader] = useState("Success");
    const [modalMessage, setModalMessage] = useState("You have been successfully subscribed.");
    const navigate = useNavigate();
    const [userClasses, setUserClasses] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const openModal = () => setModalOpen(true);
    const closeModal = () => {
        setModalOpen(false);
        navigate("/subscriptions");
    };

    const handleClose = () => {
        setOpen(false);
    }

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

    const handleDelete = (clss) => {
        setClasses((prev) => prev.filter((c) => c.id !== clss.id));
        fetch(`http://localhost:8000/classes/${clss.class_model}/delete/?occ_id=${clss.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`,
            }})
            .then(r => r.json())
            .catch(err => console.log(err))

    }

    const userEnrolled = () => {
        fetch(`http://localhost:8000/classes/schedule/?limit=1000`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`,
            }})
            .then(r => r.json())
            .then(data => {
                let ids = [];
                Object.entries(data.results).map((inst) => {
                    ids.push(inst[1]["id"]);
                })

                setUserClasses(ids);
            })
            .catch(err => console.log(err))
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
                $("#"+`enrol-button-${currClass.id}`).attr("disabled", true);
                userEnrolled();
                handleClose();
            })
            .catch(err => {
                setModalHeader("Error");
                setModalMessage("User has no active subscription. Please choose a subscription plan.");
                openModal();
            })


    }

    useEffect(() => {
        userEnrolled();
    }, [])

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
                    <TableCell>{ dayjs(clss.start_time).format("DD/MM/YY hh:mm")  }</TableCell>
                    <TableCell>{ dayjs(clss.end_time).format("DD/MM/YY hh:mm") }</TableCell>
                    <TableCell>
                        <Button id={`enrol-button-${clss.id}`}
                                disabled={userClasses.indexOf(clss.id) !== -1}
                                onClick={e => {
                                        setOpen(true);
                                        setCurrClass(clss);}
                        }>
                            ENROL</Button>
                        <Dialog open={open} onClose={handleClose}>
                            <DialogTitle>Enrol in...</DialogTitle>
                            <DialogContent>
                                <RadioGroup
                                    defaultValue="occurrence"
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
                        {isAdmin &&
                            <GridActionsCellItem
                                icon={<DeleteIcon />}
                                label="Delete"
                                onClick={() => {
                                    handleDelete(clss)}}
                                color="inherit"
                            />}

                    </TableCell>

                </TableRow>
        ))}
        </TableBody>
            </Table>
        </TableContainer>
        </>
    )
}

export default ClassesTable;