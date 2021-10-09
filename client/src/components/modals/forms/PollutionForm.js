import React, {useRef} from "react";
import * as formik from 'formik';
import * as yup from 'yup';
import { Button, Modal, Form, Spinner } from "react-bootstrap";
import PollutionTypePicker from './PollutionTypePicker'
import { useMutation } from '@apollo/client';
import {CREATE_POLLUTION_REPORT} from '../../../GraphQL/Mutations'
import {GET_ALL_POLLUTION_REPORTS} from '../../../GraphQL/Queries'
import ImagePreview from './../../reusables/ImagePreview'
const PollutionForm = ({show, handleClose}) => {
  
  const { Formik } = formik;

  const formRef = useRef();
  const imagePickerRef = useRef();

  const schema = yup.object().shape({
    latitude: yup.number().min(-90).max(90).required("Field is Required"),
    longitude: yup.number().min(-180).max(180).required("Field is Required"),
    
  });
  const [CreatePollutionReport, { loading, error, data }] = useMutation(CREATE_POLLUTION_REPORT, {
    refetchQueries: [
      GET_ALL_POLLUTION_REPORTS, // DocumentNode object parsed with gql
      'GetAllPollutionReports' // Query name
    ],
  });
  const addPollutionReport = async () => {
    try {
      const { data } = await CreatePollutionReport({
        variables: {
          latitude: parseFloat(formRef.current.values.latitude),
          longitude: parseFloat(formRef.current.values.longitude),
          type: imagePickerRef.current.state.image.value
        }
      })
      console.log(data)
      handleClose();
    }
    catch (e) {
      console.log(error);
    }
  }

  return (
    <Modal show={show} onHide={handleClose} animation={true}>
      <Formik
      innerRef={formRef}
      validateOnBlur={true}
      validateOnChange={true}
      validationSchema={schema}
      onSubmit={addPollutionReport}
      initialValues={{
        latitude: '',
        longitude: '',
      }}
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
        <Form.Group controlId="validationFormik01">
          <Form.Label>Latitude</Form.Label>
          <Form.Control
            className="ltr"
            type="decimal"
            name="latitude"
            value={values.latitude}
            placeholder="Please Enter a Number"
            onChange={handleChange}
            onBlur={handleBlur}
            isValid={!errors.latitude && touched.latitude}
            isInvalid={touched.latitude && errors.latitude}
          />
          <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
          <Form.Control.Feedback type="invalid">
              {errors.latitude}
          </Form.Control.Feedback>
          
        </Form.Group>
        <Form.Group controlId="validationFormik02">
          <Form.Label>Longitude</Form.Label>
          <Form.Control
            className="ltr"
            type="decimal"
            name="longitude"
            value={values.longitude}
            placeholder="Please Enter a Number"
            onChange={handleChange}
            onBlur={handleBlur}
            isValid={touched.longitude && !errors.longitude}
            isInvalid={touched.longitude && errors.longitude}
          />
          <Form.Control.Feedback type="invalid">
            {errors.longitude}
          </Form.Control.Feedback>
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <PollutionTypePicker ref={imagePickerRef} />
        <ImagePreview />
      </Modal.Body>
      <Modal.Footer>
      <Button type="submit" variant="primary" disabled={loading}>
      {loading && <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
        />}
        {loading? "" : "Sumbit"}
      </Button>
        <Button variant="secondary" onClick={handleClose} >
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
