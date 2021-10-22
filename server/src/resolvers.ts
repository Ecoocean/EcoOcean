import { db, admin } from "./firestore";
import { GeoPoint } from "@google-cloud/firestore";
import { GraphQLUpload } from "graphql-upload";
import { saveFileToFireStorage } from "./fileUploader";
import { pubsub } from "./index";
import openGeocoder from "node-open-geocoder";

export const resolvers = {
  Upload: GraphQLUpload,
  Subscription: {
    reportAdded: {
      // More on pubsub below
      subscribe: () => pubsub.asyncIterator(["REPORT_ADDED"]),
    },
  },
  Query: {
    getAllPollutionReports: async () => {
      const snapshot = await db
        .collection("pollution_report")
        .orderBy("created_at", "desc")
        .get();
      const output = snapshot.docs.map((doc) => doc.data());
      return output;
    },
  },
  Mutation: {
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
      };
      await ref.set(pollutionReport);
      openGeocoder()
        .reverse(args.longitude, args.latitude)
        .end((err, res) => {
          if (res) {
            console.log(res.address);
            ref.update({ address: res.display_name });
          }
        });
      pubsub.publish("REPORT_ADDED", { reportAdded: pollutionReport });
      return pollutionReport;
    },
  },
};
