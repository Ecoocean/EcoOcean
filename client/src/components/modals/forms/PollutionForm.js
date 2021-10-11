import React, { useRef } from "react";
import * as formik from "formik";
import * as yup from "yup";
import { Button, Modal, Form, Spinner } from "react-bootstrap";
import PollutionTypePicker from "./PollutionTypePicker";
import { useMutation } from "@apollo/client";
import { CREATE_POLLUTION_REPORT } from "../../../GraphQL/Mutations";
import { GET_ALL_POLLUTION_REPORTS } from "../../../GraphQL/Queries";
import ImageUploaderComp from "../../reusables/ImageUploaderComp";
import MyLocationMap from "../../map/MyLocationMap";
const PollutionForm = ({show,  handleClose}) => {
  const { Formik } = formik;

  const formRef = useRef(null);
  const pollutionTypePickerRef = useRef(null);
  const locationMapRef = useRef(null);
  const imagePickerRef = useRef(null);

  const schema = yup.object().shape({});
  const [CreatePollutionReport, { loading, error, data }] = useMutation(
    CREATE_POLLUTION_REPORT,
    {
      refetchQueries: [
        GET_ALL_POLLUTION_REPORTS, // DocumentNode object parsed with gql
        "GetAllPollutionReports", // Query name
      ],
    }
  );
  const AddPollutionReport = async () => {
    try {
      if (
        locationMapRef.current &&
        pollutionTypePickerRef.current &&
        imagePickerRef.current
      ) {
        const { data } = await CreatePollutionReport({
          variables: {
            latitude: locationMapRef.current.state.currentLocation.lat,
            longitude: locationMapRef.current.state.currentLocation.lng,
            type: pollutionTypePickerRef.current.state.image.value,
          },
        });
        console.log(data);
        handleClose();
      }
    } catch (e) {
      console.log(error);
    }
  };

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
              <MyLocationMap ref={locationMapRef} />
              <PollutionTypePicker ref={pollutionTypePickerRef} />
              <ImageUploaderComp ref={imagePickerRef} />
            </Modal.Body>
            <Modal.Footer>
              <Button type="submit" variant="primary" disabled={loading}>
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
