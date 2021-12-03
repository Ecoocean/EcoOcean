import { InMemoryCache, makeVar } from "@apollo/client";


// all the reports
export const allPollutionReportsVar = makeVar([]);

//visible reports based on location in the map
export const filteredPollutionReportsVar = makeVar([]);

//indicator for knowing when location is changed -> computing filtered reports
export const loadingPollutionReportsVar = makeVar(false);

//the report that got clicked either in the list or in the map
export const selectedReportVar = makeVar(null);

//the report that got clicked on 'show in map'
export const selectedMapReportVar = makeVar(null);

// SnackBar Variables
export const showSnackBarVar = makeVar(false);
export const msgSnackBarVar = makeVar("");
export const severitySnackBarVar = makeVar("");


// Side bar variables
export const sideBarOpenTabVar = makeVar('home');
export const sideBarCollapsedVar = makeVar(true);

export const cache = new InMemoryCache({
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
