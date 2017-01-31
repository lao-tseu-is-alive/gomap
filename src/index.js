/*
 index.js for testing webpack integration as explained here
 https://www.youtube.com/watch?v=eWmkBNBTbMM
 */

import  messages from './messages';
import Button from './button';
import Kitten from './kitten';
import Uppsalajs from './uppsalajs';
import * as mathStuff from './mathStuff';

var app = document.getElementById('app');

const Bouton = () => (Button.button);
const TreeShakingMathTest = () => (mathStuff.multiply(3, 3));
const envInfo = `DEV : ${DEVELOPMENT.toString()} - PROD: ${PRODUCTION.toString()}`;
console.log(envInfo)

const mainHtmlDiv =
    `<div id=map><h2>${messages.app_title}</h2><p>${messages.app_info}</p>
${Bouton()} 3 x 3 = ${TreeShakingMathTest()} ! <br> ${envInfo} <br>
it's working GREAT !<br>
${Kitten}
${Uppsalajs}
    <noscript>${messages.javascript_needed}</noscript></div>`;
app.innerHTML = mainHtmlDiv;
Button.attachEl();
if (DEVELOPMENT) {
    if (module.hot) {
        module.hot.accept();
    }
}