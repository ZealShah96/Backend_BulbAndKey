/**
 * access
 *
 * @module modules/User/index
 */
const routes = require('./routes').endpoints;
'use strict';

const Hapi=require('hapi');

exports.plugin = {
    pkg      : require('./package.json'),
    register : async function (server, options) {
        server.route(routes);
      }
  }
//const Routes=require('./config/route').endpoints;


//Create a server with a host and port
// const server=Hapi.server({
//     host:'localhost',
//     port:8000
// });


 //server.register( function (server, options) {
  // server.route(routes);
 //});


    /******************************************************************************************
   * Start Server
   ******************************************************************************************/
  // server.start();
