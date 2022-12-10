import React, {useContext, useEffect, useState} from 'react';
import { useNavigate, useParams } from "react-router-dom";
import {Button, Grid, ImageList, ImageListItem, Paper} from "@mui/material";
import UserAPIContext from "../../../contexts/UserAPIContext";
import {tokenHandle} from "../../../pages/login";
import {DataGrid, GridActionsCellItem} from "@mui/x-data-grid";
import './style.css';
import {theme} from "../../../themes/main";
import {ThemeProvider} from "@mui/material/styles";

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

    const parsePhone = (phone) => {
        phone = String(phone);
        let first = phone.substring(0,3)
        let mid = phone.substring(3,6)
        let last = phone.substring(6)
        return `(${first}) ${mid}-${last}`
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
            <ThemeProvider theme={theme}>
            <div className={"profile-page"}>
            <h2> { studio.name }</h2>
            { isAdmin &&
                <>
                    <Button color="primary" className="Button" id="edit-button" variant="outlined" onClick={redirectEdit}>EDIT</Button>
                    <Button color="primary" className="Button" id="class-button" variant="outlined" onClick={redirectClass}>ADD CLASS</Button>
                </>
             }
            <br/>
            <ImageList
                sx={{ width: 500, height: 450 }} cols={2} rowHeight={164}
            >
                {studio.image1 !== undefined && studio.image1 != null &&
                    <ImageListItem><img alt='profile' src={studio.image1}/></ImageListItem>
                }
                {studio.image2 !== undefined  && studio.image2 != null &&
                    <ImageListItem><img alt='profile' src={studio.image2} /></ImageListItem>
                }
                {studio.image3 !== undefined && studio.image3 != null &&
                    <ImageListItem><img alt='profile' src={studio.image3} /></ImageListItem>
                }
                {studio.image4 !== undefined && studio.image4 != null &&
                    <ImageListItem><img alt='profile' src={studio.image4} /></ImageListItem>
                }
                {studio.image5 !== undefined && studio.image5 != null &&
                    <ImageListItem><img alt='profile' src={studio.image5}/></ImageListItem>
                }
            </ImageList>
            <br/>
            <p> Address: { studio.address }</p>
            <p> Postal Code: { studio.postal_code }</p>
            <p> Phone: { parsePhone(studio.phone) }</p>

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
                <Button color="primary" className="Button" id="delete-button" variant="outlined" onClick={submitDel}>DELETE</Button>
             }
            </div>
            </ThemeProvider>
        </>

    )

}

export default StudioProfile;