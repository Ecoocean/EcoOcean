import {
  PORTFOLIO_FETCH_REQUEST,
  PORTFOLIO_FETCH_SUCCESS,
  PORTFOLIO_FETCH_FAIL,
  PORTFOLIO_LATEST_LIST_REQUEST,
  PORTFOLIO_LATEST_LIST_SUCCESS,
  PORTFOLIO_LATEST_LIST_FAIL,
} from "../constants/portfolioConstants";

export const portfolioFetchReducer = (state = { portfolio: null }, action) => {
  switch (action.type) {
    case PORTFOLIO_FETCH_REQUEST:
      return { loading: true, portfolio: null };

    case PORTFOLIO_FETCH_SUCCESS:
      return {
        loading: false,
        portfolio: action.payload,
      };

    case PORTFOLIO_FETCH_FAIL:
      return { loading: false, portfolio: null, error: action.payload };

    default:
      return state;
  }
};

export const portfolioLatestListReducer = (
  state = { portfolios: [] },
  action
) => {
  switch (action.type) {
    case PORTFOLIO_LATEST_LIST_REQUEST:
      return { loading: true, portfolio: [] };

    case PORTFOLIO_LATEST_LIST_SUCCESS:
      return {
        loading: false,
        portfolios: action.payload,
      };

    case PORTFOLIO_LATEST_LIST_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};
