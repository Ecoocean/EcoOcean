import React, { useState, useEffect } from "react";
import { Row, Col, Container, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../reusables/Loader";
import Message from "../reusables/Message";
import { updateUserPassword } from "../../actions/userActions";
import { USER_UPDATE_PASSWORD_RESET } from "../../constants/userConstants";

const ChangePasswordScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [oldPassword, setOldPassword] = useState("");

  const userPasswordUpdate = useSelector((state) => state.userPasswordUpdate);
  const { error, success, loading } = userPasswordUpdate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const [message, setMessage] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch({
      type: USER_UPDATE_PASSWORD_RESET,
    });
    if (oldPassword.length === 0) {
      setMessage("אנא הקלד/י את סיסמתך הישנה");
    } else if (password.length === 0) {
      setMessage("הסיסמה לא יכולה להיות ריקה");
    } else if (password !== passwordConfirm) {
      setMessage("הסיסמאות אינן תואמות");
    } else {
      setMessage("");
      dispatch(updateUserPassword(oldPassword, password));
    }
  };

  return (
    <Container className="offset_nav rtl text-right" id="login_screen">
      <Row>
        <Col xs={12}>
          <h1>שינוי סיסמה</h1>
          {success && <Message variant="success" text={success} />}
          {message && <Message variant="danger" text={message} />}
          {error && <Message variant="danger" text={error} />}
          {loading && <Loader />}
          <Form onSubmit={submitHandler}>
            <Form.Group size="lg">
              <Form.Label>סיסמה נוכחית</Form.Label>
              <Form.Control
                type="password"
                id={"old_password_field"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group size="lg">
              <Form.Label>סיסמה חדשה</Form.Label>
              <Form.Control
                type="password"
                id={"new_password_field"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group size="lg">
              <Form.Label>סיסמה חדשה שנית</Form.Label>
              <Form.Control
                type="password"
                id={"new_password_repeat_field"}
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
            </Form.Group>
            <Button block id={"change_password_submit_btn"} size="lg" type="submit">
              עדכון סיסמה
            </Button>
            <Link to="/profile">חזרה לפרופיל</Link>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ChangePasswordScreen;
