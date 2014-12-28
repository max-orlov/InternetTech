var http = require('http'),
    net = require('net'),
    huji = require('../hujiwebserver');


var lPort = 8888;
var numberOfRequests = 100;

function test(i, connectionType) {
    var request;
    var conn;
    var requestStr = 'GET /loadhttp.html HTTP/1.1\r\nHost:localhost\r\n' + 'Connection: ' + connectionType + '\r\n\r\n';

    conn = net.createConnection(lPort);
    conn.setNoDelay();

    conn.write(requestStr);
    conn.on('data', function (data) {
        console.log(' got response for request: ' + i);
    });

    conn.on('error', function (error) {
        console.log(error);
        console.log(' error for request: ' + i);
    });
}

function test1(requestNumber, connectionType) {
    var options = {
        hostname: 'localhost',
        port: lPort,
        path: '/loadhttp.html',
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
    }).on('error', function (e) {
        console.log("Got error for request: " + requestNumber + ". error: " + e);
    });
}

function load() {
    var serverID = huji.start(lPort,"/tests",function(e){console.log(e)});
    var i;

    for (i = 0; i < numberOfRequests; i++) {
        test(i, 'keep-alive');
        test(i,'close');
    }

    for (i = 0; i < numberOfRequests; i++) {
        test(i,'close');
    }

    setTimeout(function () {
        huji.stop(serverID, function(e) {e ? (console.log(e)) : (console.log('server is down'))});
    }, 4000);
}

load();