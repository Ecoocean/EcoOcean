/* eslint-disable camelcase */

const fs = require("fs");
exports.shorthands = undefined;

exports.up = pgm => {

    pgm.sql("TRUNCATE pub_sens CASCADE;");

    pgm.sql("GRANT SELECT ON pub_sens TO ecoocean_user;");

    pgm.sql("GRANT INSERT ON pub_sens TO ecoocean_user;");

    pgm.sql("GRANT UPDATE ON pub_sens TO ecoocean_user;");

    pgm.sql(fs.readFileSync('./sql_files/insert_pub_sens.sql').toString());
};

exports.down = pgm => {};
