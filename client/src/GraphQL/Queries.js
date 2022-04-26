import { gql } from "@apollo/client";
import { dateFilterVar } from "../cache";
//from server

export const GET_GVULOTS = gql`
  query getGvulotsGeoJson {
    gvulots {
      nodes {
        id
        muniHeb
        geom {
          geojson
        }
        gvulSensIntersectsByGvulId {
          nodes {
            sens {
              id
              geom {
                geojson
              }
            }
          }
        }
      }
    }
  }
`;
export const GET_SENS = gql`
  query getSensGeoJson {
    pubSens {
      nodes {
        id
        geom {
          geojson
        }
      }
    }
  }
`;


export const GET_LOCATION_REPORTS = gql`
  query getLocationPollutionReports($xmax: Float!, $xmin: Float!, $ymax: Float!, $ymin: Float!, $filter: PollutionReportFilter) {
    getLocationPollutionReports(xmax: $xmax, xmin: $xmin, ymax: $ymax, ymin: $ymin, filter: $filter) {
      nodes {
        municipalName
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
        polygonReports {
          nodes {
            type
            geom {
              geojson
            }
          }
        }
      }
    }
  }
`;


