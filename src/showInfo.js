/**
 * Created by cgil on 2/1/17.
 */
import css from './style/base.css';
import  messages from './messages';
const envInfo = `DEV : ${DEV.toString()} - PROD: ${PROD.toString()}`;
const debugInfo = DEV ? `<p>${messages.app_title}<span class="${css.boxDebug}"> ${envInfo} </span></p>` : ``;
console.log(envInfo);

const Info = `   
    <!-- GEOLOCATION FEEDBACK -->
<div class="panel panel-info">
    <div class="panel-heading">
        <h3 class="panel-title">Information GPS</h3>
        <span class="pull-right clickable glyphicon glyphicon-remove" data-effect="slideUp"><i class="fa fa-times"></i></span>
    </div>
    <div class="panel-body">
        <form class="form-horizontal">
            <div id="info" class="alert alert-danger" style="display: none;" role="alert"></div>
            <div class="form-group">
                <label for="gps_coordxy" class="col-sm-4 control-label">Coordonnées GPS X,Y :</label>
                <div class="col-sm-8">
                    <input type="text" readonly class="form-control" id="gps_coordxy"
                           placeholder="Votre position GPS X,Y">
                </div>
            </div>
            <div class="form-group">
                <label for="gps_coordxy" class="col-sm-4 control-label">Activer le tracking de position</label>
                <div class="col-sm-8">
                    <input id="track" class="form-control align-right" type="checkbox" checked>
                </div>
            </div>
        </form>
        <p>
            position accuracy : <code id="accuracy"></code>&nbsp;&nbsp;
            altitude : <code id="altitude"></code>&nbsp;&nbsp;
            altitude accuracy : <code id="altitudeAccuracy"></code>&nbsp;&nbsp;
            heading : <code id="heading"></code>&nbsp;&nbsp;
            speed : <code id="speed"></code>
        </p>
    </div>
</div>
`;
export default Info;
