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
  FORUM_MESSAGE_ADD_RESET,
  FORUM_MESSAGE_EDIT_REQUEST,
  FORUM_MESSAGE_EDIT_SUCCESS,
  FORUM_MESSAGE_EDIT_FAIL,
  FORUM_MESSAGE_EDIT_RESET,
  FORUM_SUBJECT_ADD_REQUEST,
  FORUM_SUBJECT_ADD_SUCCESS,
  FORUM_SUBJECT_ADD_FAIL,
  FORUM_SUBJECT_ADD_RESET,
} from "../constants/forumConstants";

export const clustersListReducer = (state = { clusters: [] }, action) => {
  switch (action.type) {
    case FORUM_CLUSTERS_REQUEST:
      return { loading: true, clusters: [] };

    case FORUM_CLUSTERS_SUCCESS:
      return {
        loading: false,
        clusters: action.payload.clusters,
      };

    case FORUM_CLUSTERS_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const subjectsListReducer = (state = { subjects: [] }, action) => {
  switch (action.type) {
    case FORUM_SUBJECTS_REQUEST:
      return { loading: true, subjects: [] };

    case FORUM_SUBJECTS_SUCCESS:
      return {
        loading: false,
        subjects: action.payload.datas,
        page: action.payload.current_page,
        pages: Math.ceil(
          Number(action.payload.total / action.payload.per_page)
        ),
      };

    case FORUM_SUBJECTS_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const messagesListReducer = (state = { messages: [] }, action) => {
  switch (action.type) {
    case FORUM_MESSAGES_REQUEST:
      return { loading: true, messages: [] };

    case FORUM_MESSAGES_SUCCESS:
      return {
        loading: false,
        messages: action.payload.datas,
        page: action.payload.current_page,
        pages: Math.ceil(
          Number(action.payload.total / action.payload.per_page)
        ),
      };

    case FORUM_MESSAGES_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const messageAddReducer = (state = {}, action) => {
  switch (action.type) {
    case FORUM_MESSAGE_ADD_REQUEST:
      return { loading: true };

    case FORUM_MESSAGE_ADD_SUCCESS:
      return { loading: false, success: action.payload };

    case FORUM_MESSAGE_ADD_FAIL:
      return { loading: false, error: action.payload };

    case FORUM_MESSAGE_ADD_RESET:
      return {};

    default:
      return state;
  }
};

export const messageEditReducer = (state = {}, action) => {
  switch (action.type) {
    case FORUM_MESSAGE_EDIT_REQUEST:
      return { loading: true };

    case FORUM_MESSAGE_EDIT_SUCCESS:
      return { loading: false, success: action.payload };

    case FORUM_MESSAGE_EDIT_FAIL:
      return { loading: false, error: action.payload };

    case FORUM_MESSAGE_EDIT_RESET:
      return {};

    default:
      return state;
  }
};

export const subjectAddReducer = (state = {}, action) => {
  switch (action.type) {
    case FORUM_SUBJECT_ADD_REQUEST:
      return { loading: true };

    case FORUM_SUBJECT_ADD_SUCCESS:
      return { loading: false, success: action.payload };

    case FORUM_SUBJECT_ADD_FAIL:
      return { loading: false, error: action.payload };

    case FORUM_SUBJECT_ADD_RESET:
      return {};

    default:
      return state;
  }
};
