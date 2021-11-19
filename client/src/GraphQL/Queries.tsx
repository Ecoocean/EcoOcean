import { gql } from "@apollo/client";
//from server

export const GET_BEACHES_GEOJSON = gql`
  query getBeachesGeoJson {
    beaches {
      nodes {
        geom {
          geojson
        }
      }
    }
}
`;

export const GET_LOCATION_REPORTS = gql`
  query getLocationPollutionReports($xmax: Float!, $xmin: Float!, $ymax: Float!, $ymin: Float!) {
    getLocationPollutionReports(xmax: $xmax, xmin: $xmin, ymax: $ymax, ymin: $ymin) {
      nodes {
        address
        createdAt
        id
        geom {
          geojson
          x
          y
        }
        isRelevant
        photoUrls
        reporter
        reporterImageUrl
        type
      }
  }
}
`;

export const GET_USER_BY_UID = gql`
  query user($uid: String!) {
    user(uid: $uid) {
      uid
      isAdmin
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
