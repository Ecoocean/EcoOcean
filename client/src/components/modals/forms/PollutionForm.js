import React, { useRef, useState } from "react";
import * as formik from "formik";
import * as yup from "yup";
import { Button, Modal, Form, Spinner } from "react-bootstrap";
import PollutionTypePicker from "./PollutionTypePicker";
import { useMutation } from "@apollo/client";
import { CREATE_POLLUTION_REPORT } from "../../../GraphQL/Mutations";

import ImageUploaderComp from "../../reusables/ImageUploaderComp";
import MyLocationMap from "../../map/MyLocationMap";
import * as firebase from "firebase/app";
import 'firebase/auth';
const PollutionForm = ({show, setSnackBar,  handleClose, }) => {
  const { Formik } = formik;

  const formRef = useRef(null);
  const pollutionTypePickerRef = useRef(null);
  const locationMapRef = useRef(null);
  const imageUploaderRef = useRef(null);
  const [locationFound, setLocationFound] = useState(false);

  const schema = yup.object().shape({});
  const [CreatePollutionReport, { loading, error, data }] = useMutation(CREATE_POLLUTION_REPORT);
  const AddPollutionReport = async () => {
    try {
      if (
        locationMapRef.current &&
        pollutionTypePickerRef.current &&
        imageUploaderRef.current
      ) {
        const { data } = await CreatePollutionReport({
          variables: {
            reporter: firebase.auth().currentUser ? firebase.auth().currentUser.displayName: "Test",
            reporterImageUrl: firebase.auth().currentUser? firebase.auth().currentUser.photoURL: null,
            latitude: locationMapRef.current.state.currentLocation.lat,
            longitude: locationMapRef.current.state.currentLocation.lng,
            type: pollutionTypePickerRef.current.state.image.value,
            files: imageUploaderRef.current.state.pictures
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

  const onLocationFound = () => {
    setLocationFound(true);
  }

  return (
    <Modal show={show} onHide={handleClose} animation={true}>
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
              <MyLocationMap ref={locationMapRef} onLocationFound={onLocationFound} />
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
