import { gql } from "@apollo/client";

export const CREATE_POLLUTION_REPORT = gql`
  mutation createPollutionReport(
    $files: [Upload]
    $input: CreatePollutionReportInput!
  ) {
    createPollutionReportExtend(
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
