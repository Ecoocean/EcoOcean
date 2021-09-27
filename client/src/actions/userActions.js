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
  USER_PASSWORD_NEW_BY_RESET_SUCCESS,
} from "../constants/userConstants";

import { API_PREFIX } from "../constants/apiConstants";

import axios from "axios";

export const logout = () => (dispatch) => {
  localStorage.clear();
  dispatch({
    type: USER_LOGOUT,
  });
};

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({
      type: USER_LOGIN_REQUEST,
    });
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.post(
      `${API_PREFIX}/members/login`,
      { email: email, password: password },
      config
    );

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });

    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    console.log(error.response);
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateUserProfile = (user) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_UPDATE_PROFILE_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.access_token}`,
      },
    };

    const { data } = await axios.put(
      `${API_PREFIX}/members/update_name`,
      user,
      config
    );

    dispatch({
      type: USER_UPDATE_PROFILE_SUCCESS,
      payload: data.message,
    });

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: Object.assign(userInfo, user),
    });

    localStorage.setItem("userInfo", JSON.stringify({ ...userInfo, user }));
  } catch (error) {
    dispatch({
      type: USER_UPDATE_PROFILE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateUserPassword = (oldPass, newPass) => async (
  dispatch,
  getState
) => {
  try {
    dispatch({
      type: USER_UPDATE_PASSWORD_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.access_token}`,
      },
    };

    const { data } = await axios.put(
      `${API_PREFIX}/members/update_password`,
      {
        password: oldPass,
        new_password: newPass,
      },
      config
    );

    dispatch({
      type: USER_UPDATE_PASSWORD_SUCCESS,
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: USER_UPDATE_PASSWORD_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const register = (name, surname, email, password, dateOfBirth) => async (
  dispatch
) => {
  try {
    dispatch({
      type: USER_REGISTER_REQUEST,
    });
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.post(
      `${API_PREFIX}/users/register`,
      {
        first_name: name,
        last_name: surname,
        email: email,
        password: password,
        date_of_birth: dateOfBirth,
      },
      config
    );
    dispatch({
      type: USER_REGISTER_SUCCESS,
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const passwordReset = (email) => async (dispatch) => {
  try {
    dispatch({
      type: USER_PASSWORD_RESET_REQUEST,
    });
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.post(
      `${API_PREFIX}/reset_password/request`,
      { email: email },
      config
    );

    dispatch({
      type: USER_PASSWORD_RESET_SUCCESS,
      payload: data.message,
    });
  } catch (error) {
    console.log(error.response);
    dispatch({
      type: USER_PASSWORD_RESET_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const passwordResetByCode = (resetCode, password) => async (
  dispatch
) => {
  try {
    dispatch({
      type: USER_PASSWORD_NEW_BY_RESET_REQUEST,
    });
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.put(
      `${API_PREFIX}/reset_password/set_new_password`,
      { id: resetCode, new_password: password },
      config
    );

    dispatch({
      type: USER_PASSWORD_NEW_BY_RESET_SUCCESS,
      payload: data.message,
    });
  } catch (error) {
    console.log(error.response);
    dispatch({
      type: USER_PASSWORD_NEW_BY_RESET_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
