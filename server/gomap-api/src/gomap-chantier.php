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
                                   planified_datestart ,
                                   planified_dateend ,
                                   real_datestart ,
                                   real_dateend,                                   
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
INSERT INTO public.gochantier(nom, description, 
            idcreator, planified_datestart, planified_dateend,
            real_datestart, real_dateend, 
            geom_polygon)
    VALUES (:name, :description, 
            7, :planified_datestart, :planified_dateend, 
            :real_datestart, :real_dateend,
            st_geomfromtext(:geom_polygon,21781));
EOT;


    $request_data = $request->getParsedBody();
    $data = [];
    $data['name'] = filter_var(trim($request_data['name']), FILTER_SANITIZE_STRING);

    $data['description'] = filter_var(trim($request_data['description']), FILTER_SANITIZE_STRING);
    $data['planified_datestart'] = filter_var(trim($request_data['planified_datestart']), FILTER_SANITIZE_STRING);
    $data['planified_dateend'] = filter_var(trim($request_data['planified_dateend']), FILTER_SANITIZE_STRING);
    $data['real_datestart'] = filter_var(trim($request_data['real_datestart']), FILTER_SANITIZE_STRING);
    $data['real_dateend'] = filter_var(trim($request_data['real_dateend']), FILTER_SANITIZE_STRING);
    $data['geom_polygon'] = filter_var(trim($request_data['geom_polygon']), FILTER_SANITIZE_STRING);
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
        if (strlen($data['planified_datestart']) < 1 ) {
            $data['planified_datestart'] = null;
            $stmt->bindParam('planified_datestart', $data['planified_datestart'],PDO::PARAM_NULL );
        } else {
            $stmt->bindParam('planified_datestart', $data['planified_datestart'] );
        }
        if (strlen($data['planified_dateend']) < 1 ) {
            $data['planified_dateend'] = null;
            $stmt->bindParam('planified_dateend', $data['planified_dateend'],PDO::PARAM_NULL );
        } else {
            $stmt->bindParam('planified_dateend', $data['planified_dateend'] );
        }

        if (strlen($data['real_datestart']) < 1 ) {
            $data['real_datestart'] = null;
            $stmt->bindParam('real_datestart', $data['real_datestart'],PDO::PARAM_NULL );
        } else {
            $stmt->bindParam('real_datestart', $data['real_datestart'] );
        }
        if (strlen($data['real_dateend']) < 1 ) {
            $data['real_dateend'] = null;
            $stmt->bindParam('real_dateend', $data['real_dateend'],PDO::PARAM_NULL );
        } else {
            $stmt->bindParam('real_dateend', $data['planified_dateend'] );
        }

        if (strlen($data['geom_polygon']) < 1 ) {
            $data['geom_polygon'] = null;
            $stmt->bindParam('geom_polygon', $data['geom_polygon'],PDO::PARAM_NULL );
        } else {
            $stmt->bindParam('geom_polygon', $data['geom_polygon'] );
        }
        $stmt->execute();
        $new_id = $dbCon->lastInsertId();
        //echo(print_r($cinemas[0]['row_to_json']));
        $dbCon = null;
        return $new_id;

    }
    catch (PDOException $e) {
        return '{"error":{"text":'. $e->getMessage() . ',"data":'. json_encode($data) . '}}';
    }

}

function saveChantiers($request, $id_chantier){
    $sql = <<<EOT
UPDATE public.gochantier SET 
    (nom, description, 
            idcreator, planified_datestart, planified_dateend,
            real_datestart, real_dateend, 
            geom_polygon) =
    (:name, :description, 
            7, :planified_datestart, :planified_dateend, 
            :real_datestart, :real_dateend,
            st_geomfromtext(:geom_polygon,21781))
WHERE idgochantier = :idgochantier;
EOT;


    $request_data = $request->getParsedBody();
    $data = [];
    $data['idgochantier'] = filter_var(trim($request_data['idgochantier']), FILTER_SANITIZE_NUMBER_INT);
    if ($id_chantier == 0) {
        return '{"error":{"reason ": "idgochantier is zero ","data":' . json_encode($data) . '}}';
    }
    if ($id_chantier <> $data['idgochantier']) {
        return '{"error":{"reason ": "' . $id_chantier . '<>' . $data['idgochantier'] . '","data":' . json_encode($data) . '}}';
    }


    $data['name'] = filter_var(trim($request_data['name']), FILTER_SANITIZE_STRING);
    $data['description'] = filter_var(trim($request_data['description']), FILTER_SANITIZE_STRING);
    $data['planified_datestart'] = filter_var(trim($request_data['planified_datestart']), FILTER_SANITIZE_STRING);
    $data['planified_dateend'] = filter_var(trim($request_data['planified_dateend']), FILTER_SANITIZE_STRING);
    $data['real_datestart'] = filter_var(trim($request_data['real_datestart']), FILTER_SANITIZE_STRING);
    $data['real_dateend'] = filter_var(trim($request_data['real_dateend']), FILTER_SANITIZE_STRING);
    $data['geom_polygon'] = filter_var(trim($request_data['geom_polygon']), FILTER_SANITIZE_STRING);
    try {
        $dbCon = dbGoConnect();
        $stmt   = $dbCon->prepare($sql);

        if (strlen($data['idgochantier']) < 1 ) {
            $data['idgochantier'] = null;
            $stmt->bindParam('idgochantier', $data['idgochantier'],PDO::PARAM_NULL );
        } else {
            $stmt->bindParam('idgochantier', $data['idgochantier'],PDO::PARAM_INT );
        }

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
        if (strlen($data['planified_datestart']) < 1 ) {
            $data['planified_datestart'] = null;
            $stmt->bindParam('planified_datestart', $data['planified_datestart'],PDO::PARAM_NULL );
        } else {
            $stmt->bindParam('planified_datestart', $data['planified_datestart'] );
        }
        if (strlen($data['planified_dateend']) < 1 ) {
            $data['planified_dateend'] = null;
            $stmt->bindParam('planified_dateend', $data['planified_dateend'],PDO::PARAM_NULL );
        } else {
            $stmt->bindParam('planified_dateend', $data['planified_dateend'] );
        }

        if (strlen($data['real_datestart']) < 1 ) {
            $data['real_datestart'] = null;
            $stmt->bindParam('real_datestart', $data['real_datestart'],PDO::PARAM_NULL );
        } else {
            $stmt->bindParam('real_datestart', $data['real_datestart'] );
        }
        if (strlen($data['real_dateend']) < 1 ) {
            $data['real_dateend'] = null;
            $stmt->bindParam('real_dateend', $data['real_dateend'],PDO::PARAM_NULL );
        } else {
            $stmt->bindParam('real_dateend', $data['planified_dateend'] );
        }

        if (strlen($data['geom_polygon']) < 1 ) {
            $data['geom_polygon'] = null;
            $stmt->bindParam('geom_polygon', $data['geom_polygon'],PDO::PARAM_NULL );
        } else {
            $stmt->bindParam('geom_polygon', $data['geom_polygon'] );
        }
        $stmt->execute();
        $new_id = $dbCon->lastInsertId();
        //echo(print_r($cinemas[0]['row_to_json']));
        $dbCon = null;
        return $new_id;

    }
    catch (PDOException $e) {
        return '{"error":{"text":'. $e->getMessage() . ',"data":'. json_encode($data) . '}}';
    }

}