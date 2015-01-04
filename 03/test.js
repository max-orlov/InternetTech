var http            = require('http'),
    net             = require('net'),
    serverSettings  = require('./settings/settings'),
    huji            = require('./hujiwebserver');

var lPort           = 8888,
    rootFolder      = '/',
    ex2Dir          = '/www',
    upCallback      = function(e) {e ? (console.log(e)) : console.log('server is up. port' + lPort)},
    downCallback    = function(e) {e ? (console.log(e)) : console.log('server is down')};

function generateOptions(host, port, path, method, connection) {
    return {
        host: host,
        port: port,
        path: path,
        method: method,
        headers : {Connection: connection}
    }
}

/**
 * Testing GET request.
 */
function testGetRequest() {
    var options = generateOptions('localhost', 8888, ex2Dir + '/index.html', 'GET', 'close');
    http.get(options, function (response) {
        response.on('data', function (data) {
            if (response.statusCode == 200) {
                console.log('Testing GET request succeeded!!');
            }
            else {
                console.log('Testing GET request failed. statusCode: ' + response.statusCode);
            }
        });
        response.on('error', function (error) {
            console.log('Error running testGetRequest. '+ error);
        });
    });
}

/**
 * Testing http v1.0 request.
 */
function testHttpOldVersion() {
    var requestStr = 'GET tests/404.html HTTP/1.1' + serverSettings.CRLF + 'Host:localhost' +
        serverSettings.CRLF + 'Connection: keep-alive' + serverSettings.CRLF + serverSettings.CRLF;

    var conn = net.createConnection(lPort);
    conn.setNoDelay();
    conn.on('data', function (data) {
        if (data.toString().search('200')!= -1){
            console.log('test http v1.0 succeeded!!');
        }
    });
    conn.on('error', function (error) {
        console.log('test http v1.0 failed');
    });

    conn.write(requestStr);
}


/**
 * Testing non existing file.
 */
function testNonExistingFile(){
    var options = generateOptions('localhost', 8888, ex2Dir + '/NotExistFile.html', 'GET', 'close');


    http.get(options, function (response) {
        response.on('data', function (data) {
            if (response.statusCode == 404) {
                console.log('Testing not exist file succeeded!!');
            }
            else {
                console.log('Testing not exist file failed. statusCode: ' + response.statusCode);
            }
        });
        response.on('error', function (error) {
            console.log('Error running testGetRequest. '+ error);
        });
    });
}


/**
 * Testing Non HTTP format.
 */
function testNonHTTPFormat(){
    var message = 'bla bla blaa';
    var conn = net.createConnection(lPort);
    conn.write(message);
    conn.on('data', function (data) {
        if (data.toString().indexOf('500') !== -1) {
            console.log('test non http format succeeded!!');
        }
        else {
            console.log("test non http format didn't get status 500.");
        }
    });
}


/**
 * Testing listening to the same port
 */
function testListeningToPotInUse() {
        huji.start(lPort, rootFolder, function (e) {
            if (e && e.toString().indexOf('EADDRINUSE') !== -1) {
                console.log('Test listening to used port succeeded!!');
            } else {
                console.log('Test listening to used port failed.');
            }
        });
}

/**
 * Testing keep alive mechanism
 */
function testKeepAlive(){
    var requestStr = 'GET tests/404.html HTTP/1.1' + serverSettings.CRLF + 'Host:localhost' +
        serverSettings.CRLF + 'Connection: keep-alive' + serverSettings.CRLF + serverSettings.CRLF;
    var conn;
    conn = net.createConnection(lPort);
    conn.setNoDelay();


    setTimeout(function (){
        try {
            conn.write(requestStr);
            console.log('keep alive test succeeded!!');
        } catch(e) {
            console.log('keep alive test failed');
            conn.end();
        }
    }, 400);

    conn.write(requestStr);

}

var serverID = huji.start(lPort,"/", upCallback);


testGetRequest();
testHttpOldVersion();
testNonExistingFile();
testNonHTTPFormat();
testListeningToPotInUse();
testKeepAlive();


setTimeout( function () {
    huji.stop(serverID, downCallback);
}, 4000);