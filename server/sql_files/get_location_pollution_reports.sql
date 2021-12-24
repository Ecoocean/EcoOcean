create function get_location_pollution_reports(xmin double precision, ymin double precision, xmax double precision, ymax double precision) returns SETOF pollution_reports
    stable
    language sql
as
$$
    -- Write our advanced query as a SQL query!
    select *
    from pollution_reports
   WHERE  pollution_reports."isRelevant" AND pollution_reports.geom && ST_MakeEnvelope($1 ,$2, $3, $4, 4326)
    ORDER BY pollution_reports.id DESC, pollution_reports.created_at ASC;
  -- End the function declaring the language we used as SQL and add the
  -- `STABLE` marker so PostGraphile knows its a query and not a mutation.
$$;

alter function get_location_pollution_reports(double precision, double precision, double precision, double precision) owner to postgres;