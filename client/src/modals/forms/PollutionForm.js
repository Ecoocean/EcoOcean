import React, { useRef, useState } from "react";
import * as formik from "formik";
import * as yup from "yup";
import { Button, Modal, Form, Spinner } from "react-bootstrap";
import PollutionTypePicker from "./PollutionTypePicker";
import { useMutation } from "@apollo/client";
import { CREATE_POLLUTION_REPORT } from "../../GraphQL/Mutations";
import {setSnackBar} from "../../SnackBarUtils"
import ImageUploaderComp from "../../ImageUploaderComp";
import MyLocationMap from "../../MyLocationMap.js";
import * as firebase from "firebase/app";

import 'firebase/auth';
import {sideBarCollapsedVar} from "../../cache";
const PollutionForm = ({ openTab }) => {
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
        sideBarCollapsedVar(false);
        setSnackBar('Pollution report sucssefully submitted', 'success');
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
        {openTab === 'add-report' ?
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
                    <Modal.Body>
                      <MyLocationMap onLocationFound={onLocationFound}/>
                      <PollutionTypePicker ref={pollutionTypePickerRef}/>
                      <ImageUploaderComp ref={imageUploaderRef}/>
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
                    </Modal.Footer>
                  </Form>
              )}
            </Formik> : null
        }
      </div>
  );
};

export default PollutionForm;
