import React, { useEffect } from "react";
import { Container, Col, Row } from "react-bootstrap";
import MapLeftPanel from "./MapLeftPanel";
import Map from "./Map.js";
import { useLazyQuery } from "@apollo/client";
import { GET_ALL_POLLUTION_REPORTS } from "../../GraphQL/Queries";
import {
  allPollutionReportsVar,
  filteredPollutionReportsVar,
} from "../../cache";

function MapContainer() {
  const FetchingAllReports = async (data: any) => {
    allPollutionReportsVar(data.getAllPollutionReports);
    filteredPollutionReportsVar(data.getAllPollutionReports);
  };

  const [fetachReports, {}] = useLazyQuery(GET_ALL_POLLUTION_REPORTS, {
    onCompleted: FetchingAllReports,
  });

  useEffect(() => {
    fetachReports();
  }, [fetachReports]);

  return (
    <Container fluid>
      <Row>
        <Col sm={4} id="map-left-panel">
          <MapLeftPanel />
        </Col>
        <Col sm={8} id="map">
          <Map />
        </Col>
      </Row>
    </Container>
  );
}

export default MapContainer;
