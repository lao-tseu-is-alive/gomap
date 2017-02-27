/**
 * Created by cgil on 2/1/17.
 */
const envInfo = `DEV : ${DEV.toString()} - PROD: ${PROD.toString()}`;


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
                <label for="gps_coordxy" class="col-sm-4 control-label">Coordonnées Nationale GPS X,Y MN03:</label>
                <div class="col-sm-8">
                    <input type="text" readonly class="form-control" id="gps_coordxy"
                           placeholder="Votre position X,Y MN03">
                </div>
            </div>
            <div class="form-group">
                <label for="gps_coordlonlat" class="col-sm-4 control-label">Latitude, Longitude :</label>
                <div class="col-sm-8">
                    <input type="text" readonly class="form-control" id="gps_coordlonlat"
                           placeholder="Votre position WGS84 Latitude, Longitude">
                </div>
            </div>
            <div class="form-group">
                <label for="gps_coordxy" class="col-sm-4 control-label">Activer le tracking de position</label>
                <div class="col-sm-8">
                    <input id="track" class="form-control align-right" type="checkbox" >
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
