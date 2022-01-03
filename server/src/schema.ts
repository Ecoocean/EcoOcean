const { gql } = require("graphile-utils");

// The GraphQL schema
const typeDefs = gql`
  scalar Upload

  type File {
    url: String!
    filename: String!
  }
  
  type UserMetadata {
    creationTime: Date
    lastRefreshTime: Date
    lastSignInTime: Date
  }

  extend type User {
    metadata: UserMetadata
  }

  extend type Query {
    getAllPollutionReports: [PollutionReport]!
    allUsers: [User]!
    getUserByUID(uid: String!): User
  }
  extend type Mutation {
    createPollutionReportExtend(geometries: [GeoJSON], files: [Upload], input: CreatePollutionReportInput!): CreatePollutionReportPayload
  }
`;

export default typeDefs;
