import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import MySvg from "./No-Image-Placeholder.svg";

function PollutionReportCard({report}) {
  return (
    <Card sx={{ maxWidth: "100%", display: "flex" }}>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Typography component="div" variant="h6" sx={{fontSize:"18px"}}>
            {`Report ID: ${report.id}`}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            component="div"
            sx={{fontSize:"14px"}}
          >
            {report.address
              ? `Address: ${report.address}`
              : `Coordinates: lat: ${report.geom.y}, lng: ${report.geom.x}`}
          </Typography>
        </CardContent>
        <Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}>
          <Grid item xs={6}>
            <Avatar
              src={
                report.reporterImageUrl
                  ? report.reporterImageUrl
                  : "/"
              }
              alt={report.reporter}
            />
            {`Reporter: ${report.reporter}`}
          </Grid>
          <Grid item xs={7}>
            {`Date: ${
              new Date(report.createdAt)?.toString()}`}
          </Grid>
        </Box>
      </Box>
      <CardMedia
        component="img"
        sx={{ width: 150, height: 150 }}
        image={
          report.photoUrls && report.photoUrls.length > 0
            ? report.photoUrls[0]
            : MySvg
        }
        alt={report.id}
      />
    </Card>
  );
}

export default PollutionReportCard;