import React from "react";
import { TransitionGroup } from 'react-transition-group';
import List from "@mui/material/List";
import { useReactiveVar } from "@apollo/client";
import {
  loadingPollutionReportsVar,
} from "./cache";
import {
  Backdrop,
  CircularProgress, Collapse,
  Grid,
} from "@mui/material";
import {
  filteredPollutionReportsVar
} from "./cache";
import Typography from "@mui/material/Typography";
import "./ReportList.scss";
import ReportItemList from "./ReportItemList";

export default function ReportList() {

  const loadingFilteredReports = useReactiveVar(loadingPollutionReportsVar);
  const filteredPollutionReports = useReactiveVar(filteredPollutionReportsVar);

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
      {filteredPollutionReports.length === 0 &&
      <Typography
                sx={{ display: "flex", justifyContent:"center"}}
                variant="subtitle1"
                className="no-reports"
                color="text.secondary"
                component="p"
              >
                No Reports in this area ...
        </Typography>
        }
        <List id="report-list" sx={{ display: "list-item", width: "100%" }} >
        <TransitionGroup>
        {filteredPollutionReports && filteredPollutionReports.map((report, index) => {
            return (
                    <Collapse key={report.id}>
                        <ReportItemList id={`report-item-${index}`} report={report} index={index}/>
                    </Collapse>
                )
          })
        }
          </TransitionGroup>
        </List>
    </div>
  );
}
