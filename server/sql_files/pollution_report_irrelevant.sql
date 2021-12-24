create function pollution_report_irrelevant_fun() returns trigger
    language plpgsql
as
$$
BEGIN
            IF OLD."isRelevant" != NEW."isRelevant" then
                PERFORM pg_notify(
                  'postgraphile:reportIrrelevant',
                  json_build_object(
                    '__node__', json_build_array(
                      'pollution_reports', -- IMPORTANT: this is not always exactly the table name; base64
                              -- decode an existing nodeId to see what it should be.
                      NEW.id      -- The primary key (for multiple keys, list them all).
                    )
                  )::text
                );
            END IF;
            RETURN NEW;
        END;
$$;

alter function pollution_report_irrelevant_fun() owner to postgres;