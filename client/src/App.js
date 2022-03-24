import React from "react";
import {BrowserRouter as Router, Routes, Route, useLocation} from "react-router-dom";
import Home from "./Home";
import SignInPage from "./pages/SignInPage.js";
import CustomizedSnackbar from "./CustomizedSnackbar";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./PrivateRoute";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#0074d9",
        },
    },
});

function App() {

    return (
        <ThemeProvider theme={theme}>
            <Router>
                <AuthProvider>
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <HomeWithParams/>
                            }
                        />
                        <Route exact path="/login" element={<SignInPage />} />
                    </Routes>
                    <CustomizedSnackbar />
                </AuthProvider>
            </Router>
        </ThemeProvider>
    );
}

function HomeWithParams() {
    let location = useLocation();
    console.log(location);

    return (
        <PrivateRoute>
            <Home key={location.key}/>
        </PrivateRoute>
    );
}

export default App;
