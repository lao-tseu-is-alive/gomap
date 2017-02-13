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
function Conv21781_in_4326(x, y) {
    const projSource = new proj4.Proj("EPSG:21781");
    const projDest = new proj4.Proj("EPSG:4326");
    var pointSource = new proj4.Point(x + ", " + y);
    return proj4.transform(projSource, projDest, pointSource);
}
function Conv4326_in_21781(x, y) {
    const projSource = new proj4.Proj("EPSG:4326");
    const projDest = new proj4.Proj("EPSG:21781");
    var pointSource = new proj4.Point(x + ", " + y);
    return proj4.transform(projSource, projDest, pointSource);
}
const gomap = {
        /**
         * allow to initialize base map rendreing inside a given div id
         * @param {string} str_map_id  the div id to use ro render the map
         * @param {array} position  [x,y] position of the center of the map
         * @param {number} zoom_level
         * @param {function} clickCallback
         * @param {boolean} enableGeoLocation
         * @return {ol.Map} an OpenLayers Map object
         */
        init_map: function (str_map_id, position, zoom_level, clickCallback, enableGeoLocation, geolocationChangeCallback) {
            'use strict';
            if (typeof(enableGeoLocation) === "undefined") enableGeoLocation = true;
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
            U.getEl('mapdiv').innerHtml = '';
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

            const layerSwitcher = new ol.control.LayerSwitcher({tipLabel: 'Légende'});
            map.addControl(layerSwitcher);
            // gestion des click sur la carte
            map.on('click', function (evt) {
                if (DEV) {
                    //debugger; // to stop in browser debug
                    console.info((evt.coordinate)); // coord nationale suisse
                    console.info(map.getPixelFromCoordinate(evt.coordinate)); // coord pixel
                }

                if (typeof(window.parent.getMapClickCoordsXY) === "undefined") {
                    //we are not inside an iframe or the iframe doesn't have a function called getMapClickCoordsXY
                    if (U.function_exist(clickCallback)) {
                        clickCallback(evt.coordinate[0], evt.coordinate[1]);
                    } else {
                        // nobody cares about the coord of this click ?
                    }
                } else {
                    window.parent.getMapClickCoordsXY(evt.coordinate);
                }
            });

            // geolocation stuff so the map follow device pos

            var positionFeature = new ol.Feature();
            positionFeature.setStyle(new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 6,
                    fill: new ol.style.Fill({
                        color: '#ff0000'
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#fff',
                        width: 2
                    })
                })
            }));
            var accuracyFeature = new ol.Feature();
            //TODO recuperer accuraxy et adapter rayon
            accuracyFeature.setStyle(new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 20,
                    fill: new ol.style.Fill({
                        color: [255,0,0,0.3]
                    }),
                }),
                stroke: new ol.style.Stroke({
                    color: '#fff',
                    width: 5
                })
            }));

            function updatePosition(geolocationRef, posFeatureRef, accuracyFeatureRef) {
                const coordinates = geolocationRef.getPosition();
                const P21781 = Conv4326_in_21781(coordinates[0], coordinates[1]);
                if (DEV) {
                    console.log("geolocation.on('change:position", coordinates);
                    console.log("geolocation in 21781 : " + P21781.x + "," + P21781.y);
                    //debugger;
                }
                const currentPosition = [P21781.x, P21781.y];
                const  currentPointPosition = new ol.geom.Point(currentPosition);
                posFeatureRef.setGeometry(currentPointPosition);
                accuracyFeatureRef.setGeometry(currentPointPosition);
                my_view.setCenter(currentPosition);
                my_view.setZoom(8);
            }


            var geolocation = new ol.Geolocation({
                projection: my_view.getProjection(),
                tracking: true,
                trackingOptions: {
                    enableHighAccuracy: true
                }
            });
            geolocation.setTracking(enableGeoLocation);


            // update the HTML page when the geolocation information changes.
            geolocation.on('change', function () {
                updatePosition(geolocation, positionFeature, accuracyFeature);
                geolocationChangeCallback(geolocation);
            });

            geolocation.on('error', function (error) {
                var info = U.getEl('info');
                info.innerHTML = error.message;
                info.style.display = '';
            });

            geolocation.on('change:accuracyGeometry', function () {
                //TODO idealement il faut convertir le systeme de coord de la geometrie ci-dessous de wgs84 en 21781
                //accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
                updatePosition(geolocation, positionFeature, accuracyFeature);
                if (DEV) {
                    console.log("geolocation.on('change:accuracyGeometry'", geolocation.getAccuracyGeometry());
                    //debugger;
                }
            });

            geolocation.on('change:position', function () {
                updatePosition(geolocation, positionFeature, accuracyFeature);
            });

            var geolocation_layer = new ol.layer.Vector({
                map: map,
                source: new ol.source.Vector({
                    features: [accuracyFeature, positionFeature]
                })
            });
            map.addLayer(geolocation_layer);
            this._olMap = map;
            this._olView = my_view;
            this._geolocation = geolocation;
            this._geolocationLayer = geolocation_layer;
            return map;
        },

        getMapRef: function () {
            return this._olMap;
        }
        ,
        getVieRef: function () {
            return this._olView;
        }
        ,
        getGeolocationRef: function () {
            return this._geolocation;
        }
        ,
        getGeolocationLayerRef: function () {
            return this._geolocationLayer;
        }
        ,
        getGeoJSONLayerRef: function () {
            return this._GeoJSONLayer;
        }
        ,


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
            var map_ref = this._olMap;
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
                        console.log("# Finished Loading Layer :" + geojson_url, e);
                    }
                    map_ref.getView().fit(extent, map_ref.getSize());
                    // and unregister the "change" listener
                    ol.Observable.unByKey(listenerKey);
                }
            });
            return newLayer;
        }
        ,
        addNewPointFeature2Layer: function (layer, coord_x, coord_y, name) {
            "use strict";
            const point = new ol.geom.Point([coord_x, coord_y]);
            const feature = new ol.Feature({
                name: name,
                geometry: point
            });
            const vector_source = layer.getSource();
            vector_source.addFeature(feature);
        }
        ,


        getPointInGooGleEPSG4326FromCoordTransformSwissEPSG217812: function (x, y) {
            "use strict";
            Conv21781_in_4326(x, y);
        }
        ,

        getPointSwissEPSG217812InFromCoordTransformGooGleEPSG4326: function (x, y) {
            "use strict";
            Conv4326_in_21781(x, y);
        }
        ,


    }
    ;
export default gomap;