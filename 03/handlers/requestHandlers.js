//var serverSettings  = require("./../settings/settings"),
//    Response        = require("./../response/response"),
//    Request         = require("./../request/request"),
//    fs              = require("fs"),
//    path            = require("path"),
//    debug           = require('./../debugging/debug');
//
//
//exports.start = function(request, dat, rootFolder, parser, socket) {
//    debug.devlog("Request handler 'start' was called.");
//    if(!request) {
//        request = new Request();
//    }
//    if (request.status !== request.requestStatus.errorParsing || request.status !== request.requestStatus.done) {
//        parser.parse(dat, request);
//    }
//    if(request.status === request.requestStatus.done) {
//        request.status = request.requestStatus.nill;
//
//        var keepAlive = request.isKeepAlive();
//        var response = new Response(request.httpVersion, 200, new (Date)().toUTCString());
//        var normPath = path.join(__dirname + '\\..\\', path.normalize(rootFolder + request.path));
//        var fileType = request.path.substr(request.path.lastIndexOf('.') + 1);
//
//        fs.stat(normPath, function(err, stat){
//            // no err was returned - so the file exists.
//            console.log(normPath);
//            if (err == null) {
//
//                response.headers['content-type'] = serverSettings.contentsTypes[fileType];
//                response.headers['content-length'] = stat.size;
//                writeHeaders(response, parser, socket);
//                writeFile(normPath, socket, keepAlive);
//            }
//
//            // No file was found
//            else if(err.code == 'ENOENT'){
//
//                var picNormPath = path.normalize(__dirname + serverSettings.pageNotFoundPath);
//                var picType = picNormPath.substr(picNormPath.lastIndexOf('.') + 1);
//                fs.stat(picNormPath, function(error, picStat){
//                    if (error == null) {
//                        response.statusCode = 404;
//                        response.headers['Content-Type'] = serverSettings.contentsTypes[picType];
//                        response.headers['Content-Length'] = picStat.size;
//                        writeHeaders(response, parser, socket);
//                        fs.createReadStream(picNormPath).pipe(socket);
//                    }
//                });
//            }
//            // Any other error we can think of.
//            else{
//                debug.devlog(err.code);
//            }
//        });
//    } else if(request.status === request.requestStatus.errorParsing) {
//        response = new Response(serverSettings.httpSupportedVersions['1.1'], request.statusCode, new(Date)().toUTCString());
//        writeHeaders(response, parser, socket);
//        socket.end();
//        request.status = request.requestStatus.nill;
//    }
//};
//
//
//function writeHeaders(response, parser, socket) {
//    socket.write(parser.stringify(response));
//}
//
//function writeFile(path, socket, keepAlive) {
//    fs.createReadStream(path).pipe(socket, {end : !keepAlive});
//}
//
