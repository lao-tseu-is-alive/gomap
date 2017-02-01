/*
 index.js for testing webpack 2 integration as explained here
 https://www.youtube.com/watch?v=eWmkBNBTbMM
 */

import './style/skeleton-plus/css/normalize.css';
import './style/skeleton-plus/css/skeleton-plus.css';
import 'openlayers/css/ol.css';
import css from './style/base.css';
import ol from 'openlayers';
//import '../js/ol3-layerswitcher';
import proj4 from '../js/proj4js/2.2.2/proj4';
//import '../js/proj4js/2.2.2/EPSG21781';
import init_map from './goeland_ol3_wmts';


import * as U from './htmlUtils';

import  messages from './messages';
import searchAddress from './searchAddress';
import baseImg from './baseImage'; //to show something before real map loads

var app = U.getEl('app');
const Search = () => (searchAddress.searchAddress);
const mainHtmlDiv = `<div id="main" class="container">
<div id="mainMenu" class="row ">  
    ${Search()}
    <div class="three columns">
        <button id="showForm">Formulaire</button>        
    </div>
    <div class="three columns">        
        <button id="showInfo">Informations</button>
    </div>
</div>
<div id="content" class="twelve columns">    
</div>
<div id=map class="twelve columns"></div>
        <noscript>${messages.javascript_needed}</noscript>       
</div>
`;//end of main page
app.innerHTML = mainHtmlDiv;

console.log(ol);
/*
var position_Lausanne = [6.63188, 46.52205];
//noinspection ES6ModulesDependencies
var map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        })
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat(position_Lausanne),
        zoom: 13
    })
});
*/
proj4.defs("EPSG:21781", "+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=600000 +y_0=200000 +ellps=bessel +towgs84=674.4,15.1,405.3,0,0,0,0 +units=m +no_defs");

var lon = 537892.8;
var lat = 152095.7;
var zoom_level = 4;
var position_Lausanne = [lon, lat];
const map = init_map('map', position_Lausanne, zoom_level);
//loadScript('../js/ol3-layerswitcher-min.js', layer_switcher_init_code);
var createIconStyleCenterBottom = function (imagePath) {
    return new ol.style.Style({image: new ol.style.Icon({src: imagePath, opacity: 0.60, anchor: [0.5, 1.0]})})
};
var coord_pfa3_180_stfrancois = [538224.21, 152378.17];
var eglise_stfrancois = new ol.Feature(new ol.geom.Point(coord_pfa3_180_stfrancois));
eglise_stfrancois.setStyle(createIconStyleCenterBottom('images/marker_blue_32x58.png'));
var coord_poste_stfrancois = [538189, 152308];
var poste_stfrancois = new ol.Feature(new ol.geom.Point(coord_poste_stfrancois));
poste_stfrancois.setStyle(createIconStyleCenterBottom('images/marker_red_32x58.png'));
var marker_layer = new ol.layer.Vector({source: new ol.source.Vector({features: [eglise_stfrancois, poste_stfrancois]})});
map.addLayer(marker_layer);
var current_view = map.getView();
current_view.setCenter(coord_pfa3_180_stfrancois);
current_view.setZoom(8);
var extent = marker_layer.getSource().getExtent();
current_view.fit(extent, map.getSize());


searchAddress.attachEl();
const elContent = U.getEl('content');
U.getEl('showForm').addEventListener('click', () => {
    System.import('./showForm')
        .then(pageModule => {
            elContent.innerHTML = pageModule.default;
        });
});

U.getEl('showInfo').addEventListener('click', () => {
    System.import('./showInfo')
        .then(pageModule => {
            elContent.innerHTML = pageModule.default;
        });
});

//you can use : import $ from 'jquery';
// or include it in html as cdn then declare it as external in webpack.config.js
//$('#app').css('background-color', 'yellow');

if (DEV) {
    if (module.hot) {
        module.hot.accept();
    }
}