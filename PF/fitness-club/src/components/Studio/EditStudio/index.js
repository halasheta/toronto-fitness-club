import React, {useContext, useEffect, useState} from 'react';
import {Autocomplete, Button, Input, TextField} from "@mui/material";
import { tokenHandle } from "../../../pages/login";
import {useNavigate, useParams} from "react-router-dom";
import $ from 'jquery';
import UserAPIContext from "../../../contexts/UserAPIContext";
import {DataGrid, GridActionsCellItem} from "@mui/x-data-grid";
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import Status404 from "../../Common/Errors/Status404";

const EditStudio = () => {
    let navigate = useNavigate();
    const { id } = useParams();
    const [studio, setStudio] = useState({});

    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [long, setLong] = useState(0);
    const [lat, setLat] = useState(0);

    const [searchResults, setSearchResults] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [value, setValue] = useState('');

    const [postalCode, setPostalCode] = useState('');
    const [phone, setPhone] = useState('');
    const [images, setImages] = useState([]);
    const [errors, setErrors] = useState({});

    const [amenities, setAmenities] = useState([]);
    const [type, setType] = useState('');
    const [quantity, setQuantity] = useState(0);

    const [rows, setRows] = useState([]);

    const { isAdmin } = useContext(UserAPIContext);

    const apiKey = "9SkGRa52CMqNXGZI4xjATR8cogEMAruY";


    const requestBody = () => {
        return JSON.stringify({
            name: name,
            address: address,
            postal_code: postalCode,
            longitude: long,
            latitude: lat,
            phone: phone,
            amenities: amenities,
            images: images
        })
    }

    const submitReq = () => {
        tokenHandle()
            .then(success => {
                if (!success) {
                    localStorage.setItem("lastPage", "/studios/add");
                    navigate("/login");
                } else {
                    fetch(`http://localhost:8000/studios/${id}/edit/`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem("token")}`,
                        },
                        body: requestBody()
                    })
                        .then(r => {
                            if (r.ok) {
                                navigate(`/studios/${id}/profile/`);
                            } else {
                                return r.json();
                            }
                        })
                        .then(r => {
                            let res = r.valueOf();
                            if (res !== {}){
                                setErrors(res);
                            }
                        })
                        .catch(err => console.log(err))
                }
            })

    }


    const onSearchChange = async (e) => {
        setInputValue(e.target.value);

        if (inputValue.length > 2) {
            let baseUrl = 'https://api.tomtom.com/search/2/search'
            await fetch(`${baseUrl}/${e.target.value}.json?key=${apiKey}&language=en-US&limit=7&countrySet=CA`, {
                method: 'GET',

            })
                .then(r => r.json())
                .then(json => {
                    setSearchResults(json.results);
                })
                .catch(err => console.log(err))

        }
    }

    const onAddressSelection = (e, val) => {
        setValue(val);
        if (val != null){
            setAddress(val.address.freeformAddress);
            setLong(val.position.lon);
            setLat(val.position.lat);
        } else {
            setAddress('');
            setLong(0);
            setLat(0);
        }
    }


    const addAmenity = () => {
        const amty = {
            type: type,
            quantity: parseInt(quantity)
        }

        if (amenities.indexOf(amty) === -1) {
            setAmenities(amenities => [...amenities, amty]);
        }

        $('#amenity-type').val('');
        $('#amenity-qty').val('');

        if (rows.indexOf({...amty, id: rows.length}) === -1) {
            setRows(rows => [...rows, {...amty, id: rows.length}]);
        }


    }


    const processRowUpdate = (newRow) => {
        const updatedRow = { ...newRow, isNew: false };

        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    }

    const handleDeleteClick = (id) => () => {
        setRows(rows.filter((row) => row.id !== id));
        amenities.splice(id, 1);
    }



    useEffect(() => {
        tokenHandle().then(success => {
            if (!success) {
                localStorage.setItem("lastPage", `/studios/${id}/edit`);
                navigate("/login");
            } else {
                fetch(`http://localhost:8000/studios/${id}/edit`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    }
                })
                    .then(r => r.json())
                    .then(json => {
                        setStudio(json);

                        setName(json.name);
                        setPostalCode(json.postal_code);
                        setPhone(json.phone);
                        setAddress(json.address);


                        if (json.amenities !== undefined) {
                            let rws = [];
                            let amtys = [];
                            json.amenities.map( (amenity, i) => {
                                if (amtys.indexOf(amenity) === -1) {
                                    amtys.push(amenity)
                                }

                                let row = {...amenity, id: i};
                                if (rws.indexOf(row) === -1){
                                    rws.push(row);
                                }
                            })
                            setRows(rws);
                            setAmenities(amtys);
                        }
                    })
                    .catch(err => console.log(err))
            }
        })
    }, [])


    return(
        <>
            { isAdmin ? <>
                    <h1>Edit Studio</h1>
                    <form>
                        <TextField id="name" label="Name" variant="outlined"
                                   required onChange={e => setName(e.target.value)}
                                   value={name}
                                   error={errors.name !== undefined} helperText={errors.name}
                                   InputLabelProps={{
                                       shrink: true,
                                   }}/>

                        <br/>
                        <TextField id="prev-address" label="Previous Address" variant="outlined"
                                   value={studio.address} editable="false"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}/>

                        <br/>
                        <Autocomplete
                            freeSolo
                            options={searchResults}
                            getOptionLabel={(option) =>
                                option.address.freeformAddress ? option.address.freeformAddress : ""
                            }

                            renderInput={ (params) =>
                                <TextField {...params} id="address" label={"New Address"}
                                         />}

                            sx={{ width: 200 }}

                            input={inputValue}
                            value={value || null}

                            open={inputValue.length > 2}
                            onInputChange={onSearchChange}
                            onChange={onAddressSelection}

                            />
                        <br/>

                        <TextField id="postal_code" label="Postal Code" variant="outlined"
                                   required onChange={e => setPostalCode(e.target.value)}
                                   value={postalCode}
                                   error={errors.postal_code !== undefined} helperText={errors.postal_code}
                                   InputLabelProps={{
                                       shrink: true,
                                   }}/>
                        <br/>

                        <TextField id="phone" label="Phone Number" variant="outlined"
                                   required onChange={e => setPhone(e.target.value)}
                                   value={phone}
                                   error={errors.phone !== undefined} helperText={errors.phone}
                                   InputLabelProps={{
                                       shrink: true,
                                   }}/>

                        <br/>

                        <h3>Amenities</h3>
                        { studio.amenities !== undefined &&
                        <div id="amenities" style={{ height: 300, width: 400 }}>
                            <DataGrid
                                columns={[
                                {field: 'type', headerName: 'Type', width: 200, editable: true},
                                {field: 'quantity', headerName: 'Quantity', type: 'number', editable: true},
                                {field: 'action', headerName: 'Action', type: 'actions',
                                getActions: ({ id }) => {
                                    return [<GridActionsCellItem
                                        icon={<DeleteIcon />}
                                        label="Delete"
                                        onClick={handleDeleteClick(id)}
                                        color="inherit"
                                    />]
                                }}

                                ]}

                                rows={rows}

                                editMode={"row"}

                                processRowUpdate={processRowUpdate}
                                experimentalFeatures={{ newEditingApi: true }}
                            />
                        </div>
                        }

                        <div id="add-amenities">
                            <br/>
                            <TextField id='amenity-type' label="Type" variant="outlined"
                                       onChange={e => setType(e.target.value)}/>

                            <TextField id='amenity-qty' type="number" variant="outlined" label={"Quantity"}
                                       InputProps={{ inputProps: { min: 0 } }}
                                       onChange={e => setQuantity(e.target.value)}/>
                            <br/>
                            <Button id="button" variant="outlined" onClick={addAmenity}>ADD AMENITY</Button>
                        </div>




                        <br/>

                        <h3>Images</h3>

                        <br/>
                        <input accept="image/*"
                               type="file"
                               multiple
                               style={{ display: 'none' }}
                               id="images-button"
                               />

                        <label htmlFor="images-button">
                            <Button variant="contained" component="span">
                                UPLOAD IMAGES
                            </Button>
                        </label>
                        <br/>

                        <br/>

                        <Button id="submit-button" variant="outlined" onClick={submitReq}>SUBMIT</Button>
                    </form>
                </>
                : <Status404/>
            }
        </>
        );
}


