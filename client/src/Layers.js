import React from 'react'
import {useQuery} from "@apollo/client";
import {GET_GVULOTS_GEOJSON} from "./GraphQL/Queries";
import {useEffect} from "react";
import L from "leaflet";
import {useMap} from "react-leaflet";


const Layers = () => {

    const map = useMap();
    const { data } = useQuery(GET_GVULOTS_GEOJSON, {
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
        if(data) {             
            const gvulots = data.gvulots.nodes.map((gvul, i) => {
                var myStyle = {
                    "color": i % 3 === 0 ? "#EE4B2B" : i % 3 === 1 ? "#ff8c00" : "#0BDA51",
                    "weight": 5,
                    "opacity": 0.65
                };
                return L.geoJSON(gvul.geom.geojson, {
                    style: myStyle,
                    onEachFeature: onEachFeature
                });
            })
            
            const gvulGroup = L.layerGroup(gvulots)
            const  overlayMaps = {
                "Municipal": gvulGroup
            };
            L.control.layers(null, overlayMaps, {position: 'bottomright'}).addTo(map);
            //make the layer active. 
            gvulGroup.addTo(map);
           
        }
    }, [data, map])

    return (
        <div>

        </div>
    )
}

export default Layers;