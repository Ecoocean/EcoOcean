/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {pgm.addColumns('pollution_reports',{
    length:{ type: 'int', notNull: false,default:0},
    width: { type: 'int', notNull: false,default:0},
    depth :{ type: 'int', notNull: false,default:0},
    coverage :{ type: 'int', notNull: false,default:0},
    cleaningStatus :{ type: 'text', notNull: false,default:null},
})};

exports.down = pgm => {};
