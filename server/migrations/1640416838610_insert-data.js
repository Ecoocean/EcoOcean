/* eslint-disable camelcase */

const fs = require("fs");
exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(fs.readFileSync('./sql_files/insert_users.sql').toString());

    pgm.sql(fs.readFileSync('./sql_files/insert_gvulot.sql').toString());
};

exports.down = pgm => {};
