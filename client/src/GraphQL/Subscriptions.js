import { gql } from "@apollo/client";

export const REPORT_ADDED_SUBSCRIPTION = gql`
  subscription {
    listen(topic: "reportAdded") {
      relatedNodeId
      relatedNode {
        nodeId
        ... on PollutionReport {
          id
          address
          createdAt
          isRelevant
          nodeId
          photoUrls
          reporter
          reporterImageUrl
          geom {
            x
            y
          }
        }
      }
    }
  }
`;

export const REPORT_IRRELEVANT_SUBSCRIPTION = gql`
  subscription {
    listen(topic: "reportIrrelevant") {
      relatedNodeId
      relatedNode {
        nodeId
        ... on PollutionReport {
          id
          geom {
            x
            y
          }
        }
      }
    }
  }
`;
