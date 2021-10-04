import {
    REPORT_ADD_REQUEST,
    REPORT_ADD_SUCCESS,
    REPORT_ADD_FAIL,
    REPORTS_REQUEST,
    REPORTS_SUCCESS,
    REPORT_FAIL
  } from "../constants/pollutionReportConstants";

import { useQuery, useMutation } from '@apollo/client';


export const listPollutionReports = () => async (dispatch) => {
  const {error, loading, data} = useQuery(GET_ALL_POLLUTION_REPORTS);

};

export const addPollutionReport = (message, topicId, page) => {
  
}
 