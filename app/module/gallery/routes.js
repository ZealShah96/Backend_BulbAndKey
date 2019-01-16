const handlers = require('../gallery/handlers');

exports.endpoints = [
    { method: 'GET', path: '/api/gallery/test/{id}', options: { handler:handlers.test }},
    { method: 'GET', path: '/api/gallery', options: { handler:handlers.list }},
    { method: 'POST', path: '/api/gallery/create/{id}', options: { handler:handlers.create }},
    { method: 'Delete', path: '/api/gallery/delete/{id}', options: { handler:handlers.delete }},
    { method: 'PATCH', path: '/api/gallery/patch/{id}', options: { handler:handlers.patch }}
];



	