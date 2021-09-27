import React from "react";
import { Container } from "react-bootstrap";

import { Routes, Route } from "react-router-dom";

import ClustersScreen from "./ClustersScreen";
import ForumSubjectsScreen from "./ForumSubjectsScreen";
import SubjectMessagesScreen from "./SubjectMessagesScreen";
import NewPostScreen from "./NewPostScreen";

const ForumScreen = () => {
  return (
    <Container className="offset_nav rtl text-right">
      <Routes>
        <Route path="" element={<ClustersScreen />} />
        <Route
          path=":title/:postId/:page"
          element={<SubjectMessagesScreen />}
        />
        <Route path=":title/:page" element={<ForumSubjectsScreen />} />
        <Route path="/new_post/:title" element={<NewPostScreen />} />
      </Routes>
    </Container>
  );
};

export default ForumScreen;
