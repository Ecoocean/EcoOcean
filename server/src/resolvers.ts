import { db, admin, auth } from "./firestore";
import { GeoPoint } from "@google-cloud/firestore";
import { GraphQLUpload } from "graphql-upload";
import { saveFileToFireStorage } from "./fileUploader";
import openGeocoder from "node-open-geocoder";
import * as geofire from 'geofire-common'
import { makeExtendSchemaPlugin } from "graphile-utils";
import typeDefs from "./schema";


export const PostgresPlugin = makeExtendSchemaPlugin(build => {
  // Get any helpers we need from `build`
  const { graphql: { graphql }, pgSql: sql, inflection } = build;

  return {
    typeDefs: typeDefs,
    resolvers: {
      Upload: GraphQLUpload,

      Query: {
        allUsers: async (parent, args, context, info) => {
          let { users } = await auth.listUsers();
          users = users.filter(({ email, displayName }) => {
            if (!(email || displayName)) return false;
            return true;
          });
          const document = /* GraphQL */ `
          query MyQuery {
            users {
              nodes {
                displayName
                email
                emailVerified
                hasChartAccess
                isAdmin
                isOnboard
                isReporter
                nodeId
                photoUrl
                uid
              }
            }
          }
          `;
          // The name of the operation in your query document (optional)
          const { data, errors } = await graphql(
            info.schema,
            document,
            null,
            context,
          );
      
          const onboardedUsers = data.users.nodes;
          return users.map((firebaseUser) => {
            const [match] = onboardedUsers.filter(
              (onb) => onb.uid === firebaseUser.uid
            );
            return {
              metadata: firebaseUser.metadata,
              ...(match || {
                uid: firebaseUser.uid,
                emailVerified: firebaseUser.emailVerified,
                displayName: firebaseUser.displayName,
                email: firebaseUser.email,
                photoUrl: firebaseUser.photoURL,
                isOnboard: false, 
              }),
            };
          });
        }
      }
    }
  };
});
