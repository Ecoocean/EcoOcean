import React, { useEffect, useState } from "react";
import { Row, Col, Card, Button, Form } from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import { addSubject } from "../../../actions/forumActions";
import { useSelector, useDispatch } from "react-redux";
import RichEditor from "../../reusables/RichEditor";
import Loader from "../../reusables/Loader";
import Message from "../../reusables/Message";

const NewPostScreen = () => {
  const { title } = useParams();
  const [subjectTitle, setSubjectTitle] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
  }, [navigate, userInfo]);

  const subjectAdd = useSelector((state) => state.subjectAdd);
  const { loading, success, error } = subjectAdd;

  let submitData = (message) => {
    dispatch(addSubject(title, subjectTitle, message));
  };

  let getData = null;

  const getCallback = (getDataCallback) => {
    getData = getDataCallback;
  };

  return (
    <div>
      <Row>
        <Col xs={12}>
          <h1>{title}</h1>
        </Col>
      </Row>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variante="danger" text={error} />
      ) : (
        <Row className="forum_subject_card">
          <Col xs={12}>
            <Card>
              <Card.Body>
                <Form>
                  <Form.Group controlId="email">
                    <Form.Label>כותרת הפוסט</Form.Label>
                    <Form.Control
                      autoFocus
                      id={"new_post_title"}
                      type="text"
                      value={subjectTitle}
                      onChange={(e) => setSubjectTitle(e.target.value)}
                    />
                  </Form.Group>
                  <hr />
                  <RichEditor title={title} getCallback={getCallback} />
                  <hr />
                  <Button
                    block
                    size="lg"
                    type="submit"
                    variant="primary"
                    id={"new_post_submit_btn"}
                    onClick={() => getData && submitData(getData())}
                  >
                    הוספת פוסט
                  </Button>
                  {success && <Message variant="success" text={success} />}
                  <p className="mt-4">
                    <Link to={`/forum/${title}/1`}>חזרה לפורום</Link>
                  </p>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default NewPostScreen;
