import React, { useContext, useState, useEffect } from "react";
import * as firebase from "firebase/app";
import "firebase/auth";
import {useMutation} from "@apollo/client";
import {SIGN_IN_CLIENT} from "../GraphQL/Mutations";
const AuthContext = React.createContext(null);

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
    return firebase.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
      signInClient({
        variables:{
          input: {
            userId: user.uid
          }
        }
      })
    });

  }, []);

  return (
    <AuthContext.Provider value={value}>
      {!loading && !error && children}
    </AuthContext.Provider>
  );
}
