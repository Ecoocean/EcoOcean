import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const CenteredBox = ({ children }) => {
  return (
    <Container className="center_block">
      <Row>
        <Col xs={12}>{children}</Col>
      </Row>
    </Container>
  );
};

export default CenteredBox;
