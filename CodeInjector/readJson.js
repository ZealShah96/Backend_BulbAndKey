"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var codeinjectore_1 = require("./codeinjectore");


exports.attachDyanamicClasses=async function(){
    return new Promise((resolve,reject)=>{
fs_1.readFile('./CodeInjector/DynamicConfigFileExample.json',{ encoding: 'utf-8' }, function (err, data) {
    var ci = new codeinjectore_1.codeinjector();
    
        if (err==null) {
            // console.log(data);
             var json = JSON.parse(data);
            // console.log(json);
             Object.entries(json).forEach(function (_a) {
                 var key = _a[0], value = _a[1];
                 var filedirectorypath = value["filedirectorypath"];
                 var filename = value["filename"];
                 var className = value["className"];
                 Object.entries(value).forEach(function (_a) {
                     var key = _a[0], value = _a[1];
                    // console.log(value);
                     if(typeof(value)=="object"){
                         className.forEach(element=>{
                             ci.main(filename, filedirectorypath, element, value["CodeToChange"], value["CodeToIdentifie"]);
                         });
                 }
                 });
             });
             resolve(true);
         }
         else{
             reject(err);
         }
    })
    
});
}
