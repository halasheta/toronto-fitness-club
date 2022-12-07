import React, {useContext, useEffect, useState} from 'react';
import {tokenHandle} from "../login";
import {useNavigate} from "react-router-dom";
import {Box, Button, Modal, Typography} from "@mui/material";
import UserAPIContext from "../../contexts/UserAPIContext";

const Subscriptions = () => {
    let navigate = useNavigate();
    let open = false;
    const [subscriptions, setSubscriptions] = useState({results: {}});
    const [nextPage, setNextPage] = useState(null);
    const [previousPage, setPreviousPage] = useState(null);
    const [modalHeader, setModalHeader] = useState("Success");
    const [modalMessage, setModalMessage] = useState("You have been successfully subscribed.");

    const [modalOpen, setModalOpen] = useState(false);
    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    const { isAdmin, subscription, setSubscription} = useContext(UserAPIContext);

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

    const getData = () => {
        tokenHandle().then(success => {
                if (!success){
                    localStorage.setItem("lastPage", "/subscriptions")
                    navigate("/login");
                } else {
                    fetch("http://localhost:8000/subscriptions/all/", {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem("token")}`,
                        }
                    }) .then(response => {
                        if (!response.ok){
                            return Promise.reject(response);
                        }
                        return response.json()
                    }).then(data => {
                        console.log(data)
                        setNextPage(data.next);
                        setPreviousPage(data.previous);
                        setSubscriptions(data);
                    }).catch(err => {
                        console.log(err);
                    })
                }
            }
        )
    }

    const subscribe = (e) => {
        let pk = e.target.name;
        console.log(pk);
        tokenHandle().then(success => {
                if (!success){
                    localStorage.setItem("lastPage", "/subscriptions")
                    navigate("/login");
                } else {
                    fetch("http://localhost:8000/subscriptions/"+ pk + "/subscribe/", {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem("token")}`,
                        }
                    }) .then(response => {
                        if (!response.ok){
                            return Promise.reject(response);
                        }
                        console.log(response)
                        return response.json()
                    }).then(data => {
                        setSubscription(pk);
                        setModalHeader("Success");
                        setModalMessage("You have been successfully subscribed.")
                        openModal();
                    }).catch(err => {
                        if (err.status === 400){
                            // bring up error box showing that
                            setModalHeader("Error");
                            setModalMessage("You do not have an existing payment method saved.")
                            openModal();
                        }
                        // check if 400 because then redirect them to make a payment method
                        console.log(err);
                    })
                }
            }
        )
    }

    const createSubscription = () => {
        navigate('/subscriptions/add');
    }

    useEffect(() => {
        getData();
    }, []);



    // TODO: add subscriptions/new route to router
    return (
        <>
            <h1>Subscriptions</h1>
            {isAdmin && <Button
                variant="outlined"
                onClick={createSubscription}>
                +
            </Button>}

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
            <div>
                {Object.entries(subscriptions.results).map(([prop, value]) => {
                    return (
                        <>
                            <div>
                                <div className='subscription' key={prop}>
                                    <h2>{value.duration}</h2>
                                    <h2>{"$" + String(value.price)}</h2>
                                    <Button id="subscribe-button" name={value.pk} variant="contained" onClick={subscribe} disabled={String(value.pk) === subscription}>Subscribe</Button>
                                </div>
                            </div>
                        </>
                        );
                    })
                }
            </div>
        </>
    )
}

export default Subscriptions;