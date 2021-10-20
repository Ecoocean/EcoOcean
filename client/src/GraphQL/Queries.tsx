import { gql } from "@apollo/client";

export const GET_ALL_POLLUTION_REPORTS = gql`
  query {
    getAllPollutionReports {
      id
      location {
        latitude
        longitude
      }
      address
      created_at
      reporter
      type
      photoUrls
    }
  }
`;
