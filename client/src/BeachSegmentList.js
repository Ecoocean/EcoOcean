import React from "react";
import {gvulotVar} from "./cache";
import {TransitionGroup} from "react-transition-group";
import Collapse from "@mui/material/Collapse";
import ListItem from "@mui/material/ListItem";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import List from "@mui/material/List";

function perc2color(perc) {
    var r, g, b = 0;
    if(perc < 50) {
        r = 255;
        g = Math.round(5.1 * perc);
    }
    else {
        g = 255;
        r = Math.round(510 - 5.10 * perc);
    }
    var h = r * 0x10000 + g * 0x100 + b * 0x1;
    return '#' + ('000000' + h.toString(16)).slice(-6);
}

export default function BeachSegmentList() {
    return (
        <List sx={{ width: "100%" }} >
            <TransitionGroup>
                { gvulotVar() && gvulotVar().map((gvul, i) => {
                    return gvul.gvulSensIntersectsByGvulId.map(({sens}, j) => {

                        return <Collapse key={`${i}${j}`}>
                            <ListItem divider sx={{display: "inherit"}}>
                                <Alert severity={"error"} sx={{backgroundColor: perc2color(100 - (sens.score * 5) )}}>
                                    <AlertTitle>{gvul.muniHeb} - area id: {sens.id}</AlertTitle>
                                    information regarding pollution status <strong>check it out!</strong>
                                </Alert>
                            </ListItem>
                        </Collapse>
                    })
                })
                }
            </TransitionGroup>
        </List>
    );
}