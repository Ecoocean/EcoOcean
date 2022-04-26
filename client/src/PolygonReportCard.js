import * as React from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import * as turf from '@turf/turf';

export default function PolygonReportCard({poly}) {
    return (
        <Card sx={{ display: 'flex' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '400px' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                    <Typography component="div" variant="h6">
                       Type: {poly.type}
                    </Typography>
                    <Typography component="div" variant="h6">
                        Area: {Math.ceil(turf.area(poly.geometry))} m2
                    </Typography>
                </CardContent>
            </Box>
        </Card>
    );
}