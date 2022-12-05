import React, {useEffect, useState} from 'react';
import {Autocomplete, Button, Input, TextField} from "@mui/material";
import { tokenHandle } from "../../pages/login";
import { useNavigate } from "react-router-dom";
import ReactSearchBox from "react-search-box";

const Studio = () => {
    const [name, setName] = useState('');

    const [address, setAddress] = useState('');
    const [long, setLong] = useState(0);
    const [lat, setLat] = useState(0);
    const [searchResults, setSearchResults] = useState([]);
    const [inputValue, setInputValue] = useState('');

    const [postalCode, setPostalCode] = useState('');
    const [phone, setPhone] = useState('');

    const [amenities, setAmenities] = useState([]);
    const [images, setImages] = useState([]);

    const [errors, setErrors] = useState({});

    let apiKey = "9SkGRa52CMqNXGZI4xjATR8cogEMAruY";


    let navigate = useNavigate();

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
                            if (res !== {}){
                                setErrors(res);
                            }
                        })
                        .catch(err => console.log(err))
                }
            })

    }


    const onSearchChange = async (e) => {
        let baseUrl = 'https://api.tomtom.com/search/2/search'
        await fetch(`${baseUrl}/${e.target.value}.json?key=${apiKey}&language=en-US&limit=7&countrySet=CA`, {
            method: 'GET',

        })
            .then(r => r.json())
            .then(json => {
                setSearchResults(json.results);
                console.log(searchResults);
            })
            .catch(err => console.log(err))
    }


     return(
        <>
            <h1>Add a studio</h1>
            <form>
                <TextField id="name" label="Name" variant="outlined"
                           required onChange={e => setName(e.target.value)}
                           error={errors.name !== undefined} helperText={errors.name}/>


                <Autocomplete
                    freeSolo
                    autoSelect
                    options={searchResults}
                    // TODO: if search results are empty dont access address
                    getOptionLabel={(option) => option.address.freeformAddress}
                        //     searchResults.map(result => ({
                        //         address: result.address.freeformAddress.value,
                        //         // longitude: result.position.lon,
                        //         // latitude: result.position.lat
                        // }))}

                    placeholder={"Start typing for suggestions"}

                    renderInput={ (params) => <TextField {...params} id="address" label={"Address"}
                    onChange={onSearchChange}/>}
                    autoComplete={inputValue.length > 2}
                    />

                {/*<ReactSearchBox*/}
                {/*    placeholder="Search for nearby places"*/}
                {/*    matchedRecords={searchResults*/}
                {/*        .map(result => ({*/}
                {/*            key: result.id,*/}
                {/*            name: result.poi.name,*/}
                {/*            dist: result.dist,*/}
                {/*            value: `${result.poi.name} | ${(result.dist / 1000).toFixed(2)}km `*/}
                {/*        }))*/}
                {/*        .sort((a, b) => a.dist - b.dist)*/}
                {/*    }*/}
                {/*    data={searchResults*/}
                {/*        .map(result => ({*/}
                {/*            key: result.id,*/}
                {/*            name: result.poi.name,*/}
                {/*            dist: result.dist,*/}
                {/*            value: result.poi.name*/}
                {/*        }))*/}
                {/*        .sort((a, b) => a.dist - b.dist)*/}
                {/*    }*/}
                {/*    onSelect={(place) => console.log(place)}*/}
                {/*    autoFocus={true}*/}
                {/*    onChange={onSearchChange}*/}
                {/*    fuseConfigs={{*/}
                {/*        minMatchCharLength: 0,*/}
                {/*        threshold: 1,*/}
                {/*        distance: 100000,*/}
                {/*        sort: false*/}
                {/*    }}*/}
                {/*    keys = {['name']}*/}
                {/*/>*/}

                <TextField id="postal_code" label="Postal Code" variant="outlined"
                           required onChange={e => setPostalCode(e.target.value)}
                           error={errors.postal_code !== undefined} helperText={errors.postal_code}/>

                <TextField id="phone" label="Phone Number" variant="outlined"
                           required onChange={e => setPhone(e.target.value)}
                           error={errors.phone !== undefined} helperText={errors.phone}/>


                <Input accept="image/*" type="file" multiple
                       onChange={e => setImages(images => [...images, e.target.files])}/>


                <Button id="create-button" variant="outlined" onClick={submitReq}>CREATE</Button>
            </form>
        </>
        )
}


export default Studio;