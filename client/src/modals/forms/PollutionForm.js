import React, {useEffect, useRef, useState} from "react";
import L from 'leaflet';
import PollutionProporties from "./PollutionProporties";
import {useMutation, useReactiveVar} from "@apollo/client";
import {CREATE_POLLUTION_REPORT} from "../../GraphQL/Mutations";
import {setSnackBar} from "../../SnackBarUtils"
import ImageUploaderComp from "../../ImageUploaderComp";
import MyLocationMap from "../../MyLocationMap.js";
import { getAuth } from 'firebase/auth';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import {gvulotVar, locationMapVar, mainMapVar, reportPolyLayersVar, selectedBeachSegmentVar} from "../../cache";
import 'firebase/auth';
import {sideBarOpenTabVar} from "../../cache";
import PollutionReportPickerModal  from "../PollutionReportPickerModal";
import {polygonColors} from "../../PolygonColors";
import '../../leaflet-measure-path.js';
import '../../leaflet-measure-path.css';
import MenuItem from "@mui/material/MenuItem";
import {FormHelperText, InputLabel, Select} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import * as turf from '@turf/turf';

let beachSegmentsLayer = null;
let isBeachSegmentSelected = false;

const myRedStyle = {
  "color": 'red',
  "weight": 5,
  "opacity": 0.65
};
const myGreenStyle = {
  "color": 'green',
  "weight": 5,
  "opacity": 0.65
};

