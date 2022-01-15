import React, {useEffect, useState} from 'react'
import {Grid, IconButton, ListItem, ListItemButton, Tooltip} from "@mui/material";
import {mainMapVar, reportPolyLayersVar, selectedMapReportVar, selectedReportVar} from "./cache";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import PollutionReportCard from "./PollutionReportCard";
import {setSnackBar} from "./SnackBarUtils";
import {useMutation, useReactiveVar} from "@apollo/client";
import {SET_REPORT_UNRELEVANT} from "./GraphQL/Mutations";
import {PollutionReportModal} from "./modals/PollutionReportModal";
import {polygonColors} from "./PolygonColors";
import L from "leaflet";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import GpsFixedIcon from '@mui/icons-material/GpsFixed';



const ReportItemList = ({report}) => {
    const [openInfoWindow, setOpenInfoWindow] = useState(false);
    const [polygons, setPolygons] = useState(null);
    const [showHide, setShowHide] = useState(false);
    const map = useReactiveVar(mainMapVar);
    const reportPolygonsLayers = useReactiveVar(reportPolyLayersVar);
    const selectedReport = useReactiveVar(selectedReportVar);
    const [
        setReportUnrelevant,
        { loading: loadingUnrelevant, error: errorUnreleant, data: dataUnrelevant },
    ] = useMutation(SET_REPORT_UNRELEVANT);

    useEffect(() =>{
        setShowHide(false);
        if(report) {
            const cachePolygons = reportPolygonsLayers.get(report.id);
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
                    const layer = L.geoJSON(polyReport.geom.geojson, {
                        style: myStyle
                    });
                    layer.bindPopup(polyReport.type);
                    return layer;
                });
                const polyGroup = L.layerGroup(polys.flat());
                setPolygons(polyGroup);
            }

        }
    }, [report]);

    const showPolygonsOnMap = () => {
        reportPolygonsLayers.set(report.id, polygons);
        polygons.addTo(map);
        setShowHide(map.hasLayer(polygons));
    }
    const hidePolygonsOnMap = () => {
        map.removeLayer(polygons);
        setShowHide(map.hasLayer(polygons));
        reportPolygonsLayers.delete(report.id);
    }


    const handleClose = () => {
        setOpenInfoWindow(false);
    };

    const handleSetReportUnrelevant = async (reportId) => {
        await setReportUnrelevant({
            variables: {
                input: {
                    id: reportId,
                    patch: {
                        isRelevant: false
                    }
                }
            },
        });
        setSnackBar("Pollution report successfully deleted", "success");
    };
        return  (

                <ListItem divider component="div" disablePadding>
                    <Grid container direction="column">
                        <Grid
                            item
                            justifyContent="left"
                            alignItems="left"
                            sx={{ marginLeft: 2 }}
                        >
                            {
                                (reportPolygonsLayers.get(report.id) && polygons && showHide) ?
                                    <Tooltip title="Hide Report Polygons" placement="top" arrow>
                                        <IconButton
                                            aria-label="delete"
                                            onClick={hidePolygonsOnMap}
                                        >
                                            <VisibilityOffIcon className="map-icon" />
                                        </IconButton>
                                    </Tooltip> :
                                    <Tooltip title="Show Report Polygons" placement="top" arrow>
                                        <IconButton
                                            aria-label="delete"
                                            onClick={showPolygonsOnMap}
                                        >
                                            <VisibilityIcon className="map-icon" />
                                        </IconButton>
                                    </Tooltip>
                            }
                            <Tooltip title="Show Report On Map" placement="top" arrow>
                                <IconButton
                                    aria-label="delete"
                                    onClick={() => selectedMapReportVar(report)}
                                >
                                    <GpsFixedIcon className="map-icon" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Report" placement="top" arrow>
                                <IconButton
                                    aria-label="delete"
                                    onClick={() => handleSetReportUnrelevant(report.id)}
                                >
                                    <DeleteForeverIcon className="delete-icon"/>
                                </IconButton>
                            </Tooltip>
                        </Grid>
                        <Grid item>
                            <ListItemButton
                                onClick={() => {
                                    selectedReportVar(report);
                                    setOpenInfoWindow(true);
                                }}
                            >
                                <PollutionReportCard report={report} />
                            </ListItemButton>
                        </Grid>
                    </Grid>
                    <PollutionReportModal
                        report={selectedReport}
                        show={openInfoWindow}
                        handleClose={handleClose}
                    />
                </ListItem>
        )
}

export default ReportItemList;