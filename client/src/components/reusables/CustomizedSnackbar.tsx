import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertColor, AlertProps } from "@mui/material/Alert";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
interface CustomizedSnackbarProps {
  open: boolean;
  severity: string;
  msg: string;
  setShowSnackBar: any;
}

interface CustomizedSnackbarState {
  open: boolean;
  severity: string;
  msg: string;
}
class CustomizedSnackbar extends React.Component<
  CustomizedSnackbarProps,
  CustomizedSnackbarState
> {
  state = { open: false, msg: "", severity: "info" };
  handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ open: false });
    this.props.setShowSnackBar(false);
  };
  componentWillReceiveProps(nextProps: { open: boolean; severity: string }) {
    // Any time props.open changes, update state.
    if (nextProps.open !== this.props.open) {
      this.setState({
        open: nextProps.open,
      });
    }
    if (nextProps.severity !== this.props.severity) {
      this.setState({
        severity: nextProps.severity,
      });
    }
  }
  render() {
    return (
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={this.state.open}
        autoHideDuration={6000}
        onClose={this.handleClose}
      >
        <Alert
          onClose={this.handleClose}
          severity={this.state.severity as AlertColor}
          sx={{ width: "100%" }}
        >
          {this.props.msg}
        </Alert>
      </Snackbar>
    );
  }
}

export default CustomizedSnackbar;
