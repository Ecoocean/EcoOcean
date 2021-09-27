import {
  FORUM_CLUSTERS_REQUEST,
  FORUM_CLUSTERS_SUCCESS,
  FORUM_CLUSTERS_FAIL,
  FORUM_SUBJECTS_REQUEST,
  FORUM_SUBJECTS_SUCCESS,
  FORUM_SUBJECTS_FAIL,
  FORUM_MESSAGES_REQUEST,
  FORUM_MESSAGES_SUCCESS,
  FORUM_MESSAGES_FAIL,
  FORUM_MESSAGE_ADD_REQUEST,
  FORUM_MESSAGE_ADD_SUCCESS,
  FORUM_MESSAGE_ADD_FAIL,
  FORUM_MESSAGE_EDIT_REQUEST,
  FORUM_MESSAGE_EDIT_SUCCESS,
  FORUM_MESSAGE_EDIT_FAIL,
  FORUM_SUBJECT_ADD_REQUEST,
  FORUM_SUBJECT_ADD_SUCCESS,
  FORUM_SUBJECT_ADD_FAIL,
} from "../constants/forumConstants";

import axios from "axios";
import { API_PREFIX } from "../constants/apiConstants";

export const listClusters = () => async (dispatch) => {
  try {
    dispatch({ type: FORUM_CLUSTERS_REQUEST });
    const { data } = await axios.get(`${API_PREFIX}/cluster/get_clusters`);
    dispatch({ type: FORUM_CLUSTERS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: FORUM_CLUSTERS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listSubjects = (title, page) => async (dispatch) => {
  try {
    dispatch({ type: FORUM_SUBJECTS_REQUEST });
    const { data } = await axios.get(
      `${API_PREFIX}/topics/all/${page}/${title}`
    );
    dispatch({ type: FORUM_SUBJECTS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: FORUM_SUBJECTS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listMessages = (subjectId, page) => async (dispatch) => {
  try {
    dispatch({ type: FORUM_MESSAGES_REQUEST });
    const { data } = await axios.get(
      `${API_PREFIX}/messages/all/${subjectId}/${page}`
    );
    dispatch({ type: FORUM_MESSAGES_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: FORUM_MESSAGES_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const addMessage = (message, topicId, page) => async (
  dispatch,
  getState
) => {
  try {
    dispatch({ type: FORUM_MESSAGE_ADD_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.access_token}`,
      },
    };

    const { data } = await axios.post(
      `${API_PREFIX}/messages/single_message`,
      {
        content: message,
        topic_id: topicId,
      },
      config
    );

    dispatch(listMessages(topicId, page));

    dispatch({ type: FORUM_MESSAGE_ADD_SUCCESS, payload: data.message });
  } catch (error) {
    dispatch({
      type: FORUM_MESSAGE_ADD_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const editMessage = (message, topicId, message_id, page) => async (
  dispatch,
  getState
) => {
  try {
    dispatch({ type: FORUM_MESSAGE_EDIT_REQUEST });

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
      `${API_PREFIX}/messages/single_message`,
      {
        content: message,
        topic_id: topicId,
        id: message_id,
      },
      config
    );

    dispatch(listMessages(topicId, page));

    dispatch({ type: FORUM_MESSAGE_EDIT_SUCCESS, payload: data.message });
  } catch (error) {
    dispatch({
      type: FORUM_MESSAGE_EDIT_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const addSubject = (clusterTitle, subjectTitle, message) => async (
  dispatch,
  getState
) => {
  try {
    dispatch({ type: FORUM_SUBJECT_ADD_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.access_token}`,
      },
    };

    const { data } = await axios.post(
      `${API_PREFIX}/topics/single_topic`,
      {
        cluster_title: clusterTitle,
        title: subjectTitle,
        message: message,
      },
      config
    );
    dispatch({ type: FORUM_SUBJECT_ADD_SUCCESS, payload: data.message });
  } catch (error) {
    dispatch({
      type: FORUM_SUBJECT_ADD_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
