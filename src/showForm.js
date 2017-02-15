/**
 * Created by cgil on 2/1/17.
 */

//TODO: add method to clear and assign values to form

const Form = `
<div class="panel panel-info">
      <div class="panel-heading">
        <h3 class="panel-title">Information sur cet objet <span id="info_idgeoobject"></span></h3>
            <span class="pull-right clickable glyphicon glyphicon-remove" data-effect="slideUp"><i class="fa fa-times"></i></span>
      </div>
      <div class="panel-body">
            <div id="toolbar_status'"></div>
      
<form class="form-horizontal">
   <input type="hidden" id="obj_idgeoobject" name="idgeoobject">
  <div class="form-group">
    <label for="obj_name" class="col-sm-2 control-label">Nom:</label>
    <div class="col-sm-10">
      <input type="text" class="form-control" id="obj_name" name="nom" placeholder="Nom de ce chantier">
    </div>
  </div>
  <div class="form-group">
    <label for="obj_date_begin" class="col-sm-2 control-label">Date de début:</label>
    <div class="col-sm-10">
      <input type="text" class="form-control" id="obj_date_begin" name="datebegin" placeholder="Date de début">
    </div>
  </div>
  <div class="form-group">
    <label for="obj_date_end" class="col-sm-2 control-label">Date de fin:</label>
    <div class="col-sm-10">
      <input type="text" class="form-control" id="obj_date_end" name="dateend" placeholder="Date de fin">
    </div>
  </div>
  <div class="form-group">
    <label for="obj_url" class="col-sm-2 control-label">Url Info :</label>
    <div class="col-sm-10">
      <input type="text" class="form-control" id="obj_infourl" name="infourl" placeholder="Url de cet objet">
    </div>
  </div>
  <div class="form-group">
    <label for="obj_url" class="col-sm-2 control-label">Url Icone:</label>
    <div class="col-sm-10">
      <input type="text" class="form-control" id="obj_iconeurl" name="iconeurl" placeholder="Url de l'icone de cet objet">
    </div>
  </div>
  <div class="form-group">
    <label for="obj_coordxy" class="col-sm-2 control-label">Coordonnées X,Y :</label>
    <div class="col-sm-10">
      <input type="text" readonly class="form-control" id="obj_coordxy" name="geom_point" placeholder="Position X,Y de cet objet">
    </div>
  </div>
  <div class="form-group">
    <label for="obj_description" class="col-sm-2 control-label">Description :</label>
    <div class="col-sm-10">
        <textarea id="obj_description" name="description" class="form-control" rows="3"></textarea>
    </div>
  </div>

  <!--
  <div class="form-group">
    <div class="col-sm-offset-2 col-sm-10">
      <div class="checkbox">
        <label>
          <input type="checkbox"> Remember me
        </label>
      </div>
    </div>
  </div>
  -->
  <div class="form-group">
    <div class="col-sm-offset-2 col-sm-10">
      <button id="save_data" class="btn btn-default">SAUVER</button>
      <button id="delete_data" class="btn btn-default">EFFACER</button>
    </div>
  </div>
</form>
</div> <!--end of panel body -->
</div>
`; //end of Form content template

export default Form;
