import typeDefs from "./schema";
import express from "express";
import { graphqlUploadExpress } from "graphql-upload";
import { PubSub } from "graphql-subscriptions";
import { postgraphile, PostGraphileOptions, makePluginHook } from "postgraphile";
import * as PostgisPlugin from "@graphile/postgis";
import { makeExtendSchemaPlugin, gql } from "graphile-utils";
import PgPubsub  from "@graphile/pg-pubsub";
import cors from 'cors';
import { PostgresPlugin } from './resolvers'

export const pubsub = new PubSub();

const pluginHook = makePluginHook([PgPubsub]);


async function startServer() {
  
  const postgraphileOptions: PostGraphileOptions = {
    pluginHook,
    subscriptions: true,
    simpleSubscriptions: true,
    watchPg: true,
    dynamicJson: true,
    setofFunctionsContainNulls: false,
    showErrorStack: "json",
    extendedErrors: ["hint", "detail", "errcode"],
    appendPlugins: [require("@graphile-contrib/pg-simplify-inflector"),
                    PostgisPlugin.default || PostgisPlugin,
                    PostgresPlugin],
    exportGqlSchemaPath: "schema.graphql",
    graphiql: true,
    enhanceGraphiql: true,
    allowExplain(req) {
      // TODO: customise condition!
      return true;
    },
    enableQueryBatching: true,
  };
  
  
  const app = express();
  const options = {
    origin: 'http://localhost:3000',
  }
  ;

  app.use(cors(options));

  // Enable pre-flight requests for all routes
  app.options('*', cors(options));
  app.use(graphqlUploadExpress());

  const postgraphileMiddleware =  postgraphile(
    process.env.DATABASE_URL || "postgres://postgres:bengurion@34.79.12.114:5432/ecoocean_postgis",
    "public",
    postgraphileOptions
  )

  app.use(
    postgraphileMiddleware
  );


  app.listen(process.env.PORT || 8080, () => {
       console.log(
         `🚀 Server ready at http://localhost:8080`
       );
  })


}
startServer();
