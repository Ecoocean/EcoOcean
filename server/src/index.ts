import express from "express";
import { graphqlUploadExpress } from "graphql-upload";
import { postgraphile, PostGraphileOptions, makePluginHook } from "postgraphile";
import ConnectionFilterPlugin from "postgraphile-plugin-connection-filter";
import * as PostgisPlugin from "@graphile/postgis";
import PgPubsub  from "@graphile/pg-pubsub";
import cors from 'cors';
import { PostgresPlugin } from './resolvers'

const pluginHook = makePluginHook([PgPubsub]);


async function startServer() {
  
  const postgraphileOptions: PostGraphileOptions = {
    pluginHook,
    // Enable live support in PostGraphile
    subscriptions: true,
    simpleSubscriptions: true,
    watchPg: true,
    dynamicJson: true,
    pgDefaultRole: 'anonymous',
    jwtPgTypeIdentifier: 'public.jwt_token',
    jwtSecret: 'superSecretRandom',
    setofFunctionsContainNulls: false,
    showErrorStack: "json",
    extendedErrors: ["hint", "detail", "errcode"],
    appendPlugins: [require("@graphile-contrib/pg-simplify-inflector"),
                    PostgisPlugin.default || PostgisPlugin,
                    PostgresPlugin, ConnectionFilterPlugin],
    exportGqlSchemaPath: "schema.graphql",
    graphiql: true,
    enhanceGraphiql: true,
    legacyRelations: "omit",
    allowExplain(req) {
      // TODO: customise condition!
      return true;
    },
    enableQueryBatching: true,
  };
  
  
  const app = express();
  const allowedDomains = [process.env.ECOOCEAN_SERVER,
                          process.env.ECOOCEAN_CLIENT_URL, process.env.ADMIN_ECOOCEAN_CLIENT_URL]
  const options = {
        origin: function (origin, callback) {
          // bypass the requests with no origin (like curl requests, mobile apps, etc )
          if (!origin) return callback(null, true);

          if (allowedDomains.indexOf(origin) === -1) {
            var msg = `This site ${origin} does not have an access. Only specific domains are allowed to access it.`;
            return callback(new Error(msg), false);
          }
          return callback(null, true);
        },
      }
  ;

  app.use(cors(options));

  // Enable pre-flight requests for all routes
  app.options('*', cors(options));
  app.use(graphqlUploadExpress());
  const dbUserName = process.env.DB_USERNAME;
  const dbPassword = process.env.DB_PASSWORD;
  const dbName = process.env.DB_NAME;
  const dbHost = process.env.DB_HOST;
  const dbPort = process.env.DB_PORT;
  const postgraphileMiddleware =  postgraphile(
    `postgres://${dbUserName}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`,
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
