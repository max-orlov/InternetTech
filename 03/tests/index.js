var webServer = require('./../hujiwebserver');

webServer.start(8888,"/",function(e){console.log(e)});
//webServer.start(8888,"/",function(e){console.log(e)});