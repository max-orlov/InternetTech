var serverSettings  = require("./../settings/settings"),
    Response        = require("./../response/response"),
    Request         = require("./../request/request"),
    fs              = require("fs"),
    path            = require("path"),
    debug           = require('./../debugging/debug');

var request = null;
var response = null;

exports.start = function(dat, rootFolder, parser, socket) {
    debug.devlog("Request handler 'start' was called.");
    if(!request) {
        request = new Request();
    }

    if (request.status !== request.requestStatus.errorParsing || request.status !== request.requestStatus.done) {
        parser.parse(dat, request);
    }
    if(request.status === request.requestStatus.errorParsing) {
        response = new Response(serverSettings.httpSupportedVersions['1.1'], request.statusCode, new(Date)().toUTCString());
        writeHeaders(response, parser, socket);
        socket.end();
    }
    if(request.status === request.requestStatus.done) {
        response = new Response(request.httpVersion, 200, new(Date)().toUTCString());

        var normPath = path.normalize(rootFolder + request.path);
        var fileType = request.path.substr(request.path.lastIndexOf('.') + 1);

        fs.stat(normPath, function(err, stat){
            // no err was returned - so the file exists.
            if (err == null) {
                response.headers['content-type'] = serverSettings.contentsTypes[fileType];
                response.headers['content-length'] = stat.size;
                writeHeaders(response, parser, socket);
                writeFile(normPath, socket);
            }
            // No file was found
            else if(err.code == 'ENOENT'){
                var picNormPath = path.normalize(rootFolder + serverSettings.pageNotFoundImagePath);
                var picType = picNormPath.substr(picNormPath.lastIndexOf('.') + 1);
                fs.stat(picNormPath, function(error, picStat){
                    if (error == null) {
                        response.status = 404;
                        response.headers['Content-Type'] = serverSettings.contentsTypes[picType];
                        response.headers['Content-Length'] = picStat.size;
                        writeHeaders(response, parser, socket);
                        fs.createReadStream(picNormPath).pipe(socket);
                    }
                });
            }
            // Any other error we can think of.
            else{
                debug.devlog(err.code);
            }
            request = null;
        });
    }
    return true;
};

function writeHeaders(response, parser, socket) {
    socket.write(parser.stringify(response));
}

function writeFile(path, socket) {
    fs.createReadStream(path).pipe(socket, {end: false});
}

