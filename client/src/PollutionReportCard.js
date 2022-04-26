import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import noImage from "./noImage.jpeg";
import './PollutionReportCard.scss';

function PollutionReportCard({report}) {
  return (
    <Card sx={{ maxWidth: "100%", maxHeight: "100%", display: "flex" }}>
      <Box sx={{ maxWidth: "100%", maxHeight: "100%", display: "flex", flexDirection: "column" }}>
        <CardContent className="card-content" sx={{ display: "flex", flexDirection: "column" }}>
          <div className="card-header">
            {`Report ID: ${report.id}`}
          </div>
            <Typography
                variant="subtitle1"
                className="card-address"
                color="text.secondary"
                component="p"
            >
                {report.municipalName &&`Municipal: ${report.municipalName}`}
            </Typography>
          <Typography
            variant="subtitle1"
            className="card-address"
            color="text.secondary"
            component="p"
          >
            {report.address
              ? `Address: ${report.address}`
              : `Coordinates: lat: ${report.geom.y}, lng: ${report.geom.x}`}
          </Typography>
        </CardContent>
        <Box sx={{ display: "flex", alignItems: "center", pl: 0.5, pb: 1, pr: 1}}>
          <Grid item xs={7}>
            <Avatar
              className="card-avatar"
              src={
                report.reporterImageUrl
                  ? report.reporterImageUrl
                  : "/"
              }
              alt={report.reporter}
            />
              <Typography className="card-reporter" component="div">
                {`Reporter: ${report.reporter}`}
              </Typography>
          </Grid>
          <Grid sx={{display: "flex"}} item xs={8}>
              <Typography className="card-date" component="div">
                {`Date: ${
                  new Date(report.createdAt)?.toString()}`}
              </Typography>
          </Grid>
        </Box>
      </Box>
      <CardMedia
        className="card-media"
        component="img"
        image={
          report.photoUrls && report.photoUrls.length > 0
            ? report.photoUrls[0]
            : noImage
        }
        alt={report.id}
      />
    </Card>
  );
}

export default PollutionReportCard;