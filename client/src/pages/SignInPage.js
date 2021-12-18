// Import FirebaseAuth and firebase.
import React, { useEffect, useState } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import * as firebase from "firebase/app";
import { Helmet } from 'react-helmet';
import CircularProgress from '@mui/material/CircularProgress';
import { Navigate  } from 'react-router-dom'
import { useMutation } from '@apollo/client';
import 'firebase/auth';
import './SignInPage.css'
import Button from '@mui/material/Button';
import {SIGN_IN_CLIENT} from "../GraphQL/Mutations";

// Configure Firebase.
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
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
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false); // Local signed-in state.
  const [signInClient, {client, loading, error, data }] = useMutation(SIGN_IN_CLIENT);

  // listen for db user result
  useEffect( () => {
    if(data?.signinClient.jwtToken) {
      localStorage.setItem('token', data?.signinClient.jwtToken);
      client.resetStore();
      setUserAuthenticated(true);
    }
  }, [data])

  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    localStorage.clear();
    const unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged((user) => {
        if(user){
          setCheckingAuth(true);
          signInClient({
            variables:{
              input: {
                userId: user.uid
              }
            }
          })
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

  if (!isSignedIn || !userAuthenticated) {
    return (
      <div className="LoginRoot">
      <Helmet>
        <title>Login</title>
      </Helmet>
      <img className="LoginLogo" src={'/images/Ecoocean_new_logo_filtered.jpg'} alt="" />
      {!isSignedIn && checkingAuth && !userAuthenticated ? <CircularProgress color="inherit" /> :
      isSignedIn && !userAuthenticated? 
      <div> 
        <h4 style={{color: "white"}}>User is not authorized</h4>
        <Button variant="contained"> onClick={() => {
          setUserAuthenticated(false);
          setIsSignedIn(null);
          setCheckingAuth(false);
          firebase.auth().signOut();
        }} >
          Try with a different account
        </Button>
      </div>:
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
