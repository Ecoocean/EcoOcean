import { gql } from "@apollo/client";

export const CREATE_POLLUTION_REPORT = gql`
  mutation createPollutionReport(
    $geometries: [GeoJSON]
    $files: [Upload]
    $input: CreatePollutionReportInput!
  ) {
    createPollutionReportExtend(
      geometries: $geometries
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
