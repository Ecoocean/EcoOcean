import React, { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Row, Col, Card, Button, Pagination } from "react-bootstrap";
import { listSubjects } from "../../../actions/forumActions";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../../reusables/Loader";
import Message from "../../reusables/Message";
import Paginate from "../../reusables/Paginate";

const ForumSubjectsScreen = () => {
  const { title, page } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const subjectsList = useSelector((state) => state.subjectsList);
  const { loading, error, subjects, pages } = subjectsList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch(listSubjects(title, page));
  }, [dispatch, listSubjects, page]);

  return (
    <div>
      <Row>
        <Col xs={12}>
          <div className="d-flex justify-content-between">
            <h1>{title}</h1>
            <Button
                id={"new_post_btn"}
              variant="primary"
              onClick={() =>
                userInfo
                  ? navigate(`/forum/new_post/${title}`)
                  : navigate("/login")
              }
            >
              הוספת פוסט
            </Button>
          </div>
        </Col>
      </Row>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variante="danger" text={error} />
      ) : (
        subjects.map((subject) => (
          <Row className="forum_subject_card forum_subject_container" key={subject.id}>
            <Col xs={12}>
              <Card>
                <Card.Body>
                  <Card.Title>{subject.title}</Card.Title>
                  <hr />
                  <Card.Text>נכתב בתאריך {subject.created_at}</Card.Text>
                  <Link to={`/forum/${title}/${subject.id}/1`}>קרא/י עוד</Link>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ))
      )}
      <Row className="forum_subject_card">
        <Col xs={12}>
          <Paginate prefix={`/forum/${title}`} page={page} pages={pages} />
        </Col>
      </Row>
    </div>
  );
};

export default ForumSubjectsScreen;
