import React, {useState, Fragment, use, useEffect} from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Tooltip, useMapEvents, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { GET_ALL_POLLUTION_REPORTS_LOCAL, GET_LOCATION_REPORTS } from "../../GraphQL/Queries";
import Typography from "@mui/material/Typography";
import { PollutionReportModal } from "../modals/PollutionReportModal";
import { useQuery, useLazyQuery, useReactiveVar, useSubscription } from "@apollo/client";
import {
  REPORT_ADDED_SUBSCRIPTION,
  REPORT_UNRELEVANT_SUBSCRIPTION,
} from "../../GraphQL/Subscriptions";
import yellowFilledMarker from './icons/marker-yellow-optimized.svg';
import greenFilledMarker from './icons/marker-green-optimized.svg';
import redFilledMarker from './icons/marker-red-optimized.svg';
import {
    filteredPollutionReportsVar,
    loadingPollutionReportsVar,
    selectedReportVar,
    selectedMapReportVar,
  } from "../../cache";



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
    const [getLocationReports, { loading, error, data }] = useLazyQuery(GET_LOCATION_REPORTS);

    useEffect(() => {
      if(selectedMapReport){
        map.flyTo({lat: selectedMapReport.location.latitude,
          lng:selectedMapReport.location.longitude},18);
      }

    }, [selectedMapReport])

    useEffect(() => {
      if(data) {
        filteredPollutionReportsVar(data.getLocationPollutionReports);
      }
  }, [data])

    useEffect(() => {
        const center = map.getCenter();
        const mapBoundNorthEast = bounds.getNorthEast();
        const mapDistance = mapBoundNorthEast.distanceTo(center);
        getLocationReports({variables: {
          latitude: center.lat,
          longitude: center.lng,
          radiusInM: mapDistance, 
        }})

    }, [])


    const IncomingReport = async ({ subscriptionData: { data } }) => {
        if (
          data.reportAdded.location.latitude > bounds.getSouthEast().lat &&
          data.reportAdded.location.latitude < bounds.getNorthWest().lat &&
          data.reportAdded.location.longitude >bounds.getNorthWest().lng &&
          data.reportAdded.location.longitude < bounds.getSouthEast().lng
        ) {
          const minTimeForLoadingSimulation = 700; // in miliseconds
          const currentFilteredReports = filteredPollutionReportsVar();
          filteredPollutionReportsVar(
            [data.reportAdded].concat(currentFilteredReports)
          );
          await new Promise((resolve) => setTimeout(resolve, minTimeForLoadingSimulation));
        }
      };
    
      const UnrelevantReport = async({ subscriptionData: { data } }) => {
        
        if (
          data.reportUnrelevant.location.latitude > bounds.getSouthEast().lat &&
          data.reportUnrelevant.location.latitude < bounds.getNorthWest().lat &&
          data.reportUnrelevant.location.longitude > bounds.getNorthWest().lng &&
          data.reportUnrelevant.location.longitude < bounds.getSouthEast().lng
        ) {
          const minTimeForLoadingSimulation = 700; // in miliseconds
          const currentFilteredReports =
            filteredPollutionReportsVar();
          filteredPollutionReportsVar(
            currentFilteredReports.filter(
              (report) => report.id !== data.reportUnrelevant.id
            )
          );
          await new Promise((resolve) => setTimeout(resolve, minTimeForLoadingSimulation));
        }
      };
    
      useSubscription(REPORT_ADDED_SUBSCRIPTION, {
        onSubscriptionData: IncomingReport,
      });
    
      useSubscription(REPORT_UNRELEVANT_SUBSCRIPTION, {
        onSubscriptionData: UnrelevantReport,
      });

    const onMapChange = async () => {
        selectedMapReportVar(null); // release selected Map Report
        const minTimeForLoadingSimulation = 700; // in miliseconds
        loadingPollutionReportsVar(true);
        const startTime = performance.now();
        const center = map.getCenter();
        const bounds = map.getBounds();
        setBounds(bounds);
        const mapBoundNorthEast = bounds.getNorthEast();
        const mapDistance = mapBoundNorthEast.distanceTo(center);
        getLocationReports({variables: {
          latitude: center.lat,
          longitude: center.lng,
          radiusInM: mapDistance, 
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
    
    useMapEvents({
      zoomanim: () => {
          new Promise(() => {
            onMapChange()
          })
          console.log("check");
        },
        dragend: () => {
            onMapChange();
        }
    });


    return (
        <div>
        <MarkerClusterGroup>
        {filteredPollutionReports.map((report) => {
            let markerColor = null;
            const reportType = report.type;
            if (reportType === "TRASH") {
                markerColor = greenMarker;
            } else if (reportType === "OIL") {
                markerColor = yellowMarker;
            } else if (reportType === "TAR") {
                markerColor = redMarker;
            }
            return <Marker
                    key={report.id}
                    position={[report.location.latitude, report.location.longitude]}
                    icon={markerColor}
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
                                    <b>{"Report Type:"}</b>
                                    </u>{" "}
                                    {report.type}
                                    <br />
                                    <u>
                                    <b>{"Date:"}</b>
                                    </u>{" "}
                                    {`${new Date(report.created_at._seconds * 1000).toString()}`}
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

export default function Map() {
    
    return (
    <MapContainer
        style={{ height: '125vh', width: '100wh' }}
        className="markercluster-map"
        center={[31.4117257, 35.0818155]}
        zoom={8}
        maxZoom={18}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <ShowReports />
      
    </MapContainer>
    )
}
