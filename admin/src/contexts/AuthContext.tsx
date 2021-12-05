import React, { useContext, useState, useEffect } from "react";
import * as firebase from "firebase/app";
import "firebase/auth";
import {useMutation} from "@apollo/client";
import {SIGN_IN_ADMIN} from "../GraphQL/Mutations";
const AuthContext = React.createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState<firebase.User | null>();
  const [signInAdmin, { client, loading, error, data }] = useMutation(SIGN_IN_ADMIN, {
    fetchPolicy: "network-only" // Doesn't check cache before making a network request
  });

  const value = {
    currentUser,
  };

  useEffect(() => {
    if(data?.signinAdmin.jwtToken) {
      localStorage.setItem('token', data?.signinAdmin.jwtToken);
      client.resetStore();
    }
  }, [data])

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
      signInAdmin({
        variables:{
          input: {
            userId: user.uid
          }
        }
      })
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={value}>
      {!loading && !error && children}
    </AuthContext.Provider>
  );
}
