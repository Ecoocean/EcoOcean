import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import Copyrights from "./reusables/Copyrights";

const Footer = () => {
  return (
    <footer className="navbar bg-light fixed-bottom">
      <Container className="justify-content-end">
        <Row>
          <Col xs={12}>
            <Copyrights />
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
