/*
 index.js main entry of webapp using webpack 2 for bundling
 */


import 'openlayers/css/ol.css';
import './style/bootstrap-datetimepicker.css';
import css from './style/base.css';
import 'jquery';
import moment from 'moment';
import 'datetimepicker';
import ol from 'openlayers';
import gomap from './goeland_ol3_wmts';
import * as U from './htmlUtils';
import searchAddress from './searchAddress';
import Form from './showFormGoChantier';
import Info from './showInfo';


searchAddress.attachEl();
loadForm();
loadInfo();
///////////////// DEBUT GESTION DES CHAMPS DATES
// http://eonasdan.github.io/bootstrap-datetimepicker/Options/#options
// http://momentjs.com/docs/#/displaying/format/
const date_options = {
    format: 'DD/MM/YYYY',
    locale: 'fr',
    minDate: moment(),
    useCurrent: false
};
$('#obj_planified_date_begin').datetimepicker(date_options);
$('#obj_planified_date_end').datetimepicker(date_options);
$('#obj_real_date_begin').datetimepicker(date_options);
$('#obj_real_date_end').datetimepicker(date_options);

$("#obj_planified_date_begin").on("dp.change", function (e) {
    $('#obj_planified_date_end').data("DateTimePicker").minDate(e.date);
});
$("#obj_planified_date_end").on("dp.change", function (e) {
    $('#obj_planified_date_begin').data("DateTimePicker").maxDate(e.date);
});

$("#obj_real_date_begin").on("dp.change", function (e) {
    $('#obj_real_date_end').data("DateTimePicker").minDate(e.date);
});
$("#obj_real_date_end").on("dp.change", function (e) {
    $('#obj_real_date_begin').data("DateTimePicker").maxDate(e.date);
});


///////////////// FIN GESTION DES CHAMPS DATES

var lon = 537892.8;
var lat = 152095.7;
var zoom_level = 4;
var position_Lausanne = [lon, lat];

var map = gomap.init_map('mapdiv', position_Lausanne, zoom_level, getMapClickCoordsXY, U.getEl('track').checked, updateGeolocationInfo);


if (DEV) {
    var geojson_url = 'https://gomap.lausanne.ch/gomap-api/chantiers';
} else {
    var geojson_url = '/gomap-api/chantiers';
}
var chantier_layer = gomap.loadGeoJSONPolygonLayer(geojson_url, false);


U.getEl('loader_message').style.display = 'none';


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
    if (!feature) {
        // here would be a good place to handle insertion of new object
        //U.getEl('obj_coordxy').value = `POINT(${x} ${y})`;
    } else {
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
        U.getEl('info_idgochantier').innerText = `(${feature_object.idgochantier})`;
        U.getEl('obj_idgochantier').value = feature_object.idgochantier;
        U.getEl('obj_coordxy').value = formatWKT.writeFeature(feature);
        U.getEl('obj_name').value = feature_object.nom;
        U.getEl('obj_description').value = feature_object.description;
        //debugger;
        $('#obj_planified_date_begin').data("DateTimePicker").date(moment(feature_object.planified_datestart, 'YYYY-MM-DD'));
        $('#obj_planified_date_end').data("DateTimePicker").date(moment(feature_object.planified_dateend, 'YYYY-MM-DD'));

        $('#obj_real_date_begin').data("DateTimePicker").date(moment(feature_object.real_datestart, 'YYYY-MM-DD'));
        $('#obj_real_date_end').data("DateTimePicker").date(moment(feature_object.real_dateend, 'YYYY-MM-DD'));
        activateForm();

    }

}


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
        var post_url = 'https://gomap.lausanne.ch/gomap-api/chantier/save/';
    } else {
        var post_url = '/gomap-api/chantier/save/';
    }

    event.preventDefault();

    const planed_datestart = $('#obj_planified_date_begin').data("DateTimePicker").date() === null ?
        '' : $('#obj_planified_date_begin').data("DateTimePicker").date().format('YYYY-MM-DD');
    const planed_dateend = $('#obj_planified_date_end').data("DateTimePicker").date() === null ?
        '' : $('#obj_planified_date_end').data("DateTimePicker").date().format('YYYY-MM-DD');
    const real_datestart = $('#obj_real_date_begin').data("DateTimePicker").date() === null ?
        '' : $('#obj_real_date_begin').data("DateTimePicker").date().format('YYYY-MM-DD');
    const real_dateend = $('#obj_real_date_end').data("DateTimePicker").date() === null ?
        '' : $('#obj_real_date_end').data("DateTimePicker").date().format('YYYY-MM-DD');
    const idgochantier = U.getEl('obj_idgochantier').value;
    var params = {
        idgochantier: idgochantier,
        name: U.getEl('obj_name').value,
        description: U.getEl('obj_description').value,
        planified_datestart: planed_datestart,
        planified_dateend: planed_dateend,
        real_datestart: real_datestart,
        real_dateend: real_dateend,
        geom_polygon: U.getEl('obj_coordxy').value
    };

    if (DEV) {
        console.log(params);
    }


    var jqxhr = $.ajax({
        type: 'POST',
        url: post_url + idgochantier,
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