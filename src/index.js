/*
 index.js for testing webpack 2 integration as explained here
 https://www.youtube.com/watch?v=eWmkBNBTbMM
 */

//import './style/skeleton-plus/css/normalize.css';
//import './style/skeleton-plus/css/skeleton-plus.css';
import 'openlayers/css/ol.css';
import './style/ol3-layerswitcher.css';
import css from './style/base.css';
import ol from 'openlayers';
import './ol3-layerswitcher';

import init_map from './goeland_ol3_wmts';
import * as U from './htmlUtils';
import  messages from './messages';
import searchAddress from './searchAddress';
//import baseImg from './baseImage'; //to show something before real map loads

var app = U.getEl('app');
const Search = () => (searchAddress.searchAddress);

//begin of main page content definition
//TODO add toolbar with edit state nav-create-edit-del
const mainHtmlDiv = `
<div id="main" class="container-fluid">
 <div id="mainMenu" class="">  
    ${Search()}
    
 </div>
 
</div>
`;//end of main page content def
//app.innerHTML = mainHtmlDiv;

// if implemented this function get called on every click to the map
function getMapClickCoordsXY(x,y) {
    //TODO add togle buton to check if we are in 'insert mode'
    var feature = map.forEachFeatureAtPixel(map.getPixelFromCoordinate([x,y]), function(feature, layer) {
        //you can add a condition on layer to restrict the listener
        return feature;
    });
    if (feature) {
        //here you can add you code to display the coordinates or whatever you want to do
        var formatGeoJSON = new ol.format.GeoJSON();
        var formatWKT = new ol.format.WKT();
        var feature_object = feature.getProperties();
        if(DEV) {
            const strObj = U.dumpObject2String(feature_object);
            console.log(`## In getMapClickCoordsXY(${x},${y}) 
                    - found feature : \n ${strObj}`);

            //debugger;
            console.log(formatGeoJSON.writeFeature(feature));
            console.log(formatWKT.writeFeature(feature));
        }
        const CoordXY = U.getEl('obj_coordxy');
        CoordXY.value = formatWKT.writeFeature(feature);
        const obj_name = U.getEl('obj_name');
        obj_name.value = feature_object.name;
        const obj_url = U.getEl('obj_url');
        obj_url.value = feature_object.infourl;

    } else {
        //TODO display form to get other features properties
        addNewPointFeature2Layer(cinema_layer,x,y,'New cinema !');
    }

}

var lon = 537892.8;
var lat = 152095.7;
var zoom_level = 4;
//import proj4 from './proj4';
//proj4.defs("EPSG:21781", "+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=600000 +y_0=200000 +ellps=bessel +towgs84=674.4,15.1,405.3,0,0,0,0 +units=m +no_defs");
var position_Lausanne = [lon, lat];
var map = init_map('map', position_Lausanne, zoom_level);
const layerSwitcher = new ol.control.LayerSwitcher({tipLabel: 'Légende'});
map.addControl(layerSwitcher);

var createIconStyleCenterBottom = function (imagePath) {
    return new ol.style.Style({image: new ol.style.Icon({src: imagePath, opacity: 0.60, anchor: [0.5, 1.0]})})
};
/*
// on inclut l'image comme ressource dans le bundle webpack
const marker_blue = require('./images/marker_blue_32x58.png');
var coord_pfa3_180_stfrancois = [538224.21, 152378.17];
var eglise_stfrancois = new ol.Feature(new ol.geom.Point(coord_pfa3_180_stfrancois));
eglise_stfrancois.setStyle(createIconStyleCenterBottom(marker_blue));
var marker_layer = new ol.layer.Vector({source: new ol.source.Vector({features: [eglise_stfrancois]})});
map.addLayer(marker_layer);
var current_view = map.getView();
//current_view.setCenter(coord_pfa3_180_stfrancois);
//current_view.setZoom(6);
*/


//TODO refactor all this stuff to load a geojson layer inside the gomap library !
const marker_cinema = require('./images/cinema.png');
// now let's add another layer with geojson data
var geojson_url = '/data/cinema_geojson.json';
var vectorSource = new ol.source.Vector({
    url: geojson_url,
    format: new ol.format.GeoJSON({
        defaultDataProjection :'EPSG:21781',
        projection: 'EPSG:21781'

    })
});
var cinema_layer = new ol.layer.Vector({
    source: vectorSource,
    style: createIconStyleCenterBottom(marker_cinema)
});
map.addLayer(cinema_layer);
var listenerKey = vectorSource.on('change', function(e) {
    if (vectorSource.getState() == 'ready') {
        //TODO maybe add "loading icon" and here where to hide it
        // retrieve extent of all features to zoom only when loading of the layer via Ajax XHR is complete
        var extent = cinema_layer.getSource().getExtent();
        //TODO activate insert/edit toolbar buttons only when layer has finished loading
        map.getView().fit(extent, map.getSize());
        // and unregister the "change" listener
        ol.Observable.unByKey(listenerKey);
    }
});

function addNewPointFeature2Layer(layer, coord_x, coord_y, name){
    "use strict";
    const point = new ol.geom.Point([coord_x,coord_y]);
    const feature = new ol.Feature({
            name: name,
            geometry: point
        });
    const vector_source = layer.getSource()
    vector_source.addFeature(feature);
}


//END of "refactor all this stuff to load a geojson layer inside the gomap library !"

searchAddress.attachEl();

//////////////////////////////////////////////////////////////////////
//// EVENT HANDLERS



// gestion des click sur la carte
map.on('click', function(evt){
    if(DEV) {
        //debugger; // to stop in browser debug
        console.info(typeof (evt.coordinate)); // coord nationale suisse
        console.info(map.getPixelFromCoordinate(evt.coordinate)); // coord pixel
    }

    if (window.parent.getMapClickCoordsXY == null) {
        //we are not inside an iframe or the iframe doesn't have a function called getMapClickCoordsXY
        if (U.function_exist(getMapClickCoordsXY)){
            getMapClickCoordsXY(evt.coordinate[0],evt.coordinate[1]);
        } else {
            // nobody cares about the coord of this click ?
        }
    } else {
        window.parent.getMapClickCoordsXY(evt.coordinate);
    }
});

// next 2 listeners are here to show how to handle dynamic page content loading,
// it's kind of "poor's man" htlm templates :-(
// but it works and loads page async
const elContent = U.getEl('content');
function displayForm(){
    "use strict";
    System.import('./showForm')
        .then(pageModule => {
            elContent.innerHTML = pageModule.default;
        });
}
U.getEl('showForm').addEventListener('click', () => {
    displayForm();
});

U.getEl('showInfo').addEventListener('click', () => {
    System.import('./showInfo')
        .then(pageModule => {
            elContent.innerHTML = pageModule.default;
        });
});

//////////////////////////////////////////////////////////////////////


// on decide d'afficher le formulaire par defaut ? ou pas
displayForm();

//you can use : import $ from 'jquery';
// or include it in html as cdn then declare it as external in webpack.config.js
//$('#app').css('background-color', 'yellow');

if (DEV) {
    if (module.hot) {
        module.hot.accept();
    }
}