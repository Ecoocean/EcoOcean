import React, { useState } from "react";
import Map from './Map'
import "./styles.scss";
import Sidebar from './Sidebar'
import L from 'leaflet';
import ShowReports from "./ShowReports";
import { Helmet } from 'react-helmet';

export default function Home() {

    const [map, setMap] = useState(null);

    const mapReady = (map) =>{
        setMap(map)
        map.addControl(L.control.zoom({ position: 'bottomright' }));
    }

    return (
        <div className="App">
            <Helmet>
                <title>EcoOcean</title>
            </Helmet>
            {map && <Sidebar map={map} />}
            <Map setMap={mapReady} >
                <ShowReports />
            </Map>
        </div>
    );

}
