import React, {useState, Fragment, use} from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Tooltip, useMapEvents, useMap } from "react-leaflet";

import blueFilledMarker from './icons/marker-blue-optimized.svg';
// when the docs use an import:
import * as GeoSearch from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';

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



function MyLocation({onLocationFound}) {
    const map = useMap();
    const [location, setLocation] = useState({lat: 31.4117257, lng:35.0818155});
    const [usingSearch, setUsingSearch] = useState(false);
    const [gpsLocaionFound, setGpsLocaionFound] = useState(false);
    map.addControl(search);

    const locationWatchID = navigator.geolocation.watchPosition(
        ({ coords: { latitude: lat, longitude: lng, accuracy: acc } }) => {
          if (acc < 50 && !usingSearch && !gpsLocaionFound) {
            // if the location is within 50 meters
            setGpsLocaionFound(true);
            setLocation({lat: lat, lng:lng});
            onLocationFound(lat, lng);
            map.flyTo({lat: lat, lng:lng},15);
          }
        },
        (err) => console.log(err),
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 1000,
        }
    );
    
    
    map.on('geosearch/showlocation', function (e) {
        setUsingSearch(true);
        onLocationFound(e.location.x, e.location.y);
 
    });
    map.on('geosearch/marker/dragend', function (e) {
        onLocationFound(e.location.lat, e.location.lng)
    });
    return gpsLocaionFound? <Marker
                    position={[location.lat, location.lng]} icon={blueMarker}>

                    </Marker> : null
    
}

export default function MyLocationMap({onLocationFound}) {
    
   
    return (
        <MapContainer
            style={{ height: '50vh', width: '100wh' }}
            className="markercluster-map"
            center={[31.4117257, 35.0818155]}
            zoom={8}
            maxZoom={18}
        >
        <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <MyLocation onLocationFound={onLocationFound} />
        
        </MapContainer>
    )
}
