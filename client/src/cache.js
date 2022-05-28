import { InMemoryCache, makeVar } from "@apollo/client";

// all the reports
export const mainMapVar = makeVar(null);
export const locationMapVar = makeVar(null);

// all the reports
export const allPollutionReportsVar = makeVar([]);

export const reportPolyLayersVar = makeVar(new Map());

export const selectedBeachSegmentVar = makeVar(null);

export const gvulotVar = makeVar(null);

export const sensVar = makeVar(null);

//visible reports based on location in the map
export const filteredPollutionReportsVar = makeVar([]);

//indicator for knowing when location is changed -> computing filtered reports
export const loadingPollutionReportsVar = makeVar(false);

//indicator for loading of entire application and refresh data
export const loadingVar = makeVar(true);

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

//Filters vars
const tomorrowDate = new Date();
tomorrowDate.setDate(tomorrowDate.getDate() + 1);
export const dateStartFilterVar = makeVar(new Date(Date.now()));
export const dateEndFilterVar = makeVar(tomorrowDate);

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
