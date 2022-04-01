/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql("ALTER TABLE pollution_reports \
    ADD COLUMN pollution_score int GENERATED ALWAYS AS (pollution_score_function( pollution_reports.length,pollution_reports. width,pollution_reports. depth)) STORED ;");
};

exports.down = pgm => {};
