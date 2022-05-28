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
  
  input PolygonInput {
    geometry: GeoJSON!
    type: String!
    squareMeters: Float!
  }

  extend type User {
    metadata: UserMetadata
  }
  
  type Geom {
    geojson: GeoJSON
  }
  
  type PubSenExtended {
    id: Int
    score: Float
    geom: Geom
  }
  
  type GvulIntersectExtended {
    score: Float
    sens: PubSenExtended
  }
  
  type GvulExtended {
    id: Int
    reportCount: Int
    score: Float
    muniHeb: String
    geom: Geom
    gvulSensIntersectsByGvulId: [GvulIntersectExtended]
  }

  extend type Query {
    getMunicipalsWithScore(filterReports: PollutionReportFilter): [GvulExtended]
    getAllPollutionReports: [PollutionReport]!
    allUsers: [User]!
    getUserByUID(uid: String!): User
  }
  extend type Mutation {
    createPollutionReportExtend(polygons: [PolygonInput], files: [Upload], input: CreatePollutionReportInput!): CreatePollutionReportPayload
  }
`;

export default typeDefs;
