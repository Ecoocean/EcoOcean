import * as React from "react";
import Box from "@mui/material/Box";
import TextField from '@mui/material/TextField';
import {
    dateStartFilterVar,
    dateEndFilterVar,
    filteredPollutionReportsVar,
    mainMapVar,
    gvulotVar,
    sensVar, loadingVar
} from "../cache";
import {useLazyQuery, useReactiveVar} from "@apollo/client";
import {GET_GVULOTS, GET_LOCATION_REPORTS} from "../GraphQL/Queries";
import {useEffect} from "react";
export default function FiltersTab() {
    const [getLocationReports, { data: dataLocal }] = useLazyQuery(GET_LOCATION_REPORTS, {
        fetchPolicy: "network-only",
    });

    const [getGvulot, { data: dataGvulot }] = useLazyQuery(GET_GVULOTS, {
        fetchPolicy: "network-only",
    });
    useEffect(() => {
        if(dataLocal) {
            filteredPollutionReportsVar(dataLocal.getLocationPollutionReports?.nodes);
        }
    }, [dataLocal]);

    useEffect(() => {
        if (dataGvulot) {
            loadingVar(false);
            gvulotVar(dataGvulot.getMunicipalsWithScore);
            const sens = dataGvulot.getMunicipalsWithScore.reduce((accu, curr) => {
                const sensMapped = curr.gvulSensIntersectsByGvulId.map(({sens}) => sens);
                return [...accu, ...sensMapped]
            }, []);

            sensVar(sens);
        }
    }, [dataGvulot]);

    return (
        <Box sx={{ display: "flex", paddingTop: "10px", gap: '10px', flexDirection: "row", alignItems: "center", justifyContent: 'center' }}>
            <TextField
                id="date_picker"
                label="Reports Start Date"
                type="date"
                defaultValue={dateStartFilterVar().toISOString().split('T')[0]}
                sx={{ width: 220 }}
                onChange = {(event) =>    {
                    loadingVar(true);
                    dateStartFilterVar(new Date(Date.parse(event.target.value)));
                    const bounds = mainMapVar().getBounds();
                    getLocationReports({variables: {
                            xmin: bounds.getSouthEast().lng,
                            ymin: bounds.getSouthEast().lat,
                            xmax: bounds.getSouthWest().lng,
                            ymax: bounds.getNorthEast().lat,
                            filter: {
                                and: [
                                    {createdAt: {greaterThan: dateStartFilterVar().toISOString().split('T')[0]}},
                                    {createdAt: {lessThan: dateEndFilterVar().toISOString().split('T')[0]}}
                                ]
                            }
                    }});
                    getGvulot({
                        variables: {
                            filterReports: {
                                and: [
                                    {createdAt: {greaterThan: dateStartFilterVar().toISOString().split('T')[0]}},
                                    {createdAt: {lessThan: dateEndFilterVar().toISOString().split('T')[0]}}
                                ]
                            }
                        }
                    })

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
                    loadingVar(true);
                    dateEndFilterVar(new Date(Date.parse(event.target.value)));
                    const bounds = mainMapVar().getBounds();
                    getLocationReports({variables: {
                            xmin: bounds.getSouthEast().lng,
                            ymin: bounds.getSouthEast().lat,
                            xmax: bounds.getSouthWest().lng,
                            ymax: bounds.getNorthEast().lat,
                            filter: {
                                and: [
                                    {createdAt: {greaterThan: dateStartFilterVar().toISOString().split('T')[0]}},
                                    {createdAt: {lessThan: dateEndFilterVar().toISOString().split('T')[0]}}
                                ]
                            }
                    }});
                    getGvulot({
                        variables: {
                            filterReports: {
                                and: [
                                    {createdAt: {greaterThan: dateStartFilterVar().toISOString().split('T')[0]}},
                                    {createdAt: {lessThan: dateEndFilterVar().toISOString().split('T')[0]}}
                                ]
                            }
                        }
                    })
                }}
                InputLabelProps={{
                    shrink: true
                }}
            />
        </Box>
    );
}
