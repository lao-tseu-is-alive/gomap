/**
 * Created by cgil on 9/7/16.
 */
goog.provide('app');

goog.require('ol.Map');
goog.require('ol.View');
goog.require('ol.layer.Tile');
goog.require('ol.source.OSM');
//goog.require('ol.Coordinate');

/**
 * @type {ol.Map}
 */

app.map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        })
    ],
    view: new ol.View({
        center: [0,0],
        zoom: 4
    })
});
