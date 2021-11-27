import { msgSnackBarVar, severitySnackBarVar, showSnackBarVar } from "./cache";

export const setSnackBar = (msg, severity) => {
  msgSnackBarVar(msg);
  severitySnackBarVar(severity);
  showSnackBarVar(true);
};
