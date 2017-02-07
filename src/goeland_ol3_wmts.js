import './style/ol3-layerswitcher.css';
import ol from 'openlayers';
import './ol3-layerswitcher';
import * as U from './htmlUtils';
import proj4 from './proj4';
/*global ol*/
/*jshint
 expr: true
 */
proj4.defs("EPSG:21781", "+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=600000 +y_0=200000 +ellps=bessel +towgs84=674.4,15.1,405.3,0,0,0,0 +units=m +no_defs");
const gomap = {
    /**
     * allow to initialize base map rendreing inside a given div id
     * @param {string} str_map_id  the div id to use ro render the map
     * @param {array} position  [x,y] position of the center of the map
     * @param {number} zoom_level
     * @return {ol.Map} an OpenLayers Map object
     */
    init_map: function (str_map_id, position, zoom_level, clickCallback) {
        'use strict';
        var base_wmts_url = 'https://map.lausanne.ch/tiles'; //valid on internet
        var RESOLUTIONS = [50, 20, 10, 5, 2.5, 1, 0.5, 0.25, 0.1, 0.05];

        /**
         * Allow to retrieve a valid OpenLayers WMTS source object
         * @param {string} layer  the name of the WMTS layer
         * @param {object} options
         * @return {ol.source.WMTS} a valid OpenLayers WMTS source
         */
        function wmtsLausanneSource(layer, options) {
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
                    html: '&copy;<a ' +
                    "href='http://www.lausanne.ch/cadastre>Cadastre'>" +
                    'SCC Lausanne</a>'
                })],
                url: url,
                tileGrid: tileGrid,
                layer: layer,
                requestEncoding: 'REST'
            });
        }


        function init_wmts_layers() {
            var array_wmts = [];
            array_wmts.push(new ol.layer.Tile({
                title: 'Plan ville couleur',
                type: 'base',
                visible: true,
                source: wmtsLausanneSource('fonds_geo_osm_bdcad_couleur', {
                    timestamps: [2015],
                    format: 'png'
                })
            }));
            array_wmts.push(new ol.layer.Tile({
                title: 'Plan cadastral (gris)',
                type: 'base',
                visible: false,
                source: wmtsLausanneSource('fonds_geo_osm_bdcad_gris', {
                    timestamps: [2015],
                    format: 'png'
                })
            }));
            array_wmts.push(new ol.layer.Tile({
                title: 'Orthophoto 2012',
                type: 'base',
                visible: false,
                source: wmtsLausanneSource('orthophotos_ortho_lidar_2012', {
                    timestamps: [2012],
                    format: 'png'
                })
            }));
            array_wmts.push(new ol.layer.Tile({
                title: 'Orthophoto 2016',
                type: 'base',
                visible: false,
                source: wmtsLausanneSource('orthophotos_ortho_lidar_2016', {
                    timestamps: [2016],
                    format: 'png'
                })
            }));
            array_wmts.push(new ol.layer.Tile({
                title: 'Carte Nationale',
                type: 'base',
                visible: false,
                source: wmtsLausanneSource('fonds_geo_carte_nationale_msgroup', {
                    timestamps: [2014],
                    format: 'png'
                })
            }));
            return array_wmts;
        }

        var MAX_EXTENT_LIDAR = [532500, 149000, 545625, 161000]; // lidar 2012
        var swissProjection = new ol.proj.Projection({
            code: 'EPSG:21781',
            extent: MAX_EXTENT_LIDAR,
            units: 'm'
        });
        var vdl_wmts = init_wmts_layers();

        var my_view = new ol.View({
            projection: swissProjection,
            center: position,
            zoom: zoom_level,
            minZoom: 1,
            maxZoom: 10,
            extent: MAX_EXTENT_LIDAR
            //,        resolutions: RESOLUTIONS
        });
        var mouse_position_control = new ol.control.MousePosition({
            coordinateFormat: ol.coordinate.createStringXY(0),
            projection: 'EPSG:21781'
        });
        U.getEl('map').innerHtml = '';
        const map = new ol.Map({
            target: str_map_id,
            controls: [
                new ol.control.Zoom(),
                mouse_position_control,
                new ol.control.Rotate(),
                new ol.control.ZoomSlider(),
                //new ol.control.ScaleLine()
            ],
            layers: vdl_wmts,
            view: my_view
        });
        this._olmap = map;
        const layerSwitcher = new ol.control.LayerSwitcher({tipLabel: 'Légende'});
        map.addControl(layerSwitcher);
        // gestion des click sur la carte
        map.on('click', function(evt){
            if(DEV) {
                //debugger; // to stop in browser debug
                console.info((evt.coordinate)); // coord nationale suisse
                console.info(map.getPixelFromCoordinate(evt.coordinate)); // coord pixel
            }

            if (window.parent.getMapClickCoordsXY == null) {
                //we are not inside an iframe or the iframe doesn't have a function called getMapClickCoordsXY
                if (U.function_exist(clickCallback)){
                    clickCallback(evt.coordinate[0],evt.coordinate[1]);
                } else {
                    // nobody cares about the coord of this click ?
                }
            } else {
                window.parent.getMapClickCoordsXY(evt.coordinate);
            }
        });

        return map;
    },

    loadGeoJSONLayer: function (geojson_url, layer_icon) {
        "use strict";
        function getIconStyleCenterBottom(imagePath) {
            return new ol.style.Style({image: new ol.style.Icon({src: imagePath, opacity: 0.60, anchor: [0.5, 1.0]})});
        }

        var vectorSource = new ol.source.Vector({
            url: geojson_url,
            format: new ol.format.GeoJSON({
                defaultDataProjection: 'EPSG:21781',
                projection: 'EPSG:21781'
            })
        });

        var newLayer = new ol.layer.Vector({
            source: vectorSource,
            style: getIconStyleCenterBottom(layer_icon)
        });
        var map_ref = this._olmap;
        this._GeoJSONLayer = newLayer;
        // use a closure so that inner function get the correct reference to map object
        map_ref.addLayer(newLayer);
        var listenerKey = vectorSource.on('change', function (e) {
            if (vectorSource.getState() == 'ready') {
                //TODO maybe add "loading icon" and here where to hide it
                // retrieve extent of all features to zoom only when loading of the layer via Ajax XHR is complete
                var extent = newLayer.getSource().getExtent();
                //TODO activate insert/edit toolbar buttons only when layer has finished loading
                if (DEV) {
                    console.log("# Finished Loading Layer :"+ geojson_url );
                }
                map_ref.getView().fit(extent, map_ref.getSize());
                // and unregister the "change" listener
                ol.Observable.unByKey(listenerKey);
            }
        });
        return newLayer;
    },
    addNewPointFeature2Layer: function (layer, coord_x, coord_y, name) {
        "use strict";
        const point = new ol.geom.Point([coord_x, coord_y]);
        const feature = new ol.Feature({
            name: name,
            geometry: point
        });
        const vector_source = layer.getSource()
        vector_source.addFeature(feature);
    }
}
export default gomap;