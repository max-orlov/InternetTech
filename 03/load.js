var serverSettings  = require("./settings/settings"),
    net             = require('net'),
    hujiwebserver   = require('./hujiwebserver');


var lPort               = 8888,
    numberOfRequests    = 1000;

function test(requestNumber) {
    var request;
    var conn;
    var requestStr = 'GET /loadhttp.html HTTP/1.1' + serverSettings.CRLF + 'Host:localhost' +
        serverSettings.CRLF + 'Connection: keep-alive'  + serverSettings.CRLF + serverSettings.CRLF;

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

    hujiwebserver.start(lPort, function (e, server) {
        if (e) {
            console.log(e);
        } else {
            server.use('/', hujiwebserver.static('/tests'));
            for (var i = 0; i < numberOfRequests; i++) {
                test(i);
            }

            setTimeout(function () {
                server.stop();
            }, 5000);

        }
    });
}


load();