import { gql } from "@apollo/client";
//from server

export const GET_GVULOTS_GEOJSON = gql`
  query getGvulotsGeoJson {
    gvulots {
      nodes {
        muniHeb
        geom {
          geojson
        }
      }
    }
  }
`;
export const GET_SENS_GEOJSON = gql`
  query getSensGeoJson {
    pubSens {
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


