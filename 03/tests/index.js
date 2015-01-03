var webServer = require('./../hujiwebserver'),
    debug = require('./../debugging/debug');

var i = webServer.start(8888,"/",function(e){debug.devlog(e)});
var a = [];
if (typeof a === 'object') {
    console.log(true)
} else {
    console.log(false);
}

//setTimeout(function(){webServer.stop(i);console.log("server stopped")}, 10000);