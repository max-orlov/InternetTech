var net = require("net");

//TODO: make sanwitches
var server = net.createServer(function (socket) {
    socket.write("Welcome\r\n");
    socket.on('data', function(dat){
        socket.write(dat+"\r\n");
        //socket.end();

    });
});

server.listen(8888, "127.0.0.1");

TYPES = {
    jpg : "text/jpg"
};
