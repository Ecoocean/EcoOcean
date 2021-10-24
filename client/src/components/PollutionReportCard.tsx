import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { PollutionReport } from "../types/PollutionReport";
import MySvg from "./No-Image-Placeholder.svg";

export default function PollutionReportCard(props: {
  report: PollutionReport;
}) {
  return (
    <Card sx={{ maxWidth: "100%", display: "flex" }}>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Typography component="div" variant="h6">
            {`Report ID: ${props.report.id}`}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            component="div"
          >
            {props.report.address
              ? `Address: ${props.report.address}`
              : `Coordinates: lat: ${props.report.location.latitude}, lng: ${props.report.location.longitude}`}
          </Typography>
        </CardContent>
        <Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}>
          <Grid item xs={6}>
            <Avatar
              alt={props.report.reporter}
              src={
                !!props.report.reporterImageUrl
                  ? props.report.reporterImageUrl
                  : "/"
              }
            />
            {`Reporter: ${props.report.reporter}`}
          </Grid>
          <Grid item xs={7}>
            {`Date: ${new Date(
              props.report.created_at._seconds * 1000
            ).toString()}`}
          </Grid>
        </Box>
      </Box>
      <CardMedia
        component="img"
        sx={{ width: 150, height: 150 }}
        image={
          props.report.photoUrls && props.report.photoUrls.length > 0
            ? props.report.photoUrls[0]
            : MySvg
        }
        alt={props.report.id}
      />
    </Card>
  );
}
