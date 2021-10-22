import { gql } from "@apollo/client";

export const REPORTS_SUBSCRIPTION = gql`
  subscription OnReportAdded {
    reportAdded {
      location {
        latitude
        longitude
      }
      id
      reporter
      created_at
      type
      address
      photoUrls
      reporterImageUrl
    }
  }
`;
