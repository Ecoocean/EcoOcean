import {
  INFO_CENTER_ARTICLES_LIST_REQUEST,
  INFO_CENTER_ARTICLES_LIST_SUCCESS,
  INFO_CENTER_ARTICLES_LIST_FAIL,
  INFO_CENTER_ARTICLE_GET_REQUEST,
  INFO_CENTER_ARTICLE_GET_SUCCESS,
  INFO_CENTER_ARTICLE_GET_FAIL,
} from "../constants/infoCenterConstants";

import axios from "axios";
import { API_PREFIX } from "../constants/apiConstants";

export const listArticles = () => async (dispatch) => {
  try {
    dispatch({ type: INFO_CENTER_ARTICLES_LIST_REQUEST });
    const { data } = await axios.get(`${API_PREFIX}/articles/get_articles`);
    dispatch({ type: INFO_CENTER_ARTICLES_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: INFO_CENTER_ARTICLES_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getArticle = (article_id) => async (dispatch) => {
  try {
    dispatch({ type: INFO_CENTER_ARTICLE_GET_REQUEST });
    const { data } = await axios.get(
      `${API_PREFIX}/articles/get_article/${article_id}`
    );
    dispatch({ type: INFO_CENTER_ARTICLE_GET_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: INFO_CENTER_ARTICLE_GET_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
