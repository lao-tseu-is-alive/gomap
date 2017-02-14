SELECT row_to_json(fc)
FROM (SELECT
        'FeatureCollection'         AS type,
        array_to_json(array_agg(f)) AS features
      FROM (SELECT
              'Feature'                             AS TYPE,
              ST_AsGeoJSON(g.geom_point, 6) :: JSON AS GEOMETRY,
              row_to_json((SELECT l
                           FROM (SELECT
                                   idgeoobject,
                                   nom,
                                   infourl,
                                   st_x(geom_point)                     AS x,
                                   st_y(geom_point)                     AS y,
                                   st_x(st_transform(geom_point, 4326)) AS lon,
                                   st_y(st_transform(geom_point, 4326)) AS lat
                                ) AS l
                          ))                        AS properties
            FROM geoobject AS g
            WHERE idtypegeoobject = 78
           ) AS f
     ) AS fc