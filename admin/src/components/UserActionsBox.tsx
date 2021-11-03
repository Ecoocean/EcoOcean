import React, { useState } from "react";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import IconButton from "@mui/material/IconButton";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import { Grid } from "@mui/material";
import { useMutation } from "@apollo/client";
import { ADD_USER } from "../GraphQL/Mutations";
import { setSnackBar } from "../SnackBarUtils";
import { userInfo } from "os";
import { lastOnboardUserUIDVar } from "../cache";

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

export default function UserActionsBox({ user }) {
  const [
    createUser,
    { loading: loadingUser, error: errorUser, data: dataUser },
  ] = useMutation(ADD_USER);
  const [userOnboard, setUserOnboard] = useState(user.isOnboard);
  const onOnboardUserClick = async () => {
    const { data } = await createUser({
      variables: {
        userInput: {
          uid: user.uid,
          userInfo: {
            displayName: user.displayName,
            email: user.email,
            emailVerified: user.emailVerified,
            photoURL: user.photoURL,
          },
        },
      },
    });
    setSnackBar(`User ${user.displayName} Successfully onboard`, "success");
    setUserOnboard(true);
    lastOnboardUserUIDVar(user.uid);
  };
  return (
    <Grid container spacing={0.1}>
      <Grid item>
        <IconButton
          color="primary"
          onClick={onOnboardUserClick}
          disabled={userOnboard}
        >
          <PersonAddIcon />
        </IconButton>
      </Grid>
      <Grid item>
        <BootstrapTooltip title="View in Firebase">
          <IconButton size="small">
            <img style={{ height: "27px" }} src="/images/firebase-logo.png" />
          </IconButton>
        </BootstrapTooltip>
      </Grid>
    </Grid>
  );
}
