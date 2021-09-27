import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  userLoginReducer,
  userRegisterReducer,
  userProfileUpdateReducer,
  userPasswordUpdateReducer,
  userPasswordResetReducer,
  userPasswordNewByResetReducer,
} from "./reducers/userReducers";

import {
  articlesListReducer,
  articleReducer,
} from "./reducers/infoCenterReducers";

import {
  portfolioFetchReducer,
  portfolioLatestListReducer,
} from "./reducers/portfolioReducers";

import {
  clustersListReducer,
  subjectsListReducer,
  messagesListReducer,
  messageAddReducer,
  messageEditReducer,
  subjectAddReducer,
} from "./reducers/forumReducers";

import {outdatedTokenMiddleware} from "./middlewares";

const reducer = combineReducers({
  // Articles
  articlesList: articlesListReducer,
  articleData: articleReducer,

  // Users
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userProfileUpdate: userProfileUpdateReducer,
  userPasswordUpdate: userPasswordUpdateReducer,
  userPasswordReset: userPasswordResetReducer,
  userPasswordNewByReset: userPasswordNewByResetReducer,

  // Forum
  clustersList: clustersListReducer,
  subjectsList: subjectsListReducer,
  messagesList: messagesListReducer,
  messageAdd: messageAddReducer,
  messageEdit: messageEditReducer,
  subjectAdd: subjectAddReducer,

  // Portfolio
  portfolioFetch: portfolioFetchReducer,
  portfolioLatestList: portfolioLatestListReducer,
});

const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const initialState = {
  userLogin: { userInfo: userInfoFromStorage },
};


const middlewares = [outdatedTokenMiddleware, thunk];
const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middlewares))
);

export default store;
