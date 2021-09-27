import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_FAIL,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_REGISTER_REQUEST,
  USER_REGISTER_FAIL,
  USER_REGISTER_SUCCESS,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_RESET,
  USER_UPDATE_PASSWORD_SUCCESS,
  USER_UPDATE_PASSWORD_FAIL,
  USER_UPDATE_PASSWORD_REQUEST,
  USER_UPDATE_PASSWORD_RESET,
  USER_PASSWORD_RESET_REQUEST,
  USER_PASSWORD_RESET_FAIL,
  USER_PASSWORD_RESET_SUCCESS,
  USER_PASSWORD_NEW_BY_RESET_REQUEST,
  USER_PASSWORD_NEW_BY_RESET_FAIL,
  USER_PASSWORD_NEW_BY_RESET_SUCCESS, USER_REGISTER_RESET, USER_LOGIN_RESET,
} from "../constants/userConstants";

export const userLoginReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return { loading: true };

    case USER_LOGIN_SUCCESS:
      return { loading: false, userInfo: action.payload };

    case USER_LOGIN_FAIL:
      return { loading: false, error: action.payload };

    case USER_LOGIN_RESET:
      return {}

    case USER_LOGOUT:
      return {};

    default:
      return state;
  }
};

export const userRegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_REGISTER_REQUEST:
      return { loading: true };

    case USER_REGISTER_SUCCESS:
      return { loading: false, success: action.payload };

    case USER_REGISTER_FAIL:
      return { loading: false, error: action.payload };

    case USER_REGISTER_RESET:
      return {};

    case USER_LOGOUT:
      return {};

    default:
      return state;
  }
};

export const userPasswordResetReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_PASSWORD_RESET_REQUEST:
      return { loading: true };

    case USER_PASSWORD_RESET_SUCCESS:
      return { loading: false, success: action.payload };

    case USER_PASSWORD_RESET_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const userPasswordNewByResetReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_PASSWORD_NEW_BY_RESET_REQUEST:
      return { loading: true };

    case USER_PASSWORD_NEW_BY_RESET_SUCCESS:
      return { loading: false, success: action.payload };

    case USER_PASSWORD_NEW_BY_RESET_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const userProfileUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_UPDATE_PROFILE_REQUEST:
      return { loading: true };

    case USER_UPDATE_PROFILE_SUCCESS:
      return { loading: false, success: action.payload };

    case USER_UPDATE_PROFILE_FAIL:
      return { loading: false, error: action.payload };

    case USER_UPDATE_PROFILE_RESET:
      return {};

    default:
      return state;
  }
};

export const userPasswordUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_UPDATE_PASSWORD_REQUEST:
      return { loading: true };

    case USER_UPDATE_PASSWORD_SUCCESS:
      return { loading: false, success: action.payload };

    case USER_UPDATE_PASSWORD_FAIL:
      return { loading: false, error: action.payload };

    case USER_UPDATE_PASSWORD_RESET:
      return {};

    default:
      return state;
  }
};
