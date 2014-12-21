var parser = require('./hujiparser'),
    serverSettings  = require('./settings'),
    handlers = require('./requestHandlers'),
    net = require('net');


var listeningPort,
    hostAddress,
    isServerUp = false,
    wasRequestMade = false;


exports.getSocket = function(lPort, hAddress, rootFolder){
    listeningPort = lPort;
    hostAddress = hAddress;

    var server = net.createServer(function (socket) {
        socket.setEncoding(serverSettings.ENCODING);
        //TODO:: ask if we need to check that the data is a valid HTTP Response
        socket.on('data', function(dat){
            var request = parser.parse(dat);
            handlers.start(request, rootFolder, parser, socket);
        });
    });

    server.once('error', function(err) {
        if (err.code === 'EADDRINUSE') {
            console.log("port is currently in use");
            //TODO:: handle error.
        }
    });

    server.listen(listeningPort, hostAddress);
    isServerUp = true;
    return server;
};


