import { gql } from "@apollo/client";

export const ADD_USER = gql`
  mutation addUser($userInput: UserInput) {
    addUser(userInput: $userInput) {
      uid
    }
  }
`;

export const SET_USER_FIELD = gql`
  mutation setUserPermissionField(
    $uid: String!
    $fieldName: String!
    $value: Boolean!
  ) {
    setUserPermissionField(uid: $uid, fieldName: $fieldName, value: $value)
  }
`;
export const CREATE_POLLUTION_REPORT = gql`
  mutation createPollutionReport(
    $latitude: Float!
    $longitude: Float!
    $reporter: String!
    $type: PollutionType!
    $files: [Upload]
    $reporterImageUrl: String
    $isRelevant: Boolean = true
  ) {
    createPollutionReport(
      latitude: $latitude
      longitude: $longitude
      reporter: $reporter
      type: $type
      files: $files
      reporterImageUrl: $reporterImageUrl
      isRelevant: $isRelevant
    ) {
      id
      location {
        latitude
        longitude
      }
      reporterImageUrl
      address
      created_at
      reporter
      type
      photoUrls
    }
  }
`;

export const SET_REPORT_UNRELEVANT = gql`
  mutation setReportUnrelevant($reportId: String!) {
    setReportUnrelevant(reportId: $reportId)
  }
`;
