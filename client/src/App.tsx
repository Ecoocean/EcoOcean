import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import SignInPage from "./pages/SignInPage.js";
import CustomizedSnackbar from "./components/reusables/CustomizedSnackbar";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<SignInPage />} />
        </Routes>
        <CustomizedSnackbar />
      </AuthProvider>
    </Router>
  );
}

export default App;
