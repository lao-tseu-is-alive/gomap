/**
 * Created by cgil on 2/1/17.
 */
import css from './style/base.css';
import  messages from './messages';
const envInfo = `DEV : ${DEV.toString()} - PROD: ${PROD.toString()}`;
const debugInfo = DEV ? `<span class="${css.boxDebug}"> ${envInfo} </span>` : ``;
console.log(envInfo);

const Info = `
    <h4>${messages.app_title}</h4>
    <div >
        <ul>
        <li><a href="https://gtmetrix.com/reports/gomap.gil.town/KpBlmPoR">GTMetrix A score (100%)</a></li>
        <li><a href="https://developers.google.com/speed/pagespeed/insights/?url=https%3A%2F%2Fgomap.gil.town%2F">91/100 on Google PageSpeed</a></li>
        </ul>
    </div>
    <div >${messages.app_info} <br>${debugInfo}</div>
    <!-- GEOLOCATION FEEDBACK -->
    <div id="info" style="display: none;"></div>
    <label for="track">
      track position
      <input id="track" type="checkbox" checked/>
    </label>
    <p>
      position accuracy : <code id="accuracy"></code>&nbsp;&nbsp;
      altitude : <code id="altitude"></code>&nbsp;&nbsp;
      altitude accuracy : <code id="altitudeAccuracy"></code>&nbsp;&nbsp;
      heading : <code id="heading"></code>&nbsp;&nbsp;
      speed : <code id="speed"></code>
    </p>
`;
export default Info;
