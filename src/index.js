/*
 index.js main entry of webapp using webpack 2 for bundling
 */

import 'babel-polyfill';
import 'openlayers/css/ol.css';
import './style/bootstrap-datetimepicker.css';

import 'jquery';
import moment from 'moment';
import './lib/bootstrap-datetimepicker';
import ol from 'openlayers';
import gomap, {Conv4326_in_21781} from './lib/goeland_ol3_wmts';
import * as U from './lib/htmlUtils';
import Form from './showFormGoChantier';
import Info from './showInfo';
import './lib/gocomplete';
import 'bootstrap-without-jquery';
import logo from './images/apple-touch-icon-57x57.png';

import './style/base.scss';

let current_mode = 'NAVIGATE'; //default mode
//TODO obvioulsy get the REAL id of the authenticated user
let current_user = 7;

let goChantierProps = {
    "idgochantier": 0,
    "nom": null,
    "description": null,
    "idcreator": current_user,
    "entiteleader": null,
    "id_affaire_goeland" : null,
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
let num_features = 0;
let chantier_layer = gomap.loadGeoJSONPolygonLayer(geojson_url,
    //callback called when loads complete
    //good place to enable edit mode
    function (new_layer) {
        let arr_features = new_layer.getSource().getFeatures();
        if (arr_features.length ==1){
            // zoom to this unique feature
            map.getView().fit(arr_features[0].getGeometry().getExtent(), map.getSize());
        }
        if (DEV) {
            console.log(`# Finished Loading chantier_layer found ${arr_features.length} features`);
        }

    });

U.getEl('toggleMode').value = 'NAVIGATE';
U.getEl('info_current_mode').innerText = 'NAVIGATION';
gomap.setMode('NAVIGATE', handleNewPolygon, handleEditPolygon);
U.getEl('applogo').innerText = '';
U.addImg(logo, 46, 46, 'applogo');

U.getEl('loader_message').style.display = 'none';
/// fin de l'initialisation et du chargement de la carte

function findFeaturebyId(layer, idFieldName, id) {
    let source = layer.getSource();
    let arr_features = source.getFeatures();
    for (let i = 0; i < arr_features.length; i++) {
        if (arr_features[i].getProperties()[idFieldName] == id) {
            return arr_features[i];
        }
    }
    return null;
}

function getFeatureExtentbyId(layer, idFieldName, id) {
    let feature = findFeaturebyId(layer, idFieldName, id);
    if (feature != null) {
        return feature.getGeometry().getExtent()
    } else {
        return null;
    }


}

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
    U.getEl('info_id_affaire_goeland').innerText = '';
    U.getEl('obj_id_affaire_goeland').value = '';
    U.getEl('obj_coordxy').value = '';
    U.getEl('obj_name').value = '';
    U.getEl('obj_description').value = '';
    U.getEl('obj_entiteleader').value = '';
    $('#obj_planified_date_begin').data("DateTimePicker").date(null);
    $('#obj_planified_date_end').data("DateTimePicker").date(null);

    $('#obj_real_date_begin').data("DateTimePicker").date(null);
    $('#obj_real_date_end').data("DateTimePicker").date(null);
    $('#formFeedback').html('');
    $('#formFeedback').hide();
    $('#toolbar_status').html('');
    $('#div_participants').html('');
}


