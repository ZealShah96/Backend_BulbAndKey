const handlers = require("../admin/handlers");
const redishandlers = require("./../../service/redisservice");

exports.endpoints = [
  {
    method: "POST",
    path: "/admin/user/get-projects",
    options: { handler: handlers.getdata, tags: ["ViewService@render"] }
  },
  {
    method: "POST",
    path: "/admin/preview",
    options: { handler: handlers.getdata, tags: ["ViewService@render"] }
  },
  {
    method: "POST",
    path: "/admin/patch",
    options: { handler: handlers.patchRecord, tags: ["ViewService@render"] }
  },
  {
    method: "POST",
    path: "/admin/login",
    
    options: { handler: handlers.loginAdmin,auth:false, tags: ["ViewService@render"] }
  }
];
