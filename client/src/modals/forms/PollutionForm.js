import React, {useEffect, useRef, useState} from "react";
import * as formik from "formik";
import * as yup from "yup";
import L from 'leaflet';
import {useMutation, useReactiveVar} from "@apollo/client";
import {CREATE_POLLUTION_REPORT} from "../../GraphQL/Mutations";
import {setSnackBar} from "../../SnackBarUtils"
import ImageUploaderComp from "../../ImageUploaderComp";
import MyLocationMap from "../../MyLocationMap.js";
import * as firebase from "firebase/app";
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import {locationMapVar, mainMapVar} from "../../cache";
import 'firebase/auth';
import {sideBarOpenTabVar} from "../../cache";
import PollutionReportPickerModal  from "../PollutionReportPickerModal";
import {polygonColors} from "../../PolygonColors";
import '../../leaflet-measure-path.js';
import '../../leaflet-measure-path.css';


const PollutionForm = ({ openTab }) => {
  const { Formik } = formik;
  const map = useReactiveVar(locationMapVar);
  const formRef = useRef(null);
  const imageUploaderRef = useRef(null);
  const [locationFound, setLocationFound] = useState(false);
  const [openTypePickerWindow, setOpenTypePickerWindow] = useState(false);
  const [selectedPolygon, setSelectedPolygon] = useState(null);
  const [location, setLocation] = useState();
  const [polygonReports, setPolygonReports] = useState(new Map());



  const handlePollutionReportPickerClose = (value) => {
    const myStyle = {
      "color": polygonColors[value],
      "weight": 5,
      "opacity": 0.65
    };
    selectedPolygon.bindPopup(value).openPopup();
    selectedPolygon.setStyle(myStyle);
    const polygon = polygonReports.get(selectedPolygon._leaflet_id);
    polygon.type = value;
    updateItemInMap(selectedPolygon._leaflet_id, polygon);
    setOpenTypePickerWindow(false);
  };

  const updateItemInMap = (key, value) => {
    setPolygonReports(map => new Map(map.set(key, value)));
  }
  const deleteItemInMap = (key) => {
    setPolygonReports(map => {
      map.delete(key);
      return new Map(map);
    });
  }

  const schema = yup.object().shape({});
  const [CreatePollutionReport, { loading }] = useMutation(CREATE_POLLUTION_REPORT);

  useEffect(() =>{
    if(map) {
      map.on('pm:create', (e) => {
        e.layer.showMeasurements();
        const northEast = e.layer._bounds._northEast;
        const southWest = e.layer._bounds._southWest;
        map.setView({lat: (southWest.lat + northEast.lat) / 2 ,
          lng: (southWest.lng + northEast.lng) / 2}, map.getZoom());
        e.layer.on('pm:edit', (e) =>{
          const featureGroup = L.featureGroup().addLayer(e.layer);
          const data = featureGroup.toGeoJSON();
          const polygon = polygonReports.get(e.layer._leaflet_id);
          polygon.geometry = data.features[0].geometry
          updateItemInMap(e.layer._leaflet_id, polygon);
        });
        setTimeout(() => {
              const featureGroup = L.featureGroup().addLayer(e.layer);
              const data = featureGroup.toGeoJSON();
              updateItemInMap(e.layer._leaflet_id, {geometry: data.features[0].geometry});
              setSelectedPolygon(e.layer);
              setOpenTypePickerWindow(true);
        }, 800);
      });

      map.on('pm:remove', (e) => {
        deleteItemInMap(e.layer._leaflet_id);
      });
    }
  }, [map])
  const AddPollutionReport = async () => {
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
                reporter: firebase.auth().currentUser ? firebase.auth().currentUser.displayName: "Test",
                reporterImageUrl: firebase.auth().currentUser? firebase.auth().currentUser.photoURL: null,
                isRelevant: true,
                photoUrls: [],
                geom: { "type": "Point", "coordinates": [ location.lng, location.lat ] }
              }
            }
          },
        });
        if(!errors) {
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

  return (
      <div>
            <Formik
                innerRef={formRef}
                validateOnBlur={true}
                validateOnChange={true}
                validationSchema={schema}
                onSubmit={AddPollutionReport}
                initialValues={{}}
            >
              {({
                  handleSubmit,
                  handleChange,
                  handleBlur,
                  values,
                  touched,
                  isValid,
                  errors,
                }) => (
                  <div>
                      <MyLocationMap onLocationFound={onLocationFound}/>
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
              )}
            </Formik>
        <PollutionReportPickerModal
            show={openTypePickerWindow}
            handleClose={handlePollutionReportPickerClose}
        />
      </div>
  );
};

export default PollutionForm;