function isFormValid() {
    "use strict";
    let strErrorMessage = 'Veuillez saisir ces champs obligatoires : ';
    let isValid = true;
    if (U.isEmptyField('obj_coordxy')) {
        strErrorMessage += 'Géométrie ';
        isValid = false;
        U.addClass('obj_coordxy', 'fieldError');
    } else {
        U.delClass('obj_coordxy', 'fieldError');
    }
    if (U.isEmptyField('obj_name')) {
        strErrorMessage += 'Nom, ';
        isValid = false;
        U.addClass('obj_name', 'fieldError');
    } else {
        U.delClass('obj_name', 'fieldError');
    }
    if (U.isEmptyField('obj_description')) {
        strErrorMessage += 'Description, ';
        isValid = false;
        U.addClass('obj_description', 'fieldError');
    } else {
        U.delClass('obj_description', 'fieldError');
    }
    if ($('#obj_planified_date_begin').data("DateTimePicker").date() == null) {
        strErrorMessage += 'Début prévu, ';
        isValid = false;
        U.addClass('obj_planified_date_begin', 'fieldError');
    } else {
        U.delClass('obj_planified_date_begin', 'fieldError');
    }
    if ($('#obj_planified_date_end').data("DateTimePicker").date() == null) {
        strErrorMessage += 'Fin prévue, ';
        isValid = false;
        U.addClass('obj_planified_date_end', 'fieldError');
    } else {
        U.delClass('obj_planified_date_end', 'fieldError');
    }
    //TODO check if obj_real_date_end > #obj_real_date_begin
    //$('#obj_real_date_begin').data("DateTimePicker").date(null);
    //$('#obj_real_date_end').data("DateTimePicker").date(null);
    $('#formFeedback').html(strErrorMessage);
    $('#formFeedback').show();

    return isValid;
}

function displayForm(feature, readonly = false) {
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

        if (U.isNullOrUndefined(feature_object.id_affaire_goeland)) {
            U.getEl('info_id_affaire_goeland').innerText = '';
            U.getEl('obj_id_affaire_goeland').value = null;
        } else {
            U.getEl('info_id_affaire_goeland').innerText = ` (Affaire Goéland:${feature_object.id_affaire_goeland})`;
            U.getEl('obj_id_affaire_goeland').value = feature_object.id_affaire_goeland;
        }
        U.getEl('obj_coordxy').value = formatWKT.writeFeature(feature);
        U.getEl('obj_name').value = U.unescapeHtml(feature_object.nom);
        U.getEl('obj_description').value = U.unescapeHtml(feature_object.description);
        U.getEl('obj_entiteleader').value = U.unescapeHtml(feature_object.entiteleader);
        $('#obj_planified_date_begin').data("DateTimePicker").date(moment(feature_object.planified_datestart, 'YYYY-MM-DD'));
        $('#obj_planified_date_end').data("DateTimePicker").date(moment(feature_object.planified_dateend, 'YYYY-MM-DD'));

        $('#obj_real_date_begin').data("DateTimePicker").date(moment(feature_object.real_datestart, 'YYYY-MM-DD'));
        $('#obj_real_date_end').data("DateTimePicker").date(moment(feature_object.real_dateend, 'YYYY-MM-DD'));
    }

    if ($('#toggleMode').val() == 'NAVIGATE') {
        $('#edit_buttons').hide();
        $('#obj_name').attr("disabled", true);
        $('#obj_description').attr("disabled", true);
        $('#obj_entiteleader').attr("disabled", true);
        $('#obj_planified_date_begin').data("DateTimePicker").disable();
        $('#obj_planified_date_end').data("DateTimePicker").disable();
        $('#obj_real_date_begin').data("DateTimePicker").disable();
        $('#obj_real_date_end').data("DateTimePicker").disable();
        if (!U.isNullOrUndefined(feature)) {
            const feature_object = feature.getProperties();
            if (U.isNullOrUndefined(feature_object.real_datestart)){
                $('#div_real_date_begin').hide();
            } else {
                $('#div_real_date_begin').show();
            }
            if (U.isNullOrUndefined(feature_object.real_dateend)){
                $('#div_real_date_end').hide();
            } else {
                $('#div_real_date_end').show();
            }



            if (!U.isNullOrUndefined(feature_object.participants)){
                $('#div_participants').html('<h4>Participants : </h4>' + feature_object.participants);
            }

        }

        $('#obj_planified_date_begin').attr("disabled", true);
        $('#obj_planified_date_end').attr("disabled", true);
        $('#obj_real_date_begin').attr("disabled", true);
        $('#obj_real_date_end').attr("disabled", true);

    } else {
        // on est en edition ou en creation
        $('#edit_buttons').show();
        $('#obj_name').attr("disabled", false);
        $('#obj_description').attr("disabled", false);

        $('#obj_planified_date_begin').data("DateTimePicker").enable();
        $('#obj_planified_date_end').data("DateTimePicker").enable();
        $('#obj_real_date_begin').data("DateTimePicker").enable();
        $('#obj_real_date_end').data("DateTimePicker").enable();
        $('#obj_planified_date_begin').attr("disabled", false);
        $('#obj_planified_date_end').attr("disabled", false);
        $('#obj_real_date_begin').attr("disabled", false);
        $('#obj_real_date_end').attr("disabled", false);
        $('#div_real_date_begin').show();
        $('#div_real_date_end').show();
        U.getEl('obj_name').focus();
    }

    if (DEV) {
        $('#div_coordxy').show();
    } else {
        $('#div_coordxy').hide();
    }
    $('#contentForm').css('left', '1px');

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
    const coordinates = geolocation.getPosition();
    const P21781 = Conv4326_in_21781(coordinates[0], coordinates[1]);
    if (DEV) {
        console.log(coordinates);
        console.log("geolocation updateGeolocationInfo : " + P21781.x + "," + P21781.y);
    }
    U.getEl('gps_coordxy').value = (Math.round(P21781.x * 100) / 100)
        + ', ' + (Math.round(P21781.y * 100) / 100);
    U.getEl('gps_coordlonlat').value = (Math.round(coordinates[1] * 10000) / 10000)
        + ', ' + (Math.round(coordinates[0] * 10000) / 10000);
    U.getEl('accuracy').innerText = (Math.round(geolocation.getAccuracy() * 100) / 100) + ' [m]';
    U.getEl('altitude').innerText = (Math.round(geolocation.getAltitude() * 100) / 100) + ' [m]';
    U.getEl('altitudeAccuracy').innerText = (Math.round(geolocation.getAltitudeAccuracy() * 100) / 100) + ' [m]';
    U.getEl('heading').innerText = (Math.round(geolocation.getHeading() * 100) / 100) + ' [rad]';
    U.getEl('speed').innerText = (Math.round(geolocation.getSpeed() * 100) / 100) + ' [m/s]';
}


