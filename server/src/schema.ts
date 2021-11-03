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
  type UserMetadata {
    creationTime: Date
    lastRefreshTime: Date
    lastSignInTime: Date
  }

  type UserInfo {
    displayName: String!
    email: String!
    photoURL: String
    emailVerified: Boolean!
  }

  type UserPermissions {
    isOnboard: Boolean
    isAdmin: Boolean
    isReporter: Boolean
    hasChartAccess: Boolean
  }

  type User {
    uid: ID!
    userInfo: UserInfo
    metadata: UserMetadata
    permissions: UserPermissions
  }

  input UserInfoInput {
    displayName: String!
    email: String!
    photoURL: String
    emailVerified: Boolean!
  }

  input UserInput {
    uid: String
    userInfo: UserInfoInput
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

    addUser(userInput: UserInput): User

    setUserPermissionField(
      uid: String!
      fieldName: String!
      value: Boolean!
    ): Boolean
  }

  type Query {
    getAllPollutionReports: [PollutionReport]!
    allUsers: [User]!
    getUserByUID(uid: String!): User
  }

  type Subscription {
    reportAdded: PollutionReport!
    reportUnrelevant: PollutionReport!
  }
`;

export default typeDefs;
