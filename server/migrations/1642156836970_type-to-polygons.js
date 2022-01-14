/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addColumns('polygon_reports', {
        type: { type: 'text', notNull: false },
    });

    pgm.dropColumns('pollution_reports', ['type']);

};

exports.down = pgm => {};
