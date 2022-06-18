import React, {useEffect, useState} from 'react';
import L from 'leaflet';
import MapSmall from "./MapSmall";
import 'leaflet.locatecontrol';
import 'leaflet-search';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import { useReactiveVar } from "@apollo/client";
import { locationMapVar, sideBarOpenTabVar } from "./cache";
import './MyLocationMap.scss';


let lc;
export default function MyLocationMap({onLocationFound}) {
    const mapInstance = useReactiveVar(locationMapVar);
    const openTab = useReactiveVar(sideBarOpenTabVar);


    useEffect(() => {
        return () => {
            lc?.stop();
        }
    }, [])


    const mapReady = (map) =>{
        L.PM.setOptIn(true);
        map.addControl(L.control.zoom({ position: 'bottomright' }));

        lc = L.control.locate({
            position: 'topright',
            locateOptions: {
                enableHighAccuracy: true}}).addTo(map);

        map.on('locationfound', function (e) {
            onLocationFound(e.latlng.lng, e.latlng.lat);
        });

        // add Leaflet-Geoman controls with some options to the map
        map.pm = new L.PM.Map(map);
        map.pm.addControls({
            position: 'bottomleft',
            drawPolyline: false,
            drawMarker: false,
            drawCircle: true,
            cutPolygon: false,
            drawCircleMarker: false,

        });


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

        locationMapVar(map);
        lc.start();
    }
    if(mapInstance) {
        mapInstance._onResize();
    }

    return (
        openTab === 'add-report' && <MapSmall setMap={mapReady} />
    )
}
