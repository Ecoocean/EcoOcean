import { gql } from "apollo-server";

// The GraphQL schema
const typeDefs = gql`
  scalar Date
  scalar Upload

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
    location: GeoLocation!
    created_at: Date!
    type: PollutionType!
    images: [Upload]
  }

  type Beach {
    name: String!
    location: GeoLocation!
  }

  type Mutation {
    addBeach(name: String!, latitude: Float!, longitude: Float!): Beach
    setBeach(name: String!, latitude: Float!, longitude: Float!): Beach
    createPollutionReport(
      latitude: Float!
      longitude: Float!
      type: PollutionType!
      images: [Upload]
    ): PollutionReport
  }

  type Query {
    getAllPollutionReports: [PollutionReport]!
    beaches: [Beach]!
    beach(name: String!): Beach
  }
`;

export default typeDefs;
