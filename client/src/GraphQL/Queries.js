import { gql } from "@apollo/client";

export const GET_GVULOTS = gql`
  query getMunicipalsWithScore ($filterReports: PollutionReportFilter) {
    getMunicipalsWithScore (filterReports: $filterReports) { 
        id
        score
        reportCount
        muniHeb
        geom {
              geojson
         }
         gvulSensIntersectsByGvulId {
              sens {
                geom {
                    geojson
                }
                id
                score
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


