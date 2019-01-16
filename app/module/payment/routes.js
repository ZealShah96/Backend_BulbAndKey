const handlers = require('../payment/handlers');

exports.endpoints = [
    { method: 'GET', path: '/api/payment/test/{id}', options: { handler:handlers.test }},
    { method: 'GET', path: '/api/payment', options: { handler:handlers.list }},
    { method: 'POST', path: '/api/payment/create/{id}', options: { handler:handlers.create }},
    { method: 'Delete', path: '/api/payment/delete/{id}', options: { handler:handlers.delete }},
    { method: 'PATCH', path: '/api/payment/patch/{id}', options: { handler:handlers.patch }}
];



	