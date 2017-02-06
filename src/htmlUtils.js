/**
 * Created by cgil on 2/1/17.
 */
export const getEl = (elemntId) => (document.getElementById(elemntId));
export const function_exist = (function_name) => (typeof function_name !== 'undefined');
export const getArrObjectsProperties = function(object_name){
    "use strict";
    var arr=[];
    for (var prop in object_name){
        if(object_name.hasOwnProperty(prop)){
            (DEV) ? console.log(prop): '';
            arr.push(prop);
        }
    }
    return arr;
    };
export const dumpObject2String = function(object_name){
    "use strict";
    var obj_dump="";
    const arr_prop = getArrObjectsProperties(object_name);
    obj_dump = arr_prop.reduce((a,b) => (`${a}\n ${b}: ${object_name[b]}`));
    return obj_dump;
};
export const cgdebug = function(){
    if (DEV) {
        debugger;
    }
};
