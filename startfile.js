
/***
 * importing all modules needed to start server which include 2 servers
 * 1. main server which has all modules apis
 * 2. admin server which will run in diffrent port
 */


 //***readJsonForDyanamic COde will help to read json and attach connection between 2 models. */
const readJsonForDyanamicCode = require('./CodeInjector/readJson');
//***server is main server */
const server = require('./server');
//***Admin server is admin server which used for accessing data from back hand. */
const adminServer=require('./adminServer');
const mongoConnection = require('./app/service/mongoservice');
const utilityService = require("./app/service/utilityservice");

//this function will use for starting server
async function startServer() {

    // readJsonForDyanamicCode.attachDyanamicClasses().then(async (bool) => {
    //     if (bool) {
    //         console.log("Dynamic class refrences added.")
            console.log("main server is starting....")
            await server.serverStart();
            console.log("main server started.");
            console.log("admin server is starting...");
           await adminServer.serverStart();
            console.log("admin server is started.");
            try {
                let connectionObject = await mongoConnection.mongoUtility.mongoConnect();
            }
            catch (e) {
              return utilityService.handleError("error in connection establishment", e, 404);
            }  
    //     }
    // }).catch((err) => {
    //     console.log("error in adding dynamic class refrences"+err)
    // });
}

//Server Initilazation....
startServer();

module.exports = {
    startServer: startServer
}

//const server=require('./server');