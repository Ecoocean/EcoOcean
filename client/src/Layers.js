import React, {useState} from 'react'
import {useQuery, useReactiveVar} from "@apollo/client";
import {GET_GVULOTS, GET_SENS } from "./GraphQL/Queries";
import {useEffect} from "react";
import L from "leaflet";
import {useMap} from "react-leaflet";
import * as turf from '@turf/turf';
import {gvulotVar, sensVar} from "./cache";


const Layers = () => {

    const map = useMap();
    const gvulot = useReactiveVar(gvulotVar);
    const sens = useReactiveVar(sensVar);
    const [layersLoaded, setLayersLoaded] = useState(false);
    const whenClicked = (e) => {
        // e = event
        console.log(e);
        // You can make your ajax call declaration here
        //$.ajax(...
    }

    const onEachFeature = (feature, layer) => {
        //bind click
        layer.on({
            click: whenClicked
        });
    }

    
    useEffect(() => {
        if (gvulot && sens && !layersLoaded) {
            setLayersLoaded(true);
            const gvulots = gvulot.map((gvul, i) => {
                var myStyle = {
                    "color": i % 3 === 0 ? "#EE4B2B" : i % 3 === 1 ? "#ff8c00" : "#0BDA51",
                    "weight": 5,
                    "opacity": 0.65
                };
                return L.geoJSON(gvul.geom.geojson, {
                    style: myStyle,
                    onEachFeature: onEachFeature
                });
            });
            const pub_sens = sens.map((sens, i) => {

                var myStyle = {
                    "color": i % 3 === 0 ? "#EE4B2B" : i % 3 === 1 ? "#ff8c00" : "#0BDA51",
                    "weight": 5,
                    "opacity": 0.65
                };
                const layer = L.geoJSON(sens.geom.geojson, {
                    style: myStyle,
                    onEachFeature: onEachFeature
                });
                layer.bindPopup(`<p>ID ${sens.id}<br />area: ${turf.area(layer.toGeoJSON())}</p>`);
                return layer;
            });

            const googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
                maxZoom: 20,
                subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
            });

            const googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
                maxZoom: 20,
                subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
            });

            const googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
                maxZoom: 20,
                subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
            });

            const googleTerrain = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
                maxZoom: 20,
                subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
            });

            const basicLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                maxNativeZoom: 19,
                maxZoom: 22
            });
            const estriSat = L.tileLayer(
                'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                    maxZoom: 20,
                });


            const baseMaps = {
                "Base": basicLayer,
                "Streets": googleStreets,
                "Hybrid": googleHybrid,
                "Terrain": googleTerrain,
                "Satellite": googleSat,
                "Another Satellite": estriSat,
            };
            const gvulGroup = L.layerGroup(gvulots);
            const sensGroup = L.layerGroup(pub_sens);
            const overlayMaps = {
                "Municipal": gvulGroup,
                "Beach Segments": sensGroup
            };
            L.control.layers(baseMaps, overlayMaps, {position: 'topright'}).addTo(map);
            //make the layer active.
            basicLayer.addTo(map);
            gvulGroup.addTo(map);
        }
    }, [sens, gvulot])

    return (
        <div>
        </div>
    )
}

export default Layers;