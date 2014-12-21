var serverSettings  = require("./../settings/settings"),
    Response        = require("./../response/response"),
    fs              = require("fs"),
    path            = require("path"),
    url             = require("url"),
    querystring = require("querystring");



function isAlive(request) {

}

function start(request, rootFolder, parser, socket) {
    console.log("Request handler 'start' was called.");

    var response = new Response();
    var fileType = request.path.substr(request.path.lastIndexOf('.') + 1);

    response.httpVersion = request.httpVersion;
    response.status = serverSettings.STATUS_CODES['200'];
    response.headers['date'] = new(Date)().toUTCString();
    response.headers['content-type'] = serverSettings.CONTENT_TYPES[fileType];
    response.headers['server'] = serverSettings.SERVER_VERSION;

    if(request != null && request.status === request.requestStatus.done) {
        console.log(request);
        var normPath = path.normalize(rootFolder + request.path);
        fs.exists(normPath, function (exists) {
            if(!exists){
                response.status = 404;
                writeHeaders(response, parser, socket);
            } else {
                writeHeaders(response, parser, socket);
                writeFile(normPath, response, socket);
            }
        });
    }
    return true;
}

function writeHeaders(response, parser, socket) {
    socket.write(parser.stringify(response));
}

function writeFile(path, response, socket){
    fs.stat(path, function(error, stat) {
        response.headers['Content-Length'] = stat.size;
        var fileStream = fs.createReadStream(path);
        fileStream.pipe(socket, {end: false});

    });
}

exports.start = start;
