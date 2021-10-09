import { gql } from '@apollo/client'

export const GET_ALL_POLLUTION_REPORTS = gql `
    query {
        getAllPollutionReports {
            location {
                latitude
                longitude
            }
            created_at
            type
        }
    }
`