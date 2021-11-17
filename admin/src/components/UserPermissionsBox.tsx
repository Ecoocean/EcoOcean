import React, { useEffect, useState } from "react";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ScaleLoader from "react-spinners/ScaleLoader";
import { UPDATE_USER } from "../GraphQL/Mutations";
import { useMutation } from "@apollo/client";

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

export default function UserPermissionsBox({ uid, admin, reporter, charts }) {
  const [adminVal, setAdmin] = useState(admin);
  const [reporterVal, setReporter] = useState(reporter);
  const [chartsVal, setCharts] = useState(charts);
  const [loadingSimulation, setLoadingSimulations] = useState(false);

  const onPermissionClick = async (fieldName, currentValue) => {
    const minTimeForLoadingSimulation = 700; // in miliseconds
    setLoadingSimulations(true);
    const startTime = performance.now();
    let patch = {}
    patch[fieldName] = !currentValue
    await updateUser({
      variables: {
        input: {
          uid: uid,
          patch: patch
        }
      },
    });
    const endTime = performance.now();
    const TotalTime = endTime - startTime; // in miliseconds

    const timeToWait = minTimeForLoadingSimulation - TotalTime;
    if (timeToWait > 0) {
      // if operation was too fast and took less than a second (1000)
      // we will wait the diff time
      await new Promise((resolve) => setTimeout(resolve, timeToWait));
    }
  };

  const [updateUser, { loading, error, data }] = useMutation(UPDATE_USER);
  return !loadingSimulation ? (
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
          style={{ color: adminVal ? "#52D198" : "grey" }}
          onClick={async () => {
            await onPermissionClick("isAdmin", adminVal);
            setAdmin(!adminVal);
            setLoadingSimulations(false);
          }}
        >
          <SupervisedUserCircleIcon />
        </IconButton>
      </BootstrapTooltip>
      <BootstrapTooltip title="Reporter">
        <IconButton
          style={{ color: reporterVal ? "#52D198" : "grey" }}
          onClick={async () => {
            await onPermissionClick("isReporter", reporterVal);
            setReporter(!reporterVal);
            setLoadingSimulations(false);
          }}
        >
          <FmdGoodIcon />
        </IconButton>
      </BootstrapTooltip>
      <BootstrapTooltip title="Access Charts">
        <IconButton
          style={{ color: chartsVal ? "#52D198" : "grey" }}
          onClick={async () => {
            await onPermissionClick("hasChartAccess", chartsVal);
            setCharts(!chartsVal);
            setLoadingSimulations(false);
          }}
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
        width: "180px",
        maxWidth: "180px",
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
      }}
    >
      <ScaleLoader
        height="30px"
        width="8px"
        radius="2px"
        margin="2px"
        color="#52D198"
        loading={loadingSimulation}
      />
    </Box>
  );
}
