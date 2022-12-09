import React, {useContext, useEffect, useState} from 'react';
import { useNavigate, useParams } from "react-router-dom";
import {Button, Grid, ImageList, ImageListItem, Paper} from "@mui/material";
import UserAPIContext from "../../../contexts/UserAPIContext";
import {tokenHandle} from "../../../pages/login";
import {DataGrid, GridActionsCellItem} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";

const StudioProfile = () => {
    let navigate = useNavigate();
    const { id } = useParams();
    const { isAdmin } = useContext(UserAPIContext);
    const [studio, setStudio] = useState({});
    const [rows, setRows] = useState([]);


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
                        let rws = [];
                        json.amenities.map( (amenity, i) => {

                            let row = {...amenity, id: i};
                            if (rws.indexOf(row) === -1){
                                rws.push(row);
                            }
                        })
                        setRows(rws);

                    })
                    .catch(err => console.log(err))
            }
        })
    }, [])

    return(
        <>
            <h2> { studio.name }</h2>
            { isAdmin &&
                <>
                    <Button id="edit-button" variant="outlined" onClick={redirectEdit}>EDIT</Button>
                    <Button id="class-button" variant="outlined" onClick={redirectClass}>ADD CLASS</Button>
                </>
             }
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

            <h3>Amenities</h3>
            { studio.amenities !== undefined &&

                <div id="amenities" style={{ height: 300, width: 400 }}>
                    <DataGrid
                        columns={[
                            {field: 'type', headerName: 'Type', width: 200, editable: false},
                            {field: 'quantity', headerName: 'Quantity', type: 'number', editable: false}]}

                        rows={rows}
                    />
                </div>
            }

            <br/>
            { isAdmin &&
                <Button id="delete-button" variant="outlined" onClick={submitDel}>DELETE</Button>
             }
        </>
    )

}

export default StudioProfile;