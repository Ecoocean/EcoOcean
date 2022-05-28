import React, {useState} from 'react'
import {useReactiveVar} from "@apollo/client";
import {useEffect} from "react";
import L from "leaflet";
import {useMap} from "react-leaflet";
import * as turf from '@turf/turf';
import {gvulotVar, sensVar} from "./cache";
import { redGreenScaleLayers } from "./chromaColors";


let controller = null
const Layers = () => {

    const map = useMap();
    const gvulot = useReactiveVar(gvulotVar);
    const sens = useReactiveVar(sensVar);
    const [gvulGroup, setGvulGroup] = useState(null);
    const [sensGroup, setSensGroup] = useState(null);
    L.Control.Layers.include({
        getActiveOverlays: function () {

            // Create array for holding active layers
            var active = [];

            // Iterate all layers in control
            this._layers.forEach(function (obj) {

                // Check if it's an overlay and added to the map
                if (obj.overlay && map.hasLayer(obj.layer)) {

                    // Push layer to active array
                    active.push(obj.layer);
                }
            });

            // Return array
            return active;
        }
    });
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
        if (gvulot && sens) {
            if(controller) {
                const active = controller.getActiveOverlays();
                console.log(active);
                gvulGroup.removeFrom(map);
                sensGroup.removeFrom(map);
                controller.remove();
            }
            const gvulots = gvulot.map((gvul, i) => {
                const myStyle = {
                    "color": redGreenScaleLayers(gvul.score).hex(),
                    "weight": 4,
                    "opacity": 0.80
                };
                return L.geoJSON(gvul.geom.geojson, {
                    style: myStyle,
                    onEachFeature: onEachFeature
                });
            });
            const pub_sens = sens.map((sens, i) => {

                var myStyle = {
                    "color": redGreenScaleLayers(sens.score).hex(),
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
            const gvulGroupLocal = L.layerGroup(gvulots);
            const sensGroupLocal = L.layerGroup(pub_sens);

            const overlayMaps = {
                "Municipal": gvulGroupLocal,
                "Beach Segments": sensGroupLocal
            };
            controller = L.control.layers(baseMaps, overlayMaps, {position: 'topright'}).addTo(map);
            //make the layer active.
            basicLayer.addTo(map);
            gvulGroupLocal.addTo(map);
            sensGroupLocal.addTo(map);

            setGvulGroup(gvulGroupLocal);
            setSensGroup(sensGroupLocal);
        }
    }, [sens, gvulot])

    return (
        <div>
        </div>
    )
}

export default Layers;