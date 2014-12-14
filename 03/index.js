var net = require("net");

var http = 'HTTP/1.1 200 OK\n\
Content-Type: text/plain\r\n\
Tom';

var server = net.createServer(function (socket) {
    socket.on('data', function(dat){
        console.log(dat + "\r\n");
        socket.write(http);
        socket.end();

    });
});

server.listen(8888, "127.0.0.1");

TYPES = {
    jpg : "text/jpg"
};
