import React, {useEffect, useRef, useState} from 'react';
import '@tomtom-international/web-sdk-maps/dist/maps.css';
import tt from '@tomtom-international/web-sdk-maps';


const StudioMap = () => {
    const mapElement = useRef();

    const [lat, setLat] = useState(43.663062);
    const [long, setLong] = useState(-79.395694);
    const [zoom, setZoom] = useState(13);
    const [map, setMap] = useState({});



    useEffect(() => {
        let map = tt.map({key: "9SkGRa52CMqNXGZI4xjATR8cogEMAruY",
            container: mapElement.current,
            center: [long, lat],
            zoom: zoom});
        setMap(map);
        return () => map.remove();
    }, [long, lat]);

    return (
        <>
        <h3>Find studios close to you</h3>
        <div ref={mapElement} id={"map"}></div>
        </>

    )

}

export default StudioMap;