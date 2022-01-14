import React, {useRef} from "react";
import { DialogTitle } from "@mui/material";
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import './PollutionReportModal.scss';
import PollutionTypePicker from "./forms/PollutionTypePicker";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import {setSnackBar} from "../SnackBarUtils";


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const BootstrapDialogTitle = (props) => {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
        </DialogTitle>
    );
};

BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};

const PollutionReportPickerModal = ({ show, handleClose }) => {
    const pollutionTypePickerRef = useRef(null);

    const onClose = (e, reason) => {
        if (reason && reason === "backdropClick") {
            return;
        }
        if(!pollutionTypePickerRef.current.state.image.value){
            setSnackBar('Pollution type must be selected', 'error');
            return;
        }
        handleClose(pollutionTypePickerRef.current.state.image.value);
    }
  return (
      <div>
        <BootstrapDialog
            sx={{display: "absolute"}}
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={show}
        >
            <BootstrapDialogTitle id="customized-dialog-title">
                Pollution Report Type Picker
            </BootstrapDialogTitle>
            <DialogContent>
                <PollutionTypePicker ref={pollutionTypePickerRef}/>
            </DialogContent>
            <DialogActions sx={{alignItems: 'end'}}>
                <div></div>
                <Button color="primary"
                        variant="contained" onClick={onClose}>
                    Submit
                </Button>
            </DialogActions>
        </BootstrapDialog>
      </div>
  );
};

export default PollutionReportPickerModal;
