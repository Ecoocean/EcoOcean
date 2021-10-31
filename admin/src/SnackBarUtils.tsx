import { msgSnackBarVar, severitySnackBarVar, showSnackBarVar } from "./cache";

export const setSnackBar = (msg: string, severity: string) => {
  msgSnackBarVar(msg);
  severitySnackBarVar(severity);
  showSnackBarVar(true);
};
