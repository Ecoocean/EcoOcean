import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { split } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { ApolloClient, ApolloProvider } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { cache } from "./cache";
import "firebase/auth";
import { StyledEngineProvider } from '@mui/material/styles';
import { setContext } from "@apollo/client/link/context";
import {onError} from "@apollo/client/link/error";
import {setSnackBar} from "./SnackBarUtils";
import { SubscriptionClient } from 'subscriptions-transport-ws';


const link = createUploadLink({
    uri: process.env.REACT_APP_SERVER_ENDPOINT_URL,
});

const graphqlEndpoint = `${process.env.REACT_APP_WEB_SOCKET_TYPE}://${process.env.REACT_APP_SERVER_ENDPOINT}`;

const wsClient = new SubscriptionClient(
    graphqlEndpoint,
    {
      reconnect: true,
      connectionParams: localStorage.getItem('token')
            ? {
                authorization: `Bearer ${localStorage.getItem('token')}`,
            }
            : {},
    }
);

wsClient.onConnected(() => console.log('CONNECTED to GraphqlEndpoint'));
wsClient.onDisconnected(() => setSnackBar('No internet connection - offline mode', 'error'));
wsClient.onReconnected(() => setSnackBar('Reconnected to the server', 'success'));

const wsLink = new WebSocketLink(wsClient);

const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = localStorage.getItem('token');
    // return the headers to the context so httpLink can read them
    if(token){
        return {
            headers: {
                ...headers,
                authorization: `Bearer ${token}`,
            }
        }
    }
    return {
        headers: {
            ...headers
        }
    }
});

// Log any GraphQL errors or network error that occurred
const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
        graphQLErrors.forEach(({message, locations, path}) => {
            console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            );
            setSnackBar(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`, 'error');
        })
    }
    if (networkError) {
        console.log(`[Network error]: ${networkError}`);
        setSnackBar(`[Network error]: could not establish connection to the server`, 'error')
    }
});

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
    link: errorLink.concat(authLink.concat(splitLink)),
    defaultOptions: {
        query: {
            errorPolicy: 'all',
        },
        mutate: {
            errorPolicy: 'all',
        },
    }
});

const rootElement = document.getElementById("root");
ReactDOM.render(
    <ApolloProvider client={client}>
        <StyledEngineProvider injectFirst>
            <App />
        </StyledEngineProvider>
    </ApolloProvider>,
  rootElement
);
