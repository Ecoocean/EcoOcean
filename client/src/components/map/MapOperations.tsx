import React, { useState } from "react";
import { Button } from "react-bootstrap";
import PollutionForm from "../modals/forms/PollutionForm";
import CustomizedSnackbar from "../reusables/CustomizedSnackbar";

const MapOperations = () => {
  const [show, setShow] = useState(false);
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [msgSnackBar, setMsgSnackBar] = useState("");
  const [severitySnackBar, setSeveritySnackBar] = useState("");

  const handleClose = (msg: string, severity: string) => {
    if (msg) {
      // if recived any message
      setMsgSnackBar(msg);
      setShowSnackBar(true);
      setSeveritySnackBar(severity);
    }
    setShow(false);
  };

  const handleShow = () => setShow(true);
  return (
    <>
      <Button variant="outline-primary" onClick={handleShow}>
        Add Pollutin Report
      </Button>{" "}
      <PollutionForm show={show} handleClose={handleClose} />
      <CustomizedSnackbar
        severity={severitySnackBar}
        msg={msgSnackBar}
        open={showSnackBar}
        setShowSnackBar={setShowSnackBar}
      />
    </>
  );
};

export default MapOperations;
