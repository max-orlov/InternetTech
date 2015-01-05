var webServer = require('./../hujiwebserver'),
    debug = require('./../debugging/debug'),
    parser = require('./../parser/hujiparser'),
    Response = require('./../response/response'),
    Request  = require('./../request/request'),
    RequestCookieHandler = require('./../handlers/requestCookieHandler');


var fs = require('fs');
var buf;
fs.readFile('json_file','ASCII',function(err,data){
    if (err){
        console.log("error");
        return;
    }
    buf = JSON.parse(data);
    print(buf);
});

function print(buf){
   for (var key_1 in buf){
       if (buf[key_1].id === "123"){
           console.log(buf[key_1])
       }
   }
}





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