// Import FirebaseAuth and firebase.
import React, { useEffect, useState } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import * as firebase from "firebase/app";
import { Helmet } from 'react-helmet';
import CircularProgress from '@mui/material/CircularProgress';
import { Navigate  } from 'react-router-dom'
import 'firebase/auth';
import './SignInPage.css'

// Configure Firebase.
const firebaseConfig = {
  apiKey: "AIzaSyCFooLdzMAr2gXrGkKEzNUFNE6S5CtNq9g",
  authDomain: "ecoocean.firebaseapp.com",
  databaseURL: "https://ecoocean-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "ecoocean",
  storageBucket: "ecoocean.appspot.com",
  messagingSenderId: "1006140535576",
  appId: "1:1006140535576:web:8162685da451d5bd9f646d",
  measurementId: "G-CCN1TXNL3L"
};
firebase.initializeApp(firebaseConfig);

// Configure FirebaseUI.
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: "popup",
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
  ],
  signInSuccessUrl: '/',
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false,
  },
};

function SignInScreen() {
  const [checkingAuth, setCheckingAuth] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false); // Local signed-in state.

  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged((user) => {
        if(user){
          setCheckingAuth(true);
        }
        setTimeout(() => {
          setIsSignedIn(!!user);
          if(user){
            setCheckingAuth(false);
          }
        }, 1000);
        
      });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  if (!isSignedIn) {
    return (
      <div className="LoginRoot">
      <Helmet>
        <title>Login</title>
      </Helmet>
      <img className="LoginLogo" src={'/images/Ecoocean_new_logo_filtered.jpg'} alt="" />
      {checkingAuth ? <CircularProgress color="inherit" /> :
      <div> 
          <StyledFirebaseAuth
            uiConfig={uiConfig}
            firebaseAuth={firebase.auth()}
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
