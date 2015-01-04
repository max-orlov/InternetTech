var webServer = require('./../hujiwebserver');

var id = webServer.start(8888,"/tests",function(e){console.log(e)});
var id2 = webServer.start(8888,"/tests",function(e){console.log(e)});
console.log(id);

setTimeout( function () {
    webServer.stop(id, function () {
        console.log('server is down now!')
    });
}, 1000);

//webServer.start(8888,"c:\\Users\\Tom\\.WebStorm9\\projects\\InternetTech\\03",function(e){console.log(e)});