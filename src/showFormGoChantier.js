/**
 * Created by cgil on 2/1/17.
 * Form and methods for gochantier
 */

import * as U from './lib/htmlUtils';
import ol from 'openlayers';
import moment from 'moment';

const Form = {
    html: `<div class="panel panel-info">
                <div class="panel-heading">
                    <h3 class="panel-title">
                        Information sur ce chantier
                        <span id="info_idgochantier"></span>
                        <span id="info_id_affaire_goeland"></span>
                    </h3>
                    <span class="pull-right clickable glyphicon glyphicon-remove"
                          data-effect="slideUp">
                        <i class="fa fa-times"></i>
                    </span>
                    <span id="slide_left_button" class="pull-right slide_left_button glyphicon glyphicon-chevron-left"
                          data-effect="slideLeft">
                        <i class="fa fa-times"></i>
                    </span>
                </div>
                <div class="panel-body">
                    <div id="toolbar_status"></div>
                    <div id="form_gochantier" class="form-horizontal">
            
                        <input type="hidden" id="obj_idgochantier" name="idgochantier">
                        <input type="hidden" id="obj_id_affaire_goeland" name="id_affaire_goeland">
                        <input type="hidden" id="obj_idcreator" name="idcreator">
            
                        <div class="form-group">
                            <label for="obj_name" class="col-sm-3 control-label">
                                Nom (*)
                            </label>
                            <div class="col-sm-9">
                                <input type="text" id="obj_name" name="nom"
                                       class="form-control" required="true" autofocus
                                       placeholder="Nom de ce chantier"
                                />
                            </div>
                        </div>
            
                        <div class="form-group">
                            <label for="obj_description" class="col-sm-3 control-label">
                                Description (*)
                            </label>
                            <div class="col-sm-9">
                                <textarea id="obj_description" name="description"
                                          class="form-control" required="true"
                                          placeholder="Description ou commentaire concernant ce chantier"
                                          rows="3">
                                </textarea>
                            </div>
                        </div>
                        <div id="div_entiteleader" class="form-group">
                            <label for="obj_entiteleader" class="col-sm-3 control-label">
                                Entité leader
                            </label>
                            <div class="col-sm-9">
                                <input type="text" id="obj_entiteleader" name="entiteleader"
                                       class="form-control" readonly 
                                       placeholder="Entité leader pour ce chantier"
                                />                    
                            </div>
                        </div>
            
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="obj_planified_date_begin" class="control-label">
                                    Début prévu le (*)
                                </label>
                                <input type="text" id="obj_planified_date_begin" name="planified_date_begin"
                                       class="form-control" required="true"
                                       placeholder="Date de début planifiée [JJ/MM/AAAA]"
                                />
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="obj_planified_date_end" class="control-label">
                                    Fin prévue le (*)
                                </label>
                                <input type="text" id="obj_planified_date_end" name="planified_date_end"
                                       class="form-control" required="true"
                                       placeholder="Date de fin planifiée [JJ/MM/AAAA]"
                                />
                            </div>
                        </div>
            
                        <div id="div_real_date_begin" class="col-sm-6">
                            <div class="form-group">
                                <label for="obj_real_date_begin" class="control-label">
                                    Début effectif :
                                </label>
                                <input type="text" id="obj_real_date_begin" name="real_date_begin"
                                       class="form-control"
                                       placeholder="Date de début réelle"
                                />
                            </div>
                        </div>
                        <div id="div_real_date_end" class="col-sm-6">
                            <div class="form-group">
                                <label for="obj_real_date_end" class="control-label">
                                    Fin effective :
                                </label>
                                <input type="text" id="obj_real_date_end" name="real_date_end"
                                       class="form-control"
                                       placeholder="Date de fin réelle"
                                />
            
                            </div>
                        </div>
                        
                        <div id="div_participants">
                        </div>
            
                        <div id="div_coordxy" class="form-group">
                            <label for="obj_coordxy" class="col-sm-3 control-label">Gèométrie :</label>
                            <div class="col-sm-9">
                                <input type="text" id="obj_coordxy" name="geom_point"
                                       readonly class="form-control" 
                                       placeholder="Position X,Y de cet objet"
                                />
                            </div>
                        </div>
            
            
                        <div id="edit_buttons" >
                            <button id="save_data" class="form-control btn btn-default">SAUVER</button>
                            <!--<button id="delete_data" class="btn btn-default">EFFACER</button>-->
                            <div id="formFeedback" class="form-control alert alert-info" role="alert">...</div>
                        </div>
                    </div>
                </div> <!--end of panel body -->
            </div>`,
    //end of html Form content template

    goChantierProps: {
        "idgochantier": 0,
        "nom": null,
        "description": null,
        "idcreator": null,
        "entiteleader": null,
        "id_affaire_goeland": null,
        "planified_datestart": null,
        "planified_dateend": null,
        "real_datestart": null,
        "real_dateend": null,
        "x": null,
        "y": null,
        "lon": null,
        "lat": null
    },

    clearFormValue: function () {
        "use strict";
        U.getEl('info_idgochantier').innerText = '';
        U.getEl('obj_idgochantier').value = '';
        U.getEl('info_id_affaire_goeland').innerText = '';
        U.getEl('obj_id_affaire_goeland').value = '';
        U.getEl('obj_idcreator').value = '';
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
    },
    isValid: function () {
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
    },

    display: function (feature, readonly = false) {
        if (!U.isNullOrUndefined(feature)) {
            Form.clearFormValue();
            const formatWKT = new ol.format.WKT();
            const feature_object = feature.getProperties();
            if (U.isNullOrUndefined(feature_object.idgochantier)) {
                U.getEl('info_idgochantier').innerText = ' nouveau (pas encore sauvé !)';
                U.getEl('obj_idgochantier').value = 0;
            } else {
                U.getEl('info_idgochantier').innerText = ` (id:${feature_object.idgochantier})`;
                U.getEl('obj_idgochantier').value = feature_object.idgochantier;
            }
            if (U.isNullOrUndefined(feature_object.idcreator)) {
                U.getEl('obj_idcreator').value = '';
            } else {
                U.getEl('obj_idcreator').value = feature_object.idcreator;
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
                if (U.isNullOrUndefined(feature_object.real_datestart)) {
                    $('#div_real_date_begin').hide();
                } else {
                    $('#div_real_date_begin').show();
                }
                if (U.isNullOrUndefined(feature_object.real_dateend)) {
                    $('#div_real_date_end').hide();
                } else {
                    $('#div_real_date_end').show();
                }


                if (!U.isNullOrUndefined(feature_object.participants)) {
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
        $('#contentList').slideUp();
        $('#contentForm').slideDown();


    },


};

export default Form;
