/**
 * Created by cgil on 2/1/17.
 */
import css from './style/base.css';
import  messages from './messages';
const envInfo = `DEV : ${DEV.toString()} - PROD: ${PROD.toString()}`;
const debugInfo = DEV ? `<span class="${css.boxDebug}"> ${envInfo} </span>` : ``;
console.log(envInfo);

const Info = `
<p>
<div class="row">
<div class="row">
    <div class="six columns"><h4>${messages.app_title}</h4></div>
    <div class="six columns">${messages.app_info} <br>${debugInfo}</div>
  </div>
</div>
</p>
`;
export default Info;
