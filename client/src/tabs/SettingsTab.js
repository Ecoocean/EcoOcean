import * as React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import firebase from "firebase";
import Grid from "@mui/material/Grid";
import {Logout} from "@mui/icons-material";
import {Button} from "@mui/material";
import { styled } from '@mui/material/styles';
import './SettingsTab.scss';

export default function SettingsTab() {

    const CustomizedAvatar = styled(Avatar)`
      @media (min-width: 992px ){
        width: 180px;
        height: 180px;
      }
      @media (min-width: 400px ) and (max-width: 992px ) {
        width: 130px;
        height: 130px;
      }
    `;

    return (
        <Box sx={{ display: "flex", paddingTop: "10px", flexDirection: "column", alignItems: "center", pl: 1, pb: 1 }}>
            <Grid item xs={6}>
                <CustomizedAvatar
                    variant="circular"
                    src={
                        firebase.auth().currentUser.photoURL
                            ? firebase.auth().currentUser.photoURL
                            : "/"
                    }
                    alt={firebase.auth().currentUser.displayName}
                />
            </Grid>
            <Grid item xs={6}>
                <p>Username: {firebase.auth().currentUser.displayName}</p>
            </Grid>
            <Grid item xs={6}>
                <Button variant="contained" onClick={() => firebase.auth().signOut()} endIcon={<Logout />}>
                    Logout
                </Button>
            </Grid>
        </Box>
    );
}