function getMapClickCoordsXY(x, y) {
    // callback for the map click event
    var feature = map.forEachFeatureAtPixel(map.getPixelFromCoordinate([x, y]), function (feature, layer) {
        //you can add a condition on layer to restrict the listener
        return feature;
    });
    if (!feature) {
        // no object found here
        //U.getEl('obj_coordxy').value = `POINT(${x} ${y})`;
        if (DEV) {
            console.log(`## In getMapClickCoordsXY(${x},${y}) - No feature found here!`);
        }
        hidePanels();
    } else {
        //we found a feature so display info about it only in navigation mode for now
        if ($('#toggleMode').val() == 'NAVIGATE' ||
            $('#toggleMode').val() == 'EDIT') {
            if (DEV) {
                const formatGeoJSON = new ol.format.GeoJSON();
                const formatWKT = new ol.format.WKT();
                const feature_object = feature.getProperties();
                const strObj = U.dumpObject2String(feature_object);
                console.log(`## In getMapClickCoordsXY(${x},${y}) - found feature :\n ${strObj}`);
                //console.log(formatGeoJSON.writeFeature(feature));
                console.log(formatWKT.writeFeature(feature));
            }

            displayForm(feature);
        }
    }
}

//callback when a new polygon is created
function handleNewPolygon(newfeature) {
    "use strict";
    const formatWKT = new ol.format.WKT();
    let featureWKTGeometry = formatWKT.writeFeature(newfeature);
    U.getEl('obj_coordxy').value = featureWKTGeometry;
    newfeature.setProperties(goChantierProps, true);
    if (DEV) {
        console.log('## Inside handleNewPolygon callback newfeature : ', newfeature);
        console.log(featureWKTGeometry);
    }
    displayForm(newfeature);

}
//callback when a polygon is edited
function handleEditPolygon(editedFeature) {
    "use strict";
    const formatWKT = new ol.format.WKT();
    let featureWKTGeometry = formatWKT.writeFeature(editedFeature);
    U.getEl('obj_coordxy').value = featureWKTGeometry;
    if (DEV) {
        console.log('## Inside handleEditPolygon callback editedFeature : ', editedFeature);
        console.log(featureWKTGeometry);
    }
    displayForm(editedFeature);

}
//////////////////////////////////////////////////////////////////////
//// EVENT HANDLERS

