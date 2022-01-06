import React, {useEffect, useRef, useState} from "react";
import * as formik from "formik";
import * as yup from "yup";
import L from 'leaflet';
import PollutionTypePicker from "./PollutionTypePicker";
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


const PollutionForm = ({ openTab }) => {
  const { Formik } = formik;
  const map = useReactiveVar(locationMapVar);
  const formRef = useRef(null);
  const pollutionTypePickerRef = useRef(null);
  const imageUploaderRef = useRef(null);
  const [locationFound, setLocationFound] = useState(false);
  const [location, setLocation] = useState();
  const [polygonReports, setPolygonReports] = useState(new Map());

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
        const northEast = e.layer._bounds._northEast;
        const southWest = e.layer._bounds._southWest;
        map.setView({lat: (southWest.lat + northEast.lat) / 2 ,
          lng: (southWest.lng + northEast.lng) / 2}, map.getZoom());
        e.layer.on('pm:edit', (e) =>{
          const featureGroup = L.featureGroup().addLayer(e.layer);
          const data = featureGroup.toGeoJSON();
          updateItemInMap(e.layer._leaflet_id, data.features[0].geometry);
        });
        const featureGroup = L.featureGroup().addLayer(e.layer);
        const data = featureGroup.toGeoJSON();
        updateItemInMap(e.layer._leaflet_id, data.features[0].geometry);
        e.layer.bindPopup('<h1>'+ "choose pollution type" + '</h1>', {
          keepInView: true,
          closeOnClick: false,
          autoClose: false,
          closeButton: false
        }
        ).openPopup();
      });

      map.on('pm:remove', (e) => {
        console.log("deleted!!");
        deleteItemInMap(e.layer._leaflet_id);
      });
    }
  }, [map])
  const AddPollutionReport = async () => {
    try {
      if (
        pollutionTypePickerRef.current &&
        imageUploaderRef.current
      ) {
        // external validation - we validate here because we can't use formik validation
        // pollution type picker is special component
        if(!pollutionTypePickerRef.current.state.image.value){
          setSnackBar('Pollution type must be selected', 'error');
          return
        }
        const { data, errors } = await CreatePollutionReport({
          variables: {
            geometries: [...polygonReports.values()],
            files: imageUploaderRef.current.state.pictures,
            input: {
              pollutionReport:{
                reporter: firebase.auth().currentUser ? firebase.auth().currentUser.displayName: "Test",
                reporterImageUrl: firebase.auth().currentUser? firebase.auth().currentUser.photoURL: null,
                isRelevant: true,
                photoUrls: [],
                type: pollutionTypePickerRef.current.state.image.value,
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
                      <PollutionTypePicker ref={pollutionTypePickerRef}/>
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
      </div>
  );
};

export default PollutionForm;
