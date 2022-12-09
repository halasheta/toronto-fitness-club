import React, {useContext, useState} from 'react';
import {Autocomplete, Button, Input, TextField} from "@mui/material";
import { tokenHandle } from "../../../pages/login";
import { useNavigate } from "react-router-dom";
import $ from 'jquery';
import UserAPIContext from "../../../contexts/UserAPIContext";
import Status404 from "../../Common/Errors/Status404";

const CreateStudio = () => {
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
    const [errors, setErrors] = useState({});

    const [amenities, setAmenities] = useState([]);
    const [type, setType] = useState('');
    const [quantity, setQuantity] = useState(0);

    const [numUpload, setNumUpload] = useState(1);

    const [imagePreviews, setImagePreviews ] = useState({});
    const [images, setImages] = useState({});

    const apiKey = "9SkGRa52CMqNXGZI4xjATR8cogEMAruY";

    const { isAdmin } = useContext(UserAPIContext);

    const toJSON = (file) => {

        if (file === undefined){
            return "";
        }
        return {
            'lastModified'     : file.lastModified,
            'lastModifiedDate' : file.lastModifiedDate,
            'name'             : file.name,
            'size'             : file.size,
            'type'             : file.type
        };
    }

    const requestBody = () => {
        // return JSON.stringify({
        //     name: name,
        //     address: address,
        //     longitude: long,
        //     latitude: lat,
        //     postal_code: postalCode,
        //     phone: phone,
        //     amenities: amenities,
        //     image1: images["one"],
        //     image2: images["two"],
        //     image3: images["three"],
        //     image4: images["four"],
        //     image5: images["five"],
        // })
        const form_data = new FormData();
        form_data.append('name', name);
        form_data.append('address', address);
        form_data.append('longitude', long);
        form_data.append('latitude', lat);
        form_data.append('postal_code', postalCode);
        form_data.append('phone', phone);
        form_data.append("amenities", amenities)

        // for (let i = 0; i < amenities.length; i++) {
        //     form_data.append(`amenities[${i}]`, amenities[i]);
        // }
        // form_data.append("amenities", JSON.stringify(amenities));
        if (images["1"] !== ""){
            form_data.append('image1', images["one"])
        }

        if (images["2"] !== ""){
            form_data.append('image1', images["two"])
        }
        if (images["3"] !== ""){
            form_data.append('image1', images["three"])
        }
        if (images["4"] !== ""){
            form_data.append('image1', images["four"])
        }
        if (images["5"] !== ""){
            form_data.append('image1', images["five"])
        }

        return form_data;
    }

    const submitReq = () => {
        tokenHandle()
            .then(success => {
                if (!success) {
                    localStorage.setItem("lastPage", "/studios/add");
                    navigate("/login");
                } else {
                    fetch('http://localhost:8000/studios/new/', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem("token")}`,
                        },
                        body: requestBody()
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
        if (val != null){
            setAddress(val.address.freeformAddress);
            setLong(val.position.lon);
            setLat(val.position.lat);
            if (val.address.extendedPostalCode != null && val.address.extendedPostalCode !== undefined){
                setPostalCode(val.address.extendedPostalCode.replace(/\s+/g, ''));
            }
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

        setAmenities(amenities => [...amenities, amty]);
        $('#amenity-type').val('');
        $('#amenity-qty').val('');


    }

    const uploadImage = (e) => {
        let updatedLinks = imagePreviews;
        let updatedImages = images;

        updatedLinks[e.target.name] = URL.createObjectURL(e.target.files[0]);
        updatedImages[e.target.name] = e.target.files[0];

        setImagePreviews(updatedLinks);
        setImages(updatedImages);
        setNumUpload(numUpload + .5);
    }

    const showMore = () => {
        setNumUpload(numUpload + 1);
    }

     return(
        <>
            { isAdmin ? <>
                    <h1>Add a Studio</h1>
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
                            sx={{ width: 200 }}

                            input={inputValue}
                            value={value || null}

                            open={  inputValue !== undefined && inputValue.length > 2}
                            onInputChange={onSearchChange}
                            onChange={onAddressSelection}
                            />
                        <br/>

                        <TextField id="postal_code" label="Postal Code" variant="outlined" value={postalCode}
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

                        {numUpload >= 1 && <div> <input accept="image/*"  style={{ display: 'none' }} id="img-button-file-1"
                                                         type="file" name="one" onChange={uploadImage}/>
                            <label htmlFor="img-button-file-1">
                                <Button variant="contained" component="span"> Choose Image </Button>
                            </label> </div>}
                        {images["one"] !== undefined && <img alt='new-img-1' src={imagePreviews.one} width="100"/>}

                        {numUpload >= 2 && <div> <input accept="image/*"  style={{ display: 'none' }} id="img-button-file-2"
                                                         type="file" name="two" onChange={uploadImage}/>
                            <label htmlFor="img-button-file-2">
                                <Button variant="contained" component="span"> Choose Image </Button>
                            </label> </div>}
                        {images["two"] !== undefined && <img alt='new-img-2' src={imagePreviews.two} width="100"/>}

                        {numUpload >= 3 && <div> <input accept="image/*"  style={{ display: 'none' }} id="img-button-file3"
                            type="file" name="three" onChange={uploadImage}/>
                        <label htmlFor="img-button-file3">
                            <Button variant="contained" component="span"> Choose Image </Button>
                        </label> </div>}

                        {images["three"] !== undefined && <img alt='new-img-3' src={imagePreviews.three} width="100"/>}

                        {numUpload >= 4 && <div> <input accept="image/*"  style={{ display: 'none' }} id="img-button-file4"
                                                         type="file" name="four" onChange={uploadImage}/>
                            <label htmlFor="img-button-file4">
                                <Button variant="contained" component="span"> Choose Image </Button>
                            </label> </div>}
                        {images["four"] !== undefined && <img alt='new-img-4' src={imagePreviews.four} width="100"/>}

                        {numUpload >= 5 && <div> <input accept="image/*"  style={{ display: 'none' }} id="img-button-file5"
                                                         type="file" name="five" onChange={uploadImage}/>
                            <label htmlFor="img-button-file5">
                                <Button variant="contained" component="span"> Choose Image </Button>
                            </label> </div>}
                        {images["five"] !== undefined && <img alt='new-img-5' src={imagePreviews.five} width="100"/>}

                        <Button variant={"text"} onClick={showMore} disabled={numUpload >= 5}>Add another image</Button>
                        <br/>

                        <br/>

                        <Button id="create-button" variant="outlined" onClick={submitReq}>CREATE</Button>
                    </form>
                </>
                : <Status404/>
            }
        </>
        );
}


export default CreateStudio;