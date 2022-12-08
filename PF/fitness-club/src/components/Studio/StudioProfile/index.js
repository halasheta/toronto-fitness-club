import React, {useContext, useEffect, useState} from 'react';
import { useNavigate, useParams } from "react-router-dom";
import {Button, Grid, ImageList, ImageListItem, Paper} from "@mui/material";
import UserAPIContext from "../../../contexts/UserAPIContext";
import {tokenHandle} from "../../../pages/login";

const StudioProfile = () => {
    let navigate = useNavigate();
    const { id } = useParams();
    const { isAdmin } = useContext(UserAPIContext);
    const [studio, setStudio] = useState({});

    const redirectEdit = () => {
        navigate(`/studios/${id}/edit`);
    }

    const redirectClass = () => {
        navigate(`/studios/${id}/classes/add`);
    }
    const submitDel = () => {
        fetch(`http://localhost:8000/studios/${id}/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`,
            }})
            .then(r => {
                if (r.ok) {
                    navigate('/studios');
                } else {
                    alert("Status " + r.status + ": Your request could not be completed at this time");
                }
            })
            .catch(err => console.log(err))
    }


    useEffect(() => {
        tokenHandle().then(success => {
            if (!success) {
                localStorage.setItem("lastPage", `/studios/${id}/profile`);
                navigate("/login");
            } else {
                fetch(`http://localhost:8000/studios/${id}/profile`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    }
                })
                    .then(r => r.json())
                    .then(json => {
                        setStudio(json);

                    })
                    .catch(err => console.log(err))
            }
        })
    }, [])

    return(
        <>
            <h2> { studio.name }</h2>
            {/*{ isAdmin &&*/}
            <Button id="edit-button" variant="outlined" onClick={redirectEdit}>EDIT</Button>

            <Button id="class-button" variant="outlined" onClick={redirectClass}>ADD CLASS</Button>
             {/*}*/}
            {studio.images !== undefined ?
                <ImageList
                    sx={{ width: 500, height: 450 }}
                    variant="quilted"
                    cols={4}
                    rowHeight={121}>
                    {studio.images.map((img) => (
                        <>
                            <ImageListItem key={img.image} cols={1} rows={1}>
                                <img src={img.image} loading="lazy"/>
                            </ImageListItem>
                        </>
                        ))}
                </ImageList>
                : <></>
            }
            <p> Address: { studio.address }</p>
            <p> Postal Code: { studio.postal_code }</p>
            <p> Phone: { studio.phone }</p>

            {studio.amenities !== undefined ?
                    <>
                    <p> Amenities </p>
                    <Grid container spacing={2} columns={16}
                          alignItems="center">
                    {studio.amenities.map((amty) => (
                        <Grid item xs={12} sm={6} md={3}>
                            <Paper> { amty.type } </Paper>
                            <Paper> quantity = { amty.quantity } </Paper>
                        </Grid>
                    ))}
                    </Grid>
                    </>
                : <></>
            }

            <br/>
            {/*{ isAdmin && */}
                <Button id="delete-button" variant="outlined" onClick={submitDel}>DELETE</Button>
            {/* }*/}
        </>
    )

}

export default StudioProfile;