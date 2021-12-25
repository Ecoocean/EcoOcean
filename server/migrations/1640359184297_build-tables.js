/* eslint-disable camelcase */

const fs = require("fs");
exports.shorthands = undefined;

exports.up = pgm => {

    pgm.createTable('users', {
        uid: { type: 'text', primaryKey: true },
        displayName: { type: 'text', notNull: false },
        email: { type: 'text', notNull: false },
        emailVerified: { type: 'boolean', notNull: false },
        photoUrl: { type: 'text', notNull: false },
        isOnboarded: { type: 'boolean', notNull: false },
        isAdmin: { type: 'boolean', notNull: false },
        isReporter: { type: 'boolean', notNull: false },
        hasChartAccess: { type: 'boolean', notNull: false },
    });

    pgm.createTable('pollution_reports', {
        id: 'id',
        geom: { type: 'geometry(Point,4326)', notNull: false },
        reporter: { type: 'text', notNull: false },
        reporterImageUrl: { type: 'text', notNull: false },
        type: { type: 'text', notNull: false },
        isRelevant: { type: 'boolean', notNull: false },
        address: { type: 'text', notNull: false },
        photoUrls: { type: 'text[]', notNull: false },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });

    pgm.createTable('gvulot', {
        id: 'id',
        geom: { type: 'geometry(MultiPolygon,4326)', notNull: false },
        muni_heb: { type: 'text', notNull: false },
        muni_eng: { type: 'text', notNull: false },
    });

    pgm.createTable('pub_sens', {
        id: 'id',
        geom: { type: 'geometry(MultiPolygon,4326)', notNull: false },
    });


    pgm.createType( 'jwt_token', {
        role: 'text',
        uid: { type: 'text' },
        displayName: { type: 'text' },
    });

    pgm.createRole("anonymous", []);
    pgm.createRole("ecoocean_user", []);
    pgm.createRole("admin", []);


    // get_location_pollution_reports function
    pgm.sql(fs.readFileSync('./sql_files/get_location_pollution_reports.sql').toString());

    // sign in client
    pgm.sql(fs.readFileSync('./sql_files/signin_client.sql').toString());

    //sign in admin
    pgm.sql(fs.readFileSync('./sql_files/signin_admin.sql').toString());

    pgm.sql("GRANT EXECUTE ON FUNCTION signin_client(user_id text) TO anonymous;");
    pgm.sql("GRANT EXECUTE ON FUNCTION signin_admin(user_id text) TO anonymous;");
    pgm.sql("GRANT EXECUTE ON FUNCTION get_location_pollution_reports(xmin double precision, ymin double precision, xmax double precision, ymax double precision) TO ecoocean_user;");

    pgm.sql("GRANT ALL ON users TO admin;");

    pgm.sql("GRANT ALL ON pollution_reports TO admin;");

    pgm.sql("GRANT SELECT ON pollution_reports TO ecoocean_user;");

    pgm.sql("GRANT INSERT ON pollution_reports TO ecoocean_user;");

    pgm.sql("GRANT UPDATE ON pollution_reports TO ecoocean_user;");

    pgm.sql("GRANT SELECT ON gvulot TO ecoocean_user;");

    pgm.sql("GRANT SELECT ON gvulot TO ecoocean_user;");

    pgm.sql("GRANT SELECT ON pub_sens TO ecoocean_user;");

    pgm.sql("GRANT USAGE, SELECT ON SEQUENCE pollution_reports_id_seq TO ecoocean_user;");

    pgm.sql("GRANT anonymous, ecoocean_user, admin TO postgres;");

    pgm.sql(fs.readFileSync('./sql_files/pollution_report_added.sql').toString());

    pgm.sql(fs.readFileSync('./sql_files/pollution_report_irrelevant.sql').toString());

    pgm.sql(fs.readFileSync('./sql_files/pollution_added_trigger.sql').toString());

    pgm.sql(fs.readFileSync('./sql_files/pollution_irrelevant_trigger.sql').toString());
};

exports.down = pgm => {};
