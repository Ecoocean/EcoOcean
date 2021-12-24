create function pollution_report_added_fun() returns trigger
    language plpgsql
as
$$
BEGIN
                PERFORM pg_notify(
                  'postgraphile:reportAdded',
                  json_build_object(
                    '__node__', json_build_array(
                      'pollution_reports', -- IMPORTANT: this is not always exactly the table name; base64
                              -- decode an existing nodeId to see what it should be.
                      NEW.id      -- The primary key (for multiple keys, list them all).
                    )
                  )::text
                );
                RETURN NEW;
        END;
$$;

alter function pollution_report_added_fun() owner to postgres;