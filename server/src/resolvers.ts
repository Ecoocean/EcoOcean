import { db, admin } from './firestore'
import { GeoPoint } from '@google-cloud/firestore'

export const resolvers = {
    Query: {
      getAllPollutionReports: async ()  => {
        const snapshot = await db.collection('pollution_report').get();
        const output = snapshot.docs.map(doc => doc.data());
        return output;
      }
    },
    Mutation: {
        createPollutionReport: async (parent, args, context, info) =>{
          const timestamp = admin.firestore.Timestamp.fromDate(new Date())
          const ref = db.collection('pollution_report').doc();
          const pollutionReport = {
            id: ref.id,
            location: new GeoPoint(args.latitude, args.longitude),
            type: args.type,
            images: args.images,
            created_at: timestamp
          }
          await ref.set(pollutionReport);
          return pollutionReport;
        }
  }
}