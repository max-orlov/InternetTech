var http = require('http');
var huji = require('../hujiwebserver');


var lPort = 8888;
var numberOfRequests = 100;


function test(requestNumber, connectionType){
    var options = {
        hostname: 'localhost',
        port: lPort,
        path: '/loadHttp.html',
        method: 'GET',
        headers : {Connection : connectionType}
    };

    http.get(options, function(res) {
        res.on('data', function(e) {
            if (res.statusCode == 200) {
                console.log("Got response " + res.statusCode + " for request: " + requestNumber);
            } else {
                console.log("Got response " + res.statusCode + " for request: " + requestNumber);
            }
        });
    }).on('error', function(e) {
        console.log("Got error for request: " + requestNumber + ". error: " + e);
    });
}

function load(){
    var serverID = huji.start(lPort,"/tests",function(e){console.log(e)});
    var i;

    for (i = 0; i < numberOfRequests; i++){
        test(i, 'keep-alive');
    }

    for (i = 0; i < numberOfRequests; i++){
        test(i,'close');
    }

    setTimeout(function(){
        huji.stop(serverID, function(e) {e ? (console.log(e)) : (console.log('server is down'))});
    }, 4000);
}

load();