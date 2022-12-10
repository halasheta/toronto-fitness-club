import React, {useContext, useEffect, useState} from 'react';
import {Autocomplete, Button, Input, TextField} from "@mui/material";
import { tokenHandle } from "../../../pages/login";
import {useNavigate, useParams} from "react-router-dom";
import $ from 'jquery';
import UserAPIContext from "../../../contexts/UserAPIContext";
import {DataGrid, GridActionsCellItem} from "@mui/x-data-grid";
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import Status404 from "../../Common/Errors/Status404";
import './style.css';

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

    const [image1, setImage1] = useState(null);
    const [image2, setImage2] = useState(null);
    const [image3, setImage3] = useState(null);
    const [image4, setImage4] = useState(null);
    const [image5, setImage5] = useState(null);

    const [image1New, setImage1New] = useState(null);
    const [image2New, setImage2New] = useState(null);
    const [image3New, setImage3New] = useState(null);
    const [image4New, setImage4New] = useState(null);
    const [image5New, setImage5New] = useState(null);

    const [rows, setRows] = useState([]);

    const { isAdmin } = useContext(UserAPIContext);

    const apiKey = "9SkGRa52CMqNXGZI4xjATR8cogEMAruY";

    const imageBody = () => {
        const form_data = new FormData();
        form_data.append('name', name);
        form_data.append('address', address);
        form_data.append('longitude', long);
        form_data.append('latitude', lat);
        form_data.append('postal_code', postalCode);
        form_data.append('phone', phone);

        if (image1New !== null){
            form_data.append('image1', image1New);
        }
        if (image2New !== null){
            form_data.append('image2', image2New);
        }
        if (image3New !== null){
            form_data.append('image3', image3New);
        }
        if (image4New !== null){
            form_data.append('image4', image4New);
        }
        if (image5New !== null){
            form_data.append('image5', image5New);
        }

        return form_data;
    }


    const requestBody = () => {
        return JSON.stringify({
            name: name,
            address: address,
            postal_code: postalCode,
            longitude: long,
            latitude: lat,
            phone: phone,
            amenities: amenities
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
                            if (!r.ok) {
                                return Promise.reject(r);
                            }
                            fetch(`http://localhost:8000/studios/${id}/edit/`, {
                                method: 'PUT',
                                headers: {
                                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                                },
                                body: imageBody()
                            })
                                .then(r => {
                                    if (!r.ok) {
                                        return Promise.reject(r);
                                    }
                                    navigate(`/studios/${id}/profile/`);
                                })
                                .catch(r => {
                                    console.log(r);
                                    let res = r.valueOf();
                                    if (res !== {}){
                                        setErrors(res);
                                    }
                                })
                        })
                        .catch(r => {
                            console.log(r)
                            let res = r.valueOf();
                            if (res !== {}){
                                setErrors(res);
                            }
                        })
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
                        setImage1(json.image1);
                        setImage2(json.image2);
                        setImage3(json.image3);
                        setImage4(json.image4);
                        setImage5(json.image5);


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

    const uploadImage = (e) => {
        if (e.target.name === "image1"){
            setImage1(URL.createObjectURL(e.target.files[0]));
            setImage1New(e.target.files[0]);
        } else if (e.target.name === "image2"){
            setImage2(URL.createObjectURL(e.target.files[0]));
            setImage2New(e.target.files[0]);
        } else if (e.target.name === "image3"){
            setImage3(URL.createObjectURL(e.target.files[0]));
            setImage3New(e.target.files[0]);
        } else if (e.target.name === "image4"){
            setImage4(URL.createObjectURL(e.target.files[0]));
            setImage4New(e.target.files[0]);
        } else if (e.target.name === "image5"){
            setImage5(URL.createObjectURL(e.target.files[0]));
            setImage5New(e.target.files[0]);
        }
    }


    return(
        <>
            <div className={"edit-page"}>
            { isAdmin ? <>
                    <h1>Edit Studio</h1>
                    <form>
                        <TextField id="name" label="Name" variant="outlined"
                                   required onChange={e => setName(e.target.value)}
                                   value={name}
                                   error={errors.name !== undefined} helperText={errors.name}
                                   sx={{ width: 400 }}
                                   InputLabelProps={{
                                       shrink: true,
                                   }}/>

                        <br/>
                        <TextField id="prev-address" label="Previous Address" variant="outlined"
                                   value={studio.address} editable="false"
                                   sx={{ width: 400 }}
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

                            sx={{ width: 400 }}

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
                                   sx={{ width: 400 }}
                                   InputLabelProps={{
                                       shrink: true,
                                   }}/>
                        <br/>

                        <TextField id="phone" label="Phone Number" variant="outlined"
                                   required onChange={e => setPhone(e.target.value)}
                                   value={phone}
                                   error={errors.phone !== undefined} helperText={errors.phone}
                                   sx={{ width: 400 }}
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
                                       onChange={e => setType(e.target.value)}
                                       sx={{ width: 200 }}/>

                            <TextField id='amenity-qty' type="number" variant="outlined" label={"Quantity"}
                                       InputProps={{ inputProps: { min: 0 } }}
                                       sx={{ width: 200 }}
                                       onChange={e => setQuantity(e.target.value)}/>
                            <br/>
                            <Button className="Button" id="button" variant="outlined" onClick={addAmenity}>ADD AMENITY</Button>
                        </div>




                        <br/>

                        <h3>Images</h3>
                        <div className={'image-preview'}> <input accept="image/*"  style={{ display: 'none' }} id="img-button-file-1"
                                                        type="file" name="image1" onChange={uploadImage}/>
                            <label htmlFor="img-button-file-1">
                                <Button className="Button" variant="contained" component="span"> Choose Image </Button>
                            </label>
                            {image1 != null && <img alt='new-img-1' src={image1} width="200"/>}
                        </div>


                        <div className={'image-preview'}> <input accept="image/*"  style={{ display: 'none' }} id="img-button-file-2"
                                     type="file" name="image2" onChange={uploadImage}/>
                            <label htmlFor="img-button-file-2">
                                <Button className="Button" variant="contained" component="span"> Choose Image </Button>
                            </label>
                            {image2 != null && <img alt='new-img-2' src={image2} width="200"/>}
                        </div>


                        <div className={'image-preview'}> <input accept="image/*"  style={{ display: 'none' }} id="img-button-file-3"
                                     type="file" name="image3" onChange={uploadImage}/>
                            <label htmlFor="img-button-file-3">
                                <Button className="Button" variant="contained" component="span"> Choose Image </Button>
                            </label>
                            {image3 != null && <img alt='new-img-3' src={image3} width="200"/>}
                        </div>


                        <div className={'image-preview'}> <input accept="image/*"  style={{ display: 'none' }} id="img-button-file-4"
                                     type="file" name="image4" onChange={uploadImage}/>
                            <label htmlFor="img-button-file-4">
                                <Button className="Button" variant="contained" component="span"> Choose Image </Button>
                            </label>
                            {image4 != null && <img alt='new-img-4' src={image4} width="200"/>}
                        </div>



                        <div className={'image-preview'}> <input accept="image/*"  style={{ display: 'none' }} id="img-button-file-5"
                                     type="file" name="image5" onChange={uploadImage}/>
                            <label htmlFor="img-button-file-5">
                                <Button className="Button" variant="contained" component="span"> Choose Image </Button>
                            </label>
                            {image5 != null && <img alt='new-img-5' src={image5} width="200"/>}
                        </div>

                        <br/>

                        <br/>

                        <Button className="Button" id="submit-button" variant="outlined" onClick={submitReq}>SUBMIT</Button>
                    </form>
                </>
                : <Status404/>
            }
            </div>
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
{/*            <Button className="Button" id={`amenity-delete-button-${i}`} variant="outlined"*/}
{/*                    onClick={updateAmenities}>REMOVE</Button>*/}
{/*            <Button className="Button" id={`amenity-button-${i}`} variant="outlined"*/}
{/*                    onClick={updateAmenities}>SUBMIT CHANGE</Button>*/}
{/*            <br/>*/}
{/*        </>*/}

{/*    )}*/}
{/*    <br/>*/}
{/*    </div>*/}
{/*: <></>}*/}


{/*</div>*/}