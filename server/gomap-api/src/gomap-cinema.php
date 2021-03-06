<?php
/**
 * Created by PhpStorm.
 * User: cgil
 * Date: 2/17/17
 * Time: 11:29 AM
 */

require_once __DIR__ . '/../src/gomap-dbapi.php';

function getCinemas(){
    $sql = <<<EOT
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
                                   description,
                                   iconeurl,
                                   infourl,
                                   datestart,dateend,
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
EOT;
    try {
        $dbCon = dbGoConnect();
        $stmt   = $dbCon->query($sql);
        $cinemas = $stmt->fetchAll(PDO::FETCH_ASSOC);
        //echo(print_r($cinemas[0]['row_to_json']));
        $dbCon = null;
        return $cinemas[0]['row_to_json'];

    }
    catch (PDOException $e) {
        return '{"error":{"text":'. $e->getMessage() .'}}';
    }

}


function newCinema($request){
    $sql = <<<EOT
INSERT INTO public.geoobject(
            idtypegeoobject, nom, description, iconeurl, infourl, 
            idcreator, datestart, dateend, 
            geom_point)
    VALUES (78, :name, :description, :iconeurl, :infourl, 
            7, :datestart, :dateend, 
            st_geomfromtext(:geom_point,21781));
EOT;

    $data = $request->getParsedBody();
    $cinema_data = [];
    $cinema_data['name'] = filter_var(trim($data['name']), FILTER_SANITIZE_STRING);

    $cinema_data['description'] = filter_var(trim($data['description']), FILTER_SANITIZE_STRING);
    $cinema_data['iconeurl'] = filter_var(trim($data['iconeurl']), FILTER_SANITIZE_STRING);
    $cinema_data['infourl'] = filter_var(trim($data['infourl']), FILTER_SANITIZE_STRING);
    $cinema_data['datestart'] = filter_var(trim($data['datestart']), FILTER_SANITIZE_STRING);
    $cinema_data['dateend'] = filter_var(trim($data['dateend']), FILTER_SANITIZE_STRING);
    $cinema_data['geom_point'] = filter_var(trim($data['geom_point']), FILTER_SANITIZE_STRING);
    try {
        $dbCon = dbGoConnect();
        $stmt   = $dbCon->prepare($sql);
        if (strlen($cinema_data['name']) < 1 ) {
            $cinema_data['name'] = null;
            $stmt->bindParam('name', $cinema_data['name'],PDO::PARAM_NULL );
        } else {
            $stmt->bindParam('name', $cinema_data['name'],PDO::PARAM_STR );
        }
        if (strlen($cinema_data['description']) < 1 ) {
            $cinema_data['description'] = null;
            $stmt->bindParam('description', $cinema_data['description'],PDO::PARAM_NULL );
        } else {
            $stmt->bindParam('description', $cinema_data['description'] );
        }
        if (strlen($cinema_data['iconeurl']) < 1 ) {
            $cinema_data['iconeurl'] = null;
            $stmt->bindParam('iconeurl', $cinema_data['iconeurl'],PDO::PARAM_NULL );
        } else {
            $stmt->bindParam('iconeurl', $cinema_data['iconeurl'] );
        }
        if (strlen($cinema_data['infourl']) < 1 ) {
            $cinema_data['infourl'] = null;
            $stmt->bindParam('infourl', $cinema_data['infourl'],PDO::PARAM_NULL );
        } else {
            $stmt->bindParam('infourl', $cinema_data['infourl'] );
        }
        if (strlen($cinema_data['datestart']) < 1 ) {
            $cinema_data['datestart'] = null;
            $stmt->bindParam('datestart', $cinema_data['datestart'],PDO::PARAM_NULL );
        } else {
            $stmt->bindParam('datestart', $cinema_data['datestart'] );
        }
        if (strlen($cinema_data['dateend']) < 1 ) {
            $cinema_data['dateend'] = null;
            $stmt->bindParam('dateend', $cinema_data['dateend'],PDO::PARAM_NULL );
        } else {
            $stmt->bindParam('dateend', $cinema_data['dateend'] );
        }
        if (strlen($cinema_data['geom_point']) < 1 ) {
            $cinema_data['geom_point'] = null;
            $stmt->bindParam('geom_point', $cinema_data['geom_point'],PDO::PARAM_NULL );
        } else {
            $stmt->bindParam('geom_point', $cinema_data['geom_point'] );
        }
        $stmt->execute();
        $cinema_id = $dbCon->lastInsertId();
        //echo(print_r($cinemas[0]['row_to_json']));
        $dbCon = null;
        return $cinema_id;

    }
    catch (PDOException $e) {
        return '{"error":{"text":'. $e->getMessage() . '}}';
    }

}