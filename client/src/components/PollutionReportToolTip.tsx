import * as React from "react";
import { styled } from "@mui/material/styles";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} placement="top" arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: "#f5f5f9",
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}));

export default function PollutionReportToolTip(props: any) {
  return (
    <div>
      <HtmlTooltip
        title={
          <React.Fragment>
            <Typography color="inherit">Report ID: </Typography>
            <u>
              <b>{"Report ID:"}</b>
            </u>{" "}
            {props.report.id}
            <br />
            <u>
              <b>{"Reporter:"}</b>
            </u>{" "}
            {props.report.reporter}
            <br />
            <u>
              <b>{"Report Type:"}</b>
            </u>{" "}
            {props.report.type}
            <br />
            <u>
              <b>{"Date:"}</b>
            </u>{" "}
            {`${new Date(props.report.createdAt)?.toString()}`}
            <br />
            <b>for more inforamtion click on the marker</b>
          </React.Fragment>
        }
        {...props}
      ></HtmlTooltip>
    </div>
  );
}
