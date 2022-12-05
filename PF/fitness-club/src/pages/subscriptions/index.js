import React, {useContext, useEffect, useState} from 'react';
import {tokenHandle} from "../login";
import {useNavigate} from "react-router-dom";
import {Button, Modal} from "@mui/material";
import UserAPIContext from "../../contexts/UserAPIContext";

const Subscriptions = () => {
    let navigate = useNavigate();
    let open = false;
    const [subscriptions, setSubscriptions] = useState({results: {}});
    const [modalMessage, setModalMessage] = useState("");

    const { isAdmin, subscription } = useContext(UserAPIContext);

    console.log(isAdmin, subscription);

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
                        console.log(response)
                        return response.json()
                    }).then(data => {
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
                        console.log("successfully subscribed!")
                    }).catch(err => {
                        if (err.status === 400){
                            // bring up error box showing that
                        }
                        // check if 400 because then redirect them to make a payment method
                        console.log(err);
                    })
                }
            }
        )
    }


    useEffect(() => {
        getData();
    }, []);



    return (
        <>
            <h1>Subscriptions</h1>
            {/*<Modal*/}
            {/*    open={open}*/}
            {/*    onClose={handleClose}*/}
            {/*    aria-labelledby="modal-modal-title"*/}
            {/*    aria-describedby="modal-modal-description"*/}
            {/*>*/}
            {/*    <Box sx={style}>*/}
            {/*        <Typography id="modal-modal-title" variant="h6" component="h2">*/}
            {/*            Text in a modal*/}
            {/*        </Typography>*/}
            {/*        <Typography id="modal-modal-description" sx={{ mt: 2 }}>*/}
            {/*            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.*/}
            {/*        </Typography>*/}
            {/*    </Box>*/}
            {/*</Modal>*/}
            <div>
                {Object.entries(subscriptions.results).map(([prop, value]) => {
                    console.log(value);
                    return (
                        <>
                            <div>
                                <div className='subscription' key={prop}>
                                    <h2>{value.duration}</h2>
                                    <h2>{"$" + String(value.price)}</h2>
                                    <Button id="subscribe-button" name={value.pk} variant="contained" onClick={subscribe} disabled={value.pk === subscription}>Subscribe</Button>
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