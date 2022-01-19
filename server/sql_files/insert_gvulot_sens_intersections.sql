DO
$body$
    declare
gvul record;
        sen record;
BEGIN

FOR gvul in select * from gvulot
                              LOOP
    FOR sen in select * from pub_sens
                LOOP
                IF ST_Intersects(gvul.geom, sen.geom) THEN
                    INSERT INTO gvul_sens_intersect("sensId", "gvulId", "squareMeters", muni_heb, muni_eng)
                    VALUES (sen.id, gvul.id, ST_Area(st_intersection(gvul.geom, sen.geom) :: geography), gvul.muni_heb, gvul.muni_eng);
End IF;
end loop;
end loop;
END;
$body$
LANGUAGE 'plpgsql';