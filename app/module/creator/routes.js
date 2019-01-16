const handlers = require('../creator/handlers');

exports.endpoints = [
    { method: 'GET', path: '/api/creator/test/{id}', options: { handler:handlers.test }},
    { method: 'GET', path: '/api/creator', options: { handler:handlers.list }},
    { method: 'POST', path: '/api/creator/create/{id}', options: { handler:handlers.create }},
    { method: 'Delete', path: '/api/creator/delete/{id}', options: { handler:handlers.delete }},
    { method: 'PATCH', path: '/api/creator/patch/{id}', options: { handler:handlers.patch }},
    { method: 'POST', path: '/api/creator/signup', options: { handler:handlers.signup }},
    { method: 'GET', path: '/web/creator/profile/{user_id}', options: { handler:handlers.profile }},
    // { method: 'GET', path: '/web/creator/notquotedprojects/{user_id}', options: { handler:handlers.projects }},
    // { method: 'GET', path: '/web/creator/quotedprojects/{user_id}', options: { handler:handlers.projects }},
    { method: 'POST', path: '/web/creator/submitequote/{project_id}/{user_id}', options: { handler:handlers.submitquote }},
    { method: 'POST', path: '/web/creator/withdrawquote/{project_id}/{user_id}', options: { handler:handlers.withdrawquote }},
    { method: 'GET', path: '/web/creator/notquotedprojects/{user_id}', options: { handler:handlers.notquotedprojects }},
    { method: 'GET', path: '/web/creator/quotedprojects/{user_id}', options: { handler:handlers.quotedprojects }},
    { method: 'GET', path: '/web/creator/projectdetails/{project_id}/{user_id}', options: { handler:handlers.projectdetail }},
    { method: 'GET', path: '/web/creator/awardedprojectdetail/{project_id}/{user_id}', options: { handler:handlers.awardedprojectdetail }},
    { method: 'POST', path: '/web/creator/changestatus/{project_id}/{user_id}', options: { handler:handlers.changestatus }},
];



	