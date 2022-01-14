import React, {useEffect, useState} from "react";
import Button from '@mui/material/Button';
import Avatar from "@mui/material/Avatar";
import ImageGallery from 'react-image-gallery';
import {DialogTitle, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';
import { alpha, styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import CustomChip from '../CustomChip';

import './PollutionReportModal.scss';
import {mainMapVar, reportPolyLayersVar} from "../cache";
import L from "leaflet";
import {useReactiveVar} from "@apollo/client";
import {polygonColors} from "../PolygonColors";



const BootstrapInput = styled(InputBase)(({ theme }) => ({
    'label + &': {
      marginTop: theme.spacing(3),
    },
    '& .MuiInputBase-input': {
      borderRadius: 4,
      position: 'relative',
      backgroundColor: theme.palette.mode === 'light' ? '#fcfcfb' : '#2b2b2b',
      border: '1px solid #ced4da',
      fontSize: 16,
      width: 'auto',
      padding: '10px 12px',
      transition: theme.transitions.create([
        'border-color',
        'background-color',
        'box-shadow',
      ]),
      // Use the system font instead of the default Roboto font.
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      '&:focus': {
        boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
        borderColor: theme.palette.primary.main,
      },
    },
  }));

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
                        color: "white",
                    }}
                >
                    <CloseIcon/>
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};

BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};
const onEachFeature = (feature, layer) => {
    //bind click
    layer.on({
        click: () => {console.log("report polygon clicked")}
    });
}
export const PollutionReportModal = ({ report, show, handleClose }) => {
    const [polygons, setPolygons] = useState(null);
    const [showHide, setShowHide] = useState(false);
    const map = useReactiveVar(mainMapVar);
    useEffect(() =>{
        setShowHide(false);
        if(report) {
            const cachePolygons = reportPolyLayersVar().get(report.id);
            if (cachePolygons) {
                setPolygons(cachePolygons);
                const res = map.hasLayer(cachePolygons);
                setShowHide(res);
            }
            else {
                const polys = report.polygonReports.nodes.map((polyReport) => {
                    const myStyle = {
                        "color": polygonColors[polyReport.type],
                        "weight": 5,
                        "opacity": 0.65
                    };
                    return L.geoJSON(polyReport.geom.geojson, {
                        style: myStyle,
                        onEachFeature: onEachFeature
                    });
                });
                const polyGroup = L.layerGroup(polys.flat());
                setPolygons(polyGroup);
            }

        }
    }, [show, report])

    const showPolygonsOnMap = () => {
        reportPolyLayersVar().set(report.id, polygons);
        polygons.addTo(map);
        setShowHide(map.hasLayer(polygons));
    }
    const hidePolygonsOnMap = () => {
        map.removeLayer(polygons);
        setShowHide(map.hasLayer(polygons));
        reportPolyLayersVar().delete(report.id);
    }

  return (
    report && (
        <BootstrapDialog
            sx={{height: "700px",  display: "absolute"}}
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={show}
        >
            <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                Pollution Report
            </BootstrapDialogTitle>
            <DialogContent dividers sx={{height: "700px"}}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        '& .MuiFormControl-root': { m: 1, width: '25ch' },
                    }}
                >
                    <FormControl variant="standard">
                        <InputLabel shrink htmlFor="bootstrap-input">
                            Report ID
                        </InputLabel>
                        <BootstrapInput readOnly defaultValue={report.id} id="bootstrap-input" />
                    </FormControl>
                    <FormControl variant="standard">
                        <InputLabel shrink htmlFor="bootstrap-input2">
                            Address
                        </InputLabel>
                        <BootstrapInput fullWidth={true} multiline={true} readOnly defaultValue={report.address
                            ? `${report.address}`
                            : `lat: ${report.geom.y}, lng: ${report.geom.x}`} id="bootstrap-input2" />
                     </FormControl>
                </Box>
                {
                    (polygons && showHide) ?
                        <Button color="primary"
                                variant="contained" onClick={hidePolygonsOnMap}>
                            Hide Polygon Reports
                        </Button> :
                        <Button color="primary"
                                variant="contained" onClick={showPolygonsOnMap}>
                            Show Polygon Reports
                        </Button>
                }

                {report.photoUrls?.length > 0 &&
                    <ImageGallery
                    showBullets= {report.photoUrls?.length > 1}
                    showThumbnails= {report.photoUrls?.length > 1}
                    showPlayButton={false}
                    items={report.photoUrls?.map((photoUrl) => {
                            return {
                                original: photoUrl,
                                thumbnail: photoUrl,
                            }})
                    }/>
                }

            </DialogContent>
            <DialogActions sx={{alignItems: 'end'}}>
                <div></div>
                <CustomChip  variant="outlined" size={1.3} avatar={ <Avatar
                        alt={report.reporter}
                        src={!!report.reporterImageUrl ? report.reporterImageUrl : "/"}
                    />} label={'Reporter: ' + report.reporter} />
                <div style={{flex: '1 0 0'}} />
                <Button color="primary"
                variant="contained" onClick={handleClose}>
                    Close
                </Button>
            </DialogActions>
        </BootstrapDialog>
    )
  );
};
