import { db, admin, bucket } from "./firestore";
import { GeoPoint } from "@google-cloud/firestore";
const { GraphQLUpload } = require("graphql-upload");

const options = {
  action: "read",
  expires: "03-17-2025",
};

async function saveImage(filename, readable) {
  return new Promise((resolve, reject) => {
    const data = [];

    readable.on("data", (chunk) => {
      data.push(chunk);
    });

    readable.on("end", () => {
      var imageBuffer = new Uint8Array(Buffer.concat(data));
      var file = bucket.file(filename);
      file.save(
        imageBuffer,
        {
          metadata: { contentType: "image/png" },
        },
        (error) => {
          if (error) {
            console.log("error");
          }
          file.getSignedUrl(options).then((results) => {
            const url = results[0];
            console.log(`The signed url for ${filename} is ${url}.`);
            resolve(url);
          });
        }
      );
    });
  });
}

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
          return await saveImage(filename, createReadStream());
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
