import React, { useState, useRef } from "react";
import GoogleMapReact, { ChangeEventValue } from "google-map-react";
import useSupercluster from "use-supercluster";
import "./Map.css";
import { useQuery, useSubscription } from "@apollo/client";
import { PollutionReport } from "../../types/PollutionReport";
import { REPORTS_SUBSCRIPTION } from "../../GraphQL/Subscriptions";
import {
  allPollutionReportsVar,
  filteredPollutionReportsVar,
  loadingPollutionReportsVar,
} from "../../cache";
import { GET_ALL_POLLUTION_REPORTS_LOCAL } from "../../GraphQL/Queries";
import { PollutionReportModal } from "../modals/PollutionReportModal";
import PollutionReportToolTip from "../PollutionReportToolTip";
import { IconButton } from "@mui/material";
import RoomSharpIcon from "@mui/icons-material/RoomSharp";

const Marker = (props: any) => props.children;

export default function Map() {
  const mapRef = useRef<any>();
  const [bounds, setBounds] = useState<number[]>([]);
  const [zoom, setZoom] = useState(10);
  const [openInfoWindow, setOpenInfoWindow] = useState(false);
  const [selectedReport, setSelectedReport] = useState(false);

  const handleClose = () => {
    setOpenInfoWindow(false);
  };

  const IncomingReport = ({ subscriptionData: { data } }: any) => {
    const allReports = allPollutionReportsVar();
    allPollutionReportsVar([data.reportAdded].concat(allReports));

    if (
      data.reportAdded.location.latitude > bounds[1] &&
      data.reportAdded.location.latitude < bounds[3] &&
      data.reportAdded.location.longitude > bounds[0] &&
      data.reportAdded.location.longitude < bounds[2]
    ) {
      const currentFilteredReports: PollutionReport[] =
        filteredPollutionReportsVar();
      filteredPollutionReportsVar(
        [data.reportAdded].concat(currentFilteredReports)
      );
    }
  };

  useSubscription(REPORTS_SUBSCRIPTION, { onSubscriptionData: IncomingReport });

  const onMapChange = async (changes: ChangeEventValue) => {
    const minTimeForLoadingSimulation = 700; // in miliseconds
    loadingPollutionReportsVar(true);
    const startTime = performance.now();
    setZoom(changes.zoom);
    const newBounds: number[] = [
      changes.bounds.nw.lng,
      changes.bounds.se.lat,
      changes.bounds.se.lng,
      changes.bounds.nw.lat,
    ];
    setBounds(newBounds);
    const BBoxPollutionReports = allPollutionReportsVar().filter(
      (report: PollutionReport) => {
        return (
          report.location.latitude > changes.bounds.se.lat &&
          report.location.latitude < changes.bounds.nw.lat &&
          report.location.longitude > changes.bounds.nw.lng &&
          report.location.longitude < changes.bounds.se.lng
        );
      }
    );
    filteredPollutionReportsVar(BBoxPollutionReports);
    const endTime = performance.now();
    const TotalTime = endTime - startTime; // in miliseconds

    const timeToWait = minTimeForLoadingSimulation - TotalTime;
    if (timeToWait > 0) {
      console.log(timeToWait);
      // if operation was too fast and took less than a second (1000)
      // we will wait the diff time
      await new Promise((resolve) => setTimeout(resolve, timeToWait));
    }
    loadingPollutionReportsVar(false);
  };

  const { loading, error, data } = useQuery(GET_ALL_POLLUTION_REPORTS_LOCAL);

  const pollutionReports: PollutionReport[] =
    data && !error && !loading ? data.allPollutionReports : [];

  const points = pollutionReports.map((report: PollutionReport) => ({
    type: "Feature",
    properties: {
      cluster: false,
      report: report,
      openWindow: false,
    },
    geometry: {
      type: "Point",
      coordinates: [report.location.longitude, report.location.latitude],
    },
  }));

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: 75, maxZoom: 20 },
  });
  const googleKey: GoogleMapReact.BootstrapURLKeys = {
    key: process.env.REACT_APP_GOOGLE_TOKEN!,
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <GoogleMapReact
        onChange={onMapChange}
        bootstrapURLKeys={googleKey}
        defaultCenter={{ lat: 31.4117257, lng: 35.0818155 }}
        options={{
          minZoom: 8,
          gestureHandling: "greedy",
        }}
        defaultZoom={8}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map }) => {
          mapRef.current = map;
        }}
      >
        {clusters.map((cluster) => {
          const [longitude, latitude] = cluster.geometry.coordinates;
          const { cluster: isCluster, point_count: pointCount } =
            cluster.properties;

          if (isCluster) {
            return (
              <Marker
                key={`cluster-${cluster.id}`}
                lat={latitude}
                lng={longitude}
              >
                <div
                  className="cluster-marker"
                  style={{
                    width: `${10 + (pointCount / points.length) * 30}px`,
                    height: `${10 + (pointCount / points.length) * 30}px`,
                  }}
                  onClick={() => {
                    const expansionZoom = Math.min(
                      supercluster.getClusterExpansionZoom(cluster.id),
                      20
                    );
                    if (mapRef.current) {
                      mapRef.current.setZoom(expansionZoom);
                      mapRef.current.panTo({ lat: latitude, lng: longitude });
                    }
                  }}
                >
                  {pointCount}
                </div>
              </Marker>
            );
          }
          let labelColor = "";
          const reportType = cluster.properties.report.type;
          if (reportType === "TRASH") {
            labelColor = "green";
          } else if (reportType === "OIL") {
            labelColor = "brown";
          } else if (reportType === "TAR") {
            labelColor = "black";
          }

          return (
            <Marker
              style={{
                position: "absolute",
                textAlign: "center",
                transform: "translate(-50%, -50%)",
              }}
              key={`report-${cluster.properties.report.id}`}
              text={cluster.id}
              lat={latitude}
              lng={longitude}
            >
              <PollutionReportToolTip report={cluster.properties.report}>
                <IconButton
                  size="large"
                  style={{ color: labelColor }}
                  className="report-marker"
                  onClick={() => {
                    setSelectedReport(cluster.properties.report);
                    setOpenInfoWindow(true);
                  }}
                >
                  <RoomSharpIcon />
                </IconButton>
              </PollutionReportToolTip>
            </Marker>
          );
        })}
        <PollutionReportModal
          report={selectedReport}
          show={openInfoWindow}
          handleClose={handleClose}
        />
      </GoogleMapReact>
    </div>
  );
}
