import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import {
  showSnackBarVar,
  severitySnackBarVar,
  msgSnackBarVar,
} from "./cache";
import { useReactiveVar } from "@apollo/client";

const Alert = React.forwardRef(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CustomizedSnackbar = () => {
  const open = useReactiveVar(showSnackBarVar);
  const severity = useReactiveVar(severitySnackBarVar);
  const msg = useReactiveVar(msgSnackBarVar);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    showSnackBarVar(false);
  };

  if(severity === 'error') {
    return (
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          sx={{ width: "100%" }}
        >
          {msg}
        </Alert>
      </Snackbar>
    ); 
  }

  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        sx={{ width: "100%" }}
      >
        {msg}
      </Alert>
    </Snackbar>
  );
};

export default CustomizedSnackbar;
