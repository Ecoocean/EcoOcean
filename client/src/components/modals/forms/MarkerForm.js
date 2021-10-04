import React, {useRef} from "react";
import * as formik from 'formik';
import * as yup from 'yup';
import { Button, Modal, Form } from "react-bootstrap";
import { useMutation } from '@apollo/client';
import {CREATE_POLLUTION_REPORT} from '../../../GraphQL/Mutations'
const MarkerForm = ({show, handleClose}) => {
  
  const { Formik } = formik;
  const formRef = useRef();

  const schema = yup.object().shape({
    altitude: yup.number().min(-90).max(90).required("Field is Required"),
    longitude: yup.number().min(-180).max(180).required("Field is Required"),
    
  });
  const [CreatePollutionReport, { error }] = useMutation(CREATE_POLLUTION_REPORT);
  const addPollutionReport = () => {
    CreatePollutionReport({
      variables: {
        altitude: parseFloat(formRef.current.values.altitude),
        longitude: parseFloat(formRef.current.values.longitude),
        type: "TRASH"
      }
    });

    if (error) {
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
        altitude: '',
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
        <Modal.Title>Add Marker</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="validationFormik01">
          <Form.Label>Altitude</Form.Label>
          <Form.Control
            className="ltr"
            type="decimal"
            name="altitude"
            value={values.altitude}
            placeholder="Please Enter a Number"
            onChange={handleChange}
            onBlur={handleBlur}
            isValid={!errors.altitude && touched.altitude}
            isInvalid={touched.altitude && errors.altitude}
          />
          <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
          <Form.Control.Feedback type="invalid">
              {errors.altitude}
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
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button type="submit">Submit form</Button>
      </Modal.Footer>
      </Form>
      )}
    </Formik>
    </Modal>
  );
};

export default MarkerForm;
