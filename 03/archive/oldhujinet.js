var parser = require('./../parser/hujiparser'),
    serverSettings  = require('./../settings/settings'),
    Request = require('./../request/request'),
    Response = require('./../response/response'),
    net = require('net'),
    fs = require("fs"),
    path = require('path');


exports.getServer = function (lPort, hAddress, rootFolder, callback) {

    var server = net.createServer(function (socket) {
        var request = null;
        socket.setTimeout(serverSettings.maxTimeout);
        socket.setEncoding(serverSettings.encoding);
        socket.on('data', function (dat) {
            if (!request) {
                request = new Request();
            }
            if (request.status !== request.requestStatus.errorParsing ||
                request.status !== request.requestStatus.done) {

                parser.parse(dat, request);
            }
            if(request.status === request.requestStatus.done) {
                var keepAlive = request.isKeepAlive();
                var response = new Response(request.httpVersion, 200, keepAlive, socket);
                var normPath = rootFolder + path.normalize(request.path);

                //console.log(normPath);

                var fileType = request.path.substr(request.path.lastIndexOf('.') + 1);

                fs.stat(normPath, function (err, stat) {
                    // no err was returned - so the file exists.
                    if (err == null) {
                        response.headers['content-type'] = serverSettings.contentsTypes[fileType];
                        response.headers['content-length'] = stat.size;
                        writeHeaders(response, socket);
                        writeFile(normPath, socket, keepAlive);
                    }

                    // No file was found
                    else if (err.code == 'ENOENT') {
                        var pageNotFoundPath = path.normalize(__dirname + serverSettings.pageNotFoundPath);

                        fs.stat(pageNotFoundPath, function (error, pageNotFound) {
                            if (error == null) {
                                response.statusCode = 404;
                                response.headers['Content-Type'] = serverSettings.contentsTypes.html;
                                response.headers['Content-Length'] = pageNotFound.size;
                                writeHeaders(response, socket);
                                writeFile(pageNotFoundPath, socket, false);
                            }
                        });
                    }
                });
                request = null;
            } else if (request.status === request.requestStatus.errorParsing) {
                response = new Response(serverSettings.httpSupportedVersions['1.1'],
                    request.statusCode, false, socket);

                writeHeaders(response, socket);
                socket.write();
                request = null;
            }
        });

        socket.on('timeout', function() {
            socket.end();
        });

        socket.on('error', function (e) {

        });

    }).on('error', function (e) {
        callback(e);
    });

    server.listen(lPort, hAddress);
    return server;
};


function writeHeaders(response, socket) {
    socket.write(parser.stringify(response));
}

function writeFile(path, socket, keepAlive) {
    fs.createReadStream(path).pipe(socket, {write : !keepAlive});
}
