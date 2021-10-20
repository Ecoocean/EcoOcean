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
    location: GeoLocation!
    created_at: Date!
    type: PollutionType!
    photoUrls: [String]
  }

  type User {
    id: ID!
    email: String!
    profileImage: String
    token: String
  }

  type Mutation {
    createPollutionReport(
      latitude: Float!
      longitude: Float!
      type: PollutionType!
      files: [Upload]
    ): PollutionReport

    singleUpload(file: Upload!): File!
  }

  type Query {
    getAllPollutionReports: [PollutionReport]!
  }
`;

export default typeDefs;
