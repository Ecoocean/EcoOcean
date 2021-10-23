import React, { useState } from "react";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import ListItemButton from "@mui/material/CardContent";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import { useQuery, useReactiveVar } from "@apollo/client";
import { PollutionReport } from "../types/PollutionReport";
import PollutionReportCard from "./PollutionReportCard";
import { GET_FILTERED_POLLUTION_REPORTS_LOCAL } from "../GraphQL/Queries";
import { loadingPollutionReportsVar } from "../cache";
import { Backdrop, CircularProgress, Grid } from "@mui/material";
import { PollutionReportModal } from "./modals/PollutionReportModal";

export default function AlignItemsList() {
  const [openInfoWindow, setOpenInfoWindow] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const loadingFilteredReports = useReactiveVar(loadingPollutionReportsVar);

  const { data, loading, error } = useQuery(
    GET_FILTERED_POLLUTION_REPORTS_LOCAL
  );

  const handleClose = () => {
    setOpenInfoWindow(false);
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
        <List dense disablePadding sx={{ display: "list-item", width: "100%" }}>
          {data.filteredPollutionReports.map((report: PollutionReport) => {
            return (
              <div key={report.id}>
                <ListItem>
                  <ListItemButton
                    onClick={() => {
                      setSelectedReport(report);
                      setOpenInfoWindow(true);
                    }}
                  >
                    <PollutionReportCard report={report} />
                  </ListItemButton>
                </ListItem>
                <Divider />
              </div>
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
