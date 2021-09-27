import React, { useEffect, useState } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import RichEditor from "../../reusables/RichEditor";
import { ContentState } from "draft-js";
import {
  listMessages,
  addMessage,
  editMessage,
} from "../../../actions/forumActions";
import {
  FORUM_MESSAGE_ADD_RESET,
  FORUM_MESSAGE_EDIT_RESET,
} from "../../../constants/forumConstants";

import { useSelector, useDispatch } from "react-redux";
import Loader from "../../reusables/Loader";
import Message from "../../reusables/Message";
import Paginate from "../../reusables/Paginate";

const SubjectMessagesScreen = () => {
  const { title, postId, page } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [editMessageObj, setEditMessageObj] = useState({});

  const messagesList = useSelector((state) => state.messagesList);
  const { loading, error, messages, pages } = messagesList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const messageAdd = useSelector((state) => state.messageAdd);
  const {
    loading: msgAddLoading,
    success: msgAddSuccess,
    error: msgAddError,
  } = messageAdd;

  const messageEdit = useSelector((state) => state.messageEdit);
  const {
    loading: msgEditLoading,
    success: msgEditSuccess,
    error: msgEditError,
  } = messageEdit;

  useEffect(() => {
    dispatch({ type: FORUM_MESSAGE_ADD_RESET });
    dispatch({ type: FORUM_MESSAGE_EDIT_RESET });

    dispatch(listMessages(postId, page));
  }, [dispatch, listMessages, page]);

  let submitData = (messageAdded) => {
    if (messageAdded && messageAdded.length > 0) {
      dispatch({ type: FORUM_MESSAGE_ADD_RESET });
      dispatch(addMessage(messageAdded, postId, page));
    }
  };

  let getData = null;

  const getCallback = (getDataCallback) => {
    getData = getDataCallback;
  };

  let editData = (messageEdited, messageId) => {
    if (messageEdited && messageEdited.length > 0) {
      dispatch({ type: FORUM_MESSAGE_EDIT_RESET });
      dispatch(editMessage(messageEdited, postId, messageId, page));
      setEditMode(false);
    }
  };

  let getDataEdit = null;

  const getCallbackEdit = (getDataCallbackEdit) => {
    getDataEdit = getDataCallbackEdit;
  };

  return (
    <div>
      <Row>
        <Col xs={12}>
          <h1>{title}</h1>
        </Col>
      </Row>
      {loading || msgAddLoading || msgEditLoading ? (
        <Loader />
      ) : error || msgAddError || msgEditError ? (
        <Message
          variante="danger"
          text={error ? error : msgAddError ? msgAddError : msgEditError}
        />
      ) : (
        messages.map((message) => (
          <Row className="forum_subject_card" key={message.id}>
            <Col xs={12}>
              <Card>
                <Card.Body>
                  <Card.Text>
                    נכתב בתאריך {message.created_at} ע"י {message.member_email}
                  </Card.Text>
                  <hr />
                  <RichEditor
                    readOnly={true}
                    title={title}
                    postId={postId}
                    data={message.content}
                    getCallback={() => null}
                  />
                  {userInfo && message.member_email === userInfo.email ? (
                    <>
                      <hr />
                      <Button
                        variant="light"
                        className="btn-sm"
                        onClick={() => {
                          setEditMessageObj({
                            data: message.content,
                            id: message.id,
                          });
                          setEditMode(true);
                        }}
                      >
                        עריכה
                      </Button>
                    </>
                  ) : null}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ))
      )}
      {userInfo && (
        <Row className="forum_subject_card">
          <Col xs={12}>
            <Card>
              {editMode ? (
                <Card.Body>
                  <RichEditor
                    title={title}
                    postId={postId}
                    getCallback={getCallbackEdit}
                    data={editMessageObj.data}
                  />
                  <Button
                    variant="primary"
                    onClick={() =>
                      getDataEdit && editData(getDataEdit(), editMessageObj.id)
                    }
                  >
                    עריכת הודעה
                  </Button>
                  {msgEditSuccess && (
                    <Message variant="success" text={msgEditSuccess} />
                  )}
                </Card.Body>
              ) : (
                <Card.Body>
                  <RichEditor
                    title={title}
                    postId={postId}
                    getCallback={getCallback}
                  />
                  <Button
                      id={"new_message_btn"}
                    variant="primary"
                    onClick={() => getData && submitData(getData())}
                  >
                    הוספת הודעה
                  </Button>
                  {msgAddSuccess && (
                    <Message variant="success" text={msgAddSuccess} />
                  )}
                </Card.Body>
              )}
            </Card>
          </Col>
        </Row>
      )}

      <Row className="forum_subject_card">
        <Col xs={12}>
          <Paginate
            prefix={`/forum/${title}/${postId}`}
            page={page}
            pages={pages}
          />
        </Col>
      </Row>
    </div>
  );
};

export default SubjectMessagesScreen;
