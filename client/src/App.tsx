import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import SignInPage from "./pages/SignInPage.js";
import CustomizedSnackbar from "./components/reusables/CustomizedSnackbar";

function App() {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<SignInPage />} />
        </Routes>
      </main>
      <Footer />
      <CustomizedSnackbar />
    </Router>
  );
}

export default App;
