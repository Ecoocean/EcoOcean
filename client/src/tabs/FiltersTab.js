import * as React from "react";
import Box from "@mui/material/Box";
import TextField from '@mui/material/TextField';
import {dateStartFilterVar, dateEndFilterVar} from "../cache";
export default function FiltersTab() {


    return (
        <Box sx={{ display: "flex", paddingTop: "10px", gap: '10px', flexDirection: "row", alignItems: "center", justifyContent: 'center' }}>
            <TextField
                id="date_picker"
                label="Reports Start Date"
                type="date"
                defaultValue={dateStartFilterVar().toISOString().split('T')[0]}
                sx={{ width: 220 }}
                onChange = {(event) =>    {
                    dateStartFilterVar(new Date(Date.parse(event.target.value)));
                    // #TODO refresh reports
                }}
                InputLabelProps={{
                    shrink: true
                }}
            />
            <TextField
                id="date_picker"
                label="Reports End Date"
                type="date"
                defaultValue={dateEndFilterVar().toISOString().split('T')[0]}
                sx={{ width: 220 }}
                onChange = {(event) =>    {
                    dateEndFilterVar(new Date(Date.parse(event.target.value)));
                    // #TODO refresh reports
                }}
                InputLabelProps={{
                    shrink: true
                }}
            />
        </Box>
    );
}
