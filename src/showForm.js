/**
 * Created by cgil on 2/1/17.
 */

//TODO: add method to clear and assign values to form

const Form = `
<div class="panel panel-info">
      <div class="panel-heading">
        <h3 class="panel-title">Information sur cet objet</h3>
            <span class="pull-right clickable glyphicon glyphicon-remove" data-effect="slideUp"><i class="fa fa-times"></i></span>
      </div>
      <div class="panel-body">      
      
<form class="form-horizontal">
  <div class="form-group">
    <label for="obj_name" class="col-sm-2 control-label">Nom:</label>
    <div class="col-sm-10">
      <input type="text" class="form-control" id="obj_name" placeholder="Nom de ce chantier">
    </div>
  </div>
  <div class="form-group">
    <label for="obj_date_begin" class="col-sm-2 control-label">Date de début:</label>
    <div class="col-sm-10">
      <input type="text" class="form-control" id="obj_date_begin" placeholder="Date de début">
    </div>
  </div>
  <div class="form-group">
    <label for="obj_date_end" class="col-sm-2 control-label">Date de fin:</label>
    <div class="col-sm-10">
      <input type="text" class="form-control" id="obj_date_end" placeholder="Date de fin">
    </div>
  </div>
  <div class="form-group">
    <label for="obj_url" class="col-sm-2 control-label">Url :</label>
    <div class="col-sm-10">
      <input type="text" class="form-control" id="obj_url" placeholder="Url de cet objet">
    </div>
  </div>
  <div class="form-group">
    <label for="obj_coordxy" class="col-sm-2 control-label">Coordonnées X,Y :</label>
    <div class="col-sm-10">
      <input type="text" readonly class="form-control" id="obj_coordxy" placeholder="Position X,Y de cet objet">
    </div>
  </div>
  <div class="form-group">
    <label for="obj_description" class="col-sm-2 control-label">Description :</label>
    <div class="col-sm-10">
        <textarea id="obj_description" class="form-control" rows="3"></textarea>
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
      <button type="submit" class="btn btn-default">SAUVER</button>
      <button type="submit" class="btn btn-default">EFFACER</button>
    </div>
  </div>
</form>
</div> <!--end of panel body -->
</div>
`; //end of Form content template

export default Form;
