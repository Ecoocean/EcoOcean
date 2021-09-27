import React, { useEffect, useState } from "react";
import { Row, Col, Card, Button, Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../../reusables/Loader";
import Message from "../../reusables/Message";

import { getArticle } from "../../../actions/infoCenterActions";

const ArticleScreen = () => {
  const { title, article_id } = useParams();
  const dispatch = useDispatch();

  const articleData = useSelector((state) => state.articleData);
  const { article, loading, error } = articleData;
  useEffect(() => {
    dispatch(getArticle(article_id));
  }, [dispatch, getArticle]);
  return (
    <Container className="offset_nav rtl text-right">
      <h1>{title}</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variante="danger" text={error} />
      ) : (
        <div dangerouslySetInnerHTML={{ __html: article }} />
      )}
    </Container>
  );
};

export default ArticleScreen;
