import { gql } from "@apollo/client";

export const REPORT_ADDED_SUBSCRIPTION = gql`
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

export const REPORT_UNRELEVANT_SUBSCRIPTION = gql`
  subscription OnReportUnrelevant {
    reportUnrelevant {
      location {
        latitude
        longitude
      }
      id
    }
  }
`;
