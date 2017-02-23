<?php
/**
 * Created by PhpStorm.
 * User: cgil
 * Date: 2/17/17
 * Time: 11:29 AM
 */

require_once __DIR__ . '/../src/gomap-dbapi.php';

function getAdresses()
{
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
            FROM adresse_region_lausanne_adr2 AS g            
           ) AS f
     ) AS fc
EOT;
    try {
        $dbCon = dbGoConnect();
        $stmt = $dbCon->query($sql);
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $dbCon = null;
        return $data[0]['row_to_json'];

    } catch (PDOException $e) {
        return '{"error":{"text":' . $e->getMessage() . '}}';
    }

}


function findAdresses($request)
{
    $sql = <<<EOT
SELECT array_to_json(array_agg(f)) AS json_data
FROM (
  SELECT
    coord_x_mn03::TEXT || '_' || coord_y_mn03 AS id,
    coalesce(rue, '') || ' ' || coalesce(entree, '') || ' , ' ||
    coalesce(num_postal :: TEXT, '') || ' ' || coalesce(commune_abrege, '') AS label
  FROM adresse_region_lausanne_adr2
  WHERE textsearch @@ to_tsquery(:search)
  ORDER BY label
) as f;
EOT;

    $request_data = $request->getParsedBody();
    $data = [];
    if (strlen($request_data['search']) > 1) {
        $data['search'] = filter_var(trim($request_data['search']), FILTER_SANITIZE_STRING);
    } else {
        $data['search'] = filter_var(trim($request_data['query']), FILTER_SANITIZE_STRING);
    }
    //$data['search'] = iconv('UTF-8','ASCII//TRANSLIT',$data['search']);
    //$data['search'] = json_decode($data['search']);
    $unwanted_array = array(    'Š'=>'S', 'š'=>'s', 'Ž'=>'Z', 'ž'=>'z', 'À'=>'A', 'Á'=>'A', 'Â'=>'A', 'Ã'=>'A', 'Ä'=>'A', 'Å'=>'A', 'Æ'=>'A', 'Ç'=>'C', 'È'=>'E', 'É'=>'E',
                            'Ê'=>'E', 'Ë'=>'E', 'Ì'=>'I', 'Í'=>'I', 'Î'=>'I', 'Ï'=>'I', 'Ñ'=>'N', 'Ò'=>'O', 'Ó'=>'O', 'Ô'=>'O', 'Õ'=>'O', 'Ö'=>'O', 'Ø'=>'O', 'Ù'=>'U',
                            'Ú'=>'U', 'Û'=>'U', 'Ü'=>'U', 'Ý'=>'Y', 'Þ'=>'B', 'ß'=>'Ss', 'à'=>'a', 'á'=>'a', 'â'=>'a', 'ã'=>'a', 'ä'=>'a', 'å'=>'a', 'æ'=>'a', 'ç'=>'c',
                            'è'=>'e', 'é'=>'e', 'ê'=>'e', 'ë'=>'e', 'ì'=>'i', 'í'=>'i', 'î'=>'i', 'ï'=>'i', 'ð'=>'o', 'ñ'=>'n', 'ò'=>'o', 'ó'=>'o', 'ô'=>'o', 'õ'=>'o',
                            'ö'=>'o', 'ø'=>'o', 'ù'=>'u', 'ú'=>'u', 'û'=>'u', 'ý'=>'y', 'þ'=>'b', 'ÿ'=>'y' );
    $data['search'] = strtr( $data['search'], $unwanted_array );
    $pattern = array('/\s\w\'/' , '/\s\s+/' , '/%|,|&|:/'   , '/\s\w{1,2}\s/');
    $replace = array(' '        , ' '       , ''        , ' ');
    $data['search'] = preg_replace($pattern, $replace, $data['search']);
    // et on remplace les espaces par des & pour que ts_query valide
    // et on rajoute :* devant les tokens (identique like gen% sur champ texte classique
    $data['search'] = preg_replace('/\s+/', ':* & ', $data['search']);
    // et aussi sur le dernier tokens
    $data['search'] = preg_replace('/(\w|[àâéèîôûü])$/', '${1}:*', $data['search']);
    // et finalement on remplace tous les accents par les lettres noramle


    try {
        $dbCon = dbGoConnect();
        // to debug as postgres $dbCon->exec("SELECT set_config('log_statement', 'all', true);");
        $stmt = $dbCon->prepare($sql);

        if (strlen($data['search']) < 5) {
            return '{"error":{"reason ": "search is too short ","data":' . json_encode($data) . '}}';
        } else {
            $stmt->bindParam('search', $data['search'], PDO::PARAM_STR);
        }

        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $dbCon = null;
        if (count($result[0]['json_data']) >0) {
            return $result[0]['json_data'];
        } else {
            return '{"error":{"reason ": "no records found ","data":' . ($data['search']) . '}}';
        }

    } catch (PDOException $e) {
        return '{"error":{"text":' . $e->getMessage() . ',"data":' . json_encode($data) . '}}';
    }

}