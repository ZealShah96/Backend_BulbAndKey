const handlers = require('../user/handlers');
const redishandlers = require('./../../service/redisservice');



exports.endpoints = [
    { method: 'GET', path: '/api/user/test/{id}', options: { handler: handlers.test } },
    { method: 'GET', path: '/api/user', options: { handler: handlers.list } },
    { method: 'POST', path: '/api/user/create/{id}', options: { handler: handlers.create } },
    { method: 'Delete', path: '/api/user/delete/{id}', options: { handler: handlers.delete } },
    { method: 'PATCH', path: '/api/user/patch/{id}', options: { handler: handlers.patch } },
    { method: 'POST', path: '/api/user/setcache', options: { handler: redishandlers.setcache } },
    { method: 'POST', path: '/api/user/getcache', options: { handler: redishandlers.getcache } },
    { method: 'POST', path: '/web/user/check', options: { handler: handlers.check } },
    { method: 'POST', path: '/web/user/login', options: { handler: handlers.login } },
    { method: 'POST', path: '/web/user/loginotp', options: { handler: handlers.loginotp } },
    { method: 'POST', path: '/web/user/loginwithotp', options: { handler: handlers.loginwithotp,auth:false,tags: ['ViewService@render'] } },
    { method: 'POST', path: '/web/user/signup', options: { handler: handlers.saveprofile } },
    { method: 'POST', path: '/web/user/signupotp', options: { handler: handlers.signupotp } },
    { method: 'POST', path: '/web/user/signupwithotp', options: { handler: handlers.signupwithotp } },
    { method: 'POST', path: '/web/user/forgetpasswordotp', options: { handler: handlers.forgetpasswordotp } },
    { method: 'POST', path: '/web/user/resetpassword', options: { handler: handlers.forgetpasswordchange } },
    { method: 'POST', path: '/web/user/forgetpassword', options: { handler: handlers.forgetpasswordchange } },
    { method: 'POST', path: '/web/user/changepassword', options: { handler: handlers.changePassword } },
    { method: 'POST', path: '/web/user/profile', options: { handler: handlers.profile } },
    { method: 'POST', path: '/web/user/saveprofile', options: { handler: handlers.saveprofile } },
    { method: 'POST', path: '/web/user/getaddress', options: { handler: handlers.getAddress } },
    { method: 'POST', path: '/web/user/editaddress', options: { handler: handlers.editAddress } },
    { method: 'POST', path: '/web/user/saveaddress', options: { handler: handlers.saveAddress } },
    { method: 'POST', path: '/web/user/removeaddress', options: { handler: handlers.removeAddress } },
    { method: 'POST', path: '/web/user/getprojects', options: { handler: handlers.getprojects } },
];



