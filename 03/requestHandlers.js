var serverSettngs  = require("./settings"),
    fs = require("fs"),
    url = require("url"),
    querystring = require("querystring");
    pathModule = require("path");


HttpResponseObject = function(){
    this.version = "";
    this.status = "";
    this.headers = {};
    this.headers['Content-Type'] = "";
    this.headers['Content-Length'] = "";

};

exports.HttpRequestObject = function(){
    this.method = "";
    this.path = "";
    this.params = "";
    this.version = "";
    this.headers = {};
    this.body = "";
};


exports.start = function(requestObject, rootFolder, parser, socket) {
    console.log("Request handler 'start' was called.");

    var responseObject = new HttpResponseObject();
    responseObject.version =  serverSettngs.HTTP_SUPPORTED_VERSIONS['1.1'];

    //TODO:: I think we should support html v1.0
    if (requestObject.version == serverSettngs.HTTP_SUPPORTED_VERSIONS['1.1'])
    {
        responseObject.status = serverSettngs.STATUS_CODES['200'];
        responseObject.headers['Date'] = new(Date)().toUTCString();
        var fileType = pathModule.extname(requestObject.path);
        responseObject.headers['Content-Type'] = serverSettngs.CONTENT_TYPES[fileType];
        responseObject.headers['Server'] = serverSettngs.SERVER_VERSION;
    }
    else{
        responseObject.status = serverSettngs.STATUS_CODES['505'];
    }
    writeObjectToSocket(pathModule.join(rootFolder, requestObject.path), responseObject, parser, socket);

    return true;
};


function writeObjectToSocket(path, responseObject, parser, socket){
        fs.stat(path, function (error, stat) {
            responseObject.headers['Content-Length'] = stat.size;

            socket.write(parser.stringify(responseObject));
            var fileStream = fs.createReadStream(path);
            fileStream.on("error", function(e) { console.log(e); });
            fileStream.pipe(socket, function(){socket.destroy();});

        });

}
