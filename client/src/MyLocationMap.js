import React, { useState } from 'react';
import L from 'leaflet';
import { Marker } from "react-leaflet";
import blueFilledMarker from './icons/marker-blue-optimized.svg';
// when the docs use an import:
import * as GeoSearch from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';
import MapSmall from "./MapSmall";
import 'leaflet/dist/leaflet.css';
import 'leaflet.locatecontrol';
import {useReactiveVar} from "@apollo/client";
import {sideBarOpenTabVar} from "./cache";

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

export default function MyLocationMap({onLocationFound}) {
    const [mapInstance, setMapInstance] = useState(null);
    const [usingSearch, setUsingSearch] = useState(false);
    const [location, setLocation] = useState(null);
    const [lc, setLc] = useState(null);
    const openTab = useReactiveVar(sideBarOpenTabVar);


    const mapReady = (map) =>{

        map.addControl(search);
        map.addControl(L.control.zoom({ position: 'bottomright' }));

        const lc = L.control.locate({
            locateOptions: {
                enableHighAccuracy: true}}).addTo(map);
        setLc(lc);

        map.on('locationfound', function (e) {
            onLocationFound(e.latlng.lng, e.latlng.lat);
            setUsingSearch(false);
        });
        map.on('geosearch/showlocation', function (e) {
            onLocationFound(e.location.x, e.location.y);
            setLocation(e.location);
            setUsingSearch(true);
            map.panTo({lat: e.location.y, lng: e.location.x}, 10);
        });
        map.on('geosearch/marker/dragend', function (e) {
            onLocationFound(e.location.lng, e.location.lat);
            setLocation(e.location);
            setUsingSearch(true);
        });

        setMapInstance(map);
    }
    if (openTab === 'add-report' && mapInstance){
        mapInstance._onResize();
        // request location update and set location
        lc.start();
    }

    return (
        <MapSmall setMap={mapReady} >
            {usingSearch && <Marker
            position={[location.y, location.x]} icon={blueMarker}>

        </Marker>}
        </MapSmall>
    )
}
