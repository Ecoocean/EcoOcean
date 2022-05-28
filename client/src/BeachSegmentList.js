import React from "react";
import {gvulotVar} from "./cache";
import {TransitionGroup} from "react-transition-group";
import Collapse from "@mui/material/Collapse";
import ListItem from "@mui/material/ListItem";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import List from "@mui/material/List";
import { redGreenScaleBoxes } from './chromaColors';

function calculateSeverity(score) {
    if(score === 0){
        return 'success'
    }
    if (score > 0 && score < 20){
        return 'warning';
    }
    return 'error';
}

export default function BeachSegmentList() {
    return (
        <List sx={{ width: "100%" }} >
            <TransitionGroup>
                { gvulotVar() && gvulotVar().map((gvul, i) => {
                    return gvul.gvulSensIntersectsByGvulId.map(({sens}, j) => {

                        return <Collapse key={`${i}${j}`}>
                            <ListItem divider sx={{display: "inherit"}}>
                                <Alert severity={calculateSeverity(sens.score)} sx={{backgroundColor: redGreenScaleBoxes(sens.score).hex()}}>
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