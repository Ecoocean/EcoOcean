import React, { useEffect } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import Loader from "../../reusables/Loader";
import Message from "../../reusables/Message";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { listClusters } from "../../../actions/forumActions";

const ClustersScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const clustersList = useSelector((state) => state.clustersList);
  const { loading, error, clusters } = clustersList;

  useEffect(() => {
    dispatch(listClusters());
  }, [dispatch, listClusters]);

  return (
    <div>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variante="danger" text={error} />
      ) : (
        clusters.map((cluster) => (
          <Row className="mb-3" key={cluster.title}>
            <Col xs={12}>
              <Card>
                <Card.Img
                  variant="top"
                  className="forum_cluster"
                  src={cluster.image_path}
                />
                <Card.Body className="d-flex justify-content-between">
                  <Card.Title>{cluster.title}</Card.Title>
                  <Card.Text>{cluster.description}</Card.Text>
                  <Button
                    variant="primary"
                    onClick={() => navigate(cluster.title + "/1")}
                  >
                    כניסה
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ))
      )}
    </div>
  );
};

export default ClustersScreen;
