//import './ol.css';
import './ol3-layerswitcher.css';
import ol from 'openlayers';
import './ol3-layerswitcher';
import * as U from './htmlUtils';
import proj4 from './proj4';
/*global ol*/
/*jshint
 expr: true
 */
proj4.defs("EPSG:21781", "+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=600000 +y_0=200000 +ellps=bessel +towgs84=674.4,15.1,405.3,0,0,0,0 +units=m +no_defs");
export function Conv21781_in_4326(x, y) {
    const projSource = new proj4.Proj("EPSG:21781");
    const projDest = new proj4.Proj("EPSG:4326");
    return proj4.transform(projSource, projDest, [x, y]);
}
export function Conv4326_in_21781(x, y) {
    const projSource = new proj4.Proj("EPSG:4326");
    const projDest = new proj4.Proj("EPSG:21781");
    return proj4.transform(projSource, projDest, [x, y]);
}
const gomap = {
        /**
         * allow to initialize base map rendreing inside a given div id
         * @param {string} str_map_id  the div id to use ro render the map
         * @param {array} position  [x,y] position of the center of the map
         * @param {number} zoom_level
         * @param {function} clickCallback is the callback to handle a click event on the map
         * @param {boolean} enableGeoLocation allows to enable/disable the geolocation tracking at startup
         * @param {function} geolocationChangeCallback is the callback to receive geolocation change
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

            const MAX_EXTENT_LIDAR = [532500, 149000, 545625, 161000]; // lidar 2012
            const swissProjection = new ol.proj.Projection({
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
                        // does nobody really care about the coord of this click ?
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
                        color: [255, 0, 0, 0.3]
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
                    console.log("geolocation updatePosition : " + P21781.x + "," + P21781.y);
                    //debugger;
                }
                const currentPosition = [P21781.x, P21781.y];
                const currentPointPosition = new ol.geom.Point(currentPosition);
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
                    //console.log("geolocation.on('change:accuracyGeometry'", geolocation.getAccuracyGeometry());
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

        /* getMapRef: function () {
         return this._olMap;
         },
         getVieRef: function () {
         return this._olView;
         },*/
        getGeolocationRef: function () {
            return this._geolocation;
        },
        getGeolocationLayerRef: function () {
            return this._geolocationLayer;
        },
        getGeoJSONLayerRef: function () {
            return this._GeoJSONLayer;
        },
        getGeoJSONPolygonLayerRef: function () {
            return this._GeoJSONPolygonLayer;
        },
        getNewPolygonLayerRef: function () {
            return this._NewPolygonLayer;
        },

        //TODO: refactor this name to : loadGeoJSONPointLayer
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
                    // here is god place to activate insert/edit toolbar buttons
                    // only when layer has finished loading
                    if (DEV) {
                        console.log("# Finished Loading Layer :" + geojson_url, e);
                    }
                    map_ref.getView().fit(extent, map_ref.getSize());
                    // and unregister the "change" listener
                    ol.Observable.unByKey(listenerKey);
                }
            });
            return newLayer;
        },


        loadGeoJSONPolygonLayer: function (geojson_url) {
            "use strict";

            const vectorSource = new ol.source.Vector({
                url: geojson_url,
                format: new ol.format.GeoJSON({
                    defaultDataProjection: 'EPSG:21781',
                    projection: 'EPSG:21781'
                })
            });
            // https://openlayers.org/en/latest/examples/draw-and-modify-features.html
            // https://openlayers.org/en/latest/examples/modify-features.html
            // TODO use a property of the geojson query to display color
            // or a style function  : http://openlayersbook.github.io/ch06-styling-vector-layers/example-07.html
            const newLayer = new ol.layer.Vector({
                source: vectorSource,
                style: new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 0, 0, 0.8)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#ffcc33',
                        width: 3
                    }),
                    image: new ol.style.Circle({
                        radius: 9,
                        fill: new ol.style.Fill({
                            color: '#ffcc33'
                        })
                    })
                })
            });
            const map_ref = this._olMap;
            this._GeoJSONPolygonLayer = newLayer;
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
                    //map_ref.getView().fit(extent, map_ref.getSize());
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
            const vector_source = layer.getSource();
            vector_source.addFeature(feature);
        },

        setMode: function (newMode, endDrawCallback, endModifyCallback) {
            function addNewPolygon2Layer(layer, callbackOnDrawEnd) {
                const map_ref = this._olMap;
                const features = new ol.Collection();
                const featureOverlay = new ol.layer.Vector({
                    source: new ol.source.Vector({features: features}),
                    style: new ol.style.Style({
                        fill: new ol.style.Fill({
                            color: 'rgba(255, 255, 255, 0.2)'
                        }),
                        stroke: new ol.style.Stroke({
                            color: '#ffcc33',
                            width: 2
                        }),
                        image: new ol.style.Circle({
                            radius: 7,
                            fill: new ol.style.Fill({
                                color: '#ffcc33'
                            })
                        })
                    })
                });
                featureOverlay.setMap(map_ref);
                this._NewPolygonLayer = featureOverlay;
                const modify = new ol.interaction.Modify({
                    features: features,
                    // the SHIFT key must be pressed to delete vertices, so
                    // that new vertices can be drawn at the same position
                    // of existing vertices
                    deleteCondition: function (event) {
                        return ol.events.condition.shiftKeyOnly(event) &&
                            ol.events.condition.singleClick(event);
                    }
                });
                map_ref.addInteraction(modify);
                const draw = new ol.interaction.Draw({
                    features: features, //vectorSource.getFeatures(), //TODO find the correct object to pass
                    type: 'Polygon' /** @type {ol.geom.GeometryType} */
                });
                draw.on('drawend', function (e) {
                    let currentFeature = e.feature;//this is the feature fired the event
                    const formatWKT = new ol.format.WKT();
                    console.log(formatWKT.writeFeature(currentFeature));
                    //debugger;
                });
                this._interactionModify = modify;
                this._interactionDraw = draw;
                map_ref.addInteraction(draw);
            }

            "use strict";
            const overlayStyle = (function () {
                /* jshint -W069 */
                const styles = {};
                styles['Polygon'] = [
                    new ol.style.Style({
                        fill: new ol.style.Fill({
                            color: [255, 255, 255, 0.5]
                        })
                    }),
                    new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: [255, 255, 255, 1],
                            width: 5
                        })
                    }),
                    new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: [0, 153, 255, 1],
                            width: 3
                        })
                    })];
                styles['MultiPolygon'] = styles['Polygon'];

                styles['LineString'] = [
                    new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: [255, 255, 255, 1],
                            width: 5
                        })
                    }),
                    new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: [0, 153, 255, 1],
                            width: 3
                        })
                    })];
                styles['MultiLineString'] = styles['LineString'];

                styles['Point'] = [
                    new ol.style.Style({
                        image: new ol.style.Circle({
                            radius: 7,
                            fill: new ol.style.Fill({
                                color: [0, 153, 255, 1]
                            }),
                            stroke: new ol.style.Stroke({
                                color: [255, 255, 255, 0.75],
                                width: 1.5
                            })
                        }),
                        zIndex: 100000
                    })];
                styles['MultiPoint'] = styles['Point'];

                styles['GeometryCollection'] = styles['Polygon'].concat(styles['Point']);

                return function (feature, resolution) {
                    return styles[feature.getGeometry().getType()];
                };
                /* jshint +W069 */
            })();
            const map_ref = this._olMap;
            const previous_mode = this._current_mode;
            this._current_mode = newMode;
            switch (newMode) {
                case 'NAVIGATE':
                    if (previous_mode == 'EDIT') {
                        map_ref.removeInteraction(this._interactionSelect);
                        map_ref.removeInteraction(this._interactionModifyEdit);
                    }
                    if (previous_mode == 'CREATE') {
                        map_ref.removeInteraction(this._interactionDraw);
                        map_ref.removeInteraction(this._interactionModify);
                    }
                    break;
                case 'CREATE':
                    if (previous_mode == 'EDIT') {
                        map_ref.removeInteraction(this._interactionSelect);
                        map_ref.removeInteraction(this._interactionModifyEdit);
                    }
                    const features = new ol.Collection();
                    const featureOverlay = new ol.layer.Vector({
                        source: new ol.source.Vector({features: features}),
                        style: new ol.style.Style({
                            fill: new ol.style.Fill({
                                color: 'rgba(255, 255, 255, 0.2)'
                            }),
                            stroke: new ol.style.Stroke({
                                color: '#ffcc33',
                                width: 2
                            }),
                            image: new ol.style.Circle({
                                radius: 7,
                                fill: new ol.style.Fill({
                                    color: '#ffcc33'
                                })
                            })
                        })
                    });
                    featureOverlay.setMap(map_ref);

                    this._NewPolygonLayer = featureOverlay;
                    this._NewPolygonCollectionFeatures = features;
                    const modify = new ol.interaction.Modify({
                        features: features,
                        // the SHIFT key must be pressed to delete vertices, so
                        // that new vertices can be drawn at the same position
                        // of existing vertices
                        deleteCondition: function (event) {
                            return ol.events.condition.shiftKeyOnly(event) &&
                                ol.events.condition.singleClick(event);
                        }
                    });
                    map_ref.addInteraction(modify);
                    const draw = new ol.interaction.Draw({
                        features: features, //vectorSource.getFeatures(), //TODO find the correct object to pass
                        type: 'Polygon' /** @type {ol.geom.GeometryType} */
                    });
                    draw.on('drawend', function (e) {
                        let currentFeature = e.feature;//this is the feature fired the event
                        const formatWKT = new ol.format.WKT();
                        let featureWKTGeometry = formatWKT.writeFeature(currentFeature);
                        console.log("INSIDE setMode(CREATE) event drawend : " + featureWKTGeometry);
                        if (U.function_exist(endDrawCallback)) {
                            endDrawCallback(currentFeature);
                        }
                        //debugger;
                    });
                    this._interactionModify = modify;
                    this._interactionDraw = draw;
                    map_ref.addInteraction(draw);
                    break; // end of EDIT mode
                case 'EDIT':
                    if (previous_mode == 'CREATE') {
                        map_ref.removeInteraction(this._interactionDraw);
                        map_ref.removeInteraction(this._interactionModify);
                    }
                    const select = new ol.interaction.Select({
                        wrapX: false,
                        style: overlayStyle
                    });
                    /* The modify interaction does not listen to geometry change events.
                     Changing the feature coordinates will make the modify interaction
                     unaware of the actual feature coordinates.
                     A possible fix: Maintain a collection used by Modify, so we can reload
                     the features manually. This collection will always contain the same
                     features as the select interaction.
                     http://stackoverflow.com/questions/26878659/openlayers-3-how-to-register-feature-modified-event-as-featuremodified-in-open
                     */
                    var selectSource = new ol.Collection();
                    select.on('select', function (evt) {
                        evt.selected.forEach(function (feature) {
                            selectSource.push(feature);
                        });
                        evt.deselected.forEach(function (feature) {
                            selectSource.remove(feature);
                        });
                    });
                    const modifyEdit = new ol.interaction.Modify({
                        //features: select.getFeatures(),
                        features: selectSource, // use our custom collection
                        style: overlayStyle,
                        // the SHIFT key must be pressed to delete vertices, so
                        // that new vertices can be drawn at the same position
                        // of existing vertices
                        deleteCondition: function (event) {
                            return ol.events.condition.shiftKeyOnly(event) &&
                                ol.events.condition.singleClick(event);
                        }
                    });
                    modifyEdit.on('modifystart', function (evt) {
                        evt.features.forEach(function (feature) {
                            originalCoordinates[feature] = feature.getGeometry().getCoordinates();
                        });
                    });
                    var originalCoordinates = {};
                    modifyEdit.on('modifyend', function (evt) {
                        console.log("INSIDE setMode(EDIT) event modifyend : ", evt);
                        evt.features.forEach(function (feature) {
                            /*if (feature in originalCoordinates) {
                             feature.getGeometry().setCoordinates(
                             originalCoordinates[feature]);
                             delete originalCoordinates[feature];

                             // remove and re-add the feature to make Modify reload it's geometry
                             selectSource.remove(feature);
                             selectSource.push(feature);
                             }*/
                            let currentFeature = feature;//this is the feature fired the event
                            const formatWKT = new ol.format.WKT();
                            let featureWKTGeometry = formatWKT.writeFeature(currentFeature);
                            console.log("INSIDE setMode(EDIT) event modifyend : " + featureWKTGeometry);
                            if (U.function_exist(endModifyCallback)) {
                                endModifyCallback(currentFeature);
                            }
                        });

                    });


                    this._interactionSelect = select;
                    this._interactionModifyEdit = modifyEdit;
                    map_ref.addInteraction(select);
                    map_ref.addInteraction(modifyEdit);
                    break; // end of EDIT mode
                default:
                    console.log("MODE not implemented :" + newMode + "Will put in NAVIGATE Mode");
                    if (previous_mode == 'EDIT') {
                        map_ref.removeInteraction(this._interactionSelect);
                        map_ref.removeInteraction(this._interactionModifyEdit);
                    }
                    if (previous_mode == 'CREATE') {
                        map_ref.removeInteraction(this._interactionDraw);
                        map_ref.removeInteraction(this._interactionModify);
                    }

            }

        }, // end of setMode


        clearTempLayers: function () {
            "use strict";
            const map_ref = this._olMap;
            //map_ref.removeLayer(this._NewPolygonLayer);
            //manually remove features from the source
            this._NewPolygonCollectionFeatures.clear();
            /*
             this._NewPolygonLayer.forEachFeature(function(feature){
             this._NewPolygonLayer.removeFeature(feature);
             });*/
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
    ; // end of gomap
export default gomap;