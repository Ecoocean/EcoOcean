import React, { useState } from 'react';
import L from 'leaflet';
import MapSmall from "./MapSmall";
import 'leaflet.locatecontrol';
import 'leaflet-search';
import 'leaflet-measure';
import {useReactiveVar} from "@apollo/client";
import {sideBarOpenTabVar} from "./cache";
import './MyLocationMap.scss';



export default function MyLocationMap({onLocationFound}) {
    const [mapInstance, setMapInstance] = useState(null);
    const [lc, setLc] = useState(null);
    const openTab = useReactiveVar(sideBarOpenTabVar);


    const mapReady = (map) =>{

        //map.addControl(search);
        map.addControl(L.control.zoom({ position: 'bottomright' }));
        const lc = L.control.locate({
            position: 'topright',
            locateOptions: {
                enableHighAccuracy: true}}).addTo(map);
        setLc(lc);

        map.on('locationfound', function (e) {
            onLocationFound(e.latlng.lng, e.latlng.lat);
        });

        const measureControl = new L.Control.Measure({
            position: 'bottomleft',
            primaryLengthUnit: 'meters',
            primaryAreaUnit: 'sqmeters',
            activeColor: "#0074d9",
            completedColor:  "#9c27b0"
        });
        measureControl.addTo(map);

        const searchLayer = new L.Control.Search({
            position: 'topleft',
            zoom: 15,
            url: 'https://nominatim.openstreetmap.org/search?format=json&q={s}',
            jsonpParam: 'json_callback',
            propertyName: 'display_name',
            propertyLoc: ['lat','lon'],
            marker: L.circleMarker([0,0],{radius:30}),
            autoCollapse: true,
            autoType: false,
            minLength: 1
        });

        searchLayer.on('search:locationfound', function (e) {
            map.stopLocate();
            lc.stopFollowing();
            onLocationFound(e.latlng.lng, e.latlng.lat);
            map.panTo({lat: e.latlng.lat, lng: e.latlng.lng}, 10);
        });
        map.addControl(searchLayer);

        setMapInstance(map);
    }
    if (openTab === 'add-report' && mapInstance){
        mapInstance._onResize();
        // request location update and set location
        lc.start();
    }

    return (
        <MapSmall setMap={mapReady} />
    )
}
