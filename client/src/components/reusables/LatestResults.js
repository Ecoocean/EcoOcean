import React, { useEffect } from "react";
import { Table, Container, Row, Col, Button } from "react-bootstrap";

import Loader from "./Loader";
import Message from "./Message";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { listPortfolioLatest } from "../../actions/portfolioActions";

const LatestResults = ({ byUser = null }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  console.log(location);
  const portfolioLatestList = useSelector((state) => state.portfolioLatestList);
  const { loading, error, portfolios } = portfolioLatestList;

  useEffect(() => {
    dispatch(listPortfolioLatest(byUser));
  }, [dispatch, listPortfolioLatest]);

  return (
    <div>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variante="danger" text={error} />
      ) : (
        <Container className="offset_nav rtl text-right">
          <h2>תוצאות הרצה אחרונות</h2>
          {location.pathname !== "/" && (
            <div>
              <p>
                אם בצעת איזון מחדש לתיק מסויים הוא יופיע בעמוד זה בדקות הקרובות,
                לרענון השתמש/י בכפתור רענון
              </p>
              <Button
                block
                id={"refresh_latest_results"}
                size="sm"
                onClick={() => dispatch(listPortfolioLatest(byUser))}
              >
                רענון
              </Button>
            </div>
          )}
          <Row>
            <Col xs={12}>
              <Table striped bordered hover id={"latest_results_table"}>
                <thead>
                  <tr>
                    <th>שם המודל</th>
                    <th>תאריך</th>
                    <th>לינק</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolios.map((x, i) => (
                    <tr key={i}>
                      <td>{x.algorithm}</td>
                      <td>{x.date_time}</td>
                      <td>
                        <Link to={`/portfolio/${x.link}`}>{x.link}</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>
      )}
    </div>
  );
};

export default LatestResults;
