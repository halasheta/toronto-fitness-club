import React, {useContext, useState} from 'react';
import {Autocomplete, Button, Input, TextField} from "@mui/material";
import { tokenHandle } from "../../pages/login";
import { useNavigate } from "react-router-dom";
import $ from 'jquery';
import UserAPIContext from "../../contexts/UserAPIContext";
import Status404 from "../Common/Errors/Status404";

const Studio = () => {
    let apiKey = "9SkGRa52CMqNXGZI4xjATR8cogEMAruY";
    let navigate = useNavigate();

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

    const { isAdmin } = useContext(UserAPIContext);

    const submitReq = () => {
        tokenHandle()
            .then(success => {
                if (!success) {
                    // TODO: deal with unauthorized access (when a (non-admin) tries to access it)
                    localStorage.setItem("lastPage", "/studios/add")
                    navigate("/login");
                } else {
                    fetch('http://localhost:8000/studios/new/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem("token")}`,
                        },
                        body: JSON.stringify({
                            name: name,
                            address: address,
                            longitude: long,
                            latitude: lat,
                            postal_code: postalCode,
                            phone: phone,
                            amenities: amenities,
                            images: images
                        })
                    })
                        .then(r => {
                            if (r.ok) {
                                navigate('/studios');
                            } else {
                                return r.json();
                            }
                        })
                        .then(r => {
                            let res = r.valueOf();
                            console.log(res);
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
        setAddress(val.address.freeformAddress);
        setLong(val.position.lon);
        setLat(val.position.lat);
    }

    const addAmenity = () => {
        const amty = {
            type: type,
            quantity: parseInt(quantity)
        }

        setAmenities(amenities => [...amenities, amty]);
        console.log(amenities);
        $('#amenity-type').val('');
        $('#amenity-qty').val('');


    }


     return(
        <>
            {/*{ isAdmin ? <>*/}
                    <h1>Add a studio</h1>
                    <form>
                        <TextField id="name" label="Name" variant="outlined"
                                   required onChange={e => setName(e.target.value)}
                                   error={errors.name !== undefined} helperText={errors.name}/>

                        <br/>
                        <Autocomplete
                            freeSolo
                            options={searchResults}
                            getOptionLabel={(option) =>
                                option.address.freeformAddress ? option.address.freeformAddress : ""
                            }

                            renderInput={ (params) =>
                                <TextField {...params} id="address" label={"Address"}/>}
                            sx={{ width: 300 }}

                            input={inputValue}
                            value={value || null}

                            open={inputValue.length > 2}
                            onInputChange={onSearchChange}
                            onChange={onAddressSelection}
                            />
                        <br/>

                        <TextField id="postal_code" label="Postal Code" variant="outlined"
                                   required onChange={e => setPostalCode(e.target.value)}
                                   error={errors.postal_code !== undefined} helperText={errors.postal_code}/>
                        <br/>

                        <TextField id="phone" label="Phone Number" variant="outlined"
                                   required onChange={e => setPhone(e.target.value)}
                                   error={errors.phone !== undefined} helperText={errors.phone}/>

                        <br/>

                        <div id="amenity">
                            Amenities
                            <br/>
                            <TextField id='amenity-type' label="Type" variant="outlined"
                                       onChange={e => setType(e.target.value)}/>

                            <TextField id='amenity-qty' type="number" variant="outlined" label={"Quantity"}
                                       InputProps={{ inputProps: { min: 0 } }}
                                       onChange={e => setQuantity(e.target.value)}/>
                            <br/>
                            <Button id="create-button" variant="outlined" onClick={addAmenity}>ADD AMENITY</Button>
                        </div>

                        <br/>

                        Images

                        <br/>
                        <input accept="image/*" type="file" multiple
                               onChange={e => {
                                   setImages(images => [...images, e.target.files]);
                                   console.log(e.target.files)
                               }}/>

                        <br/>

                        <br/>

                        <Button id="create-button" variant="outlined" onClick={submitReq}>CREATE</Button>
                    </form>
            {/*    </>*/}
            {/*    : <Status404/>*/}
            {/*}*/}
        </>
        );
}


export default Studio;