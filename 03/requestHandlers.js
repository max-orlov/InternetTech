var querystring = require("querystring"),
    fs = require("fs");

exports.start = function(request_object, rootFolder, parser, socket) {
    console.log("Request handler 'start' was called.");
    var responseObject={
        'type': "",
        'headers' : {
            'Date': "",
            'Content-Type': "",
            'Content-Length': ""
        },
        'body' : ""
    };
    if (request_object['type']['version'].indexOf('HTTP') != -1)
    {
        responseObject['type'] = "HTTP/1.1 200 OK";
        responseObject['headers']['Date'] = "Fri, 31 Dec 1999 23:59:59 GMT";
        var requestPath = request_object['type']['path'];
        if (requestPath.indexOf('html') != -1) {
            responseObject['headers']['Content-Type'] = "text/html";
            writeHTMLFile(rootFolder + request_object['type']['path'].replace("/", "\\"), responseObject, parser, socket);
        }
        else if (requestPath.indexOf('ico') != -1){

        }
        else if (requestPath.indexOf('png') != -1){
            console.log("PNG >>><<<")
        }
    }

    return true;
}

exports.upload = function(response, request) {
    console.log("Request handler 'upload' was called.");

    console.log("about to parse");
}

exports.show = function(response) {
    console.log("Request handler 'show' was called.");
    response.writeHead(200, {"Content-Type": "image/png"});
    fs.createReadStream("/tmp/test.png").pipe(response);
}

function writeHTMLFile(path, responseObject, parser, socket){
    var fs  = require("fs");
    var date = new Date();
    console.log(path);
    fs.readFile(path, "utf8", function(error, contents) {
        if (error){throw error;}
        responseObject['body'] = contents;
        responseObject['headers']['Content-Length'] = contents.length;
        socket.write(parser.stringify(responseObject), "utf8",new function(){
            console.log("Data was sent back on " + date.getHours() +":"+date.getMinutes()+":"+date.getSeconds()+":"+date.getMilliseconds());
        });
    });
}