<?php
error_reporting(E_ALL);
if (PHP_SAPI == 'cli-server') {
    // To help the built-in PHP dev server, check if the request was actually for
    // something which should probably be served as a static file
    $url = parse_url($_SERVER['REQUEST_URI']);
    $file = __DIR__ . $url['path'];
    if (is_file($file)) {
        return false;
    }
}
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require __DIR__ . '/../vendor/autoload.php';

session_start();

// Instantiate the app
$settings = require __DIR__ . '/../src/settings.php';
$app = new \Slim\App($settings);

$app->options('/{routes:.+}', function ($request, $response, $args) {
    return $response;
});

$app->add(function ($req, $res, $next) {
    $response = $next($req, $res);
    return $response
        ->withHeader('Access-Control-Allow-Origin', 'http://localhost:8080')
        ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
});

// Set up dependencies
require __DIR__ . '/../src/dependencies.php';

// Register middleware
require __DIR__ . '/../src/middleware.php';

// Register routes
//require __DIR__ . '/../src/routes.php';

require __DIR__ . '/../src/gomap-cinema.php';
require __DIR__ . '/../src/gomap-chantier.php';
require __DIR__ . '/../src/gomap-adresses.php';

//////////////////////////////////////////////////////////////////////////
$app->get('/cinemas', function (Request $request, Response $response, $args) {
    return $response->write(getCinemas());
});
//TODO  get user id and check if it's authorized to save and then use it in idcreator binding
$app->post('/cinema/new', function (Request $request, Response $response) {
    return $response->write(newCinema($request));
});

$app->get('/chantiers', function (Request $request, Response $response, $args) {
    return $response->write(getChantiers());
});
//TODO  get user id and check if it's authorized to save and then use it in idcreator binding
$app->post('/chantier/new', function (Request $request, Response $response) {
    $server_response = newChantiers($request);
    if (strpos($server_response, '{"error":') === false) {
        return $response->write($server_response);
    } else {
        $newResponse = $response->withStatus(502);
        return $newResponse->write($server_response);
    }

});

//TODO  get user id and check if it's authorized to save and then use it in idcreator binding
$app->post('/chantier/save/{id}', function (Request $request, Response $response, $args) {
    $chantier_id = (int)$args['id'];
    $server_response = saveChantiers($request, $chantier_id);
    if (strpos($server_response, '{"error":') === false) {
        return $response->write($server_response);
    } else {
        $newResponse = $response->withStatus(502);
        return $newResponse->write($server_response);
    }

});


$app->post('/adresses', function (Request $request, Response $response, $args) {
    /*$search = (string)$args['search'];
    if (strlen($search) < 3) {
        $newResponse = $response->withStatus(502);
        return $newResponse->write('{"error":{"reason ": "search is too short ","data":' . json_encode($search) . '}}');
    }
    */
    $server_response = findAdresses($request);
    if (strpos($server_response, '{"error":') === false) {
        return $response->write($server_response);
    } else {
        $newResponse = $response->withStatus(502);
        return $newResponse->write($server_response);
    }

});


// Run app
$app->run();
