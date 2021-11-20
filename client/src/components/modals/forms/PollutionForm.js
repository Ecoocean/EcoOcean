import React, { useRef, useState } from "react";
import * as formik from "formik";
import * as yup from "yup";
import { Button, Modal, Form, Spinner } from "react-bootstrap";
import PollutionTypePicker from "./PollutionTypePicker";
import { useMutation } from "@apollo/client";
import { CREATE_POLLUTION_REPORT } from "../../../GraphQL/Mutations";
import {setSnackBar} from "../../../SnackBarUtils"
import ImageUploaderComp from "../../reusables/ImageUploaderComp";
import MyLocationMap from "../../map/MyLocationMap.js";
import * as firebase from "firebase/app";

import 'firebase/auth';
const PollutionForm = ({show, handleClose, }) => {
  const { Formik } = formik;

  const formRef = useRef(null);
  const pollutionTypePickerRef = useRef(null);
  const imageUploaderRef = useRef(null);
  const [locationFound, setLocationFound] = useState(false);
  const [location, setLocation] = useState();

  const schema = yup.object().shape({});
  const [CreatePollutionReport, { loading, error, data }] = useMutation(CREATE_POLLUTION_REPORT);
  const AddPollutionReport = async () => {
    try {
      if (
        pollutionTypePickerRef.current &&
        imageUploaderRef.current
      ) {
        // exteranl validation - we validate here because we can't use formik validation
        // pollution type picker is special component
        if(!pollutionTypePickerRef.current.state.image.value){
          setSnackBar('Pollution type must be selected', 'error');
          return
        }
        const { data } = await CreatePollutionReport({
          variables: {
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
        setSnackBar('Pollution report sucssefully submitted', 'success');
        handleClose();
      }
    } catch (err) {
      setSnackBar(err, 'error');
      handleClose();
    }
  };

  const onLocationFound = (lng, lat) => {
    setLocationFound(true);
    setLocation({lat: lat, lng: lng})
  }

  return (
    <Modal show={show} size="lg" onHide={handleClose} animation={true}>
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
          <Form onSubmit={handleSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>Add Pollution Report</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <MyLocationMap onLocationFound={onLocationFound} />
              <PollutionTypePicker ref={pollutionTypePickerRef} />
              <ImageUploaderComp ref={imageUploaderRef} />
            </Modal.Body>
            <Modal.Footer>
              <Button type="submit" variant="primary" disabled={loading || !locationFound}>
                {loading && (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                )}
                {loading ? "" : "Sumbit"}
              </Button>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default PollutionForm;
