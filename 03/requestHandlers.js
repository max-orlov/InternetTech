var serverSettngs  = require("./settings"),
    fs = require("fs"),
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
    console.log("Request handling for " + requestObject.path + " started");

    var responseObject = new HttpResponseObject();
    responseObject.version =  serverSettngs.HTTP_SUPPORTED_VERSIONS['1.1'];

    //TODO:: I think we should support html v1.0
    if (requestObject.version == serverSettngs.HTTP_SUPPORTED_VERSIONS['1.1'])
    {
        responseObject.headers['Date'] = new(Date)().toUTCString();
        var fileType = pathModule.extname(requestObject.path).substr(1);
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
    console.log(path);
    fs.exists(path, function(exists){
        if (exists){
            responseObject.status = serverSettngs.STATUS_CODES['200'];

            fs.stat(path, function (error, stat) {

                if (error)
                    console.log("error");

                responseObject.headers['Content-Length'] = stat.size;

                socket.write(parser.stringify(responseObject));
                var fileStream = fs.createReadStream(path);

                // TODO: TOM - This little motherfucker {end:false} was all that was needed, goddamn nodeJS sucks.
                // TODO: we do need to close the socked manually. One reason that it might have worked on your pc is maybe your nodeJS is of ver <= 0.8 - check this when you get up.
                fileStream.pipe(socket, {end: false});
                return true;

            });
        }
        else{
            console.log("NO such file exists");
            responseObject.status = serverSettngs.STATUS_CODES['404'];
            socket.write(parser.stringify(responseObject),function(){
                console.log("empty header was written");
            });
        }
    });



}
