const handlers = require('../project/handlers');

exports.endpoints = [
    { method: 'GET', path: '/api/project/test/{id}', options: { handler:handlers.test }},
    { method: 'GET', path: '/api/project', options: { handler:handlers.list }},
    { method: 'POST', path: '/api/project/create/{id}', options: { handler:handlers.create }},
    { method: 'Delete', path: '/api/project/delete/{id}', options: { handler:handlers.delete }},
    { method: 'PATCH', path: '/api/project/patch/{id}', options: { handler:handlers.patch }}
];



	