export default EditStudio;

{/*{studio.amenities !== undefined ?*/}


{/*<div id="edit-amenities">*/}
{/*    <AmenityTable amenities={studio.amenities}></AmenityTable>*/}
{/*    {studio.amenities.map((amty, i) =>*/}
{/*        <>*/}
{/*            <TextField id={`amenity-type-${i}`} label="Type" variant="outlined"*/}
{/*                       value={amty.type}*/}
{/*                       InputLabelProps={{*/}
{/*                           shrink: true,*/}
{/*                       }}*/}
{/*                       onChange={e => setType(e.target.value)}/>*/}

{/*            <TextField id={`amenity-qty-${i}`} type="number" variant="outlined"*/}
{/*                       label={"Quantity"}*/}
{/*                       InputProps={{ inputProps: { min: 0 } }}*/}
{/*                       value={amty.quantity}*/}
{/*                       InputLabelProps={{*/}
{/*                           shrink: true,*/}
{/*                       }}*/}
{/*                       onChange={e => setQuantity(e.target.value)}/>*/}
{/*            <br/>*/}
{/*            <Button id={`amenity-delete-button-${i}`} variant="outlined"*/}
{/*                    onClick={updateAmenities}>REMOVE</Button>*/}
{/*            <Button id={`amenity-button-${i}`} variant="outlined"*/}
{/*                    onClick={updateAmenities}>SUBMIT CHANGE</Button>*/}
{/*            <br/>*/}
{/*        </>*/}

{/*    )}*/}
{/*    <br/>*/}
{/*    </div>*/}
{/*: <></>}*/}


{/*</div>*/}