import { InMemoryCache, makeVar } from "@apollo/client";

export const allPollutionReportsVar = makeVar([]);
export const filteredPollutionReportsVar = makeVar([]);
export const loadingPollutionReportsVar = makeVar(false);
export const selectedReportVar = makeVar(null);
export const selectedMapReportVar = makeVar(null);

export const cache: InMemoryCache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        selectedMapReport: {
          read() {
            return selectedMapReportVar();
          },
        },
        selectedReport: {
          read() {
            return selectedReportVar();
          },
        },
        loadingPollutionReports: {
          read() {
            return loadingPollutionReportsVar();
          },
        },
        allPollutionReports: {
          read() {
            return allPollutionReportsVar();
          },
        },
        filteredPollutionReports: {
          read() {
            return filteredPollutionReportsVar();
          },
        },
      },
    },
  },
});
