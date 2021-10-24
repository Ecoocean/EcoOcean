import { gql } from "apollo-server";

// The GraphQL schema
const typeDefs = gql`
  scalar Date
  scalar Upload

  type File {
    url: String!
    filename: String!
  }

  enum PollutionType {
    TRASH
    TAR
    OIL
  }

  type GeoLocation {
    latitude: Float!
    longitude: Float!
  }

  type PollutionReport {
    id: ID
    reporter: String!
    location: GeoLocation!
    created_at: Date!
    type: PollutionType!
    address: String
    photoUrls: [String]
    reporterImageUrl: String
    isRelevant: Boolean!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    profileImageUrl: String
    token: String
  }

  type Mutation {
    createPollutionReport(
      latitude: Float!
      longitude: Float!
      reporter: String!
      type: PollutionType!
      files: [Upload]
      reporterImageUrl: String
      isRelevant: Boolean!
    ): PollutionReport

    setReportUnrelevant(reportId: String!): Boolean!
  }

  type Query {
    getAllPollutionReports: [PollutionReport]!
  }

  type Subscription {
    reportAdded: PollutionReport!
    reportUnrelevant: PollutionReport!
  }
`;

export default typeDefs;
