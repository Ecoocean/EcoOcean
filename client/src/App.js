import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import QWrapper from "./components/screens/questionnaire/QWrapper";
import LoginScreen from "./components/screens/LoginScreen";
import ForumScreen from "./components/screens/forum/ForumScreen";
import RegisterScreen from "./components/screens/RegisterScreen";
import ProfileScreen from "./components/screens/ProfileScreen";
import ChangePasswordScreen from "./components/screens/ChangePasswordScreen";
import PortfolioScreen from "./components/screens/PortfolioScreen";
import ForgotPasswordScreen from "./components/screens/ForgotPasswordScreen";
import ResetPasswordScreen from "./components/screens/ResetPasswordScreen";
import UserLatestResultsScreen from "./components/screens/UserLatestResultsScreen";
import InfoCenterScreen from "./components/screens/infoCenter/InfoCenterScreen";
import ArticleScreen from "./components/screens/infoCenter/ArticleScreen";
import LowRiskExplanationScreen from "./components/screens/LowRiskExplanationScreen";

function App() {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="login" element={<LoginScreen />} />
          <Route path="register" element={<RegisterScreen />} />
          <Route path="profile" element={<ProfileScreen />} />
          <Route
            path="user_latest_results"
            element={<UserLatestResultsScreen />}
          />
          <Route path="change_password" element={<ChangePasswordScreen />} />
          <Route path="forgot_password" element={<ForgotPasswordScreen />} />
          <Route
            path="reset_password/:reset_code"
            element={<ResetPasswordScreen />}
          />
          <Route
            path="info_center/:title/:article_id"
            element={<ArticleScreen />}
          />
          <Route path="info_center" element={<InfoCenterScreen />} />

          <Route path="forum/*" element={<ForumScreen />} />
          <Route path="questionnaire/*" element={<QWrapper />} />
          <Route path="portfolio/:link" element={<PortfolioScreen />} />
          <Route path="low_risk_explanation" element={<LowRiskExplanationScreen />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
