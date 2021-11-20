import React, {useState} from 'react';
import { Button, Spinner } from "react-bootstrap";
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";

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



function MyLocation({onLocationFound, onGpsLocationFound}) {
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
            onGpsLocationFound();
            setLocation({lat: lat, lng:lng});
            onLocationFound(lng, lat);
            map.flyTo({lat: lat, lng:lng},18);
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
        onLocationFound(e.location.lng, e.location.lat)
    });
    return gpsLocaionFound && !usingSearch? <Marker
                    position={[location.lat, location.lng]} icon={blueMarker}>

                    </Marker> : null
            
    
}

export default function MyLocationMap({onLocationFound}) {
    const [gpsLocaionFound, setGpsLocaionFound] = useState(false);

    const onGpsLocationFound = () => {
        setGpsLocaionFound(true);
    }
   
    return (
        <div>
             {!gpsLocaionFound && (
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
            <MyLocation onLocationFound={onLocationFound} onGpsLocationFound={onGpsLocationFound}/>
            
            </MapContainer>
    </div>
    )
}
