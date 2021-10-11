import React from "react";
import { Card, Spinner, Row, Col } from "react-bootstrap";
const SpinnerCard = () => {
  return (
    <Card id="spinner_card">
      <Row>
        <Col xs={12}>
          <Spinner className="" animation="border" />
          <Card.Body>
            <Card.Text>התיק שלך בדרך...</Card.Text>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
};

export default SpinnerCard;
