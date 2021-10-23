import { InMemoryCache, makeVar } from "@apollo/client";

export const allPollutionReportsVar = makeVar([]);
export const filteredPollutionReportsVar = makeVar([]);
export const loadingPollutionReportsVar = makeVar(false);

export const cache: InMemoryCache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
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
