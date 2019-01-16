/**
 * app.js
 *
 * @module server/config/app.js
 */


  'use strict';

  module.exports = {
    local: {
      database: {
        host         : 'localhost',
        port         : 3309,
        db           : 'platform',
        display_name : 'admin',
        password     : 'admin',
        url          : 'mongodb://<user>:<password>@<url>',
        authdb       : 'admin',
      },
     
      redis: {
        host     : '0.0.0.0',
        port     : 3308,
        password : 'admin',
        authdb   : 'admin',
      },
   
      server: {
        host: '0.0.0.0',
        port: 3305
      },
    
      mail : {
        domainName      : '',
        server          : '',
        display_name    : '',
        encryption      : '',
        port            : '',
        templatePath    : __dirname + '/../../web/views/template/email/app',
        service         : 'SES',
        accessKeyId     : 'AKIAJKZVBGXCITCI7XRQ',
        secretAccessKey : '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',
        region          : 'eu-west-1',
        rateLimit       : 10,
      }
     
    }
  }