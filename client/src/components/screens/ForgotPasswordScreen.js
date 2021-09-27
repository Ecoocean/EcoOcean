import React, { useState, useEffect } from "react";
import { Row, Col, Container, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../reusables/Loader";
import Message from "../reusables/Message";
import { passwordReset } from "../../actions/userActions";
import { validateEmail } from "../reusables/utils";

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");

  const [message, setMessage] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo, error, loading } = userLogin;

  const userPasswordReset = useSelector((state) => state.userPasswordReset);
  const {
    error: errorPassReset,
    success: successPassReset,
    loading: loadingPassReset,
  } = userPasswordReset;

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (email.length === 0) {
      setMessage("חשבון המייל לא יכול להיות ריק");
    } else if (!validateEmail(email)) {
      setMessage("פורמט מייל אינו תקין");
    } else {
      setMessage("");
      dispatch(passwordReset(email));
    }
  };

  return (
    <Container className="offset_nav rtl text-right" id="login_screen">
      <Row>
        <Col xs={12}>
          <h1>איפוס סיסמה</h1>
          {message && <Message variant="danger" text={message} />}
          {successPassReset && (
            <Message variant="success" text={successPassReset} />
          )}
          {error && <Message variant="danger" text={error} />}
          {errorPassReset && <Message variant="danger" text={errorPassReset} />}
          {(loading || loadingPassReset) && <Loader />}
          <Form onSubmit={submitHandler}>
            <Form.Group>
              <Form.Label>מייל</Form.Label>
              <Form.Control
                autoFocus
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Button block size="lg" type="submit">
              איפוס
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPasswordScreen;
