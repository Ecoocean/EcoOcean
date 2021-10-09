import React from "react";
import { Container, Col, Row } from "react-bootstrap";
import MapLeftPanel from './MapLeftPanel';
import Map from "./Map";

class MapContainer extends React.Component {

render() {
  return (
    <Container fluid>
      <Row>
        <Col sm={4} id="map-left-panel" >
          <MapLeftPanel />
        </Col>
        <Col sm={8} id="map">
          <Map/>
        </Col>
      </Row>
    </Container>
  );
 }
}

export default MapContainer;