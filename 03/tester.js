var http            = require('http'),
    net             = require('net'),
    hujiwebserver   = require('hujiwebserver');

var lport           = 8888,
    rootFolder      = '/',
    ex2Dir          = '/www',
    upCallback      = function(e) {e ? (console.log(e)) : console.log('server is up. port' + lport)},
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



function testStatic1() {
    var options = generateOptions('localhost', 8888, ex2Dir + '/index.html', 'GET', 'close');
    http.get(options, function (response) {
        response.on('data', function (data) {
            if (response.statusCode == 200) {

                console.log('TestStatic1 succeeded!!');
            }
            else {
                console.log('TestStatic1 failed. statusCode: ' + response.statusCode);
            }
        });
        response.on('error', function (error) {
            console.log('Error running TestStatic1. '+ error);
        });
    });
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
    var conn = net.createConnection(lport);
    conn.write(message);
    conn.on('data', function (data) {
        if (data.toString().indexOf('500')!= -1) {
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
function testListeningToPortInUse() {
    huji.start(lport, rootFolder, function (e) {
        if (e && e.toString().indexOf('EADDRINUSE') != -1) {
            console.log('Test listening to used port succeeded');
        } else {
            console.log('Test listening to used port failed.');
        }
    });
}



hujiwebserver.start(8888, function (e, server) {
    server.use('/root', hujiwebserver.static('/www/tom'));

});


testGetRequest();
testNonExistingFile();
testNonHTTPFormat();
testListeningToPortInUse();


setTimeout(function(){
    huji.stop(serverID, downCallback);
}, 4000);
