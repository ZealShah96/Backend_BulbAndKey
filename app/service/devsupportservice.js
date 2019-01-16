//const colorjson=require('./../../../config/colorconfig');
const fs=require('fs');

exports.findColorBasedOnInput=async function(number){
    return new Promise((resolve,reject)=>{
        fs.readFile('./config/colorconfig.json',{ encoding: 'utf-8' },(err,data)=>{
            if(err==null){
                utilityService.log(JSON.parse(data));
let ojectsofcolor=JSON.parse(data);
//'\''+number+'\'',`
utilityService.log(`'${number.toString()}'`);
                let color=ojectsofcolor[`${number}`];
                utilityService.log('\x1b[32m%s\x1b[0m',"color for console."+number+color);
            resolve(color);
            }
            else{
                utilityService.log('\x1b[5m%s\x1b[0m',err.message);
                utilityService.log('\x1b[5m%s\x1b[0m',err.stack);
                reject(err);
            }
            });
    });

}