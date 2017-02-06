/**
 * Created by cgil on 2/1/17.
 */

//TODO: add method to clear and assign values to form


const Form = `

<form class="form-horizontal">
  <div class="form-group">
    <label for="obj_name" class="col-sm-2 control-label">Nom :</label>
    <div class="col-sm-10">
      <input type="text" class="form-control" id="obj_name" placeholder="Nom de cet objet">
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
`; //end of Form content template

export default Form;
