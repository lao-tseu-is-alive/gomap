var ol = require('openlayers');
var position_Lausanne = [6.63188, 46.52205];
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
