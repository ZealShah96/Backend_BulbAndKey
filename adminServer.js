"use strict";
//universal node modules import
const fs = require("fs");
const Hapi = require("hapi");

// dependency from project
const redis = require("./app/service/redisservice");
const utilityService = require("./app/service/utilityservice");


// Create a server with a host and port
let server = Hapi.server({
  host: "localhost",
  port: 8001,
  routes: { cors: true }
});

const validate = async request => {
  let isValid = await checkUserNameAndPassword(request);
  console.log("test");
  const credentials = { id: 1, name: "test shah" };
  return { isValid, credentials };
};


//check user name password and return allowed api services.
async function checkUserNameAndPassword(request) {
  try {
    let urlHasAdmin = await urlShouldHasAdmin(request.path);

    if (urlHasAdmin) {

      //users and userroles import uncaching
      utilityService.requireUncachedJson("./config/userRoles.json");
      utilityService.requireUncachedJson("./config/users.json");


      //caching list of services and other data.
      let listOfAllowedApiServices = JSON.parse(
        fs.readFileSync("./config/userRoles.json", { encoding: "utf-8" })
      );
      let listOfUser = JSON.parse(
        fs.readFileSync("./config/users.json", { encoding: "utf-8" })
      );

      let linksAvaibaleForUser = listOfAllowedApiServices[request.headers.role];
      //checking passed link is allowed or not.
      if(linksAvaibaleForUser['api_services'].indexOf(request.path)==-1){
        return false;
      }
      return true;
    }
    return false;
  } catch (err) {
    return false;
  }
}

//checking dose url is allowed for using admin 
async function urlShouldHasAdmin(url) {
  if (url.split("/")[1] === "admin") {
    return true;
  }
  return false;
}

// Create a server with a host and port
const init = async () => {

  //registring basic auth module of hapi
  await server.register(
    require("./../test/app/module/admin/hapi-auth-basic")
  );
//describing authetication statergy of server.
  server.auth.strategy("simple", "basic", { validate });

  //list of modules
  var modules = [
    "user",
    "project",
    "address",
    "creator",
    "payment",
    "gallery",
    "quote",
    "coupon",
    "admin"
  ];

  //***registring module by module to server.
/*this will register 3 things 1.routes 2.schema 3. handler of that module 
all thinhs will be avaiable through index file.
  */
  for (var i = 0; i < modules.length; i++) {
    
    await server.register(require("./app/module/" + modules[i] + "/index"));

    require("./app/module/" + modules[i] + "/schema");
  }
  server.auth.default("simple");
  /******************************************************************************************
   * Start Server
   ******************************************************************************************/
  await server.start();
  console.log("Server started on :- " + server.info.uri);
  return server;
};

/******************************************************************************************
 * Init Server - Starting Point
 ******************************************************************************************/

async function serverStart() {
  return new Promise((resolve, reject) => {
    //getting all configuration from json file based on enviroment you choose.
    utilityService
      .findConfigurationFromConfigFile("adminserverconfig")
      .then(serverConfig => {
        server = Hapi.server({
          host: serverConfig.host,
          port: serverConfig.port,
          routes: {
            cors: {
              origin: ["*"],
              headers: ["Accept", "Content-Type", "user_id", "role"],
              additionalHeaders: ["X-Requested-With"]
            }
          }
        });
        init()
        //server will be server object of started  server.
          .then(server => {
            // console.log(server);
            console.log("Server Start");
            return resolve(server);
          })
          //error handling.
          .catch(err => {
            console.error(err);
            return reject(server);
          });
      });
  }).catch(err => {
    throw new Error("We can't configure server on this port.");
  });
}

//init();

module.exports = { server: server, serverStart: serverStart };
