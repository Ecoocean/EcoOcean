import { ApolloServer } from "apollo-server";
import typeDefs from "./schema";
import { resolvers } from "./resolvers";
import { graphqlUploadKoa } from "graphql-upload";
import Koa from "koa";

/**
 * Starts the API server.
 */
async function startServer() {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await apolloServer.listen();

  new Koa()
    .use(
      graphqlUploadKoa({
        // Limits here should be stricter than config for surrounding
        // infrastructure such as Nginx so errors can be handled elegantly by
        // `graphql-upload`:
        // https://github.com/jaydenseric/graphql-upload#type-processrequestoptions
        maxFileSize: 10000000, // 10 MB
        maxFiles: 20,
      })
    )
    .use(apolloServer.getMiddleware())
    .listen(4000, (error) => {
      if (error) throw error;

      console.info(`Serving http://localhost:4000`);
    });
}

startServer();
