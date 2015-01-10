var http            = require('http'),
    net             = require('net'),
    serverSetting   = require('./settings/settings');
    hujiwebserver   = require('./hujiwebserver');

var lport           = 8888,
    rootFolder      = '/',
    ex2Dir          = '/www',
    headRequest     = 'HEAD /root/test.html HTTP/1.1' + serverSetting.CRLF +
        'Content-Type: application/x-www-form-urlencoded' + serverSetting.CRLF + serverSetting.CRLF;

function generateOptions(host, port, path, method, connection) {
    return {
        host: host,
        port: port,
        path: path,
        method: method,
        headers : {Connection: connection}
    }
}

function basicStaticTest(callback) {
    console.log("basicStaticTest began");
    var options = generateOptions('localhost', lport, '/root/test.html', 'GET', 'close');
    http.get(options, function (response) {
        response.on('data', function (data) {
            if (response.statusCode == 200) {
                console.log('basicStaticTest passed!!');
                next(callback)

            }
            else {
                console.log('basicStaticTest failed. expected : 200 |  actual :' + response.statusCode);
            }
        });
        response.on('error', function (error) {
            console.log('Error running TestStatic1. '+ error);
        });
    });
}

function basicStaticNonExistingFileTest(callback) {
    console.log("basicStaticNonExistingFileTest began");

    var options = generateOptions('localhost', lport, '/root/noFile.html', 'GET', 'close');
    http.get(options, function (response) {
        response.on('data', function (data) {
            if (response.statusCode == 404) {
                console.log('basicStaticNonExistingFileTest passed!!');
                next(callback)

            }
            else {
                console.log('basicStaticNonExistingFileTest failed. expected : 404 |  actual :' + response.statusCode);
            }
        });
        response.on('error', function (error) {
            console.log('Error running basicStaticNonExistingFileTest. '+ error);
        });
    });
}

function basicStaticServerStopTest(callback){
    console.log("basicStaticServerStopTest began");
    var options = generateOptions('localhost', lport, '/root/noFile.html', 'GET', 'close');
    http.get(options, function (response) {

    }).on('error', function(e){
        if (e.code == 'ECONNREFUSED'){
            console.log('basicStaticServerStopTest passed!!');
            next(callback)
        }
        else{
            console.log('basicStaticServerStopTest did not manage to stop the server');
        }
    });
}

/**
 * Testing Non HTTP format.
 */
function basicStaticNonHttpFormatTest(callback){
    console.log("basicStaticNonHttpFormatTest began");

    var message = 'bla bla blaa';
    var conn = net.createConnection(lport);
    conn.write(message);
    conn.on('data', function (data) {
        if (data.toString().indexOf('500')!= -1) {
            console.log('basicStaticNonHttpFormatTest passed!!');
            next(callback)
        }
        else {
            console.log("basicStaticNonHttpFormatTest didn't get status 500.");
        }
    });
}

function basicStaticHeadTest(callback){
    console.log("basicStaticPostTest began");
    var headOptions = generateOptions('localhost', lport, '/root/test.html', 'HEAD', 'close');
    var bodySize = 0;

    var req = http.request(headOptions, function(headResponse) {
        headResponse.on('data', function(chunk){
            bodySize += chunk.length;
        })
        headResponse.on('end', function(){
            if (bodySize == 0 && headResponse.statusCode == 200 && headResponse.headers['Content-length'] != '0') {
                console.log('basicStaticPostTest passed!!');
                next(callback)
            }
            else {
                console.log("basicStaticPostTest didn't get status 200.");
            }
        })
    });

    req.end();
}

// TODO :: write it up
function basicStaticCookieRequestTest(callback){

}

// TODO :: write it up
function basicRescordHandlerTest(callback){

}

function main(){
    hujiwebserver.start(lport, function (e, server) {

        if (e) {
            console.log(e);
        } else {
            server.use('/root', hujiwebserver.static('/tests/'));

            function stopServerAndTest(){
                server.stop(function(){
                    basicStaticServerStopTest()
                })
            };

            var orderedTesters = [
                basicStaticTest,
                basicStaticNonExistingFileTest,
                basicStaticNonHttpFormatTest,
                basicStaticHeadTest,
                stopServerAndTest
            ];

            testRoll(orderedTesters);


        }

    });

}

function next(callback){
    if (callback != undefined)
        callback();
    else
        console.log("No more tests to run");

}

function testRoll(funcs){
    for (var i = funcs.length - 1 ; i > 0  ; --i){
        funcs[i-1] = funcs[i-1].bind(funcs[i-1], funcs[i]);
    }
    funcs[0]();
}

main();

