import {gql} from '@apollo/client'

export const CREATE_POLLUTION_REPORT = gql `
    mutation createPollutionReport(
        $latitude: Float!
        $longitude: Float!
        $type: PollutionType!
        ) {
        createPollutionReport(
            latitude: $latitude
            longitude: $longitude
            type: $type
            ) {
            created_at
        }
    }

`