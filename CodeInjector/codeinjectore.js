"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var codeinjector = /** @class */ (function () {
    function codeinjector() {
    }
    codeinjector.prototype.main = function (filename, filedirectorypath, className, CodeToChange, CodeToIdentifie) {
        
        var filePath = filedirectorypath +filename;
       
        var className=className;
        var CodeToChange=CodeToChange;
        var CodeToIdentifie=CodeToIdentifie;
       // console.log(filePath);
        var stringToAdd = "" + CodeToChange;
   fs_1.openSync('./'+filePath,'a');
        ///File Read Will Start From here 
        var data=fs_1.readFileSync('./'+filePath, { encoding: 'utf-8' },'a');
            //console.log(data);
            var arrayOfLines_1 = data.split('\n');
            var stringEndOFFile_1 = "" + CodeToIdentifie;
            var indexWhereLineBreak = 0;
            var boolCodeIsAvaibaleOrNot=false;
            arrayOfLines_1.map(function (val, index) {

                if(arrayOfLines_1[index].trim()==stringToAdd.trim()){
                    boolCodeIsAvaibaleOrNot=true;
                }
                if ((arrayOfLines_1[index].trim() == stringEndOFFile_1.trim() )&& !boolCodeIsAvaibaleOrNot) {
                    indexWhereLineBreak = index;
                    arrayOfLines_1[index] = ("\n        " +replaceSpecificCharcter("LowerCase"
                    ,replaceSpecificCharcter("className",stringToAdd,className)
                    ,className.toLowerCase())
                     + "\n         " 
                     + stringEndOFFile_1 
                     + "\n         ");
                }
            });
            if(data==arrayOfLines_1.join('\n')){
                console.log("There are no changes in file");
            }
            else{
                console.log("There are some changes in file");
                console.log(filePath);
            fs_1.writeFileSync('../'+filePath, arrayOfLines_1.join('\n'));
        }
          //  console.log(indexWhereLineBreak);
        
    };
    return codeinjector;
}());



function replaceSpecificCharcter(symbol, string, changeelement) {

    var tempString = string;
    if (tempString.indexOf(symbol) > -1) {

        tempString = replaceSpecificCharcter(symbol, string.replace(symbol, changeelement), changeelement);

    }
    return tempString;
}
exports.codeinjector = codeinjector;
