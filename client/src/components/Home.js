import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Logo from "./reusables/Logo";
import { useNavigate } from "react-router-dom";
import LatestResults from "./reusables/LatestResults";
import Map from "./reusables/Map";

const Home = () => {
  return (
    <Container fluid>
      <div>Statistics</div>
      <Row>
        <Col sm={12} id="disclaimer" className="rtl text-right" p={4}>
          <Map/>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
