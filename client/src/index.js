import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  from,
} from '@apollo/client'
import { onError } from '@apollo/client/link/error';

const errorLink = onError(({graphqlErrors, networkError}) => {
  if (graphqlErrors) {
    graphqlErrors.map(({message, location, path}) => {
      alert(`Graphql error ${message}`);
    });
  }
});

const link = from([
  errorLink,
  new HttpLink({
    uri: "http://localhost:5000/graphql",
    credentials: 'same-origin'
  })
]);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: link,
});

ReactDOM.render(
  <Provider store={store}>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </Provider>,
  document.getElementById("root")
);

