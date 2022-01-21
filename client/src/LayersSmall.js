import React from 'react'
import {useQuery} from "@apollo/client";
import {GET_GVULOTS_GEOJSON, GET_SENS_GEOJSON } from "./GraphQL/Queries";
import {useEffect} from "react";
import L from "leaflet";
import {useMap} from "react-leaflet";
import * as turf from '@turf/turf';


const LayersSmall = () => {

    const map = useMap();

    const { data: dataSens } = useQuery(GET_SENS_GEOJSON, {
        fetchPolicy: "network-only",
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

    }, [map])
    
    useEffect(() => {
        if(dataSens) {

            const pub_sens = dataSens.pubSens.nodes.map((sens, i) => {
                var myStyle = {
                    "color": "#0074d9",
                    "weight": 5,
                    "opacity": 0.65
                };
                const layer =  L.geoJSON(sens.geom.geojson, {
                    style: myStyle,
                    pmIgnore: true,
                    onEachFeature: onEachFeature
                });
                layer.bindPopup(`<p>ID ${sens.id}<br />area: ${turf.area(layer.toGeoJSON())}</p>`);
                return layer;
            });

            const sensGroup = L.layerGroup(pub_sens);

            //make the layer active.
            sensGroup.addTo(map);

        }
    }, [dataSens, map])

    return (
        <div>

        </div>
    )
}

export default LayersSmall;