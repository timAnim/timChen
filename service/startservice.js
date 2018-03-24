var Service = require('node-windows').Service;
 
// Create a new service object 
var svc = new Service({
  name:'blog-service',
  description: '博客项目的后台',
  script: 'C:\\www\\service\\startservice.js'
});
 
svc.on('install',function(){
  svc.start();
});
 
svc.install();