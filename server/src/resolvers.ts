import { db, admin, auth } from "./firestore";
import { GeoPoint } from "@google-cloud/firestore";
import { GraphQLUpload } from "graphql-upload";
import { saveFileToFireStorage } from "./fileUploader";
import { pubsub } from "./index";
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
      Subscription: {
        reportAdded: {
          subscribe: () => pubsub.asyncIterator(["REPORT_ADDED"]),
        },
        reportUnrelevant: {
          subscribe: () => pubsub.asyncIterator(["REPORT_UNRELEVANT"]),
        },
      },
      Query: {
        getUserByUID: async (parentValue, args) => {
          const snapshot = await db.collection("user").doc(args.uid).get();
          return snapshot.data();
        },
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
        },
        getAllPollutionReports: async () => {
          const snapshot = await db
            .collection("pollution_report")
            .where("isRelevant", "==", true)
            .orderBy("created_at", "desc")
            .get();
          const output = snapshot.docs.map((doc) => doc.data());
          return output;
        },
      },
      Mutation: {
        setUserPermissionField: async (parent, args) => {
          db.collection("user")
            .doc(args.uid)
            .update({
              [`permissions.${args.fieldName}`]: args.value,
            });
        },
    
        setReportUnrelevant: async (parent, args) => {
          const ref = db.collection("pollution_report").doc(args.reportId);
          const report = await ref.get();
          ref.update({ isRelevant: false });
          pubsub.publish("REPORT_UNRELEVANT", { reportUnrelevant: report.data() });
          return true;
        },
        createPollutionReport: async (parent, args) => {
          const urls = await Promise.all(
            args.files.map(async (file) => {
              const { createReadStream, filename } = await file;
              return await saveFileToFireStorage(filename, createReadStream());
            })
          );
          const timestamp = admin.firestore.Timestamp.fromDate(new Date());
          const geohash = geofire.geohashForLocation([args.latitude, args.longitude]);
          const ref = db.collection("pollution_report").doc();
          const pollutionReport = {
            id: ref.id,
            reporterImageUrl: args.reporterImageUrl,
            reporter: args.reporter,
            geohash: geohash,
            location: new GeoPoint(args.latitude, args.longitude),
            type: args.type,
            created_at: timestamp,
            photoUrls: urls,
            address: null,
            isRelevant: args.isRelevant,
          };
          await ref.set(pollutionReport);
          openGeocoder()
            .reverse(args.longitude, args.latitude)
            .end((err, res) => {
              if (res) {
                pollutionReport.address = res.display_name;
                ref.update({ address: res.display_name });
              }
              if (err) {
                console.log(err);
              }
              pubsub.publish("REPORT_ADDED", { reportAdded: pollutionReport });
            });
          return pollutionReport;
        },
      },
    }
  };
});