U.getEl('track').addEventListener('change', function () {
    gomap.getGeolocationRef().setTracking(this.checked);
});

U.getEl('showForm').addEventListener('click', () => {
    displayForm();
    $('.navbar-toggle').click();
});

U.getEl('showInfo').addEventListener('click', () => {
    activateInfo();
    $('.navbar-toggle').click();
});

U.getEl('toggleMode').addEventListener('change', function (e) {
    "use strict";
    if (DEV) {
        console.log('MODE ' + $('#toggleMode').val() + ' SELECTED');
        console.log(this.selectedIndex);
    }
    gomap.setMode($('#toggleMode').val(), handleNewPolygon, handleEditPolygon);
    switch ($('#toggleMode').val()) {
        case 'NAVIGATE':
            U.getEl('info_current_mode').innerText = 'NAVIGATION';
            break;
        case 'CREATE':
            U.getEl('info_current_mode').innerText = 'CREATION';
            break;
        case 'EDIT':
            U.getEl('info_current_mode').innerText = 'EDITION';
            break;
        default:
            U.getEl('info_current_mode').innerText = 'Probleme :' + $('#toggleMode').val();
    }


    hidePanels();
    $('.navbar-toggle').click();

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
        U.getEl('track').checked = false
        gomap.getGeolocationRef().setTracking(false);
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

$('.slide_left_button').on('click', function () {
    $('#contentForm').animate(
        {
            'left': '-1000px' // move it towards the left and, probably, off-screen.
        }, 1000,
        function () {
            $(this).slideUp('fast');
        }
    );
});


//TODO add authentication login and display SAVE only if user authenticated
$('#save_data').on('click', function (event) {
    if (isFormValid()) {

        //TODO: forbid save when there is no network connection
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
                if (DEV) {
                    //alert("POST Success :\n textStatus :" + textStatus + "\n data : " + data);
                    console.log("POST Success with url : " + post_url);
                    console.log(jqXHR);

                }


                $('#toolbar_status').text(`SAUVEGARDE OK (id:${jqXHR.responseText})`);
                if (idgochantier === "0") {
                    // on a finit une insertion
                    U.getEl('obj_idgochantier').value = jqXHR.responseText;
                    U.getEl('info_idgochantier').innerText = `(id:${jqXHR.responseText})`;
                    $('#formFeedback')
                        .html(`INSERTION REUSSIE ! (nouvel id = ${jqXHR.responseText})`)
                        .addClass('alert-success');
                    // on nettoye la couche  temporaire apres une creation
                    gomap.clearTempLayers();
                } else {
                    $('#formFeedback')
                        .html(`SAUVEGARDE MODIFICATIONS REUSSIE !`)
                        .addClass('alert-success');
                }
                map.removeLayer(chantier_layer);
                chantier_layer = gomap.loadGeoJSONPolygonLayer(geojson_url, function () {
                    let feature_extent =getFeatureExtentbyId(chantier_layer,'idgochantier',idgochantier);
                    map.getView().fit(feature_extent, map.getSize());
                });

                //hidePanels();
                //clearFormValue();
                // apres sauvegarde ok on repasse en mode navigation
                U.getEl('toggleMode').value = 'NAVIGATE';
                U.getEl('info_current_mode').innerText = 'NAVIGATION';
                gomap.setMode('NAVIGATE', handleNewPolygon, handleEditPolygon);
                //TODO passer formulaire en mode consultation
                //displayForm(feature);

            },
            error: function (jqXHR, textStatus, errorThrown) {
                //alert("## POST error ##\n textStatus :" + textStatus + "\n ajaxError : " + errorThrown.toString());
                $('#formFeedback')
                    .html('ERREUR PENDANT LA SAUVEGARDE !')
                    .addClass('alert-danger');
                if (DEV) {
                    console.log("POST error with url : " + post_url);
                    console.log("## POST jqXHR : ", jqXHR);
                    console.log("## POST textStatus : ", textStatus);
                    console.log("## POST errorThrown : ", errorThrown);
                    console.log("## POST jqXHR.responseText : ", jqXHR.responseText);
                }
            }
        });

    }
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