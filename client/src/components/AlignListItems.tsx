import * as React from "react";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import ListItemButton from "@mui/material/CardContent";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import { useQuery } from "@apollo/client";
import { PollutionReport } from "../types/PollutionReport";
import PollutionReportCard from "./PollutionReportCard";
import FlipMove from "react-flip-move";
import Skeleton from "@mui/material/Skeleton";
import { GET_FILTERED_POLLUTION_REPORTS_LOCAL } from "../GraphQL/Queries";

export default function AlignItemsList() {
  const { data, loading, error } = useQuery(
    GET_FILTERED_POLLUTION_REPORTS_LOCAL
  );

  return (
    <Paper style={{ maxHeight: 950, overflow: "auto" }}>
      <List disablePadding={true} dense sx={{ width: "100%" }}>
        {data.filteredPollutionReports.map((report: PollutionReport) => {
          return (
            <div>
              <ListItem key={report.id}>
                <ListItemButton>
                  <PollutionReportCard report={report} />
                </ListItemButton>
              </ListItem>
              <Divider />
            </div>
          );
        })}
      </List>
    </Paper>
  );
}
