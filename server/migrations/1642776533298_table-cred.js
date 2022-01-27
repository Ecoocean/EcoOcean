/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {

    pgm.sql("GRANT SELECT ON gvul_sens_intersect TO ecoocean_user;");

    pgm.sql("GRANT INSERT ON gvul_sens_intersect TO ecoocean_user;");

    pgm.sql("GRANT UPDATE ON gvul_sens_intersect TO ecoocean_user;");
};

exports.down = pgm => {};
