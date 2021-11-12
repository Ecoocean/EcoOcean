import { gql } from "@apollo/client";
//from server

export const GET_LOCATION_REPORTS = gql`
  query getLocationPollutionReports($latitude: Float!, $longitude: Float!, $radiusInM: Float!) {
    getLocationPollutionReports(latitude: $latitude, longitude: $longitude, radiusInM: $radiusInM) {
      id
      geohash
      location {
        latitude
        longitude
      }
      reporterImageUrl
      address
      created_at
      reporter
      type
      photoUrls
    }
  }
`;

export const GET_USER_BY_UID = gql`
  query getUserByUID($uid: String!) {
    getUserByUID(uid: $uid) {
      uid
    }
  }
`;
export const GET_ALL_POLLUTION_REPORTS = gql`
  query {
    getAllPollutionReports {
      id
      location {
        latitude
        longitude
      }
      reporterImageUrl
      address
      created_at
      reporter
      type
      photoUrls
    }
  }
`;

//local from cache
export const GET_ALL_POLLUTION_REPORTS_LOCAL = gql`
  query GetAllPollutionReports {
    allPollutionReports @client
  }
`;

export const GET_FILTERED_POLLUTION_REPORTS_LOCAL = gql`
  query GetfilteredPollutionReports {
    filteredPollutionReports @client
  }
`;
