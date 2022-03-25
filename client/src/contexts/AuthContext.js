import React, { useContext, useState, useEffect } from "react";
import {connectAuthEmulator, getAuth} from 'firebase/auth';
import {useMutation} from "@apollo/client";
import {SIGN_IN_CLIENT} from "../GraphQL/Mutations";
import {initializeApp} from "firebase/app";
const AuthContext = React.createContext(null);

// Configure Firebase.
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || '',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || '',
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL || '',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET || '',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || '',
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || ''
};

initializeApp(firebaseConfig);

let auth = getAuth();
if (process.env.REACT_APP_ENVIRONMENT === "dev") {
  connectAuthEmulator(auth,'http://localhost:9099/', { disableWarnings: true });
}

export function useAuth() {
  return useContext(AuthContext);
}
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [notAuth, setNotAuth] = useState(false);
  const [signInClient, {client, loading, error, data }] = useMutation(SIGN_IN_CLIENT);

  // listen for db user result
  useEffect( () => {
    if(data?.signinClient?.jwtToken) {
      localStorage.setItem('token', data?.signinClient.jwtToken);
      client.resetStore();
      setCurrentUser(data?.signinClient);
      setNotAuth(false);
    }
    else if (data || error) {
      setNotAuth(true);
    }
    setIsLoading(false);
  }, [data, error])

  const value = {
    isLoading,
    currentUser,
    notAuth,
    setNotAuth
  };

  useEffect(() => {
    const unregisterAuthObserver = auth.onAuthStateChanged((user) => {
      if(user) {
        localStorage.removeItem('token');
        setIsLoading(true);
        setTimeout(() => {
          signInClient({
            variables:{
              input: {
                userId: user?.uid
              }
            }
          })
        }, 1000);
      }
      else{
        setCurrentUser(null);
      }

    });
    return () => {
      unregisterAuthObserver();
    }

  }, []);

  return (
    <AuthContext.Provider value={value}>
      { children }
    </AuthContext.Provider>
  );
}
