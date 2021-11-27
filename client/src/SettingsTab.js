import * as React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import firebase from "firebase";
import Grid from "@mui/material/Grid";
import {Logout} from "@mui/icons-material";
import {Button} from "@mui/material";

export default function SettingsTab() {

    return (
        <Box sx={{ display: "flex", paddingTop: "10px", flexDirection: "column", alignItems: "center", pl: 1, pb: 1 }}>
            <Grid item xs={6}>
                <Avatar
                    sx={{
                        border: "0.1px solid lightgray",
                        width: 200,
                        height: 200,
                    }}
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
