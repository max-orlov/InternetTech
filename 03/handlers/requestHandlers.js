var serverSettings  = require("./../settings/settings"),
    Response         = require("./../response/response"),
    fs              = require("fs"),
    url             = require("url"),
    querystring = require("querystring");



exports.start = function(request, rootFolder, parser, socket) {
    console.log("Request handler 'start' was called.");

    var response = new Response();
    response.httpVersion =  serverSettings.HTTP_SUPPORTED_VERSIONS['1.1'];

    //TODO:: I think we should support html v1.0
    if (request.httpVersion == serverSettings.HTTP_SUPPORTED_VERSIONS['1.1'])
    {
        response.status = serverSettings.STATUS_CODES['200'];
        response.headers['Date'] = new(Date)().toUTCString();
        var fileType = request.path.substr(request.path.lastIndexOf('.') + 1);
        response.headers['Content-Type'] = serverSettings.CONTENT_TYPES[fileType];
        response.headers['Server'] = serverSettings.SERVER_VERSION;

    }
    else{
        response.status = serverSettings.STATUS_CODES['505'];

    }

    if(request != null && request.status === "Done") {

        var normPath = rootFolder + (request.path.replace(/\//g, "\\"));
        console.log(normPath);
        fs.exists(normPath, function (exists) {
            if(!exists){
                response.status = 404;
                writeHeaders(response, parser, socket);
            } else {
                writeHeaders(response, parser, socket);
                writeFile(normPath, response, parser, socket);
            }
        });
    }

    return true;
};

function writeHeaders(response, parser, socket) {
    socket.write(parser.stringify(response));
}

function writeFile(path, response, parser, socket){
    fs.stat(path, function(error, stat) {
        //response.headers['Content-Length'] = stat.size;
        var fileStream = fs.createReadStream(path);
        fileStream.pipe(socket);
    });
}
