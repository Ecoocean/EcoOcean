import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import { useQuery, useReactiveVar } from "@apollo/client";
import { PollutionReport } from "../types/PollutionReport";
import PollutionReportCard from "./PollutionReportCard";
import { GET_FILTERED_POLLUTION_REPORTS_LOCAL } from "../GraphQL/Queries";
import { loadingPollutionReportsVar, selectedItemReportVar } from "../cache";
import {
  Backdrop,
  CircularProgress,
  Grid,
  ListItemButton,
} from "@mui/material";

export default function AlignItemsList() {
  const loadingFilteredReports = useReactiveVar(loadingPollutionReportsVar);
  const selectedItemReport = useReactiveVar(selectedItemReportVar);

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
              <ListItemButton
                key={report.id}
                divider
                onClick={() => {
                  selectedItemReportVar(report);
                }}
              >
                <PollutionReportCard report={report} />
              </ListItemButton>
            );
          })}
        </List>
      </Paper>
    </div>
  );
}
