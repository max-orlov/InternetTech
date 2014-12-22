var serverSettings  = require("./../settings/settings"),
    Response        = require("./../response/response"),
    fs              = require("fs"),
    path            = require("path"),
    debug           = require('./../debugging/debug'),
    url             = require("url"),
    querystring = require("querystring");

function isAlive(request) {

}

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
        debug.devlog("Request Object:");
        debug.devlog(request);

        var normPath = path.normalize(rootFolder + request.path);

        fs.stat(normPath, function(err,stat){
            // no err was returned - so the file exists.
            if (err == null) {
                response.headers['Content-Length'] = stat.size;
                writeHeaders(response, parser, socket);
                writeFile(normPath, response, socket);
            }
            // No file was found
            else if(err.code == 'ENOENT'){
                response.status = 404;
                writeHeaders(response, parser, socket);
                socket.end();
                socket.destroy();
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

function writeFile(path, response, socket){

    var fileStream = fs.createReadStream(path);
    fileStream.pipe(socket, {end: false});
    fileStream.on('end', function(){
        socket.end();
        // This does the trick - no more errors, and the page is done loading.
        socket.destroy();
    });
}
