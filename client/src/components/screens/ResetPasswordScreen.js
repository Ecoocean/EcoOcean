import React, { useState, useEffect } from "react";
import { Row, Col, Container, Form, Button } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../reusables/Loader";
import Message from "../reusables/Message";
import { passwordResetByCode } from "../../actions/userActions";

const ResetPasswordScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { reset_code } = useParams();

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const userPasswordNewByReset = useSelector(
    (state) => state.userPasswordNewByReset
  );
  const { error, success, loading } = userPasswordNewByReset;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const [message, setMessage] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    if (password.length === 0) {
      setMessage("אנא הקלד/י את סיסמתך החדשה");
    } else if (password.length === 0) {
      setMessage("הסיסמה לא יכולה להיות ריקה");
    } else if (password !== passwordConfirm) {
      setMessage("הסיסמאות אינן תואמות");
    } else {
      setMessage("");
      dispatch(passwordResetByCode(reset_code, password));
    }
  };

  return (
    <Container className="offset_nav rtl text-right" id="login_screen">
      <Row>
        <Col xs={12}>
          <h1>איפוס סיסמא</h1>
          {success && <Message variant="success" text={success} />}
          {message && <Message variant="danger" text={message} />}
          {error && <Message variant="danger" text={error} />}
          {loading && <Loader />}
          <Form onSubmit={submitHandler}>
            <Form.Group size="lg" controlId="password">
              <Form.Label>סיסמה חדשה</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group size="lg" controlId="password_confirm">
              <Form.Label>סיסמה חדשה שנית</Form.Label>
              <Form.Control
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
            </Form.Group>
            <Button block size="lg" type="submit">
              עדכון סיסמה
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ResetPasswordScreen;