const PollutionForm = ({ openTab }) => {
  const map = useReactiveVar(locationMapVar);
  const polygonReports = useReactiveVar(reportPolyLayersVar)
  const gvulot = useReactiveVar(gvulotVar);
  //const pollutionProportiesRef = useRef(null);
  const imageUploaderRef = useRef(null);
  const [locationFound, setLocationFound] = useState(false);
  const [openTypePickerWindow, setOpenTypePickerWindow] = useState(false);
  const [selectedPolygon, setSelectedPolygon] = useState(null);
  const [location, setLocation] = useState(null);
  const [gvulName, setGvulName] = useState('');
  const [emptyMunicipal, setEmptyMunicipal] = useState(false);


  const handlePollutionReportPickerClose = (value) => {
    selectedPolygon.bindPopup(value).openPopup();
    const polygon = polygonReports.get(selectedPolygon._leaflet_id);
    polygon.type = value;
    polygonReports.set(selectedPolygon._leaflet_id, polygon);
    setOpenTypePickerWindow(false);
  };

  const [CreatePollutionReport, { loading }] = useMutation(CREATE_POLLUTION_REPORT);

  useEffect(() =>{
    if(map) {
      map.on('pm:create', (e) => {

        e.layer.setStyle({ pmIgnore: false });
        L.PM.reInitLayer(e.layer);
        if (e.shape !== 'Circle') {

          e.layer.showMeasurements();
          const northEast = e.layer._bounds._northEast;
          const southWest = e.layer._bounds._southWest;
          map.setView({lat: (southWest.lat + northEast.lat) / 2 ,
            lng: (southWest.lng + northEast.lng) / 2}, map.getZoom());
        }
        else {
          map.setView(e.layer._latlng, map.getZoom());
        }
        e.layer.on('pm:edit', (e) =>{
          const featureGroup1 = L.featureGroup().addLayer(e.layer);
          featureGroup1.options.pmIgnore = false;
          L.PM.reInitLayer(featureGroup1);
          const data1 = featureGroup1.toGeoJSON();
          const polygon = polygonReports.get(e.layer._leaflet_id);
          polygon.geometry = data1.features[0]?.geometry
          polygonReports.set(e.layer._leaflet_id, polygon);
          const featureGroup2 = L.featureGroup().addLayer(selectedBeachSegmentVar());
          const data2 = featureGroup2.toGeoJSON();
          if(selectedBeachSegmentVar() && turf.booleanContains(data2.features[0].geometry, data1.features[0].geometry)){
            e.layer.setStyle(myGreenStyle);
          }
          else{
            e.layer.setStyle(myRedStyle);
          }
        });
        setTimeout(() => {
              const featureGroup1 = L.featureGroup().addLayer(e.layer);
              const data1 = featureGroup1.toGeoJSON();
              polygonReports.set(e.layer._leaflet_id, {geometry: data1.features[0].geometry});
              setSelectedPolygon(e.layer);
              const featureGroup2 = L.featureGroup().addLayer(selectedBeachSegmentVar());
              const data2 = featureGroup2.toGeoJSON();
              if(selectedBeachSegmentVar() && turf.booleanContains(data2.features[0].geometry, data1.features[0].geometry)){
                e.layer.setStyle(myGreenStyle);
              }
              else {
                e.layer.setStyle(myRedStyle);
              }
              setOpenTypePickerWindow(true);
        }, 800);
      });

      map.on('pm:remove', (e) => {
        polygonReports.delete(e.layer._leaflet_id);
      });
    }
  }, [map]);

  const reportPolygonsWithinSegment = () => {
    const featureGroup = L.featureGroup().addLayer(selectedBeachSegmentVar());
    const segmentData = featureGroup.toGeoJSON();
    for (const polygon of polygonReports.values()){
      if (!turf.booleanContains(segmentData.features[0].geometry, polygon.geometry)){
        return false;
      }
    }
    return true;
  }
  const AddPollutionReport = async () => {

    if (gvulName === ''){
      setEmptyMunicipal(true);
      return;
    }
    if(!isBeachSegmentSelected){
      setSnackBar('Beach segment must be selected', 'error');
      return;
    }
    if(!reportPolygonsWithinSegment()){
      setSnackBar('All polygon reports must intersect the selected segment', 'error');
      return;
    }
    try {
      if (
        imageUploaderRef.current
      ) {
        // external validation - we validate here because we can't use formik validation
        // pollution type picker is special component
        const { data, errors } = await CreatePollutionReport({
          variables: {
            polygons: [...polygonReports.values()],
            files: imageUploaderRef.current.state.pictures,
            input: {
              pollutionReport:{
                reporter: getAuth().currentUser ? getAuth().currentUser.displayName: "Test",
                reporterImageUrl: getAuth().currentUser? getAuth().currentUser.photoURL: null,
                isRelevant: true,
                photoUrls: [],
                // type: pollutionTypePickerRef.current.state.image.value,
                geom: { "type": "Point", "coordinates": [ location.lng, location.lat ] },
                // length: parseInt(pollutionProportiesRef.current.state.length),
                // width : parseInt(pollutionProportiesRef.current.state.width),
                // depth : parseInt(pollutionProportiesRef.current.state.depth),
                // coverage : parseInt(pollutionProportiesRef.current.state.coverage),
                // cleaningStatus : pollutionProportiesRef.current.state.cleaningStatus,
              }
            }
          },
        });
        if(!errors) {
          imageUploaderRef.current.reset();
          setGvulName('');
          sideBarOpenTabVar('pollution-reports');
          setSnackBar('Pollution report successfully submitted', 'success');

          mainMapVar().setView({lat: location.lat, lng: location.lng}, 17);
          const anchor = document.querySelector(
              '#back-to-top-anchor',
          );
          if (anchor) {
            anchor.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            });
          }
          polygonReports.clear();
          map.eachLayer(function(layer) {
            if (!!layer.toGeoJSON) {
              const geojson = layer.toGeoJSON();
              if(geojson.geometry?.type === 'Polygon'){
                map.removeLayer(layer);
              }
            }
          });

        }
      }
    } catch (err) {
      setSnackBar(err, 'error');
    }
  };

  const onLocationFound = (lng, lat) => {
    setLocationFound(true);
    setLocation({lat: lat, lng: lng})
  }
  const handleBeachSegmentClick = (event, layer) =>{
    if (!isBeachSegmentSelected) {
      if (beachSegmentsLayer) {
        beachSegmentsLayer.removeFrom(map);
      }
      selectedBeachSegmentVar(layer);
      layer.addTo(map);
      isBeachSegmentSelected = true;
    }
    else {
      layer.removeFrom(map);
      beachSegmentsLayer.addTo(map);
      isBeachSegmentSelected = false;
    }

  }

  const onBeachSegmentLayer = (feature, layer) => {
    //bind click
    layer.on({
      click: (e) => {
        handleBeachSegmentClick(e, layer);
      }
    });
  }

  const mutiPolygonToPolygon = (multiPolyGeoJson) => {
    if(multiPolyGeoJson.type === 'MultiPolygon') {
      const [arr] = multiPolyGeoJson.coordinates[0];
      multiPolyGeoJson.coordinates[0] = arr;
      multiPolyGeoJson.type = 'Polygon';
    }
    return multiPolyGeoJson;
  }

  const handleChange = (event) => {
    isBeachSegmentSelected = false;
    setGvulName(event.target.value);
    setEmptyMunicipal(false);
    if (beachSegmentsLayer) {
      beachSegmentsLayer.removeFrom(map);
      if (selectedBeachSegmentVar()) {
        selectedBeachSegmentVar().removeFrom(map);
      }
    }
    const gvul = gvulot.find(g => g.muniHeb === event.target.value);
    const pub_sens = gvul.gvulSensIntersectsByGvulId.nodes.map(({sens}, i) => {
      var myStyle = {
        "color": "#0074d9",
        "weight": 5,
        "opacity": 0.65
      };
      return L.geoJSON(mutiPolygonToPolygon(sens.geom.geojson), {
        style: myStyle,
        pmIgnore: true,
        onEachFeature: onBeachSegmentLayer
      });
    });

    const sensGroup = L.layerGroup(pub_sens);
    beachSegmentsLayer = sensGroup;
    //make the layer active.
    sensGroup.addTo(map);
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 450,
      },
    },
  };
  return (
      <div>
          <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
              <MyLocationMap onLocationFound={onLocationFound}/>
            <FormControl sx={{ m: 1, minWidth: 250 }}>
              <InputLabel id="demo-controlled-open-select-label">Municipal</InputLabel>
                <Select
                    labelId="demo-controlled-open-select-label"
                    id="select-municipal"
                    value={gvulName}
                    label="Municipal"
                    onChange={handleChange}
                    MenuProps={MenuProps}
                >
                  {
                    gvulot?.map((gvul) => {
                      return <MenuItem key={gvul.id} value={gvul.muniHeb}>{gvul.muniHeb}</MenuItem>
                    })
                  }
                </Select>
              {emptyMunicipal && <FormHelperText>This is required!</FormHelperText>}
            </FormControl>
            {Array.from(polygonReports.values()).map((poly) => {
              return <div>{poly.type}</div>
            })}
              <ImageUploaderComp ref={imageUploaderRef}/>
              <LoadingButton
                  onClick={AddPollutionReport}
                  loading={loading}
                  disabled={loading || !locationFound}
                  loadingPosition="start"
                  startIcon={<SaveIcon />}
                  variant="outlined"
              >
                Save
              </LoadingButton>

          </div>
        <PollutionReportPickerModal
            show={openTypePickerWindow}
            handleClose={handlePollutionReportPickerClose}
        />
      </div>
  );
};

export default PollutionForm;
