import { gql } from "@apollo/client";

export const CREATE_POLLUTION_REPORT = gql`
  mutation createPollutionReport(
    $input: CreatePollutionReportInput!
  ) {
    createPollutionReport(
      input: $input
    ) {
      pollutionReport {
        id
      }
    }
  }
`;

export const SET_REPORT_UNRELEVANT = gql`
  mutation setReportUnrelevant($reportId: String!) {
    setReportUnrelevant(reportId: $reportId)
  }
`;
