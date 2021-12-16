import React, {useEffect, useState} from 'react';
import { Button, Spinner } from "react-bootstrap";
import L from 'leaflet';
import { Marker, useMap } from "react-leaflet";

import blueFilledMarker from './icons/marker-blue-optimized.svg';
// when the docs use an import:
import * as GeoSearch from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';
import MapSmall from "./MapSmall";
import 'leaflet/dist/leaflet.css';

const blueMarker = L.icon({
    iconUrl: blueFilledMarker,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
});


const provider = new GeoSearch.OpenStreetMapProvider()
const search = new GeoSearch.GeoSearchControl({
    provider: provider,
    style: 'bar',
    marker: {
        // optional: L.Marker    - default L.Icon.Default
        icon: blueMarker,
        draggable: true,
      },
  });



function MyLocation({onLocationFound, onGpsLocationFound}) {
    const map = useMap();
    const [location, setLocation] = useState({lat: 31.4117257, lng:35.0818155});
    const [usingSearch, setUsingSearch] = useState(false);
    const [gpsLocaionFound, setGpsLocationFound] = useState(false);
    map.addControl(search);

    useEffect(() =>{
        const locationWatchID = navigator.geolocation.watchPosition(
            ({ coords: { latitude: lat, longitude: lng, accuracy: acc } }) => {
                if (acc < 50 && !usingSearch && !gpsLocaionFound) {
                    // if the location is within 50 meters
                    setGpsLocationFound(true);
                    onGpsLocationFound();
                    setLocation({lat: lat, lng:lng});
                    onLocationFound(lng, lat);
                    map.flyTo({lat: lat, lng:lng}, 18);
                }
            },
            (err) => console.log(err),
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 1000,
            }
        );

        return () => {
            navigator.geolocation.clearWatch(locationWatchID);
        }
    }, [])
    
    
    map.on('geosearch/showlocation', function (e) {
        setUsingSearch(true);
        onLocationFound(e.location.x, e.location.y);
 
    });
    map.on('geosearch/marker/dragend', function (e) {
        onLocationFound(e.location.lng, e.location.lat)
    });
    return (gpsLocaionFound || usingSearch) ? <Marker
                    position={[location.lat, location.lng]} icon={blueMarker}>

                    </Marker> : null
            
    
}

export default function MyLocationMap({onLocationFound}) {
    const [gpsLocationFound, setGpsLocationFound] = useState(false);

    const onGpsLocationFound = () => {
        setGpsLocationFound(true);
    }
    const mapReady = (map) =>{
        map.addControl(L.control.zoom({ position: 'bottomright' }));
        setTimeout(function(){ map.invalidateSize()}, 300);
    }
   
    return (
        <div>
             {!gpsLocationFound && (
            <Button variant="primary">
              <Spinner
                as="span"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              getting accurate location...
            </Button>
          )}
            <MapSmall setMap={mapReady} >
                <MyLocation onLocationFound={onLocationFound} onGpsLocationFound={onGpsLocationFound}/>
            </MapSmall>
    </div>
    )
}
