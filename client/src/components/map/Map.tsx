import React, { useState, useRef } from "react";
import GoogleMapReact, { ChangeEventValue } from "google-map-react";
import useSupercluster from "use-supercluster";
import "./Map.css";
import { useQuery } from "@apollo/client";
import { GET_ALL_POLLUTION_REPORTS } from "../../GraphQL/Queries";
import { PollutionReport } from "../../types/PollutionReport";
import {
  allPollutionReportsVar,
  filteredPollutionReportsVar,
} from "../../cache";
const Marker = (props: any) => props.children;

export default function Map() {
  const mapRef = useRef<any>();
  const [bounds, setBounds] = useState<number[]>([]);
  const [zoom, setZoom] = useState(10);

  const onMapChange = (changes: ChangeEventValue) => {
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
    console.log(changes.bounds);
  };

  const { loading, error, data } = useQuery(GET_ALL_POLLUTION_REPORTS);

  const pollutionReports: PollutionReport[] =
    data && !error && !loading ? data.getAllPollutionReports : [];

  const points = pollutionReports.map((report: PollutionReport) => ({
    type: "Feature",
    properties: {
      cluster: false,
      reportId: report.id,
      category: report.type,
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
          let imageUrl = "";
          if (cluster.properties.category === "TRASH") {
            imageUrl = "/images/trash.png";
          } else if (cluster.properties.category === "OIL") {
            imageUrl = "/images/oil.png";
          } else if (cluster.properties.category === "TAR") {
            imageUrl = "/images/tar.png";
          }

          return (
            <Marker
              style={{
                position: "absolute",
                textAlign: "center",
                transform: "translate(-50%, -50%)",
              }}
              key={`report-${cluster.properties.reportId}`}
              text={cluster.id}
              lat={latitude}
              lng={longitude}
            >
              <button className="report-marker">
                <img src={imageUrl} alt="cant load pic" />
              </button>
            </Marker>
          );
        })}
      </GoogleMapReact>
    </div>
  );
}
