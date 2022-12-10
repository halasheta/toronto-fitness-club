import React, {useEffect, useState} from 'react';
import { useNavigate } from "react-router-dom";
import {ButtonGroup, Button, TextField} from "@mui/material";
import {tokenHandle} from "../login";
 


const Payments = () => {
    // show current payment method
    // have button to update payment method that brings up modal?

    // show payment history with toggle between past and past + future payments
    const navigate = useNavigate();
    const [cardNumber, setCardNumber] = useState(null);
    const [payments, setPayments] = useState(null);
    const [viewFuture, setViewFuture] = useState(false);
    const [makeNew, setMakeNew] = useState(false);
    const [newNumber, setNewNumber] = useState(null);
    const [newCode, setNewCode] = useState(null);
    const [validNumber, setValidNumber] = useState(true);
    const [validCode, setValidCode] = useState(true);
    const [nextPage, setNextPage] = useState(null);
    const [previousPage, setPreviousPage] = useState(null);
    const [pageNum, setPageNum] = useState(1);
    const [] = useState(null);

    const getData = () => {
        // two fetch requests, one to get payment method, one to get payment history
        tokenHandle().then(success => {
                if (!success){
                    localStorage.setItem("lastPage", "/payments")
                    navigate("/login");
                } else {
                    fetch("http://localhost:8000/payments/method/update/", {
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
                        setCardNumber(data.credit_number);
                        fetch("http://localhost:8000/payments/history/", {
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
                            console.log(data);
                            setNextPage(data.next);
                            setPreviousPage(data.previous);
                            setPayments(data);
                        }).catch(err => {
                            console.log(err);
                        })
                    }).catch(err => {
                        console.log(err);
                    })
                }
            }
        )
    }

    const censorCard = (card) => {
        card = String(card);
        let numStars = card.length - 4;
        let stars = "*".repeat(numStars);
        return stars + card.substring(numStars);
    }

    const paymentMethod = () => {
        // send data to /payments/new or /update
        let error = false;
        if (newCode == null || newCode.length !== 3){
            setValidCode(false);
            error = true;
        } else {
            setValidCode(true);
        }

        if (newNumber == null || newNumber.length < 8 || newNumber.length > 19){
            setValidNumber(false);
            error = true;
        } else {
            setValidNumber(true);
        }

        if (!error){
            let form_data = new FormData();
            form_data.append('credit_number', newNumber);
            form_data.append('credit_code', newCode);
            if (cardNumber == null){
                fetch("http://localhost:8000/payments/method/create/", {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: form_data
                }) .then(response => {
                    if (!response.ok){
                        return Promise.reject(response);
                    }
                    return response.json()
                }).then(data => {
                    console.log(data);
                    setCardNumber(data.credit_number);
                    if (viewFuture){
                        getPayments("10/");
                    }
                    setMakeNew(!makeNew);
                }).catch(err => {
                    console.log(err);
                })
            } else {
                fetch("http://localhost:8000/payments/method/update/", {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: form_data
                }) .then(response => {
                    if (!response.ok){
                        return Promise.reject(response);
                    }
                    return response.json()
                }).then(data => {
                    console.log(data);
                    setCardNumber(data.credit_number);
                    if (viewFuture){
                        getPayments("10/");
                    }
                    setMakeNew(!makeNew);
                }).catch(err => {
                    console.log(err);
                })
            }


        }
    }

    const getPayments = (query) => {
        fetch("http://localhost:8000/payments/history/" + query, {
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
            console.log(data);
            setPayments(data);
            setNextPage(data.next);
            setPreviousPage(data.previous)
        }).catch(err => {
            console.log(err);
        })
    }

    const toggleView = () => {
        let query = "";
        if (!viewFuture){
            query = "50/?limit=10";
        }

        getPayments(query);
        setViewFuture(!viewFuture);
    }

    const toggleMake = () => {
        setMakeNew(!makeNew);
    }

    const numberChange = (event) => {
        setNewNumber(event.target.value);
    }

    const codeChange = (event) => {
        setNewCode(event.target.value);
    }

    const paginate = (event) => {
        let newNum = pageNum;
        let query = "";
        if (event.target.name === "add"){
            newNum += 1;
            query = nextPage;
        } else {
            newNum -= 1;
            query = previousPage;
        }

        if (query !== ""){
            fetch(query, {
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
                console.log(data);
                setPayments(data);
                setNextPage(data.next);
                setPreviousPage(data.previous)
                setPageNum(newNum);
            }).catch(err => {
                console.log(err);
            })
        }

    }

    useEffect(() => {
        getData();
    }, []);

    return (
        <>
            <h1>Payments</h1>

            { cardNumber != null &&
                <div>
                    <h4>Current Payment Method</h4>
                    <p><b>Card Number: </b>{censorCard(cardNumber)}</p>
                </div>
            }

            { cardNumber == null &&
                <div>
                    <h5>You have no existing payment method saved.</h5>
                </div>
            }

            <Button className="Button"
                variant="outlined"
                onClick={toggleMake}>New Payment Method
            </Button>

            { makeNew &&
            <div>
                <TextField id="filled-number" label="Card Number" type="Number" variant="outlined" onChange={numberChange}
                           error={!validNumber} helperText={validNumber ? "" : "Card number is invalid."}/>
                <TextField id="filled-number" label="Security Code"  type="Number"  variant="outlined" onChange={codeChange}
                           error={!validCode} helperText={validCode ? "" : "Security code is invalid."}/>
                <Button className="Button" variant="contained" onClick={paymentMethod}>Save </Button>
            </div>}

            <br/>

            <h4>Payment History</h4>
            <ButtonGroup className="Button"Group variant="contained">
                <Button className="Button" disabled={!viewFuture} onClick={toggleView}>Past Only</Button>
                <Button className="Button" disabled={viewFuture} onClick={toggleView}>Past & Future</Button>
            </ButtonGroup>
            <div>
                {(payments == null || Object.entries(payments.results).length === 0) &&
                    <p> {viewFuture ? "You have no past or future payments." : "You have no past payments."}</p>
                }

                {payments != null && Object.entries(payments.results).map(([prop, value]) => {
                    return (
                        <>
                            <div>
                                <div className='payment' key={prop}>
                                    {value.charged &&
                                        <p><b>Charged</b></p>
                                    }
                                    <div>
                                        <p><b>Date: </b>{value.date.substring(0,10) + " " + value.date.substring(11,16)}</p>
                                        <p><b>Amount: </b>${value.amount}</p>
                                        <p><b>Card: </b>{censorCard(value.credit_number)}</p>
                                    </div>
                                    <hr/>
                                </div>
                            </div>
                        </>
                    );
                })}

                {payments != null &&
                    <div>
                        <Button className="Button" onClick={paginate} id="page-prev" name="sub" variant="contained" disabled={previousPage == null}>{"<"}</Button>
                        <p id="page-num">{pageNum}</p>
                        <Button className="Button" onClick={paginate} id="page-next" name="add" variant="contained" disabled={nextPage == null}>{">"}</Button>
                    </div>}
            </div>
        </>
    )
}

export default Payments;