'use strict'

// Connection URL
//const mongoConnection=require('mongodb').MongoClient;
const mongoose = require('mongoose');
const utilityService = require('./utilityservice');

//Url 
let url = '';


var mongoUtility = {};




mongoUtility.mongoConnect = async function () {
    return new Promise((resolve, reject) => {
        // Database Name
       // const dbName = utilityService.findConfigurationFromConfigFile("databasename");
        url= "mongodb://localhost:3309/bulbandkey";
        mongoose.connect(url,
            { useNewUrlParser: true }).then(
               async () => {
                    utilityService.log("db  connection is done on port 3309");
                    utilityService.log('Version : '+mongoose.version)
                    return resolve({ "statuscode": 200, "mongoose": mongoose });
                },
                err => {
                    throw new Error("connection has some error." + err);
                    // utilityService.log("connection has some error." + err)
                    // return reject({ "statuscode": 500, "err": err })
                }
            );
    });
}



mongoUtility.mongoDisconnect = async function () {
    return new Promise((resolve, reject) => {
        mongoose.connection.close().then(
            () => {
                utilityService.log("db connection is Closed on port 3309");
                return resolve({ "statuscode": 200, "err": null });
            },
            err => {
                throw new Error("connection closing has some error." + err);
                // utilityService.log("connection closing has some error." + err);
                // return reject({ "statuscode": 500, "err": err })
            }
        );

    });

}















// mongoUtility.mongoConnect=function(){
//     return new Promise((resolve,reject)=>{
//         var connection=mongoose.createConnection(url); 
//         if(!connection){
//         //assert.equal(null, err);

//            // if(!err){
//               //  const db = client.db(dbName);
//                 utilityService.log("Connected successfully to "+dbName);
//                 resolve(200,connection);
//          //  }
//           //  else{
//             //    reject(404,err,client);
//           //  }


//         }


//      //   client.close();
//       });

// };


// mongoUtility.mongodisConnect=function(client){
//   //  MongoClient.connect(url, function(err, client) {
//         //assert.equal(null, err);
//        // utilityService.log("Connected successfully to server");

//       //  const db = client.db(dbName);

//      return new Promise((resolve,reject)=>{
//         try{
//             client.close();
//             return resolve(200,err);
//         }
//         catch(err){
//             return reject(500,err);
//         }
//      });
//     //  .then(function(err){
//     //      if(!err)
//     //      {
//     //          callback(200,err);
//     //         }
//     //         else{
//     //             callback(500,err);
//     //         }
//     //  });
//     //  });

// };


module.exports.mongoUtility = mongoUtility;




