import { InMemoryCache, makeVar } from "@apollo/client";

export const allPollutionReportsVar = makeVar([]);
export const filteredPollutionReportsVar = makeVar([]);

export const cache: InMemoryCache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
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
