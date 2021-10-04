import {gql} from '@apollo/client'

export const CREATE_POLLUTION_REPORT = gql `
    mutation createPollutionReport(
        $altitude: Float!
        $longitude: Float!
        $type: PollutionType!
        ) {
        createPollutionReport(
            altitude: $altitude
            longitude: $longitude
            type: $type
            ) {
            created_at
        }
    }

`