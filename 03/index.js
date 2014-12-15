var net = require("net");
var parser = require('./hujiparser');
var webServer = require('./hujiwebserver');


webServer.start(8888,"stuff",function(){console.log("ERROR")});