import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import _ from "lodash";

import Questionnaire from "./Questionnaire";
import Questions_Answers from "./questions_answers";
import { Breadcrumb, Spinner, Row, Col, Card } from "react-bootstrap";
import QExplanation from "./QExplanation";
import Loader from "../../reusables/Loader";
import { useSelector } from "react-redux";
import { API_PREFIX } from "../../../constants/apiConstants";

import axios from "axios";

const QWrapper = () => {
  const location = useLocation();
  const params = useParams();
  const [load, setLoad] = useState(false);
  const [modelName, setModelName] = useState("blackLitterman");
  const [answersState, setAnswersState] = useState(
    Array(Questions_Answers.length).fill(1)
  );
  const [question, setQuestion] = useState(
    parseInt(params["*"].substr(params["*"].lastIndexOf("/") + 1))
  );

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const navigate = useNavigate();

  const submitForm = async () => {
    try {
      setLoad(true);
      let sd = {
        answers: _.fromPairs(answersState.map((x, i) => [i, x])),
        model_name: modelName,
      };
      if (userInfo) {
        sd["uid"] = userInfo.email;
      }
      const { data } = await axios.post(`${API_PREFIX}/form_submit/submit`, sd);
      if (data.hasOwnProperty('link')) {
        navigate(`/portfolio/${data.link}`);
      }
      else {
        navigate('/low_risk_explanation');
      }
    } catch (e) {
      console.log(e);
    }
  };

  const update_answer = (quest, ans) => {
    setAnswersState(answersState.map((x, i) => (i === quest ? ans : x)));
  };

  const update_model = (name) => {
    setModelName(name);
  };

  const jumpToQuestion = (num) => {
    if (num === 0) {
      navigate("explanation");
      setQuestion(num);
    } else if (num === Questions_Answers.length + 1) {
      submitForm();
    } else {
      navigate(`question/${num}`);
      setQuestion(num);
    }
  };

  return (
    <div className="rtl offset_nav" id="q_wrapper">
      <Row>
        <Col xs={12}>
          {/* <Breadcrumb> */}
          <ol className="breadcrumb">
            {_.range(Questions_Answers.length, 0).map((i) => {
              return (
                <li
                  key={i}
                  onClick={() => jumpToQuestion(i)}
                  className={i === question ? "active" : ""}
                >
                  שאלה {i}
                </li>
              );
            })}
            <li
              onClick={() => {
                setQuestion(0);
                navigate("/questionnaire/explanation");
              }}
              className={
                location.pathname.indexOf("explanation") !== -1 ? "active" : ""
              }
            >
              הסבר קצר
            </li>
          </ol>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Routes>
            <Route
              path="question/:q_num"
              element={
                load ? (
                  <Loader />
                ) : (
                  <Questionnaire
                    answers_state={answersState}
                    update_question={jumpToQuestion}
                    update_answer={update_answer}
                    max_q_n={Questions_Answers.length}
                    data={Questions_Answers[question - 1]}
                    update_model={update_model}
                    current_model={modelName}
                  />
                )
              }
            />
            <Route
              path="/explanation"
              element={<QExplanation update_question={jumpToQuestion} />}
            />
            <Route
              path="/*"
              element={<QExplanation update_question={jumpToQuestion} />}
            />
          </Routes>
        </Col>
      </Row>
    </div>
  );
};

export default QWrapper;
