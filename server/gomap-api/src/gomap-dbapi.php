<?php
/**
 * Created by PhpStorm.
 * User: cgil
 * Date: 2/13/17
 * Time: 2:59 PM
 */


function dbGoConnect() {

    include_once 'gomap-dbconfig.php';


    try {
        $goDbName=getgoDbName();
        $goDbUser=getgoDbUser();
        $goDbPassword=getgoDbPassword();
        $conn = new PDO ("pgsql:host=localhost;port=5432;dbname=$goDbName;user=$goDbUser;password=$goDbPassword");
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $conn;
    }
    catch (PDOException $e) {
        $srvmess = $e->getMessage();
        exit("\n\n<br/> ###### IMPOSSIBLE DE SE CONNECTER SUR CETTE BASE DE DONNEE : $goDbName  ###### \n\n");
    }
}
