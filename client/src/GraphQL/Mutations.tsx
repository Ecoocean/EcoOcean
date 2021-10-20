import { gql } from "@apollo/client";

export const CREATE_POLLUTION_REPORT = gql`
  mutation createPollutionReport(
    $latitude: Float!
    $longitude: Float!
    $reporter: String!
    $type: PollutionType!
    $files: [Upload]
  ) {
    createPollutionReport(
      latitude: $latitude
      longitude: $longitude
      reporter: $reporter
      type: $type
      files: $files
    ) {
      created_at
    }
  }
`;
