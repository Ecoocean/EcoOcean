import React, {  useState, Fragment, useEffect } from 'react'
import L from 'leaflet';
import { Marker } from 'react-leaflet'
import {  Tooltip, useMapEvents, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import {GET_GVULOTS, GET_LOCATION_REPORTS} from "./GraphQL/Queries";
import Typography from "@mui/material/Typography";
import { PollutionReportModal } from "./modals/PollutionReportModal";
import {  useLazyQuery, useReactiveVar, useSubscription } from "@apollo/client";
import {
    REPORT_ADDED_SUBSCRIPTION, REPORT_IRRELEVANT_SUBSCRIPTION
} from "./GraphQL/Subscriptions";
import yellowFilledMarker from './icons/marker-yellow-optimized.svg';
import greenFilledMarker from './icons/marker-green-optimized.svg';
import redFilledMarker from './icons/marker-red-optimized.svg';
import {
    filteredPollutionReportsVar,
    loadingPollutionReportsVar,
    selectedReportVar,
    selectedMapReportVar,
    sideBarCollapsedVar, dateStartFilterVar, dateEndFilterVar, gvulotVar, sensVar
} from "./cache";
import generateLayers from "./Layers";


// Create marker icon according to the official leaflet documentation
const yellowMarker = L.icon({
    iconUrl: yellowFilledMarker,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
});

const greenMarker = L.icon({
    iconUrl: greenFilledMarker,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
});

const redMarker = L.icon({
    iconUrl: redFilledMarker,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
});

function ShowReports() {
    const map = useMap();
    const [bounds, setBounds] = useState(map.getBounds());
    const [openInfoWindow, setOpenInfoWindow] = useState(false);
    const selectedReport = useReactiveVar(selectedReportVar);
    const selectedMapReport = useReactiveVar(selectedMapReportVar);
    const filteredPollutionReports = useReactiveVar(filteredPollutionReportsVar);
    const [getLocationReports, { data: dataLocal }] = useLazyQuery(GET_LOCATION_REPORTS, {
        fetchPolicy: "network-only",
    });
    const [getGvulot, { data: dataGvulot }] = useLazyQuery(GET_GVULOTS, {
        fetchPolicy: "network-only",
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


    useEffect( () => {
        if(selectedMapReport){
            sideBarCollapsedVar(false);
            map.setView({lat: selectedMapReport.geom.y,
                lng:selectedMapReport.geom.x},18);
            filteredPollutionReportsVar([selectedMapReport]);
        }

    }, [selectedMapReport, map])

    useEffect(() => {
        if(dataLocal) {
            filteredPollutionReportsVar(dataLocal.getLocationPollutionReports?.nodes);
        }
    }, [dataLocal])



    useEffect(() => {

        const variables = {
            xmin: bounds.getSouthEast().lng,
            ymin: bounds.getSouthEast().lat,
            xmax: bounds.getSouthWest().lng,
            ymax: bounds.getNorthEast().lat,
            filter: {
                and: [
                    {createdAt: {greaterThan: dateStartFilterVar().toISOString().split('T')[0]}},
                    {createdAt: {lessThan: dateEndFilterVar().toISOString().split('T')[0]}},
                    {isRelevant: {equalTo: true}}
                ]
            }
        };
        getLocationReports({variables: variables});

    }, [])


    const IncomingReport = async ({ subscriptionData: { data } }) => {
        await getGvulot({
            variables: {
                filterReports: {
                    and: [
                        {createdAt: {greaterThan: dateStartFilterVar().toISOString().split('T')[0]}},
                        {createdAt: {lessThan: dateEndFilterVar().toISOString().split('T')[0]}},
                        {isRelevant: {equalTo: true}}
                    ]
                }
            }
        });
        generateLayers();
        if (
            data.listen.relatedNode.geom.y > bounds.getSouthEast().lat &&
            data.listen.relatedNode.geom.y < bounds.getNorthWest().lat &&
            data.listen.relatedNode.geom.x >bounds.getNorthWest().lng &&
            data.listen.relatedNode.geom.x < bounds.getSouthEast().lng &&
            dateStartFilterVar() < Date.now() &&
            dateEndFilterVar() > Date.now()
        ) {
            const minTimeForLoadingSimulation = 700; // in miliseconds
            const currentFilteredReports = filteredPollutionReportsVar();
            filteredPollutionReportsVar(
                [data.listen.relatedNode].concat(currentFilteredReports)
            );
            await new Promise((resolve) => setTimeout(resolve, minTimeForLoadingSimulation));
        }
    };

    const IrrelevantReport = async({ subscriptionData: { data } }) => {
        await getGvulot({
            variables: {
                filterReports: {
                    and: [
                        {createdAt: {greaterThan: dateStartFilterVar().toISOString().split('T')[0]}},
                        {createdAt: {lessThan: dateEndFilterVar().toISOString().split('T')[0]}},
                        {isRelevant: {equalTo: true}}
                    ]
                }
            }
        });
        generateLayers();
        if (
            data.listen.relatedNode.geom.y > bounds.getSouthEast().lat &&
            data.listen.relatedNode.geom.y  < bounds.getNorthWest().lat &&
            data.listen.relatedNode.geom.x  > bounds.getNorthWest().lng &&
            data.listen.relatedNode.geom.x  < bounds.getSouthEast().lng
        ) {
            const minTimeForLoadingSimulation = 700; // in miliseconds
            const currentFilteredReports =
                filteredPollutionReportsVar();
            filteredPollutionReportsVar(
                currentFilteredReports.filter(
                    (report) => report.id !== data.listen.relatedNode.id
                )
            );
            await new Promise((resolve) => setTimeout(resolve, minTimeForLoadingSimulation));
        }
    };

    useSubscription(REPORT_ADDED_SUBSCRIPTION, {
        onSubscriptionData: IncomingReport,
    });

    useSubscription(REPORT_IRRELEVANT_SUBSCRIPTION, {
        onSubscriptionData: IrrelevantReport,
    });

    const onMapChange = async () => {
        selectedMapReportVar(null); // release selected Map Report
        const minTimeForLoadingSimulation = 700; // in miliseconds
        loadingPollutionReportsVar(true);
        const startTime = performance.now();
        const bounds = map.getBounds();
        setBounds(bounds);
        getLocationReports({variables: {
                xmin: bounds.getSouthEast().lng,
                ymin: bounds.getSouthEast().lat,
                xmax: bounds.getSouthWest().lng,
                ymax: bounds.getNorthEast().lat,
                filter: {
                    and: [
                        {createdAt: {greaterThan: dateStartFilterVar().toISOString().split('T')[0]}},
                        {createdAt: {lessThan: dateEndFilterVar().toISOString().split('T')[0]}}
                    ]
                }
            }})
        const endTime = performance.now();
        const TotalTime = endTime - startTime; // in miliseconds

        const timeToWait = minTimeForLoadingSimulation - TotalTime;
        if (timeToWait > 0) {
            // if operation was too fast and took less than a second (1000)
            // we will wait the diff time
            await new Promise((resolve) => setTimeout(resolve, timeToWait));
        }
        loadingPollutionReportsVar(false);
    };


    const handleClose = () => {
        setOpenInfoWindow(false);
    };
    let timer = null;
    useMapEvents({

        zoomanim: () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                onMapChange()
            }, 1250)
        },
        dragend: () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                onMapChange()
            }, 1250)
        }
    });


    return (
        <div>
            <MarkerClusterGroup>
                {filteredPollutionReports && filteredPollutionReports.map((report) => {

                    return <Marker
                        key={report.id}
                        position={[report.geom.y, report.geom.x]}
                        icon={redMarker}
                        eventHandlers={{
                            click: (e) => {
                                selectedReportVar(report);
                                setOpenInfoWindow(true);
                            },
                        }}
                    >
                        <Tooltip>
                            <div>
                                <Fragment>
                                    <Typography color="inherit">Report ID: </Typography>
                                    <u>
                                        <b>{"Report ID:"}</b>
                                    </u>{" "}
                                    {report.id}
                                    <br />
                                    <u>
                                        <b>{"Reporter:"}</b>
                                    </u>{" "}
                                    {report.reporter}
                                    <br />
                                    <u>
                                        <b>{"Date:"}</b>
                                    </u>{" "}
                                    {`${new Date(report.createdAt)?.toString()}`}
                                    <br />
                                    <b>for more inforamtion click on the marker</b>
                                </Fragment>
                            </div>
                        </Tooltip>
                    </Marker>
                })}
            </MarkerClusterGroup>
            <PollutionReportModal
                report={selectedReport}
                show={openInfoWindow}
                handleClose={handleClose}
            />
        </div>
    )
}

export default ShowReports;