import React, {useEffect, useRef, useState} from 'react';
import '@tomtom-international/web-sdk-maps/dist/maps.css';
import tt from '@tomtom-international/web-sdk-maps';
import {Autocomplete, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField} from "@mui/material";
import {tokenHandle} from "../../../pages/login";
import {useNavigate} from "react-router-dom";
import "./style.css";


const StudioMap = () => {
    let navigate = useNavigate();
    const mapElement = useRef();

    const apiKey = "9SkGRa52CMqNXGZI4xjATR8cogEMAruY";

    const [coords, setCoords] = useState({longitude: -79.395694, latitude: 43.663062})
    const [geoError, setGeoError] = useState(null);

    const [searchResults, setSearchResults] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [value, setValue] = useState('');

    const [zoom, setZoom] = useState(13);
    const [map, setMap] = useState({});

    const [userMarker, setUserMarker] = useState(null);
    const [studios, setStudios] = useState([]);
    const [radioValue, setRadioValue] = useState(5);


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
        if (val != null) {
            setCoords({longitude: val.position.lon, latitude: val.position.lat});
            tokenHandle()
                .then(success => {
                    if (!success) {
                        localStorage.setItem("lastPage", "/studios/map");
                        navigate("/login");
                    } else {
                        fetch(`http://localhost:8000/studios/all?longitude=${val.position.lon}&latitude=${val.position.lat}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${localStorage.getItem("token")}`,
                            }
                        })
                            .then(r => r.json())
                            .then(json => {
                                setStudios(json.results);
                            })
                            .catch(err => console.log(err));
                    }
                });
        }
    }


    useEffect(() => {
         if (!navigator.geolocation) {
             setGeoError('The Geolocation API is not available in your browser!')
         }
         else {
            navigator.geolocation.getCurrentPosition((e) => {
                setCoords({longitude: e.coords.longitude,
                                latitude: e.coords.latitude});
            }, (err) => {
                setGeoError('Something went wrong getting your position!')
            })
         }


        let map = tt.map({key: apiKey,
            container: mapElement.current,
            center: [coords.longitude, coords.latitude],
            zoom: zoom});
        setMap(map);

        let marker = new tt.Marker({
            color: '#FFA500'
        });
        marker.setLngLat([coords.longitude, coords.latitude]);
        marker.addTo(map);

        setUserMarker(marker);

        for (let i = 0; i < studios.length && i < radioValue; i++){
            let marker = new tt.Marker({
                color: '#8E1600'
            });
            marker.setLngLat([studios[i].longitude, studios[i].latitude]);
            marker.addTo(map);
            marker.setPopup(new tt.Popup({offset: 30}).setText(`[${studios[i].name}] ${studios[i].address}`));
        }
        return () => map.remove();
    }, [coords, studios, radioValue]);


    return (
        <>
            <div className="map-page">
        <h3>Find studios near you</h3>
        <br/>
        <FormControl>
            <FormLabel>Display the closest...</FormLabel>
            <RadioGroup
                row
                onChange={e => setRadioValue(e.target.value)}>
                <FormControlLabel value="5" control={<Radio/>}
                                  label="5 studios"/>
                <FormControlLabel value="10" control={<Radio/>}
                                  label="10 studios"/>
                <FormControlLabel value="15" control={<Radio/>}
                                  label="15 studios"/>

            </RadioGroup>
        </FormControl>
            <br/>

            <Autocomplete
            freeSolo
            options={searchResults}
            getOptionLabel={(option) =>
                option.address.freeformAddress ? option.address.freeformAddress : ""
            }

            renderInput={ (params) =>
                <TextField {...params} id="location" label={"Start typing for options..."}/>}
            sx={{ width: 500 }}

            input={inputValue}
            value={value || null}

            open={  inputValue !== undefined && inputValue.length > 2}
            onInputChange={onSearchChange}
            onChange={onAddressSelection}
        />
        <br/>
        <div style={{ height: 500, width: 500 }}
             ref={mapElement} id={"map"}></div>
            </div>
        </>

    )

}

export default StudioMap;