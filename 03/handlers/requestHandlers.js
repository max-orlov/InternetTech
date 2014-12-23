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
        console.log(normPath);
        fs.stat(normPath, function(err,stat){
            // no err was returned - so the file exists.
            if (err == null) {
                response.headers['Content-Length'] = stat.size;
                writeHeaders(response, parser, socket);
                writeFile(normPath, socket);
            }
            // No file was found
            else if(err.code == 'ENOENT'){
                response.status = 404;
                //response.headers['Content-Length'] = fs.statSync(serverSettings.PAGE_NOT_FOUND_IMAGE_PATH).size;
                writeHeaders(response, parser, socket);
                //TODO: figure out why the image displays only for wrong extension but jibrish comes out for wrong file.
                fs.createReadStream(serverSettings.PAGE_NOT_FOUND_IMAGE_PATH).pipe(socket);
            }
            // Any other error we can think of.
            else{
                debug.devlog(err.code);
            }
        });
    }
    return true;
};

function writeHeaders(response, parser, socket) {
    socket.write(parser.stringify(response));
}

function writeFile(path, socket){
    fs.createReadStream(path).pipe(socket);
}

