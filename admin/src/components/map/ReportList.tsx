import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { PollutionReport } from "../../types/PollutionReport";
import MapIcon from "@mui/icons-material/Map";
import PollutionReportCard from "../PollutionReportCard";
import { GET_FILTERED_POLLUTION_REPORTS_LOCAL } from "../../GraphQL/Queries";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {
  loadingPollutionReportsVar,
  selectedReportVar,
  selectedMapReportVar,
} from "../../cache";
import {
  Backdrop,
  CircularProgress,
  Grid,
  IconButton,
  ListItem,
  ListItemButton,
  Tooltip,
} from "@mui/material";
import { PollutionReportModal } from "../modals/PollutionReportModal";


export default function ReportList() {
  const [openInfoWindow, setOpenInfoWindow] = useState(false);
  const loadingFilteredReports = useReactiveVar(loadingPollutionReportsVar);
  const selectedReport = useReactiveVar(selectedReportVar);
  const { data, loading, error } = useQuery(
    GET_FILTERED_POLLUTION_REPORTS_LOCAL
  );


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
          {data.filteredPollutionReports.map((report: PollutionReport) => {
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
                        <MapIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Report" placement="top" arrow>
                      <IconButton
                        aria-label="delete"
                      >
                        <DeleteForeverIcon />
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
      />
    </div>
  );
}
