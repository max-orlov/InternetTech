var webServer = require('./../hujiwebserver');

webServer.start(8888,"/",function(e){console.log(e)});
//webServer.start(8888,"c:\\Users\\Tom\\.WebStorm9\\projects\\InternetTech\\03",function(e){console.log(e)});