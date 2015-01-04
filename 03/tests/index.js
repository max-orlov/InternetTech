var webServer = require('./../hujiwebserver'),
    debug = require('./../debugging/debug'),
    parser = require('./../parser/hujiparser'),
    Response = require('./../response/response'),
    Request  = require('./../request/request'),
    RequestCookieHandler = require('./../handlers/requestCookieHandler');


var i = webServer.start(8888,"/",function(e){debug.devlog(e)});
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
//var request = new Request();
//request.headers['cookie'] = 'name=tom;f=dana;ran=1';
//RequestCookieHandler(request, new Response(), function () {
//    return true;
//});

//console.log(request);
//setTimeout(function(){webServer.stop(i);console.log("server stopped")}, 10000);