import {
  PORTFOLIO_FETCH_REQUEST,
  PORTFOLIO_FETCH_SUCCESS,
  PORTFOLIO_FETCH_FAIL,
  PORTFOLIO_LATEST_LIST_REQUEST,
  PORTFOLIO_LATEST_LIST_SUCCESS,
  PORTFOLIO_LATEST_LIST_FAIL,
} from "../constants/portfolioConstants";

import { API_PREFIX } from "../constants/apiConstants";

import axios from "axios";

export const portfolioFetch = (link) => async (dispatch) => {
  try {
    dispatch({ type: PORTFOLIO_FETCH_REQUEST });
    const { data } = await axios.get(
      `${API_PREFIX}/portfolios/get_portfolio_by_algorithm/${link}/`
    );
    dispatch({ type: PORTFOLIO_FETCH_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PORTFOLIO_FETCH_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listPortfolioLatest = (byUser) => async (dispatch) => {
  try {
    dispatch({ type: PORTFOLIO_LATEST_LIST_REQUEST });
    if (byUser) {
      console.log(byUser);
      const { data } = await axios.get(
        `${API_PREFIX}/recent_results/get_by_user/${byUser}`
      );
      dispatch({ type: PORTFOLIO_LATEST_LIST_SUCCESS, payload: data });
    } else {
      const { data } = await axios.get(`${API_PREFIX}/recent_results/get_all`);
      dispatch({ type: PORTFOLIO_LATEST_LIST_SUCCESS, payload: data });
    }
  } catch (error) {
    dispatch({
      type: PORTFOLIO_LATEST_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
