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
    console.log("Basic static request <basicStaticTest> began");
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
    console.log("A basic non existing file request <basicStaticNonExistingFileTest> began");

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
    console.log("Basic server stop test <basicStaticServerStopTest> began");
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

function basicServerShutdown(callback){
    console.log("Basic server stop test <basicStaticServerStopTest> began");
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
    console.log("Testing a non http request format <basicStaticNonHttpFormatTest> began");

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
    console.log("Server receives a HEAD request <basicStaticPostTest> begen");
    var headOptions = generateOptions('localhost', lport, '/root/test.html', 'HEAD', 'close');
    var bodySize = 0;

    var req = http.request(headOptions, function(headResponse) {
        headResponse.on('data', function(chunk){
            bodySize += chunk.length;
        })
        headResponse.on('end', function(){
            if (bodySize == 0 && headResponse.statusCode == 200 && headResponse.headers['Content-length'] != '0') {
                console.log('basicStaticHeadTest passed!!');
                next(callback)
            }
            else {
                console.log("basicStaticHeadTest didn't get status 200.");
            }
        })
    });

    req.end();
}

// TODO :: write it up
function basicStaticCookieRequestTest(callback){

}

function basicResouredHandlerURITest(callback){
    console.log("Getting a response to the query basic handler <basicRescordHandlerTest> began");
    var options = generateOptions('localhost', lport, '/root/tests/json_file?name=tom', 'GET', 'close');
    http.get(options, function (response) {
        response.on('data', function (data) {
            if (response.statusCode == 200 && data.toString().indexOf("name: tom") == -1) {
                console.log('basicResouredHandlerURITest passed!!');
                next(callback)

            }
            else {
                if (response.statusCode != 200)
                    console.log('basicResouredHandlerURITest failed. expected : 200 |  actual :' + response.statusCode);
                else{
                    console.log("The records wasn't found at all");
                }
            }
        });
        response.on('error', function (error) {
            console.log('Error running basicResouredHandlerURITest. '+ error);
        });
    });
}

function basicRescordHandlerBodyTest(callback){
    console.log("Getting a response to the query basic handler <basicRescordHandlerTest> began");
    var options = generateOptions('localhost', lport, '/root/tests/json_file?name=tom', 'POST', 'close');
    http.get(options, function (response) {
        response.on('data', function (data) {
            if (response.statusCode == 200 && data.toString().indexOf("name: tom") == -1) {
                console.log('basicResouredHandlerURITest passed!!');
                next(callback)

            }
            else {
                if (response.statusCode != 200)
                    console.log('basicResouredHandlerURITest failed. expected : 200 |  actual :' + response.statusCode);
                else{
                    console.log("The records wasn't found at all");
                }
            }
        });
        response.on('error', function (error) {
            console.log('Error running basicResouredHandlerURITest. '+ error);
        });
    });

}

function getAndPostCrossTest(callback){
    console.log("Server is up ont GET request and a receives POST request <getAndPostCrossTest> began");

    var options = generateOptions('localhost', lport, '/root/test.html', 'POST', 'close');
    var req = http.request(options, function (response) {
        response.on('data', function (data) {
            if (response.statusCode == 404) {
                console.log('getAndPostCrossTest passed!!');
                next(callback)

            }
            else {
                console.log('getAndPostCrossTest failed. expected : 404 |  actual :' + response.statusCode);
            }
        });
        response.on('error', function (error) {
            console.log('Error running getAndPostCrossTest. '+ error);
        });
    });
    req.end();
}

function postAndGetCrossTest(callback){
    console.log("Server is up ont POST request and receives a GET request <postAndGetCrossTest> began");

    var options = generateOptions('localhost', lport, '/root/test.html', 'GET', 'close');
    var req = http.get(options, function (response) {
        response.on('data', function (data) {
            if (response.statusCode == 404) {
                console.log('postAndGetCrossTest passed!!');
                next(callback)

            }
            else {
                console.log('postAndGetCrossTest failed. expected : 404 |  actual :' + response.statusCode);
            }
        });
        response.on('error', function (error) {
            console.log('Error running postAndGetCrossTest. '+ error);
        });
    });
    req.end();
}

function testSuite1(callback){
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
    console.log('~~~Starting suite 1 tests~~~');
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~');

    hujiwebserver.start(lport, function (e, server) {

        if (e) {
            console.log(e);
        } else {
            server.use('/root', hujiwebserver.static('/tests/'));
            function stopServerAndTest(callback){
                server.stop(function(){
                    basicStaticServerStopTest(callback)
                })
            };
            var orderedTesters = [
                basicStaticTest,
                basicStaticNonExistingFileTest,
                basicStaticNonHttpFormatTest,
                basicStaticHeadTest,
                stopServerAndTest,
                callback
            ];
            var first = testSequence(orderedTesters);
            first();
        }
    });
}

function testSuite2(callback){
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
    console.log('~~~Starting suite 2 tests~~~');
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
    hujiwebserver.start(lport, function (e, server) {

        if (e) {
            console.log(e);
        } else {
            server.post('/root', hujiwebserver.static('/tests/'));
            function stopServerAndTest(callback){
                server.stop(function(){
                    basicStaticServerStopTest(callback)
                })
            };
            var orderedTesters = [
                postAndGetCrossTest,
                stopServerAndTest,
                callback
            ];
            var first = testSequence(orderedTesters);
            first();
        }
    });
}

function testSuite3(callback){
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
    console.log('~~~Starting suite 3 tests~~~');
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
    hujiwebserver.start(lport, function (e, server) {

        if (e) {
            console.log(e);
        } else {
            server.get('/root', hujiwebserver.static('/tests/'));
            function stopServerAndTest(callback){
                server.stop(function(){
                    basicStaticServerStopTest(callback)
                })
            };
            var orderedTesters = [
                getAndPostCrossTest,
                stopServerAndTest,
                callback
            ];
            var first = testSequence(orderedTesters);
            first();
        }
    });
}

function testSuite4(callback){
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
    console.log('~~~Starting suite 4 tests~~~');
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~');

    hujiwebserver.start(lport, function (e, server) {

        if (e) {
            console.log(e);
        } else {
            server.get('/root', hujiwebserver.recordsHandler());
            function stopServerAndTest(callback){
                server.stop(function(){
                    basicServerShutdown(callback)
                })
            };
            var orderedTesters = [
                basicResouredHandlerURITest,
                //basicResouredHandlerBodyTest
                stopServerAndTest,
                callback
            ];
            var firstFunc = testSequence(orderedTesters);
            firstFunc();
        }
    });
}

function next(callback){
    if (callback != undefined)
        callback();
    else{
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
        console.log("Testing was finished and all tests passed");
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    }
}

function testSequence(funcs){
    for (var i = funcs.length - 1 ; i > 0  ; --i){
        funcs[i-1] = funcs[i-1].bind(funcs[i-1], funcs[i]);
    }
    return funcs[0];
}

// TESTING SUITES - the order between them doesn't really matter.
var firstFunc = testSequence([testSuite1,testSuite2, testSuite3,testSuite4]);

firstFunc()

