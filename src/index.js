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
import '../js/goeland_ol3_wmts';

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