import { db, admin, auth } from "./firestore";
import { GeoPoint } from "@google-cloud/firestore";
import { GraphQLUpload } from "graphql-upload";
import { saveFileToFireStorage } from "./fileUploader";
import { pubsub } from "./index";
import openGeocoder from "node-open-geocoder";

export const resolvers = {
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
    allUsers: async (parentValue, args) => {
      const { users } = await auth.listUsers();
      return users;
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
      const ref = db.collection("pollution_report").doc();
      const pollutionReport = {
        id: ref.id,
        reporterImageUrl: args.reporterImageUrl,
        reporter: args.reporter,
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
};
