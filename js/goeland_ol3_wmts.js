/*global ol*/
var MAX_EXTENT_LIDAR = [532500, 149000, 545625, 161000]; //projet lidar
var map; //ol3 map
var base_wmts_url = "https://map.lausanne.ch/tiles";
var swissProjection = new ol.proj.Projection({
    code: 'EPSG:21781',
    extent: MAX_EXTENT_LIDAR,
    units: 'm'
});

var RESOLUTIONS = [50, 20, 10, 5, 2.5, 1, 0.5, 0.25, 0.1, 0.05];
function wmtsLausanneSource(layer, options) {
    'use strict';
    var resolutions = (Array.isArray(options.resolutions)) ? options.resolutions : RESOLUTIONS;
    var tileGrid = new ol.tilegrid.WMTS({
        origin: [420000, 350000],
        resolutions: resolutions,
        matrixIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    });
    var extension = options.format || 'png';
    var timestamp = options.timestamps;
    return new ol.source.WMTS(/** @type {olx.source.WMTSOptions} */({
        //crossOrigin: 'anonymous',
        attributions: [new ol.Attribution({
            html: "&copy;<a href='http://www.lausanne.ch/cadastre>Cadastre'> www.lausanne.ch</a>"
        })],
        url: (base_wmts_url + '/1.0.0/{Layer}/default/' + timestamp + '/swissgrid_05/' +
                '{TileMatrix}/{TileRow}/{TileCol}.').replace('http:', location.protocol) + extension,
        tileGrid: tileGrid,
        layer: options.serverLayerName ? options.serverLayerName : layer,
        requestEncoding: 'REST'
    }));
}

var src_pv_color = wmtsLausanneSource('fonds_geo_osm_bdcad_couleur', {
    timestamps: [2015],
    format: 'png'
});

var layer_pv_color = new ol.layer.Tile({
    source: src_pv_color
});


function init_map(str_map_id, position, zoom_level) {

    var my_view = new ol.View({
        projection: swissProjection,
        center: position,
        zoom: zoom_level,
        minZoom: 1,
        maxZoom: 10,
        extent: MAX_EXTENT_LIDAR
    });
    var mouse_position_control = new ol.control.MousePosition({
        coordinateFormat: ol.coordinate.createStringXY(2),
        projection: 'EPSG:21784'
    });
    map = new ol.Map({
        target: str_map_id,
        controls: [new ol.control.Zoom(),
            mouse_position_control,
            new ol.control.Rotate(),
            new ol.control.ZoomSlider(),
            new ol.control.ScaleLine()
        ],
        layers: [layer_pv_color],
        view: my_view
    });

}