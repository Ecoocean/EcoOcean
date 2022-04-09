import React from "react";
import {gvulotVar} from "./cache";
import {TransitionGroup} from "react-transition-group";
import Collapse from "@mui/material/Collapse";
import ListItem from "@mui/material/ListItem";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import List from "@mui/material/List";

export default function MunicipalList() {
    return (
        <List sx={{ width: "100%" }} >
            <TransitionGroup>
                { gvulotVar() && gvulotVar().map((gvul, i) => {
                    return <Collapse key={i}>
                        <ListItem divider sx={{display: "inherit"}}>
                            <Alert severity={ i % 3 === 0 ? "error" : i % 3 === 1 ? "warning" : "success"}>
                                <AlertTitle>{gvul.muniHeb}</AlertTitle>
                                information regarding pollution status <strong>check it out!</strong>
                            </Alert>
                        </ListItem>
                    </Collapse>
                })
                }
            </TransitionGroup>
        </List>
    );
}