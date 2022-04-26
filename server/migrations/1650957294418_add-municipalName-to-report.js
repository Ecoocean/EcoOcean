/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addColumns('pollution_reports',{
        municipalName :{ type: 'text', notNull: false,default:null},
    })
};

exports.down = pgm => {

};
