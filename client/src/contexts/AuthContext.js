import React, { useContext, useState, useEffect } from "react";
import {connectAuthEmulator, getAuth} from 'firebase/auth';
import {useMutation} from "@apollo/client";
import {SIGN_IN_CLIENT} from "../GraphQL/Mutations";
const AuthContext = React.createContext(null);

let auth = getAuth();
if (process.env.REACT_APP_ENVIRONMENT === "dev") {
  connectAuthEmulator(auth,'http://localhost:9099/');
}

export function useAuth() {
  return useContext(AuthContext);
}
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [signInClient, {client, loading, error, data }] = useMutation(SIGN_IN_CLIENT);

  // listen for db user result
  useEffect( () => {
    if(data?.signinClient?.jwtToken) {
      localStorage.setItem('token', data?.signinClient.jwtToken);
      client.resetStore();
    }
  }, [data])

  const value = {
    currentUser,
  };

  useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      if(user) {
        signInClient({
          variables:{
            input: {
              userId: user?.uid
            }
          }
        })
      }

    });

  }, []);

  return (
    <AuthContext.Provider value={value}>
      {!loading && !error && children}
    </AuthContext.Provider>
  );
}
