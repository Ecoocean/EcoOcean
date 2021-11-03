import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import SignInPage from "./pages/SignInPage.js";
import CustomizedSnackbar from "./components/reusables/CustomizedSnackbar";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Helmet } from "react-helmet";
import Header from "./components/Header";
import Footer from "./components/Footer";
import UsersPage from './pages/UsersPage'

const theme = createTheme({
  palette: {
    primary: {
      main: "#212121",
    },
  },
});

function App() {
  return (

    <ThemeProvider theme={theme}>
      <Router>
        <AuthProvider>
        <Helmet>
        <title>EcoOcean</title>
      </Helmet>
      <Routes>
        
        <Route
              exact
              path="/"
              element={
                <PrivateRoute>
                  <Header />
                    <Home />
                  <Footer />
                </PrivateRoute>
              }
        />   
        <Route exact path="/users" element={<PrivateRoute><Header /><UsersPage /><Footer /></PrivateRoute>} />
        

          <Route path="/login" element={< SignInPage/>} />
        </Routes>
          <CustomizedSnackbar />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
