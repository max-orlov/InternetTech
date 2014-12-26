var parser = require('./parser/hujiparser'),
    serverSettings  = require('./settings/settings'),
    Request = require('./request/request'),
    Response = require('./response/response'),
    net = require('net'),
    fs = require("fs"),
    path = require('path');
    //handlers = require('./handlers/requestHandlers'),
    //debug = require('./debugging/debug');


exports.getSocket = function(lPort, hAddress, rootFolder, callback){
    var request = null;

    var server = net.createServer(function (socket) {

        socket.setEncoding(serverSettings.encoding);
        socket.setTimeout(serverSettings.maxTimeout);

        socket.on('data', function (dat) {
            if(!request) {
                request = new Request();
            }
            if (request.status !== request.requestStatus.errorParsing || request.status !== request.requestStatus.done) {
                parser.parse(dat, request);
            }
            if(request.status === request.requestStatus.done) {

                var keepAlive = request.isKeepAlive();
                var response = new Response(request.httpVersion, 200, new (Date)().toUTCString());
                var normPath = path.join(__dirname, path.normalize(rootFolder + request.path));
                var fileType = request.path.substr(request.path.lastIndexOf('.') + 1);

                fs.stat(normPath, function(err, stat){
                    // no err was returned - so the file exists.
                    if (err == null) {
                        response.headers['content-type'] = serverSettings.contentsTypes[fileType];
                        response.headers['content-length'] = stat.size;
                        writeHeaders(response, parser, socket);
                        writeFile(normPath, socket, keepAlive);
                    }

                    // No file was found
                    else if(err.code == 'ENOENT'){

                        var picNormPath = path.normalize(__dirname + serverSettings.pageNotFoundImagePath);
                        var picType = picNormPath.substr(picNormPath.lastIndexOf('.') + 1);

                        fs.stat(picNormPath, function(error, picStat){
                            if (error == null) {
                                response.statusCode = 404;
                                response.headers['Content-Type'] = serverSettings.contentsTypes[picType];
                                response.headers['Content-Length'] = picStat.size;
                                writeHeaders(response, parser, socket);
                                writeFile(picNormPath, socket, false);
                            }
                        });
                    }
                });
                request = null;
            } else if(request.status === request.requestStatus.errorParsing) {
                response = new Response(serverSettings.httpSupportedVersions['1.1'], request.statusCode, new(Date)().toUTCString());
                writeHeaders(response, parser, socket);
                socket.end();
                request = null;
            }
        });

        socket.on('timeout', function() {
            socket.end();
        });

        //socket.on('close', function() {
        //    console.log('connection closed');
        //});


    }).once('error', function (e) {
        if (e.code === 'EADDRINUSE') {
           callback(e)
        }
    });
    server.listen(lPort, hAddress);

    return server;
};


function writeHeaders(response, parser, socket) {
    socket.write(parser.stringify(response));
}

function writeFile(path, socket, keepAlive) {
    fs.createReadStream(path).pipe(socket, {end : !keepAlive});
}
