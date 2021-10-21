import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
import { ApolloClient, ApolloProvider } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { cache } from "./cache";

const link = createUploadLink({ uri: "http://localhost:4000/graphql" });
const client = new ApolloClient({
  ssrMode: typeof window === "undefined",
  cache: cache,
  link: link,
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
