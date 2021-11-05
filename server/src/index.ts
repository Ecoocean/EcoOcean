import typeDefs from "./schema";
import { resolvers } from "./resolvers";
import express from "express";
import { ApolloServer, AuthenticationError } from "apollo-server-express";
import { graphqlUploadExpress } from "graphql-upload";
import { createServer } from "http";
import { execute, subscribe } from "graphql";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { PubSub } from "graphql-subscriptions";
import { testPlugin } from "./eventLogger";
import { auth } from "./firestore";

const schema = makeExecutableSchema({ typeDefs, resolvers });

export const pubsub = new PubSub();
const app = express();

async function startServer() {
  const server = new ApolloServer({
    schema,
    plugins: [
      testPlugin,
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            },
          };
        },
      },
    ],
    formatError: (err) => {
      // Don't give the specific errors to the client.
      if (err.message.startsWith("Database Error: ")) {
        return new Error("Internal server error");
      }
      // Otherwise return the original error. The error can also
      // be manipulated in other ways, as long as it's returned.
      return err;
    },
    context: async ({ req }) => {
      // Note: This example uses the `req` argument to access headers,
      // but the arguments received by `context` vary by integration.
      // This means they vary for Express, Koa, Lambda, etc.
      //
      // To find out the correct arguments for a specific integration,
      // see https://www.apollographql.com/docs/apollo-server/api/apollo-server/#middleware-specific-context-fields

      // Get the user token from the headers.
      const token = req.headers.authorization || "";
      const newToken = token.replace("Bearer ", "");

      // Try to retrieve a user with the token
      const decodedToken = await auth.verifyIdToken(newToken);
      const user = await auth.getUser(decodedToken.uid);
      // optionally block the user
      // we could also check user roles/permissions here
      if (!user)
        throw new AuthenticationError(
          "you must be logged in to query this schema"
        );
      // Add the user to the context
      return { user };
    },
  });

  // This `app` is the returned value from `express()`.
  const httpServer = createServer(app);

  const subscriptionServer = SubscriptionServer.create(
    {
      // This is the `schema` we just created.
      schema,
      // These are imported from `graphql`.
      execute,
      subscribe,
    },
    {
      // This is the `httpServer` we created in a previous step.
      server: httpServer,
      // This `server` is the instance returned from `new ApolloServer`.
      path: server.graphqlPath,
    }
  );

  await server.start();

  // This middleware should be added before calling `applyMiddleware`.
  app.use(graphqlUploadExpress());

  server.applyMiddleware({ app, path: "/", cors: true });

  httpServer.listen({ port: 4001 }, () => {
    console.log(
      `🚀 Server ready at http://localhost:4001${server.graphqlPath}`
    );
    console.log("testttt");
  });

  return app;
}
startServer();
