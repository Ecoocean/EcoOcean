const { gql } = require('graphile-utils');

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
    exportCsv: String
  }
  extend type Mutation {
    createPollutionReportExtend(
      files: [Upload]
      input: CreatePollutionReportInput!
    ): CreatePollutionReportPayload
  }
`;

export default typeDefs;
