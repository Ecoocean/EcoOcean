import React from "react";
import { Spinner } from "react-bootstrap";
import CenteredBox from "./CenteredBox";
const Loader = () => {
  return (
    <CenteredBox>
      {
        <Spinner
          role="status"
          style={{ height: "100px", width: "100px" }}
          animation="border"
        >
          <span className="sr-only">Loading...</span>
        </Spinner>
      }
    </CenteredBox>
  );
};

export default Loader;
