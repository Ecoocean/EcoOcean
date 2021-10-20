import { db, admin } from "./firestore";
import { GeoPoint } from "@google-cloud/firestore";
import { GraphQLUpload } from "graphql-upload";
import { saveFileToFireStorage } from "./fileUploader";

export const resolvers = {
  Upload: GraphQLUpload,
  Query: {
    getAllPollutionReports: async () => {
      const snapshot = await db.collection("pollution_report").get();
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
        location: new GeoPoint(args.latitude, args.longitude),
        type: args.type,
        created_at: timestamp,
        urls: urls,
      };
      await ref.set(pollutionReport);
      return pollutionReport;
    },
  },
};
