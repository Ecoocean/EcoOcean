import React, { useEffect, useState } from "react";

import MUIDataTable from "mui-datatables";
import {
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import { GET_ALL_USERS } from "../GraphQL/Queries";
import UserPermissionsBox from "./UserPermissionsBox";
import { DateTime } from "luxon";
import UserActionsBox from "./UserActionsBox";
import { useQuery, useReactiveVar } from "@apollo/client";
import { lastOnboardUserUIDVar } from "../cache";

export default function UsersTable() {
  const { loading, error, data } = useQuery(GET_ALL_USERS, {
    fetchPolicy: "network-only",
  });
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
          return <UserActionsBox user={tableMeta.rowData[0]} />;
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
          const { uid, admin, isOnboard, reporter, charts } = permissions;

          const Permissions = () => {
            const [showPermissions, setShowPermissions] = useState(isOnboard);
            const lastOnboardUserUID = useReactiveVar(lastOnboardUserUIDVar);

            useEffect(() => {
              if (lastOnboardUserUID === uid) {
                setShowPermissions(true);
              }
            }, [lastOnboardUserUID]);

            return showPermissions ? (
              <UserPermissionsBox
                uid={uid}
                admin={admin}
                reporter={reporter}
                charts={charts}
              />
            ) : null;
          };
          return <Permissions />;
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

  return !loading ? (
    <MUIDataTable
      title={"User List"}
      data={data.allUsers.map((user) => {
        const {
          uid,
          permissions: { isOnboard, isAdmin, isReporter, hasChartAccess },
          userInfo: { displayName, email, emailVerified, photoURL },
          metadata: { lastSignInTime },
        } = user;
        const lastSignInDate = DateTime.fromHTTP(lastSignInTime);
        return {
          name: {
            uid: uid,
            emailVerified: emailVerified,
            isOnboard: isOnboard,
            displayName: displayName,
            email: email,
            photoURL: photoURL,
          },
          lastSignInTime: lastSignInDate,
          status: { emailVerified: emailVerified },
          permissions: {
            uid,
            isOnboard: isOnboard,
            admin: isAdmin,
            reporter: isReporter,
            charts: hasChartAccess,
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
