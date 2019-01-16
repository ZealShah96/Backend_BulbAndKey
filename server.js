"use strict";

const Hapi = require("hapi");
const AuthBearer = require("hapi-auth-bearer-token");
const redis = require("./app/service/redisservice");
var mongoConnection = require('./app/service/mongoservice');
const utilityService = require("./app/service/utilityservice");

// Create a server with a host and port (default configuration)

let server = Hapi.server({
  host: "localhost",
  port: 8000,
  routes: { cors: true }
});


// Create a server with a host and port

const init = async () => {

  
  //registring basic auth module of hapi
  await server.register(AuthBearer);
  server.auth.strategy("simple", "bearer-access-token", {
    allowQueryToken: true,
    tokenType: "token", // optional, false by default
    validate: async (request, token, h) => {
    
      const isValid = await redis.getcachevalue(token);
      const credentials = { token };
      const artifacts = { test: "info" };
      return { isValid, credentials, artifacts };
    }
  });
  //server.auth.default(false);
  /******************************************************************************************
   * Define the guest cookie
   ******************************************************************************************/
  // server.state('frg', {
  //   encoding: 'base64json',
  //   path: '/',
  //   isSecure: false,
  // });

  /******************************************************************************************
   * Init plugins
   ******************************************************************************************/
  // Init plugins

  // await server.register([

  // { plugin: require('inert') },
  // { plugin: require('hapi-boom-decorators') },
  // {
  //   plugin: require('good'),
  //   options: {
  //     ops: {
  //         interval: 1000
  //     },
  //     reporters: {
  //       file: [{
  //         module: 'good-squeeze',
  //         name: 'Squeeze',
  //         args: [{ log: '*', response: '*', request: '*' }]
  //         // args: [{ops: '*'}]
  //       }, {
  //         module: 'good-squeeze',
  //         name: 'SafeJson',
  //         args: [{ seperator: '\n' }]
  //       }, {
  //         module: 'rotating-file-stream',
  //         args: ['platfrom.log', {
  //             path: './logs', // base path
  //             size: '10M' //, // rotate every 10 MegaBytes written
  //             // interval: '1d', // rotate daily
  //             // compress: true // compress rotated files
  //         }]
  //       }]
  //     }
  //   }
  // },
  // {
  //   plugin: require('hapi-i18n'),
  //   options: {
  //     locales: ['en', 'fr'],
  //     directory: __dirname + '/locales',
  //     defaultLocale: 'en',
  //   }
  // },
  // {
  //   plugin: require('hapi-auth-jwt2'),
  //   options: {
  //     locales: ['en', 'fr'],
  //     directory: __dirname + '/locales',
  //     defaultLocale: 'en',
  //   }
  // },
  // {
  //   plugin: require('hapi-elastic'),
  //   options: {
  //     host: "http://elastic:changeme@localhost:" + appConfig.elasticsearch.port,
  //     maxRetries: 10,
  //     keepAlive: true,
  //     maxSockets: 10,
  //     minSockets: 10,
  //   }
  // },
  // {
  //   plugin: require('yar'),
  //   options: {
  //     storeBlank: false,
  //     cookieOptions: {
  //       password: 'the-password-must-be-at-least-32-characters-long',
  //       isSecure: false
  //     }
  //   }
  // },
  // {
  //   plugin: require('hapi-auth-cookie')
  // },
  // {

  // }
  // {
  //   plugin: require('nes'),
  //   options: {
  //     onConnection: function(socket) {
  //       console.log('--- onConnection ----');
  //       // sendint message to the client
  //       server.broadcast("welcome everybody!!!");
  //     },
  //     onMessage: function(socket, message, next) {
  //       console.log('--- onMessage ----');
  //     },
  //   }
  // },
  //])
  // /******************************************************************************************
  //  * JWT setup
  //  ******************************************************************************************/
  // const validate = async function(decoded, request) {
  //   // do your checks to see if the person is valid
  //   if (!people[decoded.id]) {
  //     return { isValid: false };
  //   } else {
  //     return { isValid: true };
  //   }
  // };
  // server.auth.strategy('jwt', 'jwt', {
  //   key: 'NeverShareYourSecret', // Never Share your secret key
  //   validate: validate, // validate function defined above
  //   verifyOptions: { algorithms: ['HS256'] } // pick a strong algorithm
  // });
  // /******************************************************************************************
  //  * Cookie Auth setup
  //  ******************************************************************************************/
  // const cache = server.cache({
  //   cache: 'redisCache',
  //   segment: 'sessions',
  //   expiresIn: 3 * 24 * 60 * 60 * 1000,
  //   /*generateTimeout : 100*/
  // });

  // server.app.cache = cache;
  // server.register(require('hapi-auth-bearer-simple'), function (err) {
  //   if (err) {
  //       console.log(err);
  //   }
  // });
  //   server.auth.strategy('verifyToken', 'cookie', {
  //     validateFunc: async(request, session) => {

  //       return out;
  //     }
  //   })

  //  server.auth.default('verifyToken');

  /******************************************************************************************
   * Init module plugins
   * 
           await server.register(require('./app/module/project/index'));
   ******************************************************************************************/

  var modules = [
    "user",
    "project",
    "address",
    "creator",
    "payment",
    "gallery",
    "quote",
    "coupon"
  ];
  for (var i = 0; i < modules.length; i++) {
    await server.register(require("./app/module/" + modules[i] + "/index"));

    require("./app/module/" + modules[i] + "/schema");
  }

  /******************************************************************************************
   * Start nes
   ******************************************************************************************/
  // server.subscription('/item/{id}');

  /******************************************************************************************
   * Set universal ruotes
   ******************************************************************************************/
  //   server.route(routes);
  //  try{
  //  await server.register(require('inject-then'));
  // }
  // catch(e){
  //   console.log(e);
  // }

  //register: require('inject-then')
  /******************************************************************************************
   * Start Server
   ******************************************************************************************/
  await server.start();
console.log("Server started on :- "+server.info.uri);
  /******************************************************************************************
   * Publish Test notification
   ******************************************************************************************/
  // server.publish('/item/100', { id: 100, status: 'complete' });

  //   Mongoose.connect(DB_URI, {
  //     useNewUrlParser: true,
  //     keepAlive: true,
  //     reconnectTries: Number.MAX_VALUE,
  //       // useMongoClient: true
  //   });
  // if (process.env.APPS_ENV == 'prod') {
  //   console.log('info', `Server running with ver ${server.version} in ${process.env.APPS_ENV}`);
  // } else {
  //   console.log('info', `Server running at: ${server.info.uri} with ver ${server.version} in ${process.env.APPS_ENV}`);
  // }

  return server;
};

/******************************************************************************************
 * Init Server - Starting Point
 ******************************************************************************************/

async function serverStart() {
  return new Promise((resolve, reject) => {
    utilityService
      .findConfigurationFromConfigFile("serverconfig")
      .then(serverConfig => {
        server = Hapi.server({
          host: serverConfig.host,
          port: serverConfig.port,
          routes: serverConfig.routes
        });
        init()
          .then(async server => {
            // console.log(server);
            console.log("Server Start");
            
              return resolve(server);
            
          })
          .catch(err => {
            console.error(err);
            return reject(server);
          });
      });
 })
  .catch(err => {
    throw new Error("We can't configure server on this port.");
  });
}

//init();

module.exports = { server: server, serverStart: serverStart };

