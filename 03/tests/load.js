var serverSettings  = require("./../settings/settings"),
    net = require('net'),
    huji = require('../hujiwebserver');


var lPort = 8888,
    numberOfRequests = 300,
    upCallback      = function(e) {e ? (console.log(e)) : console.log('server is up. port' + lPort)},
    downCallback    = function(e) {e ? (console.log(e)) : console.log('server is down')};


function test(requestNumber, connectionType) {
    var request;
    var conn;
    var requestStr = 'GET /loadhttp.html HTTP/1.1' + serverSettings.CRLF + 'Host:localhost' +
        serverSettings.CRLF + 'Connection: ' + connectionType + serverSettings.CRLF + serverSettings.CRLF;

    conn = net.createConnection(lPort);
    conn.setNoDelay();

    conn.write(requestStr);
    conn.on('data', function (data) {
        console.log("Got response for request: " + requestNumber);
    });
    conn.on('error', function (error) {
        console.log("Got error for request: " + requestNumber + ". error: " + error);
    });
}


function load() {

    var serverID = huji.start(lPort,"/tests", upCallback);
    var i;

    for (i = 0; i < numberOfRequests; i++) {
        test(i, 'keep-alive');
    }

    for (i = 0; i < numberOfRequests; i++) {
        test(i,'close');
    }

    setTimeout(function () {
        huji.stop(serverID, downCallback);
    }, 4000);
}

load();