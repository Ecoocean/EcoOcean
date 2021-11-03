import { gql } from "@apollo/client";

//from server
export const GET_USER_BY_UID = gql`
  query getUserByUID($uid: String!) {
    getUserByUID(uid: $uid) {
      uid
      permissions {
        isAdmin
      }
    }
  }
`;

export const GET_ALL_USERS = gql`
  query {
    allUsers {
      uid
      userInfo {
        displayName
        email
        emailVerified
        photoURL
      }
      metadata {
        creationTime
        lastRefreshTime
        lastSignInTime
      }
      permissions {
        isOnboard
        isAdmin
        isReporter
        hasChartAccess
      }
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
