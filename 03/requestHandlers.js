var querystring = require("querystring"),
    fs = require("fs");
    url = require("url");
    serverSettngs  = require("./settings");


HttpResponseObject = function(){
    this.version = "";
    this.status = "";
    this.headers = {};
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
    responseObject.version =  serverSettngs.HTTP_SUPPORTED_VERSION;

    if (requestObject.version == serverSettngs.HTTP_SUPPORTED_VERSION)
    {
        responseObject.status = serverSettngs.STATUS_CODES['200'];
        responseObject.headers.date = new(Date)().toUTCString();
        var fileType = requestObject.path.substr(requestObject.path.lastIndexOf('.') + 1);
        responseObject.headers['Content-Type'] = serverSettngs.CONTENT_TYPES[fileType];

    }
    else{
        responseObject.status = serverSettngs.STATUS_CODES['505'];

    }
    writeFile(rootFolder + requestObject.path.replace("/", "\\"), responseObject, parser, socket);

    return true;
};


function writeFile(path, responseObject, parser, socket){
    fs.stat(path, function(error, stat) {
        responseObject.headers['Content-Length'] = stat.size;
        socket.write(parser.stringify(responseObject));
        var fileStream = fs.createReadStream(path);
        fileStream.pipe(socket);
    });
}
