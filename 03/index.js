var net = require("net");

var server = net.createServer(function (socket) {
    socket.write("Welcome\r\n");
    socket.on('data', function(dat){
        console.log(dat + "\r\n");
        var str = "HTTP/1.1 200 OK\r\n";
        socket.write(str);
        socket.end();

    });
});

server.listen(8888, "127.0.0.1");

TYPES = {
    jpg : "text/jpg"
};
