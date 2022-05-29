import React, {useEffect} from "react";
import Map from './Map'
import "./styles.scss";
import Sidebar from './Sidebar'
import L from 'leaflet';
import ShowReports from "./ShowReports";
import { Helmet } from 'react-helmet';
import 'leaflet-easyprint';
import {useQuery, useReactiveVar} from "@apollo/client";
import {
    dateEndFilterVar,
    dateStartFilterVar,
    gvulotVar,
    loadingVar,
    mainMapVar,
    sensVar
} from "./cache";
import {GET_GVULOTS} from "./GraphQL/Queries";
import {Backdrop, CircularProgress, Grid} from "@mui/material";


export default function Home() {
    const loadingApplication = useReactiveVar(loadingVar);
    const map = useReactiveVar(mainMapVar);
    const { data: dataGvulot } = useQuery(GET_GVULOTS, {
        fetchPolicy: "network-only",
        variables: {
            filterReports: {
                and: [
                    {createdAt: {greaterThan: dateStartFilterVar().toISOString().split('T')[0]}},
                    {createdAt: {lessThan: dateEndFilterVar().toISOString().split('T')[0]}},
                    {isRelevant: {equalTo: 'true'}}
                ]
            }
        }

    });

    useEffect(() => {
        if (dataGvulot) {
            gvulotVar(dataGvulot.getMunicipalsWithScore);
            const sens = dataGvulot.getMunicipalsWithScore.reduce((accu, curr) => {
                const sensMapped = curr.gvulSensIntersectsByGvulId.map(({sens}) => sens);
                return [...accu, ...sensMapped]
            }, []);

            sensVar(sens);
        }
    }, [dataGvulot]);


    const mapReady = (map) =>{
        loadingVar(false);
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
            <Backdrop
                sx={{
                    position: "absolute",
                    color: "#fff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={loadingApplication}
            >
                <Grid
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Grid item>
                        <CircularProgress color="inherit" />
                    </Grid>
                    <Grid item>Loading please wait ...</Grid>
                </Grid>
            </Backdrop>
            {map && <Sidebar map={map} />}
            <Map setMap={mapReady} >
                <ShowReports />
            </Map>
        </div>
    );

}
