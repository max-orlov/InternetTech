var parser = require('./parser/hujiparser'),
    serverSettings  = require('./settings/settings'),
    Request = require('./request/request'),
    Response = require('./response/response'),
    net = require('net'),
    fs = require("fs"),
    debug = require("./debugging/debug");
    path = require('path');


exports.getSocket = function (lPort, hAddress, rootFolder, callback, serverID) {

    var connection = net.createServer(function (socket) {

        debug.devlog("Connection started on : " + serverID);
        var request = null;
        socket.setTimeout(serverSettings.maxTimeout);
        socket.setEncoding(serverSettings.encoding);
        socket.on('data', function (dat) {
            if (!request) {
                request = new Request();
            }
            //TODO: errorParsing doesn't exist
            if (request.status !== request.requestStatus.errorParsing || request.status !== request.requestStatus.done) {
                parser.parse(dat, request);
            }
            if(request.status === request.requestStatus.done) {
                var response = new Response(request.httpVersion, 200);
                var normPath = path.join(__dirname, path.normalize(rootFolder + request.path));
                var fileType = request.path.substr(request.path.lastIndexOf('.') + 1);
                var isKeepAlive = request.isKeepAlive();
                fs.stat(normPath, function (err, stat) {
                    // no err was returned - so the file exists.
                    if (err == null) {
                        response.headers['content-type'] = serverSettings.contentsTypes[fileType];
                        response.headers['content-length'] = stat.size;
                        writeHeaders(response, socket);
                        writeFile(normPath, socket, isKeepAlive, response);
                    }

                    // No file was found
                    else if (err.code == 'ENOENT') {
                        pageNotFoundResponse(response, socket);
                    }
                });
            //TODO: errorParsing doesn't exist
            } else if (request.status === request.requestStatus.errorParsing) {
                response = new Response(serverSettings.httpSupportedVersions['1.1'], request.statusCode);
                writeHeaders(response, parser, socket);
                socket.end();
            }
            request = null;

        })
        .on('timeout', function() {
                debug.devlog("Socket closed");
                socket.end();
            })
        .on('close', function() {
                debug.devlog('connection closed');
            })
        .on('error', function (e) {
                socket.end();
                callback(e);
        });

    }).on('error', function (e) {
        callback(e);
    }).listen(lPort, hAddress);

    return connection;
};


function writeHeaders(response, socket) {
    socket.write(parser.stringify(response));
}

function writeFile(path, socket, keepAlive, response) {
    debug.devlog("STARTED WRITING FILE " + path + " TO SOCKET");
    fs.createReadStream(path).pipe(socket, {end: !keepAlive});


}

function pageNotFoundResponse(response, socket){
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