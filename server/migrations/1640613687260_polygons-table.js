/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {

    pgm.createTable('polygon_reports', {
        geom: { type: 'geometry(Polygon,4326)', notNull: true },
        pollution_report_id: {
            type: 'integer',
            notNull: true,
            references: '"pollution_reports"',
            onDelete: 'cascade',
        },
    });

    pgm.createIndex('polygon_reports', 'pollution_report_id');

    pgm.sql("GRANT SELECT ON polygon_reports TO ecoocean_user;");

    pgm.sql("GRANT INSERT ON polygon_reports TO ecoocean_user;");

    pgm.sql("GRANT UPDATE ON polygon_reports TO ecoocean_user;");
};

exports.down = pgm => {};
