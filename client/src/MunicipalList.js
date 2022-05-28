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
    if (score > 0 && score < 30){
        return 'warning';
    }
    return 'error';
}

export default function MunicipalList() {
    return (
        <List sx={{ width: "100%" }} >
            <TransitionGroup>
                { gvulotVar() && gvulotVar().map((gvul, i) => {
                    return <Collapse key={i}>
                        <ListItem divider sx={{display: "inherit"}}>
                            <Alert severity={calculateSeverity(gvul.score)} sx={{backgroundColor: redGreenScaleBoxes(gvul.score).hex()}}>
                                <AlertTitle>{gvul.muniHeb}</AlertTitle>
                                There {gvul.reportCount === 0 || gvul.reportCount === 1 ? 'is' : 'are'} currently <strong>{gvul.reportCount}</strong> reports in this area
                            </Alert>
                        </ListItem>
                    </Collapse>
                })
                }
            </TransitionGroup>
        </List>
    );
}