var querystring = require("querystring"),
    fs = require("fs");
url = require("url");
var CONTENT_TYPES={
    js: "application/javascript",
    txt: "text/plain",
    html: "text/html",
    css: "text/css",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    png: "image/png"
}

var STATUS_CODES = {
    200 : 'OK',
    404 : 'Not Found',
    405 : 'Method Not Allowed',
    500 : 'Parsing Error'
};

exports.start = function(requestObject, HttpResponseObject, rootFolder, parser, socket) {
    console.log("Request handler 'start' was called.");
    //console.log(requestObject);

    var responseObject = new HttpResponseObject();
    if (requestObject['type']['version'].indexOf('HTTP/1.1') != -1)
    {
        var now = new Date();
        responseObject['type'] = "HTTP/1.1 200 " + STATUS_CODES[200];
        responseObject['headers']['Date'] = new(Date)().toUTCString();
        var fileType = requestObject['type']['path'].substr(requestObject['type']['path'].lastIndexOf('.') + 1);
        responseObject['headers']['Content-Type'] = CONTENT_TYPES[fileType];


    }
    else{
        responseObject['type'] = "HTTP/1.1 404" + STATUS_CODES[404];

    }
    writeFile(rootFolder + requestObject['type']['path'].replace("/", "\\"), responseObject, parser, socket);

    return true;
};


function writeFile(path, responseObject, parser, socket){
    var fs  = require("fs");
    var date = new Date();
    fs.stat(path, function(error, stat) {
        responseObject['headers']['Content-Length'] = stat.size;
        socket.write(parser.stringify(responseObject));
        var filestream = fs.createReadStream(path);
        filestream.pipe(socket);
    });


}
