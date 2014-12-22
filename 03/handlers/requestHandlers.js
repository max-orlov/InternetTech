var serverSettings  = require("./../settings/settings"),
    Response        = require("./../response/response"),
    fs              = require("fs"),
    path            = require("path"),
    debug           = require('./../debugging/debug'),
    url             = require("url"),
    querystring = require("querystring");


exports.start = function(request, rootFolder, parser, socket) {
    debug.devlog("Request handler 'start' was called.");

    var response = new Response();
    var fileType = request.path.substr(request.path.lastIndexOf('.') + 1);

    response.httpVersion = request.httpVersion;
    response.status = serverSettings.STATUS_CODES['200'];
    response.headers['date'] = new(Date)().toUTCString();
    response.headers['content-type'] = serverSettings.CONTENT_TYPES[fileType];
    response.headers['server'] = serverSettings.SERVER_VERSION;

    if(request != null && request.status === request.requestStatus.done) {
        debug.devlog("Request Object:", debug.MESSAGE_LEVEL.dirty);
        debug.devlog(request, debug.MESSAGE_LEVEL.dirty);

        var normPath = path.normalize(rootFolder + request.path);

        fs.stat(normPath, function(err,stat){
            // no err was returned - so the file exists.
            if (err == null) {
                response.headers['Content-Length'] = stat.size;
                writeHeaders(response, parser, socket);
                writeFile(request, normPath, socket);
            }
            // No file was found
            else if(err.code == 'ENOENT'){
                response.status = 404;
                writeHeaders(response, parser, socket);
            }
            // Any other error we can think of.
            else{
                debug.devlog(err.code);
            }
        });
    }
    return true;
}

function writeHeaders(response, parser, socket) {
    socket.write(parser.stringify(response));
}

function writeFile(response, path, socket){

    var fileStream = fs.createReadStream(path);
    fileStream.pipe(socket, {end: false});
    fileStream.on('end', function(){
        /**
         *  This does the trick - no more errors, and the page is done loading. but this is a big issue
         *  because we can't destroy the socked each time we done writing some file - this will make the
         *  keep-alive irrelevant.
         *  Try to check if u run it the way you do (without the {end:false} and the other stuff in here)
         *  I hope it will work and this issue is only on my pc.
         */
        socket.destroy();
    });
}

