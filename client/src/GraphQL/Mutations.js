import { gql } from "@apollo/client";

export const CREATE_POLLUTION_REPORT = gql`
  mutation createPollutionReport(
    $polygons: [PolygonInput]
    $files: [Upload]
    $input: CreatePollutionReportInput!
  ) {
    createPollutionReportExtend(
      polygons: $polygons
      files: $files
      input: $input
    ) {
      pollutionReport {
        id
      }
    }
  }
`;

export const SET_REPORT_UNRELEVANT = gql`
  mutation updatePollutionReport(
    $input:  UpdatePollutionReportInput!
  ) {
    updatePollutionReport(input: $input) {
      pollutionReport {
        id
      }
    }
  }
`;

export const SIGN_IN_CLIENT = gql`
  mutation signinClient($input: SigninClientInput!) {
    signinClient(input: $input) {
      jwtToken
    }
  }
`;
