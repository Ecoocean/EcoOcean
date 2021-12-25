import { auth } from "./firestore";
import { GraphQLUpload } from "graphql-upload";
import { makeExtendSchemaPlugin } from "graphile-utils";
import typeDefs from "./schema";
import {saveFileToFireStorage} from "./fileUploader";
import NodeGeocoder from "node-geocoder";

const options = {
  provider: 'openstreetmap',
};

const geocoder = NodeGeocoder(options);

export const PostgresPlugin = makeExtendSchemaPlugin(build => {
  // Get any helpers we need from `build`
  const {graphql: {graphql}, pgSql: sql, inflection} = build;

  return {
    typeDefs: typeDefs,
    resolvers: {
      Upload: GraphQLUpload,

      Mutation: {
        createPollutionReportExtend: async (parent, args, context, info) => {
          const urls = await Promise.all(
              args.files.map(async (file) => {
                const {createReadStream, filename} = await file;
                return await saveFileToFireStorage(filename, createReadStream());
              })
          );
          const res = await geocoder.reverse({
            lat: args.input.pollutionReport.geom.coordinates[1],
            lon: args.input.pollutionReport.geom.coordinates[0]
          });

          if (res) {
            args.input.pollutionReport.address = res[0].formattedAddress;
          }
          const document = /* GraphQL */ `
            mutation createPollutionReport(
              $input: CreatePollutionReportInput!
            ) {
              createPollutionReport(
                input: $input
              ) {
                pollutionReport {
                  id
                }
              }
            }
          `;
          const operationName = "createPollutionReport";
          args.input.pollutionReport.photoUrls = urls;
          const variables = {input: args.input};
          // The name of the operation in your query document (optional)
          const {data, errors} = await graphql(
              info.schema,
              document,
              null,
              context,
              variables,
              operationName
          );
          if (errors){
            return errors[0];
          }
          return data;
          }
        },
        Query: {
          allUsers: async (parent, args, context, info) => {
            let {users} = await auth.listUsers();
            users = users.filter(({email, displayName}) => {
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
                    isOnboarded
                    isReporter
                    nodeId
                    photoUrl
                    uid
                  }
                }
              }
            `;
            // The name of the operation in your query document (optional)
            const {data, errors} = await graphql(
                info.schema,
                document,
                null,
                context,
            );
            if (errors){
              return errors;
            }

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
                  isOnboarded: false,
                }),
              };
            });
          }
        }
      }
    }
})
