/*
 index.js main entry of webapp using webpack 2 for bundling
 */


import 'openlayers/css/ol.css';

import css from './style/base.css';
import ol from 'openlayers';
import gomap from './goeland_ol3_wmts';
import * as U from './htmlUtils';
import searchAddress from './searchAddress';
import Form from './showForm';
import Info from './showInfo';


function loadForm() {
    "use strict";
    /* commented by cgil 8-2-2016 because System.import generates promise and IE crash
     System.import('./showForm')
     .then(pageModule => {
     elContent.innerHTML = pageModule.default;
     });
     */
    U.getEl('contentForm').innerHTML = Form;
}

function loadInfo() {
    "use strict";
    /* commented by cgil 8-2-2016 because System.import generates promise and IE crash
     System.import('./showInfo')
     .then(pageModule => {
     elContent.innerHTML = pageModule.default;
     });
     */
    U.getEl('contentInfo').innerHTML = Info;
}

function hidePanels() {
    $('#contentInfo').slideUp();
    $('#contentForm').slideUp();
}

function activateForm() {
    // $('#contentInfo').closest('.panel').slideUp();
    // $('#contentForm').closest('.panel').slideDown();
    $('#contentInfo').slideUp();
    $('#contentForm').slideDown();
    //U.getEl('contentInfo').style.display = 'none';
    //U.getEl('contentForm').style.display = '';


}

function activateInfo() {
    $('#contentForm').slideUp();
    $('#contentInfo').slideDown();
    //U.getEl('contentForm').style.display = 'none';
    //U.getEl('contentInfo').style.display = '';

}


function updateGeolocationInfo(geolocation) {
    U.getEl('accuracy').innerText = geolocation.getAccuracy() + ' [m]';
    U.getEl('altitude').innerText = geolocation.getAltitude() + ' [m]';
    U.getEl('altitudeAccuracy').innerText = geolocation.getAltitudeAccuracy() + ' [m]';
    U.getEl('heading').innerText = geolocation.getHeading() + ' [rad]';
    U.getEl('speed').innerText = geolocation.getSpeed() + ' [m/s]';
}


function getMapClickCoordsXY(x, y) {
    //TODO add togle buton to check if we are in 'insert mode'
    var feature = map.forEachFeatureAtPixel(map.getPixelFromCoordinate([x, y]), function (feature, layer) {
        //you can add a condition on layer to restrict the listener
        return feature;
    });
    if (feature) {
        //here you can add you code to display the coordinates or whatever you want to do
        var formatGeoJSON = new ol.format.GeoJSON();
        var formatWKT = new ol.format.WKT();
        var feature_object = feature.getProperties();
        if (DEV) {
            const strObj = U.dumpObject2String(feature_object);
            console.log(`## In getMapClickCoordsXY(${x},${y}) 
                    - found feature : \n ${strObj}`);

            //debugger;
            console.log(formatGeoJSON.writeFeature(feature));
            console.log(formatWKT.writeFeature(feature));
        }
        // put the attribute data of this feature in form fields
        U.getEl('info_idgeoobject').innerText = `(${feature_object.idgeoobject})`;
        U.getEl('obj_idgeoobject').value = feature_object.idgeoobject;
        U.getEl('obj_coordxy').value = formatWKT.writeFeature(feature);
        U.getEl('obj_name').value = feature_object.nom;
        U.getEl('obj_infourl').value = feature_object.infourl;
        U.getEl('obj_description').value = feature_object.description;
        U.getEl('obj_date_begin').value = feature_object.datestart;
        U.getEl('obj_date_end').value = feature_object.dateend;

    } else {
        // here would be a good place to handle insertion of new object
        //gomap.addNewPointFeature2Layer(gomap.getGeolocationLayerRef(),x,y,'New cinema !');
        //for now we just store object postion
        U.getEl('obj_coordxy').value = `POINT(${x} ${y})`;
    }

}


var lon = 537892.8;
var lat = 152095.7;
var zoom_level = 4;
var position_Lausanne = [lon, lat];
loadForm();
loadInfo();
var map = gomap.init_map('mapdiv', position_Lausanne, zoom_level, getMapClickCoordsXY, U.getEl('track').checked, updateGeolocationInfo);


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

// now let's add another layer with geojson data
const marker_cinema = require('./images/cinema.png');
//var geojson_url = '/data/cinema_geojson.json';
if (DEV) {
    var geojson_url = 'https://gomap.lausanne.ch/gomap-api/cinemas';
} else {
    var geojson_url = '/gomap-api/cinemas';
}
var cinema_layer = gomap.loadGeoJSONLayer(geojson_url, marker_cinema);

searchAddress.attachEl();

U.getEl('loader_message').style.display = 'none';
//////////////////////////////////////////////////////////////////////
//// EVENT HANDLERS

U.getEl('track').addEventListener('change', function () {
    gomap.getGeolocationRef().setTracking(this.checked);
});


U.getEl('showForm').addEventListener('click', () => {
    activateForm();
});

U.getEl('showInfo').addEventListener('click', () => {
    activateInfo();
});

$('.clickable').on('click', function () {
    hidePanels();
    //var effect = $(this).data('effect');
    //$(this).closest('.panel')[effect]();
});
$('#save_data').on('click', function (event) {
    if (DEV) {
        console.log('about to save');
        var post_url = 'https://gomap.lausanne.ch/gomap-api/cinema/new';
    } else {
        var post_url = '/gomap-api/cinema/new';
    }

    event.preventDefault();
    const default_point = 'POINT(537603.73 152608.98)';

    var params = {
        idgeoobject: U.getEl('obj_idgeoobject').value,
        name: U.getEl('obj_name').value,
        description: U.getEl('obj_description').value,
        iconeurl: U.getEl('obj_iconeurl').value,
        infourl: U.getEl('obj_infourl').value,
        datestart: U.getEl('obj_date_begin').value,
        dateend: U.getEl('obj_date_end').value,
        geom_point: U.getEl('obj_coordxy').value
    };


    var jqxhr = $.ajax({
        type: 'POST',
        url: post_url,
        data: params,
        dataType: "text",
        success: function (data, textStatus, jqXHR) {
            //alert("POST Success :\n textStatus :" + textStatus + "\n data : " + data);
            console.log("POST Success with url : " + post_url);
            console.log(jqXHR);

            $('#toolbar_status').text('LA SAUVEGARDE DU POLYGONE EST OK');
            //$('#toolbar_status').focus();
            /*
             ol_controls['polygon'].deactivate();
             ol_controls['modify'].deactivate();
             // si crinou appelle cette page alors on appelle sa fonction avec la bbox
             ol_vectors.refresh();
             ol_vectors.redraw();
             */
        },
        error: function (jqXHR, textStatus, errorThrown) {
            //alert("## POST error ##\n textStatus :" + textStatus + "\n ajaxError : " + errorThrown.toString());
            console.log("POST error with url : " + post_url);
            console.log("## POST jqXHR : ", jqXHR);
            console.log("## POST textStatus : ", textStatus);
            console.log("## POST errorThrown : ", errorThrown);
            console.log("## POST jqXHR.responseText : ", jqXHR.responseText);
        }
    });


});

//////////////////////////////////////////////////////////////////////


//


// if you really need jquery just do a
// import $ from 'jquery';
// or include it in html as cdn then declare it as external in webpack.config.js
//$('#content').css('background-color', 'yellow');

if (DEV) {
    if (module.hot) {
        module.hot.accept();
    }
}