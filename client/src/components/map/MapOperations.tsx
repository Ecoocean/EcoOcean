import React, { useState } from "react";
import { Button } from "react-bootstrap";
import PollutionForm from "../modals/forms/PollutionForm";

const MapOperations = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
  };

  const handleShow = () => setShow(true);
  return (
    <>
      <Button variant="outline-primary" onClick={handleShow}>
        Add Pollutin Report
      </Button>{" "}
      <PollutionForm show={show} handleClose={handleClose} />
    </>
  );
};

export default MapOperations;
