import * as React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import { getAuth } from 'firebase/auth';
import Grid from "@mui/material/Grid";
import {Logout} from "@mui/icons-material";
import {Button} from "@mui/material";
import { styled } from '@mui/material/styles';
import './SettingsTab.scss';
import {sideBarOpenTabVar} from "../cache";

export default function SettingsTab() {

    const CustomizedAvatar = styled(Avatar)`
      @media (min-width: 992px ){
        width: 180px;
        height: 180px;
      }
      @media (min-width: 300px ) and (max-width: 992px ) {
        width: 130px;
        height: 130px;
      }
    `;

    const onSignOut = () => {
        getAuth().signOut();
        sideBarOpenTabVar('home');
    }

    return (
        <Box sx={{ display: "flex", paddingTop: "10px", flexDirection: "column", alignItems: "center", pl: 1, pb: 1 }}>
            <Grid item xs={6}>
                <CustomizedAvatar
                    variant="circular"
                    src={
                        getAuth().currentUser?.photoURL
                            ? getAuth().currentUser.photoURL
                            : "/"
                    }
                    alt={getAuth().currentUser?.displayName}
                />
            </Grid>
            <Grid item xs={6}>
                <p>Username: {getAuth().currentUser?.displayName}</p>
            </Grid>
            <Grid item xs={6}>
                <Button id={'logout-button'} variant="contained" onClick={onSignOut} endIcon={<Logout />}>
                    Logout
                </Button>
            </Grid>
        </Box>
    );
}
