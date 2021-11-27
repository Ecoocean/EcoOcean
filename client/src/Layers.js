import React from 'react'
import {useQuery} from "@apollo/client";
import {GET_BEACHES_GEOJSON} from "./GraphQL/Queries";
import {useEffect} from "react";
import L from "leaflet";
import {useMap} from "react-leaflet";


const Layers = () => {

    const map = useMap();
    const { data } = useQuery(GET_BEACHES_GEOJSON, {
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
            const beaches = data.beaches.nodes.map((beach) => {
                return L.geoJSON(beach.geom.geojson, {
                    onEachFeature: onEachFeature
                })
            });
            const beachGroup = L.layerGroup(beaches);
            const  overlayMaps = {
                "Beaches": beachGroup
            };
            L.control.layers(null, overlayMaps).addTo(map);
            // .addTo(map);
            // })
        }
    }, [data, map])

    return (
        <div>

        </div>
    )
}

export default Layers;