import React, { useState } from "react";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ScaleLoader from "react-spinners/ScaleLoader";
import { display } from "@mui/system";

const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
  },
}));

export default function UserPermissionsBox({ admin, reporter, charts }) {
  let [loading, setLoading] = useState(false);
  const onPermissionClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };
  return !loading ? (
    <Box
      component="div"
      sx={{
        p: 2,
        border: "1px solid grey",
        borderRadius: "25px",
        height: "50px",
        maxWidth: "180px",
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
      }}
    >
      <BootstrapTooltip title="Admin">
        <IconButton
          style={{ color: admin ? "#52D198" : "grey" }}
          onClick={onPermissionClick}
        >
          <SupervisedUserCircleIcon />
        </IconButton>
      </BootstrapTooltip>
      <BootstrapTooltip title="Reporter">
        <IconButton
          style={{ color: reporter ? "#52D198" : "grey" }}
          onClick={onPermissionClick}
        >
          <FmdGoodIcon />
        </IconButton>
      </BootstrapTooltip>
      <BootstrapTooltip title="Access Charts">
        <IconButton
          style={{ color: charts ? "#52D198" : "grey" }}
          onClick={onPermissionClick}
        >
          <AssessmentIcon />
        </IconButton>
      </BootstrapTooltip>
    </Box>
  ) : (
    <Box
      component="div"
      sx={{
        p: 2,
        border: "1px solid grey",
        borderRadius: "25px",
        height: "50px",
        maxWidth: "180px",
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
      }}
    >
      <ScaleLoader
        height="25"
        width="8"
        radius="2"
        margin="2"
        color="#52D198"
        loading={loading}
      />
    </Box>
  );
}
