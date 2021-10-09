import React, { useState, useRef } from "react";
import GoogleMapReact from "google-map-react";
import useSupercluster from "use-supercluster";
import "./Map.css";
import { useQuery } from "@apollo/client";
import {GET_ALL_POLLUTION_REPORTS} from '../../GraphQL/Queries'

const Marker = ({ children }) => children;

export default function Map() {
  const mapRef = useRef();
  const [bounds, setBounds] = useState(null);
  const [zoom, setZoom] = useState(10);

  const { loading, error, data} = useQuery(GET_ALL_POLLUTION_REPORTS);

  const pollutionReports = data && !error && !loading ? data.getAllPollutionReports : [];

  const points = (pollutionReports.map(report => ({
    type: "Feature",
    properties: { cluster: false, reportId: report.created_at, category: report.type },
    geometry: {
      type: "Point",
      coordinates: [
        parseFloat(report.location.longitude),
        parseFloat(report.location.latitude)
      ]
    }
  })))

  const {clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: 75, maxZoom: 20 }
  });



  return (
    
    <div style={{ height: "100vh", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_KEY }}
        defaultCenter={{ lat: 31.4117257, lng: 35.0818155 }}
        
        options = {{
          minZoom: 8,
          gestureHandling:'greedy'
        }}
        defaultZoom={8}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map }) => {
          mapRef.current = map;
        }}
        onChange={({ zoom, bounds }) => {
          setZoom(zoom);
          setBounds([
            bounds.nw.lng,
            bounds.se.lat,
            bounds.se.lng,
            bounds.nw.lat
          ]);
        }}
      >
        {clusters.map(cluster => {
          const [longitude, latitude] = cluster.geometry.coordinates;
          const {
            cluster: isCluster,
            point_count: pointCount
          } = cluster.properties;

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
                    height: `${10 + (pointCount / points.length) * 30}px`
                  }}
                  onClick={() => {
                    const expansionZoom = Math.min(
                      supercluster.getClusterExpansionZoom(cluster.id),
                      20
                    );
                    mapRef.current.setZoom(expansionZoom);
                    mapRef.current.panTo({ lat: latitude, lng: longitude });
                  }}
                >
                  {pointCount}
                </div>
              </Marker>
            );
          }
          let imageUrl = ''
          if(cluster.properties.category ==='TRASH') {
            imageUrl = "/images/trash.png";
          }
          else if (cluster.properties.category === 'OIL'){
            imageUrl = "/images/oil.png"
          }
          else if (cluster.properties.category === 'TAR'){
            imageUrl = "/images/tar.png"
          }

          return (
            <Marker
              style={{position: 'absolute', textAlign: 'center', transform: 'translate(-50%, -50%)'}}
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