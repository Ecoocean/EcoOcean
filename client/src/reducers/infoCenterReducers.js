import {
  INFO_CENTER_ARTICLES_LIST_REQUEST,
  INFO_CENTER_ARTICLES_LIST_SUCCESS,
  INFO_CENTER_ARTICLES_LIST_FAIL,
  INFO_CENTER_ARTICLE_GET_REQUEST,
  INFO_CENTER_ARTICLE_GET_SUCCESS,
  INFO_CENTER_ARTICLE_GET_FAIL,
} from "../constants/infoCenterConstants";

export const articlesListReducer = (state = { articles: [] }, action) => {
  switch (action.type) {
    case INFO_CENTER_ARTICLES_LIST_REQUEST:
      return { loading: true, articles: [] };

    case INFO_CENTER_ARTICLES_LIST_SUCCESS:
      return {
        loading: false,
        articles: action.payload.articles,
      };

    case INFO_CENTER_ARTICLES_LIST_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const articleReducer = (state = { article: null }, action) => {
  switch (action.type) {
    case INFO_CENTER_ARTICLE_GET_REQUEST:
      return { loading: true, articles: null };

    case INFO_CENTER_ARTICLE_GET_SUCCESS:
      return {
        loading: false,
        article: action.payload,
      };

    case INFO_CENTER_ARTICLE_GET_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};
