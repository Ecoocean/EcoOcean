import React, {useEffect} from "react";
import Map from './Map'
import "./styles.scss";
import Sidebar from './Sidebar'
import L from 'leaflet';
import ShowReports from "./ShowReports";
import { Helmet } from 'react-helmet';
import 'leaflet-easyprint';
import {useQuery, useReactiveVar} from "@apollo/client";
import {gvulotVar, mainMapVar, sensVar} from "./cache";
import {GET_GVULOTS, GET_SENS} from "./GraphQL/Queries";

export default function Home() {

    const map = useReactiveVar(mainMapVar);
    const { data: dataGvulot } = useQuery(GET_GVULOTS, {
        fetchPolicy: "network-only",
    });
    const { data: dataSens } = useQuery(GET_SENS, {
        fetchPolicy: "network-only",
    });
    useEffect(() => {
        if (dataGvulot) {
            gvulotVar(dataGvulot.gvulots.nodes);
        }
    }, [dataGvulot]);
    useEffect(() => {
        if (dataSens) {
            sensVar(dataSens.pubSens.nodes);
        }
    }, [dataSens]);

    const mapReady = (map) =>{
        mainMapVar(map);
        map.addControl(L.control.zoom({ position: 'bottomright' }));
        L.control.locate({
            position: 'bottomright',
            locateOptions: {
                enableHighAccuracy: true}}).addTo(map);

        L.easyPrint({
            title: 'Print Map',
            position: 'bottomright',
            sizeModes: ['A4Portrait', 'A4Landscape']
        }).addTo(map);
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
