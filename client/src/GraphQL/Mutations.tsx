import { gql } from "@apollo/client";

export const CREATE_POLLUTION_REPORT = gql`
  mutation createPollutionReport(
    $latitude: Float!
    $longitude: Float!
    $reporter: String!
    $type: PollutionType!
    $files: [Upload]
    $reporterImageUrl: String
  ) {
    createPollutionReport(
      latitude: $latitude
      longitude: $longitude
      reporter: $reporter
      type: $type
      files: $files
      reporterImageUrl: $reporterImageUrl
    ) {
      created_at
    }
  }
`;
