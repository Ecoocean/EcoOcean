import React from "react";
import { Row, Col, Container } from "react-bootstrap";
import MapOperations from "./MapOperations";
import MapElementList from './MapElementList'

const MapLeftPanel = () => {
  return (
    <Container fluid="md">
      <Row>
        <Col id="map-operations">
          <MapOperations />
        </Col>
      </Row>
      <Row>
        <Col id="map-element-list">
          <MapElementList />
        </Col>
      </Row>
    </Container>
  );
};

export default MapLeftPanel;
