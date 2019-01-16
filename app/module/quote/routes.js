const handlers = require('../quote/handlers');

exports.endpoints = [
    { method: 'GET', path: '/api/quote/test/{id}', options: { handler:handlers.test }},
    { method: 'GET', path: '/api/quote', options: { handler:handlers.list }},
    { method: 'POST', path: '/api/quote/create/{id}', options: { handler:handlers.create }},
    { method: 'Delete', path: '/api/quote/delete/{id}', options: { handler:handlers.delete }},
    { method: 'PATCH', path: '/api/quote/patch/{id}', options: { handler:handlers.patch }}
];



	