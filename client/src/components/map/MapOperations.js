import React, {useState} from "react";
import { Button } from "react-bootstrap";
import MarkerForm from "../modals/forms/MarkerForm";

const MapOperations = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>
      <Button variant="outline-primary" onClick={handleShow} >Add Marker</Button>{' '}
      <Button variant="outline-secondary">Secondary</Button>{' '}
      <Button variant="outline-success">Success</Button>{' '}
      <Button variant="outline-warning">Warning</Button>{' '}
      <Button variant="outline-danger">Danger</Button>{' '}
      <MarkerForm show={show} handleClose={handleClose}/>
    </>
  );
};

export default MapOperations;
