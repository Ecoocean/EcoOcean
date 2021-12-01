import React from "react";
import { Button, Modal } from "react-bootstrap";
import Avatar from "@mui/material/Avatar";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import {DialogTitle, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

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
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};

BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};

export const PollutionReportModal = ({ report, show, handleClose }) => {
  return (
    report && (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={show}
        >
            <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                Pollution Report
            </BootstrapDialogTitle>
            <DialogContent dividers>
                ID: {report.id}
                {report.address
                    ? `Address: ${report.address}`
                    : `Coordinates: lat: ${report.geom.y}, lng: ${report.geom.x}`}
                <ImageList sx={{ width: 350, height: 350 }} cols={2}>
                    {report.photoUrls?.map((photoUrl) => (
                        <ImageListItem key={photoUrl}>
                            <a href={photoUrl} target="_blank">
                                <img width="164" height="164" src={photoUrl} />
                            </a>
                        </ImageListItem>
                    ))}
                </ImageList>
            </DialogContent>
            <DialogActions sx={{alignItems: 'end'}}>
                <Avatar
                    alt={report.reporter}
                    src={!!report.reporterImageUrl ? report.reporterImageUrl : "/"}
                />
                <div>{`Reporter: ${report.reporter}`}</div>
                <div style={{flex: '1 0 0'}} />
                <Button onClick={handleClose}>
                    Close
                </Button>
            </DialogActions>
        </BootstrapDialog>
    )
  );
};
