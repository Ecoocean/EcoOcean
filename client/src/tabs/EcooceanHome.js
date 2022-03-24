import React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import './EcooceanHome.scss';


export default function EcooceanHome() {
    return (
        <Box sx={{ display: "flex", paddingTop: "40px", flexDirection: "column", alignItems: "center", pl: 1, pb: 1 }}>
            <Grid item xs={6}>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <img
                        id={'ecoocean-home-logo'}
                        src="/images/ecoOcenLogoNavPainted.png"
                        alt="logo"
                        style={{ width: "12rem" }}
                    />
                </Typography>
            </Grid>
            <Grid item xs={6}>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <img
                        id={'bgu-home-logo'}
                        src="/images/bgu.png"
                        alt="logo"
                        style={{ width: "12rem" }}
                    />
                </Typography>
            </Grid>
        </Box>
    );

}
