/**
 * Created by cgil on 2/1/17.
 */

//TODO: add method to clear and assign values to form here

const Form = `
<div class="panel panel-info">
      <div class="panel-heading">
        <h3 class="panel-title">Information sur ce chantier<span id="info_idgochantier"></span></h3>
            <span class="pull-right clickable glyphicon glyphicon-remove" data-effect="slideUp"><i class="fa fa-times"></i></span>
      </div>
      <div class="panel-body">
            <div id="toolbar_status'"></div>
      
<form class="form-horizontal">
  <input type="hidden" id="obj_idgochantier" name="idgochantier">
  <div class="form-group">
    <label for="obj_name" class="col-sm-3 control-label">Nom (*)</label>
    <div class="col-sm-9">
      <input type="text" class="form-control" id="obj_name" required="true"autofocus  name="nom" placeholder="Nom de ce chantier">
    </div>
  </div>
   <div class="form-group">
    <label for="obj_description" class="col-sm-3 control-label">Description (*)</label>
    <div class="col-sm-9">
        <textarea id="obj_description" required="true" name="description" class="form-control"
         placeholder="Description ou commentaire concernant ce chantier"
        rows="3"></textarea>
    </div>
  </div>
  
  <div class='col-sm-6'>
    <div class="form-group">
        <label for="obj_planified_date_begin" class="control-label">Début prévu le (*)</label>
        
        <div class='input-group date' id='obj_planified_date_begin'>
            <input type='text' class="form-control" required="true" placeholder="Date de début planifiée [JJ/MM/AAAA]" />
            <span class="input-group-addon">
                <span class="glyphicon glyphicon-calendar"></span>
            </span>
        </div>
    </div>
  </div>
  <div class='col-sm-6'>
    <div class="form-group">
        <label for="obj_planified_date_end" class="control-label">Fin prévue le (*)</label>
        <div class='input-group date' id='obj_planified_date_end'>
            <input type='text' class="form-control" required="true" placeholder="Date de fin planifiée [JJ/MM/AAAA]"/>
            <span class="input-group-addon">
                <span class="glyphicon glyphicon-calendar"></span>
            </span>
        </div>
    </div>
  </div>
 
 <div class='col-sm-6'>
    <div class="form-group">
        <label for="obj_real_date_begin" class="control-label">Début effectif :</label>
        <div class='input-group date' id='obj_real_date_begin'>
            <input type='text' class="form-control" placeholder="Date de début réelle" />
            <span class="input-group-addon">
                <span class="glyphicon glyphicon-calendar"></span>
            </span>
        </div>
    </div>
  </div>
  <div class='col-sm-6'>
    <div class="form-group">
        <label for="obj_real_date_end" class="control-label">Fin effective :</label>
        <div class='input-group date' id='obj_real_date_end'>
            <input type='text' class="form-control" placeholder="Date de fin réelle"/>
            <span class="input-group-addon">
                <span class="glyphicon glyphicon-calendar"></span>
            </span>
        </div>
    </div>
  </div>
  
  
  <div class="form-group">
    <label for="obj_coordxy" class="col-sm-3 control-label">Gèométrie :</label>
    <div class="col-sm-9">
      <input type="text" readonly class="form-control" id="obj_coordxy" name="geom_point" placeholder="Position X,Y de cet objet">
    </div>
  </div>
  
  
  <div id="edit_buttons" class="form-group">
    <div class="col-sm-offset-3 col-sm-9">
      <button id="save_data" class="btn btn-default">SAUVER</button>
      <!--<button id="delete_data" class="btn btn-default">EFFACER</button>-->
      <div id="formFeedback" class="alert alert-info" role="alert">...</div>
    </div>
  </div>
</form>
</div> <!--end of panel body -->
</div>
`; //end of Form content template

export default Form;
