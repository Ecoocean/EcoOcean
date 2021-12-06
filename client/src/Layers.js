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
    function polystyle(feature) {
        return {
            fillColor: 'blue',
            weight: 2,
            opacity: 1,
            color: 'white',  //Outline color
            fillOpacity: 0.7
        };
    }

    useEffect(() => {
        if(data) {    
            var myStyle = {
                "color": "#0096FF",
                "weight": 5,
                "opacity": 0.65
            };
                 
            const gvulots = data.gvulots.nodes.map((gvul) => {
                return L.geoJSON(gvul.geom.geojson, {
                    style: myStyle,
                    onEachFeature: onEachFeature
                });
            })
            
            const gvulGroup = L.layerGroup(gvulots)
            const  overlayMaps = {
                "Municipal": gvulGroup
            };
            console.log(overlayMaps);
            L.control.layers(null, overlayMaps).addTo(map);
           
        }
    }, [data, map])

    return (
        <div>

        </div>
    )
}

export default Layers;