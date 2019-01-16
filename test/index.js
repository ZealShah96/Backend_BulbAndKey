const hapi = require('hapi');
const server = new hapi.Server({
    host:'localhost',
    port:Number(process.env.PORT || 8080 )
});
  
  
//server.connection()
  
server.route({
    method:'GET',
    path:'/test',
    handler: function (req,res){
        return "Testing hapi with mocha and chai";
      }
})
  
server.start((err)=>{
  if (err) console.log('error while connecting :'+err)
})
  
module.exports = server;