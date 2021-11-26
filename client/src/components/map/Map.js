import React, {useState, Fragment, useEffect} from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Tooltip, useMapEvents, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { GET_BEACHES_GEOJSON, GET_LOCATION_REPORTS } from "../../GraphQL/Queries";
import Typography from "@mui/material/Typography";
import { PollutionReportModal } from "../modals/PollutionReportModal";
import { useQuery, useLazyQuery, useReactiveVar, useSubscription } from "@apollo/client";
import {
    REPORT_ADDED_SUBSCRIPTION, REPORT_IRRELEVANT_SUBSCRIPTION
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
    const [getLocationReports, { data: dataLocal }] = useLazyQuery(GET_LOCATION_REPORTS, {
      fetchPolicy: "network-only",
    });

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
    

    

    useEffect( () => {
      if(selectedMapReport){
        map.flyTo({lat: selectedMapReport.geom.y,
          lng:selectedMapReport.geom.x},18);
        filteredPollutionReportsVar([selectedMapReport]);
      }

    }, [selectedMapReport])

    useEffect(() => {
      if(dataLocal) {
        filteredPollutionReportsVar(dataLocal.getLocationPollutionReports.nodes);
        // const markers = dataLocal.getLocationPollutionReports.nodes.map((report) =>{
        //     return L.marker([report.geom.y, report.geom.x])
        // })
        // const reports = L.layerGroup(markers);
        //   const  overlayMaps = {
        //       "Reports": reports
        //   };
        //   L.control.layers(overlayMaps).addTo(map);
      }
    }, [dataLocal])

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
    }, [data])

    useEffect(() => {
        const center = map.getCenter();
        const mapBoundNorthEast = bounds.getNorthEast();
        const mapDistance = mapBoundNorthEast.distanceTo(center);
        const variables = {
          xmin: bounds.getSouthEast().lng,
          ymin: bounds.getSouthEast().lat,
          xmax: bounds.getSouthWest().lng,
          ymax: bounds.getNorthEast().lat
        };
        getLocationReports({variables: variables});

    }, [])


    const IncomingReport = async ({ subscriptionData: { data } }) => {
        if (
          data.listen.relatedNode.geom.y > bounds.getSouthEast().lat &&
            data.listen.relatedNode.geom.y < bounds.getNorthWest().lat &&
            data.listen.relatedNode.geom.x >bounds.getNorthWest().lng &&
            data.listen.relatedNode.geom.x < bounds.getSouthEast().lng
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
          ymax: bounds.getNorthEast().lat
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
        },
        dragend: () => {
          new Promise(() => {
            onMapChange();
          })
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
                    position={[report.geom.y, report.geom.x]}
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
                                    {`${new Date(report.created_at?._seconds * 1000).toString()}`}
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
