import React from "react";

import MUIDataTable from "mui-datatables";
import {
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import { useQuery } from "@apollo/client";
import { GET_ALL_USERS } from "../GraphQL/Queries";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import IconButton from "@mui/material/IconButton";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import UserPermissionsBox from "./UserPermissionsBox";

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

const columns = [
  {
    name: "name",
    label: "Name",
    options: {
      filter: true,
      sort: true,
      customBodyRender: (value, tableMeta, updateValue) => {
        return (
          <Grid container spacing={2}>
            <Grid item>
              <Avatar
                sx={{ width: 56, height: 56 }}
                variant="circular"
                src={value.photoURL}
              ></Avatar>
            </Grid>
            <Grid item xs container direction="column" spacing={1}>
              <Grid item>{value.displayName}</Grid>
              <Grid item>
                <Typography variant="body2" color="text.secondary">
                  {value.email}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        );
      },
    },
  },
  {
    name: "lastSignInTime",
    label: "Last Sign In Time",
    options: {
      filter: false,
      sort: false,
    },
  },
  {
    name: "status",
    label: "Status",
    options: {
      filter: false,
      sort: false,
      customBodyRender: (value, tableMeta, updateValue) => {
        const color = value.emailVerified ? "success" : "error";
        const label = value.emailVerified
          ? "Email Verified"
          : "Email Not Verified";
        return <Chip label={label} color={color} />;
      },
    },
  },
  {
    name: "actions",
    label: "Actions",
    options: {
      filter: false,
      sort: false,
      customBodyRender: (value, tableMeta, updateValue) => {
        return (
          <Grid container spacing={0.1}>
            <Grid item>
              <BootstrapTooltip title="Onboard User">
                <IconButton color="primary">
                  <PersonAddIcon />
                </IconButton>
              </BootstrapTooltip>
            </Grid>
            <Grid item>
              <BootstrapTooltip title="View in Firebase">
                <IconButton size="small">
                  <img
                    style={{ height: "27px" }}
                    src="/images/firebase-logo.png"
                  />
                </IconButton>
              </BootstrapTooltip>
            </Grid>
          </Grid>
        );
      },
    },
  },
  {
    name: "permissions",
    label: "Permissions",
    options: {
      filter: false,
      sort: false,
      customBodyRender: (permissions, tableMeta, updateValue) => {
        const { admin, reporter, charts } = permissions;
        return (
          <UserPermissionsBox
            admin={admin}
            reporter={reporter}
            charts={charts}
          />
        );
      },
    },
  },
];

const options = {
  filterType: "checkbox",
  selectableRowsHideCheckboxes: true,
};
export default function UsersTable() {
  const { loading, error, data } = useQuery(GET_ALL_USERS);

  return !loading ? (
    <MUIDataTable
      title={"User List"}
      data={data.allUsers.map((user) => {
        const { displayName, email, emailVerified, photoURL, metadata } = user;
        return {
          name: {
            displayName: displayName,
            email: email,
            photoURL: photoURL,
          },
          lastSignInTime: metadata.lastSignInTime,
          status: { emailVerified: emailVerified },
          permissions: {
            admin: true,
            reports: false,
            charts: true,
          },
        };
      })}
      columns={columns}
      options={options}
    />
  ) : (
    <CircularProgress />
  );
}
