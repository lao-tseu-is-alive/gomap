<?php
/**
 * Created by PhpStorm.
 * User: cgil
 * Date: 2/17/17
 * Time: 11:29 AM
 */

require_once __DIR__ . '/../src/gomap-dbapi.php';

function getChantiers(){
    $sql = <<<EOT
SELECT row_to_json(fc)
FROM (SELECT
        'FeatureCollection'         AS type,
        array_to_json(array_agg(f)) AS features
      FROM (SELECT
              'Feature'                             AS TYPE,
              ST_AsGeoJSON(g.geom_polygon, 6) :: JSON AS GEOMETRY,
              row_to_json((SELECT l
                           FROM (SELECT
                                   idgochantier,
                                   nom,
                                   description,
                                   idcreator,
                                   datestart,dateend,
                                   st_x(geom_point)                     AS x,
                                   st_y(geom_point)                     AS y,
                                   st_x(st_transform(geom_point, 4326)) AS lon,
                                   st_y(st_transform(geom_point, 4326)) AS lat
                                ) AS l
                          ))                        AS properties
            FROM gochantier AS g            
           ) AS f
     ) AS fc
EOT;
    try {
        $dbCon = dbGoConnect();
        $stmt   = $dbCon->query($sql);
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $dbCon = null;
        return $data[0]['row_to_json'];

    }
    catch (PDOException $e) {
        return '{"error":{"text":'. $e->getMessage() .'}}';
    }

}


function newChantiers($request){
    $sql = <<<EOT
INSERT INTO public.gochantier(
            nom, description, 
            idcreator, datestart, dateend, 
            geom_point)
    VALUES (:name, :description, 
            7, :datestart, :dateend, 
            st_geomfromtext(:geom_point,21781));
EOT;

    $data = $request->getParsedBody();
    $data = [];
    $data['name'] = filter_var(trim($data['name']), FILTER_SANITIZE_STRING);

    $data['description'] = filter_var(trim($data['description']), FILTER_SANITIZE_STRING);
    $data['datestart'] = filter_var(trim($data['datestart']), FILTER_SANITIZE_STRING);
    $data['dateend'] = filter_var(trim($data['dateend']), FILTER_SANITIZE_STRING);
    $data['geom_point'] = filter_var(trim($data['geom_point']), FILTER_SANITIZE_STRING);
    try {
        $dbCon = dbGoConnect();
        $stmt   = $dbCon->prepare($sql);
        if (strlen($data['name']) < 1 ) {
            $data['name'] = null;
            $stmt->bindParam('name', $data['name'],PDO::PARAM_NULL );
        } else {
            $stmt->bindParam('name', $data['name'],PDO::PARAM_STR );
        }
        if (strlen($data['description']) < 1 ) {
            $data['description'] = null;
            $stmt->bindParam('description', $data['description'],PDO::PARAM_NULL );
        } else {
            $stmt->bindParam('description', $data['description'] );
        }
        if (strlen($data['datestart']) < 1 ) {
            $data['datestart'] = null;
            $stmt->bindParam('datestart', $data['datestart'],PDO::PARAM_NULL );
        } else {
            $stmt->bindParam('datestart', $data['datestart'] );
        }
        if (strlen($data['dateend']) < 1 ) {
            $data['dateend'] = null;
            $stmt->bindParam('dateend', $data['dateend'],PDO::PARAM_NULL );
        } else {
            $stmt->bindParam('dateend', $data['dateend'] );
        }
        if (strlen($data['geom_point']) < 1 ) {
            $data['geom_point'] = null;
            $stmt->bindParam('geom_point', $data['geom_point'],PDO::PARAM_NULL );
        } else {
            $stmt->bindParam('geom_point', $data['geom_point'] );
        }
        $stmt->execute();
        $new_id = $dbCon->lastInsertId();
        //echo(print_r($cinemas[0]['row_to_json']));
        $dbCon = null;
        return $new_id;

    }
    catch (PDOException $e) {
        return '{"error":{"text":'. $e->getMessage() . '}}';
    }

}