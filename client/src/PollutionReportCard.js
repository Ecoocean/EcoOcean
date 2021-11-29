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
    <Card sx={{ maxWidth: "100%", height: "190px", display: "flex" }}>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Typography component="div" variant="h6" sx={{fontSize:"18px"}}>
            {`Report ID: ${report.id}`}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            component="div"
            sx={{fontSize:"13px"}}
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
              <Typography component="div" sx={{fontSize:"12px"}}>
                {`Reporter: ${report.reporter}`}
              </Typography>
          </Grid>
          <Grid item xs={7}>
              <Typography component="div" sx={{fontSize:"12px"}}>
                {`Date: ${
                  new Date(report.createdAt)?.toString()}`}
              </Typography>
          </Grid>
        </Box>
      </Box>
      <CardMedia
        component="img"
        sx={{ width: 151, height: "auto" }}
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