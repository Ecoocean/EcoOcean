import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import { useMutation, useReactiveVar } from "@apollo/client";
import MapIcon from "@mui/icons-material/Map";
import PollutionReportCard from "./PollutionReportCard.js";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {
  loadingPollutionReportsVar,
  selectedReportVar,
  selectedMapReportVar,
} from "./cache";
import {
  Backdrop,
  CircularProgress,
  Grid,
  IconButton,
  ListItem,
  ListItemButton,
  Tooltip,
} from "@mui/material";
import { PollutionReportModal } from "./modals/PollutionReportModal";
import { SET_REPORT_UNRELEVANT } from "./GraphQL/Mutations";
import { setSnackBar } from "./SnackBarUtils";
import {
  filteredPollutionReportsVar
} from "./cache";
import "./ReportList.scss";

export default function ReportList() {
  const [openInfoWindow, setOpenInfoWindow] = useState(false);
  const loadingFilteredReports = useReactiveVar(loadingPollutionReportsVar);
  const selectedReport = useReactiveVar(selectedReportVar);
  const filteredPollutionReports = useReactiveVar(filteredPollutionReportsVar);
  const [
    setReportUnrelevant,
    { loading: loadingUnrelevant, error: errorUnreleant, data: dataUnrelevant },
  ] = useMutation(SET_REPORT_UNRELEVANT);

  const handleClose = () => {
    setOpenInfoWindow(false);
  };

  const handleSetReportUnrelevant = async (reportId) => {
    await setReportUnrelevant({
      variables: {
        input: {
          id: reportId,
          patch: {
            isRelevant: false
          }
        }
      },
    });
    setSnackBar("Pollution report successfully deleted", "success");
  };

  return (
    <div style={{ position: "relative" }}>
      <Backdrop
        sx={{
          position: "absolute",
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={loadingFilteredReports}
      >
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item>
            <CircularProgress color="inherit" />
          </Grid>
          <Grid item>Loading reports please wait ...</Grid>
        </Grid>
      </Backdrop>
      <Paper style={{ maxHeight: 950, overflow: "auto" }}>
        <List sx={{ display: "list-item", width: "100%" }}>
          {filteredPollutionReports.map((report) => {
            return (
              <ListItem divider key={report.id} component="div" disablePadding>
                <Grid container direction="column">
                  <Grid
                    item
                    justifyContent="left"
                    alignItems="left"
                    sx={{ marginLeft: 2 }}
                  >
                    <Tooltip title="Show Report On Map" placement="top" arrow>
                      <IconButton
                        aria-label="delete"
                        onClick={() => selectedMapReportVar(report)}
                      >
                        <MapIcon className="map-icon" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Report" placement="top" arrow>
                      <IconButton
                        aria-label="delete"
                        onClick={() => handleSetReportUnrelevant(report.id)}
                      >
                        <DeleteForeverIcon className="delete-icon"/>
                      </IconButton>
                    </Tooltip>
                  </Grid>
                  <Grid item>
                    <ListItemButton
                      onClick={() => {
                        selectedReportVar(report);
                        setOpenInfoWindow(true);
                      }}
                    >
                      <PollutionReportCard report={report} />
                    </ListItemButton>
                  </Grid>
                </Grid>
              </ListItem>
            );
          })}
        </List>
      </Paper>
      <PollutionReportModal
        report={selectedReport}
        show={openInfoWindow}
        handleClose={handleClose}
      />
    </div>
  );
}
