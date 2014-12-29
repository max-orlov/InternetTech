var webServer = require('./../hujiwebserver'),
    debug = require('./../debugging/debug');

var i = webServer.start(8888,"/",function(e){debug.devlog(e)});
console.log(i);

//setTimeout(function(){webServer.stop(i);console.log("server stopped")}, 10000);