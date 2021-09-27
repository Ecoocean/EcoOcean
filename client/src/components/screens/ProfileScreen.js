import React, { useState, useEffect } from "react";
import { Row, Col, Container, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../reusables/Loader";
import Message from "../reusables/Message";
import { updateUserProfile } from "../../actions/userActions";
import { USER_UPDATE_PROFILE_RESET } from "../../constants/userConstants";

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userProfileUpdate = useSelector((state) => state.userProfileUpdate);
  const { error, success, loading } = userProfileUpdate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const [name, setName] = useState(userInfo ? userInfo.first_name : "");
  const [surname, setSurname] = useState(userInfo ? userInfo.last_name : "");

  const [message, setMessage] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch({
      type: USER_UPDATE_PROFILE_RESET,
    });
    if (name.length === 0) {
      setMessage("השם לא יכול להיות ריק");
    } else if (surname.length === 0) {
      setMessage("שם המשפחה לא יכול להיות ריק");
    } else {
      setMessage("");
      dispatch(
        updateUserProfile({
          first_name: name,
          last_name: surname,
        })
      );
    }
  };

  return (
    <Container className="offset_nav rtl text-right" id="login_screen">
      <Row>
        <Col xs={12}>
          <h1>פרופיל</h1>
          {success && <Message variant="success" text={success} />}
          {message && <Message variant="danger" text={message} />}
          {error && <Message variant="danger" text={error} />}
          {loading && <Loader />}
          <Form onSubmit={submitHandler}>
            <Form.Group size="lg">
              <Form.Label>שם</Form.Label>
              <Form.Control
                type="text"
                id={"first_name_field"}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group size="lg">
              <Form.Label>שם משפחה</Form.Label>
              <Form.Control
                type="text"
                id={"last_name_field"}
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
              />
            </Form.Group>
            <Button id={"edit_profile_submit_btn"} block size="lg" type="submit">
              עדכון פרופיל
            </Button>
            <p className="mt-4">
              <Link id={"change_password_page_nav"} to="/change_password">שינוי סיסמה</Link>
            </p>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfileScreen;
