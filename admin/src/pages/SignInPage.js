
import React, { useState } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { getAuth, EmailAuthProvider, GoogleAuthProvider, FacebookAuthProvider, connectAuthEmulator } from 'firebase/auth';
import { Helmet } from 'react-helmet';
import CircularProgress from '@mui/material/CircularProgress';
import { Navigate  } from 'react-router-dom'
import './SignInPage.css'
import Button from '@mui/material/Button';
import { useAuth } from "../contexts/AuthContext";
import {Alert, AlertTitle} from "@mui/lab";

const auth = getAuth();

if (process.env.REACT_APP_ENVIRONMENT === "dev") {
  connectAuthEmulator(auth,'http://localhost:9099/', { disableWarnings: true });
}

function SignInScreen() {

  // Configure FirebaseUI.
  const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: "popup",
    // We will display Google and Facebook as auth providers.
    signInOptions: [
      EmailAuthProvider.PROVIDER_ID,
      GoogleAuthProvider.PROVIDER_ID,
      FacebookAuthProvider.PROVIDER_ID,
    ],
    signInSuccessUrl: '/',
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: () => false,
    },
  };
  const { currentUser, isLoading, notAuth, setNotAuth } = useAuth();

  if (!currentUser) {
    return (
        <div className="LoginRoot">
          <Helmet>
            <title>Login</title>
          </Helmet>
          <img className="LoginLogo" src={'/images/Ecoocean_new_logo_filtered.jpg'} alt="" />
          {isLoading ? <CircularProgress color="inherit" /> :
              notAuth ?
                  <div style={{alignItems: 'center',
                    justifyContent: 'center',
                    display: 'flex',
                    gap: '10px',
                    flexDirection: 'column'}}>
                    <Alert variant="filled" severity="info">
                      <AlertTitle>Error</AlertTitle>
                      User is not authorized — <strong>Please ask an admin to get access</strong>
                    </Alert>
                    <Button variant="contained" onClick={() => {
                      setNotAuth(false);
                      auth.signOut();
                    }}>
                      Try with a different account
                    </Button>
                  </div>
                  :
                  <div>
                    <StyledFirebaseAuth
                        uiConfig={uiConfig}
                        firebaseAuth={auth}
                    />
                  </div>
          }
        </div>
    );
  }
  return (
      <Navigate to="/" />
  );
}

export default SignInScreen;
