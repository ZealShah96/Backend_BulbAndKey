const handlers = require("../project/handlers");
const imageHandlers = require("../../service/imageioservice");

exports.endpoints = [
  {
    method: "GET",
    path: "/api/project/test/{id}",
    options: { handler: handlers.test, tags: ["ViewService@render"] }
  },
  {
    method: "GET",
    path: "/api/project",
    options: { handler: handlers.list, tags: ["ViewService@render"] }
  },
  {
    method: "POST",
    path: "/api/project/create/{id}",
    options: { handler: handlers.create, tags: ["ViewService@render"] }
  },
  {
    method: "Delete",
    path: "/api/project/delete/{id}",
    options: { handler: handlers.delete, tags: ["ViewService@render"] }
  },
  {
    method: "PATCH",
    path: "/api/project/patch/{id}",
    options: { handler: handlers.patch, tags: ["ViewService@render"] }
  },
  {
    method: "POST",
    path: "/web/project/view",
    options: { handler: handlers.projectview, tags: ["ViewService@render"] }
  },
  {
    method: "POST",
    path: "/web/project/close",
    options: { handler: handlers.projectclose, tags: ["ViewService@render"] }
  },
  {
    method: "GET",
    path: "/web/project/close/{id}",
    options: { handler: handlers.projectclose, tags: ["ViewService@render"] }
  },
  {
    method: "POST",
    path: "/web/project/delete",
    options: { handler: handlers.projectdelete, tags: ["ViewService@render"] }
  },
  {
    method: "GET",
    path: "/web/project/delete/{id}",
    options: { handler: handlers.projectdelete, tags: ["ViewService@render"] }
  },
  {
    method: "POST",
    path: "/web/project/cake",
    options: {
      handler: handlers.createCakeProject,
      tags: ["ViewService@render"]
    }
  },
  {
    method: "POST",
    path: "/web/project/doUploadimage",

    options: {
      handler: imageHandlers.doUpload,
      tags: ["ViewService@render"]
    }
  }
];
