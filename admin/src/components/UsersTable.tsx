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
import { DateTime } from "luxon";

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
      sortCompare:
        (order) =>
        ({ data: val1 }, { data: val2 }) => {
          const name1 = val1.displayName;
          const name2 = val2.displayName;
          console.log(order);
          if (name1 === name2) {
            return 0;
          }

          if (order === "desc" && name1 > name2) {
            return 1;
          }

          return -1;
        },
      customHeadLabelRender: (columnMeta) => {
        return <Box sx={{ fontWeight: "bold" }}>{columnMeta.label}</Box>;
      },
      customBodyRender: (value, tableMeta, updateValue) => {
        return (
          <Grid container spacing={2}>
            <Grid item>
              <Avatar
                sx={{ width: 70, height: 70 }}
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
    label: "Last Sign In",
    options: {
      customHeadLabelRender: (columnMeta) => {
        return <Box sx={{ fontWeight: "bold" }}>{columnMeta.label}</Box>;
      },
      filter: false,
      sort: true,
      customBodyRender: (value, tableMeta, updateValue) => {
        return value.toRelative();
      },
    },
  },
  {
    name: "status",
    label: "Status",
    options: {
      customHeadLabelRender: (columnMeta) => {
        return <Box sx={{ fontWeight: "bold" }}>{columnMeta.label}</Box>;
      },
      filter: false,
      sort: false,
      customBodyRender: (value, tableMeta, updateValue) => {
        const color = value.emailVerified ? "#52D198" : "#E0452F";
        const label = value.emailVerified
          ? "Email Verified"
          : "Email Not Verified";
        return <Chip label={label} sx={{ backgroundColor: color }} />;
      },
    },
  },
  {
    name: "actions",
    label: "Actions",
    options: {
      customHeadLabelRender: (columnMeta) => {
        return <Box sx={{ fontWeight: "bold" }}>{columnMeta.label}</Box>;
      },
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
      customHeadLabelRender: (columnMeta) => {
        return <Box sx={{ fontWeight: "bold" }}>{columnMeta.label}</Box>;
      },
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
  customSearch: (searchQuery, currentRow, columns) => {
    const searchQueryLower = searchQuery.toLowerCase();
    const nameLower = currentRow[0].displayName.toLowerCase();
    return nameLower.includes(searchQueryLower);
  },
};
export default function UsersTable() {
  const { loading, error, data } = useQuery(GET_ALL_USERS);

  return !loading ? (
    <MUIDataTable
      title={"User List"}
      data={data.allUsers.map((user) => {
        const { displayName, email, emailVerified, photoURL, metadata } = user;
        const lastSignInTime = DateTime.fromHTTP(metadata.lastSignInTime);
        return {
          name: {
            displayName: displayName,
            email: email,
            photoURL: photoURL,
          },
          lastSignInTime: lastSignInTime,
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
