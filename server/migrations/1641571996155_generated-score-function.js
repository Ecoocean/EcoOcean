/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql("create or replace function pollution_score_function(length int,width int,depth int) \
    returns int \
    language plpgsql \
    IMMUTABLE \
    as \
    $$ \
    begin \
       return length * width * depth; \
    end; \
    $$; \
    ");
};

exports.down = pgm => {};
