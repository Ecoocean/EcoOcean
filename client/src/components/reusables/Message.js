import React from "react";
import { Alert } from "react-bootstrap";
import CenteredBox from "./CenteredBox";

const Message = ({ text, variant }) => {
  return (
    <Alert className="alert_box" variant={variant}>
      {/* <Alert.Heading>הוד</Alert.Heading> */}
      <span data-variant={variant}>{text}</span>
    </Alert>
  );
};

export default Message;
