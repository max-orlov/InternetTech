var webServer = require('./../hujiwebserver'),
    debug = require('./../debugging/debug'),
    parser = require('./../parser/hujiparser'),
    Response = require('./../response/response'),
    Request  = require('./../request/request'),
    RequestCookieHandler = require('./../handlers/requestCookieHandler');

var req = new Request();
req.query = require('./../parser/queryparser').parseQuery("p1[name]=maxim&basic=base");
var res = new Response();

var next = function(){};

var rh = require('./../handlers/requestRecordHandler')();
rh(req,res,next);
//console.log(res.body);

//var i = webServer.start(8888,"/",function(e){debug.devlog(e)});
//var a = [];
//if (typeof a === 'object') {
//    console.log(true)
//} else {
//    console.log(false);
//}
//

//var response = new Response();
//response.set('set-cookie', ['name=tom;']);
//response.cookie('rememberme', '1', { maxAge: 900000, httpOnly: true })
////console.log(response.headers);
//console.log(parser.stringify(response));
//


//console.log(request);
//setTimeout(function(){webServer.stop(i);console.log("server stopped")}, 10000);