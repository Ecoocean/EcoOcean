import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Button,
  ButtonGroup,
  Form,
  Row,
  Col,
  FormCheck,
} from "react-bootstrap";

const model_names = ["markowitz", "Kmeans", "blackLitterman", "mean_gini"];
const model_names_heb = [
  "מרקוביץ",
  "מודל אשכולות מבוסס KMeans",
  "בלאק-ליטרמן",
  "מודל ג'יני",
];

const Questionnaire = ({
  data,
  max_q_n,
  update_question,
  answers_state,
  update_answer,
  update_model,
  current_model,
}) => {
  const { q_num } = useParams();
  const q_number = parseInt(q_num);
  const [disabledBtns, setDisabledBtns] = useState(false);
  return (
    <Card border="0">
      <Row>
        <Col xs={6}>
          {data.using_image_question ? (
            <Card.Img
              variant="top"
              src={"/images/" + data.image_url_question}
            />
          ) : null}
        </Col>
        <Col xs={6}>
          <Card.Body>
            <Row style={{ minHeight: "20vh" }}>
              <Col xs={12}>
                <h1>
                  <Card.Text className="question_text">
                    שאלה מספר {q_number}
                  </Card.Text>
                </h1>
                <h4>
                  <Card.Text className="question_text">
                    {data.question}
                  </Card.Text>
                </h4>
              </Col>
            </Row>
            <hr />
            <Form.Group id={"answers_radio_options"} as={Row} style={{ position: "relative" }}>
              <ButtonGroup
                style={{ position: "absolute", top: "-35px", right: 0 }}
              >
                <Button
                  disabled={disabledBtns}
                  id={"next_question_btn"}
                  variant="primary"
                  onClick={() => {
                    if (q_number === max_q_n) {
                      setDisabledBtns(true);
                    }
                    update_question(q_number + 1);
                  }}
                >
                  {q_number === max_q_n ? "הרכבת תיק" : "שאלה הבאה"}
                </Button>
                <Button
                    id={"previous_question_btn"}
                  disabled={disabledBtns}
                  onClick={() => update_question(q_number - 1)}
                  // disabled={q_number === 1}
                  variant="secondary"
                >
                  {q_number === 1 ? "חזרה להסבר" : "שאלה קודמת"}
                </Button>
              </ButtonGroup>
              <Col xs={12}>
                <Form.Label as="legend" column>
                  <h3>תשובות אפשריות</h3>
                </Form.Label>
                {data.list_ans.map((ans, i) => {
                  return (
                    <Form.Check key={i}>
                      <Form.Check.Label
                        className="rtl"
                        onClick={() => update_answer(q_number - 1, i)}
                      >
                        <Form.Check.Input
                          readOnly={true}
                          checked={answers_state[q_number - 1] === i}
                          name={data.question}
                          type={"radio"}
                        />
                        <span className="mr-5">{ans}</span>
                      </Form.Check.Label>
                    </Form.Check>
                  );
                })}
              </Col>
            </Form.Group>
            <br />
            <hr />
            <br />
            <Form.Group id={"models_radio_options"}>
              <h1>מודל להריץ</h1>
              {model_names.map((name, i) => (
                <Form.Check key={i}>
                  <Form.Check.Label
                    className="rtl"
                    onClick={() => update_model(name)}
                  >
                    <Form.Check.Input
                      readOnly={true}
                      checked={current_model === name}
                      name={name}
                      type={"radio"}
                    />
                    <span className="mr-5">{model_names_heb[i]}</span>
                  </Form.Check.Label>
                </Form.Check>
              ))}
            </Form.Group>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
};

export default Questionnaire;
