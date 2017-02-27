/**
 * Created by cgil on 2/1/17.
 */
export const getEl = (elemntId) => (document.getElementById(elemntId));
export const function_exist = (function_name) => ((typeof(function_name) !== 'undefined') && (function_name !== null));
export const isNullOrUndefined = (variable) => ((typeof(variable) === 'undefined') || (variable === null))
export const unescapeHtml = function (safe) {
    if (isNullOrUndefined(safe)) {
        return safe;
    } else {
        return safe.replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#039;/g, "'")
            .replace(/&#39;/g, "'");
    }
}
export const getArrObjectsProperties = function (object_name) {
    "use strict";
    var arr = [];
    for (var prop in object_name) {
        if (object_name.hasOwnProperty(prop)) {
            (DEV) ? console.log(prop) : '';
            arr.push(prop);
        }
    }
    return arr;
};
export const dumpObject2String = function (object_name) {
    "use strict";
    var obj_dump = "";
    const arr_prop = getArrObjectsProperties(object_name);
    obj_dump = arr_prop.reduce((a, b) => (`${a}\n ${b}: ${object_name[b]}`));
    return obj_dump;
};
export const cgdebug = function () {
    if (DEV) {
        debugger;
    }
};
