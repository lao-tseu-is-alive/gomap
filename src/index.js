/*
 index.js main entry of webapp using webpack 2 for bundling
 */


import 'openlayers/css/ol.css';
import './style/bootstrap-datetimepicker.css';
import './style/gocomplete.css';
import './style/base.css';
import 'jquery';
import moment from 'moment';
import 'datetimepicker';
import ol from 'openlayers';
import gomap from './goeland_ol3_wmts';
import * as U from './htmlUtils';
import Form from './showFormGoChantier';
import Info from './showInfo';
import './gocomplete';

let current_mode = 'NAVIGATE'; //default mode
//TODO obvioulsy get the REAL id of the authenticated user
let current_user = 7;

let goChantierProps = {
    "idgochantier": 0,
    "nom": 'titre du nouveau chantier',
    "description": null,
    "idcreator": current_user,
    "planified_datestart": null,
    "planified_dateend": null,
    "real_datestart": null,
    "real_dateend": null,
    "x": null,
    "y": null,
    "lon": null,
    "lat": null
}

loadForm();
loadInfo();
///////////////// DEBUT GESTION DES CHAMPS DATES
// http://eonasdan.github.io/bootstrap-datetimepicker/Options/#options
// http://momentjs.com/docs/#/displaying/format/
const date_options = {
    format: 'DD/MM/YYYY',
    locale: 'fr',
    //minDate: moment(),
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

const lon = 537892.8;
const lat = 152095.7;
const zoom_level = 4;
var position_Lausanne = [lon, lat];

const map = gomap.init_map(
    'mapdiv',
    position_Lausanne,
    zoom_level,
    getMapClickCoordsXY,
    U.getEl('track').checked,
    updateGeolocationInfo
);
// testing the same without the click callback
//var map = gomap.init_map('mapdiv', position_Lausanne, zoom_level, null, U.getEl('track').checked, updateGeolocationInfo);


if (DEV) {
    var geojson_url = 'https://gomap.lausanne.ch/gomap-api/chantiers';
} else {
    var geojson_url = '/gomap-api/chantiers';
}
//TODO handle inserts of NEW polygon
var chantier_layer = gomap.loadGeoJSONPolygonLayer(geojson_url);


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

function clearFormValue() {
    "use strict";
    U.getEl('info_idgochantier').innerText = '';
    U.getEl('obj_idgochantier').value = '';
    U.getEl('obj_coordxy').value = '';
    U.getEl('obj_name').value = '';
    U.getEl('obj_description').value = '';
    $('#obj_planified_date_begin').data("DateTimePicker").date(null);
    $('#obj_planified_date_end').data("DateTimePicker").date(null);

    $('#obj_real_date_begin').data("DateTimePicker").date(null);
    $('#obj_real_date_end').data("DateTimePicker").date(null);
}

function displayForm(feature) {
    if (!U.isNullOrUndefined(feature)) {
        clearFormValue();
        const formatGeoJSON = new ol.format.GeoJSON();
        const formatWKT = new ol.format.WKT();
        const feature_object = feature.getProperties();
        if (U.isNullOrUndefined(feature_object.idgochantier)) {
            U.getEl('info_idgochantier').innerText = ' nouveau (pas encore sauvé !)';
            U.getEl('obj_idgochantier').value = 0;
        } else {
            U.getEl('info_idgochantier').innerText = ` (id:${feature_object.idgochantier})`;
            U.getEl('obj_idgochantier').value = feature_object.idgochantier;
        }

        U.getEl('obj_coordxy').value = formatWKT.writeFeature(feature);
        U.getEl('obj_name').value = U.unescapeHtml(feature_object.nom);
        U.getEl('obj_description').value = U.unescapeHtml(feature_object.description);
        $('#obj_planified_date_begin').data("DateTimePicker").date(moment(feature_object.planified_datestart, 'YYYY-MM-DD'));
        $('#obj_planified_date_end').data("DateTimePicker").date(moment(feature_object.planified_dateend, 'YYYY-MM-DD'));

        $('#obj_real_date_begin').data("DateTimePicker").date(moment(feature_object.real_datestart, 'YYYY-MM-DD'));
        $('#obj_real_date_end').data("DateTimePicker").date(moment(feature_object.real_dateend, 'YYYY-MM-DD'));
    }

    if ($('#toggleMode').val() == 'NAVIGATE') {
        $('#edit_buttons').hide();
    } else {
        $('#edit_buttons').show();
    }

    $('#contentInfo').slideUp();
    $('#contentForm').slideDown();


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
    // callback for the map click event
    var feature = map.forEachFeatureAtPixel(map.getPixelFromCoordinate([x, y]), function (feature, layer) {
        //you can add a condition on layer to restrict the listener
        return feature;
    });
    if (!feature) {
        // here would be a good place to handle insertion of new object
        //U.getEl('obj_coordxy').value = `POINT(${x} ${y})`;
        hidePanels();
    } else {
        //we found a feature so display info about it
        if ($('#toggleMode').val() == 'CREATE') {

        } else {

            if (DEV) {
                const formatGeoJSON = new ol.format.GeoJSON();
                const formatWKT = new ol.format.WKT();
                const feature_object = feature.getProperties();
                const strObj = U.dumpObject2String(feature_object);
                console.log(`## In getMapClickCoordsXY(${x},${y}) - found feature :\n ${strObj}`);
                console.log(formatGeoJSON.writeFeature(feature));
                console.log(formatWKT.writeFeature(feature));
            }

            displayForm(feature);
        }

    }

}


function handleNewPolygon(newfeature, wktgeometry) {
    "use strict";
    U.getEl('obj_coordxy').value = wktgeometry;
    newfeature.setProperties(goChantierProps, true);
    if (DEV) {
        console.log('## Inside handleNewPolygon callback newfeature : ', newfeature);
        console.log(wktgeometry);
    }
    displayForm(newfeature);

}
//////////////////////////////////////////////////////////////////////
//// EVENT HANDLERS

U.getEl('track').addEventListener('change', function () {
    gomap.getGeolocationRef().setTracking(this.checked);
});

U.getEl('showForm').addEventListener('click', () => {
    displayForm();
});

U.getEl('showInfo').addEventListener('click', () => {
    activateInfo();
});

U.getEl('toggleMode').addEventListener('change', function (e) {
    "use strict";
    if (DEV) {
        console.log('MODE ' + $('#toggleMode').val() + ' SELECTED');
        console.log(this.selectedIndex);
    }
    gomap.setMode($('#toggleMode').val(), handleNewPolygon);

});
let adresses_url = '/gomap-api/adresses';
if (DEV) {
    adresses_url = 'https://gomap.lausanne.ch/gomap-api/adresses';
}
$('#searchAdd').gocomplete({
    url: adresses_url,
    method: 'post',
    minLength: 4,
    idFieldName: 'searchSelected'
});

$('#searchSelected').change(function (event) {
        event.preventDefault();
        const search = U.getEl('searchSelected');
        const coord = search.value;
        const position = coord.split('_').map(Number);
        let current_view = map.getView();
        current_view.setCenter(position);
        current_view.setZoom(8);
        $("#searchclear").show();
    }
);
$("#searchclear").hide();

$("#searchclear").click(function () {
    $("#searchAdd").val('');
    $("#searchclear").hide();
});

/*
 U.getEl('searchButton').addEventListener('click', () => {
 // next one allow to stop in debuger in chrome
 //debugger;
 const search = U.getEl('searchSelected');
 const coord = search.value;
 const position = coord.split('_').map(Number);
 console.log('Your search will go to : ', position);

 let current_view = map.getView();
 current_view.setCenter(position);
 current_view.setZoom(8);


 });
 */

$('.clickable').on('click', function () {
    hidePanels();
});


//TODO add authentication login and display SAVE only if user authenticated
$('#save_data').on('click', function (event) {

    event.preventDefault();

    // TODO: refactor this code inside the corresponding form module

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

    let prefix_url = '/gomap-api/chantier/';
    if (DEV) {
        console.log('about to save');
        console.log(params);
        prefix_url = 'https://gomap.lausanne.ch/gomap-api/chantier/';
    }
    let post_url = prefix_url;
    if (idgochantier === "0") {
        post_url += 'new';  // doing an insert
    } else {
        post_url += 'save/' + idgochantier; // doing an update
    }


    var jqxhr = $.ajax({
        type: 'POST',
        url: post_url,
        data: params,
        dataType: "text",
        success: function (data, textStatus, jqXHR) {
            //alert("POST Success :\n textStatus :" + textStatus + "\n data : " + data);
            console.log("POST Success with url : " + post_url);
            console.log(jqXHR);

            $('#toolbar_status').text(`SAUVEGARDE OK (id:${jqXHR.responseText})`);
            $('#formFeedback')
                .html(`LA SAUVEGARDE EST FAITE ! (nouvel id = ${jqXHR.responseText})`)
                .addClass('alert-success');
            U.getEl('obj_idgochantier').value = jqXHR.responseText;
            U.getEl('info_idgochantier').innerText = `(id:${jqXHR.responseText})`;
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
            $('#formFeedback')
                .html('ERREUR PENDANT LA SAUVEGARDE EST FAITE !')
                .addClass('alert-danger');
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