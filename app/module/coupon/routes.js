const handlers = require('../coupon/handlers');

exports.endpoints = [
    { method: 'GET', path: '/api/coupon/test/{id}', options: { handler:handlers.test }},
    { method: 'GET', path: '/api/coupon', options: { handler:handlers.list }},
    { method: 'POST', path: '/api/coupon/create/{id}', options: { handler:handlers.create }},
    { method: 'Delete', path: '/api/coupon/delete/{id}', options: { handler:handlers.delete }},
    { method: 'PATCH', path: '/api/coupon/patch/{id}', options: { handler:handlers.patch }}
];



	