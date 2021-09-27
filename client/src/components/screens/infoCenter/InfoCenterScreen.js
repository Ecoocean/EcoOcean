import React, { useEffect } from "react";
import { Row, Col, Card, Button, Container } from "react-bootstrap";
import Loader from "../../reusables/Loader";
import Message from "../../reusables/Message";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { listArticles } from "../../../actions/infoCenterActions";

const InfoCenterScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const articlesList = useSelector((state) => state.articlesList);
  const { loading, error, articles } = articlesList;
  useEffect(() => {
    dispatch(listArticles());
  }, [dispatch, listArticles]);

  return (
    <Container className="offset_nav rtl text-right">
      <h2>מאמרים</h2>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variante="danger" text={error} />
      ) : (
        articles.map((article) => (
          <Row className="mb-3" key={article.id}>
            <Col xs={12}>
              <Card>
                {/* <Card.Img
                  variant="top"
                  className="forum_cluster"
                  src={cluster.image_path}
                /> */}
                <Card.Body className="d-flex justify-content-between">
                  <Card.Title>{article.title}</Card.Title>
                  <Card.Text>{article.description}</Card.Text>
                  <Button
                    variant="primary"
                    onClick={() => navigate(article.title + "/" + article.id)}
                  >
                    כניסה
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ))
      )}
    </Container>
  );
};

export default InfoCenterScreen;
