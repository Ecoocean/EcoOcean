import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
import { split } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { ApolloClient, ApolloProvider } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { cache } from "./cache";
import * as firebase from "firebase/app";
import "firebase/auth";
import { setContext } from "@apollo/client/link/context";
const link = createUploadLink({
  uri: "https://us-central1-ecoocean.cloudfunctions.net/graphql",
});

const wsLink = new WebSocketLink({
  uri: "ws://https://us-central1-ecoocean.cloudfunctions.net/graphql",
  options: {
    reconnect: true,
  },
});

const authLink = setContext((_, { headers }) => {
  //it will always get unexpired version of the token
  return firebase
    .auth()
    .currentUser.getIdToken()
    .then((token) => {
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : "",
        },
      };
    });
});

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  link
);

const client = new ApolloClient({
  ssrMode: typeof window === "undefined",
  cache: cache,
  link: authLink.concat(splitLink),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
