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
          // The pgClient on context is already in a transaction configured for the user:
          const { pgClient } = context;
          // Create a savepoint we can roll back to
          await pgClient.query("SAVEPOINT mutation_wrapper");
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
          const createReportDocument = /* GraphQL */ `
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
          const createPolyDocument = /* GraphQL */ `
            mutation createPolygonReport($input: CreatePolygonReportInput!) {
              createPolygonReport(
                input: $input
              ) {
                clientMutationId
              }
            }
          `;

          args.input.pollutionReport.photoUrls = urls;
          const variables = {input: args.input};
          // The name of the operation in your query document (optional)
          const {data, errors} = await graphql(
              info.schema,
              createReportDocument,
              null,
              context,
              variables,
              "createPollutionReport"
          );
          if (errors){
            await pgClient.query("ROLLBACK TO SAVEPOINT mutation_wrapper");
            return errors[0];
          }

          const gvulSensIntersectsQuery= /* GraphQL */ `query gvulSensIntersects($condition: GvulSensIntersectCondition) {
            gvulSensIntersects(condition: $condition) {
              nodes {
                squareMeters
              }
            }
          }`;
          const {data: sensIntersectData, errors: sensIntersectErrors} = await graphql(
              info.schema,
              gvulSensIntersectsQuery,
              null,
              context,
              {
                condition: {
                  sensId: args.input.pollutionReport.sensId,
                  gvulId: args.input.pollutionReport.gvulId
                }
              },
              "gvulSensIntersects"
          );
          if (sensIntersectErrors){
            await pgClient.query("ROLLBACK TO SAVEPOINT mutation_wrapper");
            return sensIntersectErrors[0];
          }

          const sensSquareMeters = sensIntersectData.gvulSensIntersects.nodes[0].squareMeters;

          await Promise.all( args.polygons?.map(async (polygon) => {
            const {data: dataPoly, errors: errorsPoly} = await graphql(
                info.schema,
                createPolyDocument,
                null,
                context,
                {
                  input: {
                    polygonReport: {
                      percentageOfSens: (polygon.squareMeters / sensSquareMeters) * 100,
                      squareMeters: polygon.squareMeters,
                      type: polygon.type,
                      geom: polygon.geometry,
                      pollutionReportId: data.createPollutionReport.pollutionReport.id
                    }
                  }
                },
                "createPolygonReport"
            );
            if (errorsPoly){
              await pgClient.query("ROLLBACK TO SAVEPOINT mutation_wrapper");
              return errorsPoly[0];
            }
          }));
          await pgClient.query("RELEASE SAVEPOINT mutation_wrapper");
          return data;
          }
        },
        Query: {
          getMunicipalsWithScore: async (parent, args, context, info) => {

            const document = /* GraphQL */`
               query gvulots ($filterReports: PollutionReportFilter) {
                 gvulots {
                    nodes {
                      id
                      muniHeb
                      geom {
                        geojson
                      }
                      pollutionReportsByGvulId (filter: $filterReports) {
                        nodes {
                          sensId
                          gvulId
                          polygonReports {
                            nodes {
                              percentageOfSens
                              type
                              squareMeters
                            }
                          }
                        }
                      }
                      gvulSensIntersectsByGvulId {
                        nodes {
                          sens {
                            geom {
                              geojson
                            }
                            id
                          }
                        }
                      }
                    }
                  }
                 }
              `;
            const {data, errors} = await graphql(
                info.schema,
                document,
                null,
                context,
                {
                  filterReports: args.filterReports
                },
            );
            if (errors){
              return errors;
            }

            data.gvulots?.nodes.forEach((gvul) => {
              gvul.gvulSensIntersectsByGvulId?.nodes.forEach(({ sens }) => {
                sens.score = 0;
                gvul.pollutionReportsByGvulId?.nodes.forEach((report) => {
                    report.polygonReports?.nodes.forEach((polyReport) => {
                      if(sens.id === report.sensId){
                        sens.score += polyReport.percentageOfSens
                      }
                    })
                });
              });
            });

            data.gvulots.nodes = data.gvulots?.nodes.map((gvul) => {
              return {
                ...gvul,
                gvulSensIntersectsByGvulId: gvul.gvulSensIntersectsByGvulId.nodes
              }
            })
            return data.gvulots.nodes;
          },
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
