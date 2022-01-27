/* eslint-disable camelcase */

const fs = require("fs");
exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('gvul_sens_intersect', {
        sensId: {
            type: 'integer',
            notNull: true,
            references: '"pub_sens"',
            onDelete: 'cascade',
        },
        gvulId: {
            type: 'integer',
            notNull: true,
            references: '"gvulot"',
            onDelete: 'cascade',
        },
        squareMeters: {
            type: 'double',
            notNull: true,
        },
        muni_heb: { type: 'text', notNull: false },
        muni_eng: { type: 'text', notNull: false },
    });
    pgm.sql(fs.readFileSync('./sql_files/insert_gvulot_sens_intersections.sql').toString());
};

exports.down = pgm => {};
