var net = require("net");
var parser = require('./hujiparser');
var http = 'HTTP/1.1 200 OK\n\
Content-Type: text/plain\r\n\
Tom';

var server = net.createServer(function (socket) {
    socket.setEncoding('utf8');
    socket.on('data', function(dat){
        var reqObj = parser.parse(dat);
        // NOTICE : This is an object.
        console.log(reqObj);
        socket.write("ll");
        //socket.end("");

    });
});

server.listen(8888, "127.0.0.1");

TYPES = {
    jpg : "text/jpg"
};
