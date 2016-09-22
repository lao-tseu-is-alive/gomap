/**
 * Created by cgil on 9/7/16.
 */
/*global ol*/
/*jshint
 expr: true
 */
goog.provide('app');

goog.require('ol.Attribution');
goog.require('ol.Map');
goog.require('ol.View');
goog.require('ol.control.MousePosition');
goog.require('ol.control.Rotate');
goog.require('ol.control.ScaleLine');
goog.require('ol.control.Zoom');
goog.require('ol.control.ZoomSlider');
goog.require('ol.coordinate');
goog.require('ol.layer.Tile');
goog.require('ol.proj.Projection');
goog.require('ol.source.WMTS');
goog.require('ol.tilegrid.WMTS');

var MAX_EXTENT_LIDAR = [532500, 149000, 545625, 161000]; // lidar 2012
var map; //ol3 map
var base_wmts_url = 'https://map.lausanne.ch/tiles'; //valid on internet
var swissProjection = new ol.proj.Projection({
    code: 'EPSG:21781',
    extent: MAX_EXTENT_LIDAR,
    units: 'm'
});

var RESOLUTIONS = [50, 20, 10, 5, 2.5, 1, 0.5, 0.25, 0.1, 0.05];
/**
 * Allow to retrieve a valid OpenLayers WMTS source object
 * @param {string} layer the name of the WMTS layer
 * @param {object} options
 * @return {ol.source.WMTS}
 */
function wmtsLausanneSource(layer, options) {
    'use strict';
    var resolutions = RESOLUTIONS;
    if (Array.isArray(options.resolutions)) {
        resolutions = options.resolutions;
    }
    var tileGrid = new ol.tilegrid.WMTS({
        origin: [420000, 350000],
        resolutions: resolutions,
        matrixIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    });
    var extension = options.format || 'png';
    var timestamp = options.timestamps;
    var url = base_wmts_url + '/1.0.0/{Layer}/default/' + timestamp +
        '/swissgrid_05/{TileMatrix}/{TileRow}/{TileCol}.' + extension;
    url = url.replace('http:', location.protocol);
    //noinspection ES6ModulesDependencies
    return new ol.source.WMTS(/** @type {olx.source.WMTSOptions} */{
        //crossOrigin: 'anonymous',
        attributions: [new ol.Attribution({
            html: "&copy;<a href='http://www.lausanne.ch/cadastre>Cadastre'>" +
                    ' www.lausanne.ch</a>'
        })],
        url: url,
        tileGrid: tileGrid,
        layer: layer,
        requestEncoding: 'REST'
    });
}

var vdl_wmts = [];
vdl_wmts.push(new ol.layer.Tile({
    title: 'Plan ville couleur',
    type: 'base',
    visible: true,
    source: wmtsLausanneSource('fonds_geo_osm_bdcad_couleur', {
        timestamps: [2015],
        format: 'png'
    })
}));
vdl_wmts.push(new ol.layer.Tile({
    title: 'Plan cadastral (gris)',
    type: 'base',
    visible: false,
    source: wmtsLausanneSource('fonds_geo_osm_bdcad_gris', {
        timestamps: [2015],
        format: 'png'
    })
}));
vdl_wmts.push(new ol.layer.Tile({
    title: 'Orthophoto 2012',
    type: 'base',
    visible: false,
    source: wmtsLausanneSource('orthophotos_ortho_lidar_2012', {
        timestamps: [2012],
        format: 'png'
    })
}));
vdl_wmts.push(new ol.layer.Tile({
    title: 'Carte Nationale',
    type: 'base',
    visible: false,
    source: wmtsLausanneSource('fonds_geo_carte_nationale_msgroup', {
        timestamps: [2014],
        format: 'png'
    })
}));

var mouse_position_control = new ol.control.MousePosition({
    //coordinateFormat: ol.coordinate.createStringXY(2),
    projection: 'EPSG:21781'
});

/**
 * @type {ol.Map}
 */

app.map = new ol.Map({
    target: 'map',
    layers: vdl_wmts,
    controls: [
        new ol.control.Zoom(),
        mouse_position_control,
        new ol.control.Rotate(),
        new ol.control.ZoomSlider(),
        new ol.control.ScaleLine()
    ],
    view: new ol.View({
        projection: swissProjection,
        center: [537892.8, 152095.7],
        zoom: 4,
        minZoom: 1,
        maxZoom: 10,
        extent: MAX_EXTENT_LIDAR
    })
});
