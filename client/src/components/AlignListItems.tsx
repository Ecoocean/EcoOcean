import * as React from "react";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import ListItemButton from "@mui/material/CardContent";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import { GET_ALL_POLLUTION_REPORTS } from "../GraphQL/Queries";
import { useQuery } from "@apollo/client";
import { PollutionReport } from "../types/PollutionReport";
import PollutionReportCard from "./PollutionReportCard";
import FlipMove from "react-flip-move";
export default function AlignItemsList() {
  const [checked, setChecked] = React.useState<PollutionReport | null>(null);

  const handleToggle = (selectedReport: PollutionReport) => () => {
    setChecked(selectedReport);
  };

  const { loading, error, data } = useQuery(GET_ALL_POLLUTION_REPORTS);

  const pollutionReports: PollutionReport[] =
    data && !error && !loading ? data.getAllPollutionReports : [];

  return (
    <Paper style={{ maxHeight: 950, overflow: "auto" }}>
      <FlipMove style={{ overflowAnchor: "none" }}>
        <List>
          {pollutionReports.map((report: PollutionReport) => {
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
      </FlipMove>
    </Paper>
  );
}
