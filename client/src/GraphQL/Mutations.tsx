import { gql } from "@apollo/client";

export const CREATE_POLLUTION_REPORT = gql`
  mutation createPollutionReport(
    $latitude: Float!
    $longitude: Float!
    $type: PollutionType!
    $images: [Upload]
  ) {
    createPollutionReport(
      latitude: $latitude
      longitude: $longitude
      type: $type
      images: $images
    ) {
      created_at
    }
  }
`;

export const UPLOAD_FILE_MUTATION = gql`
  mutation ($file: Upload!) {
    uploadFile(file: $file)
  }
`;
