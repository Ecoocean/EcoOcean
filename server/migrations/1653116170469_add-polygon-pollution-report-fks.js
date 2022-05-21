/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addColumns('polygon_reports',{
        squareMeters :{ type: 'double', notNull: true},
        percentageOfSens :{ type: 'double', notNull: true},
    });

    pgm.addColumns('pollution_reports',{
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
        }
    })
};

exports.down = pgm => {};
