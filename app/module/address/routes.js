const handlers = require('../address/handlers');

exports.endpoints = [
    { method: 'GET', path: '/api/address/test/{id}', options: { handler:handlers.test }},
    { method: 'GET', path: '/api/address', options: { handler:handlers.list }},
    { method: 'POST', path: '/api/address/create/{id}', options: { handler:handlers.create }},
    { method: 'Delete', path: '/api/address/delete/{id}', options: { handler:handlers.delete }},
    { method: 'PATCH', path: '/api/address/patch/{id}', options: { handler:handlers.patch }},
    { method: 'POST', path: '/web/address/create', options: { handler:handlers.create }}
];



	