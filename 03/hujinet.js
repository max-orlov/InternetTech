var parser = require('./hujiparser'),
    serverSettings  = require('./settings'),
    handlers = require('./requestHandlers'),
    net = require('net');
net.m


var listeningPort,
    hostAddress,
    isServerUp = false,
    wasRequestMade = false;


exports.getSocket = function(lPort, hAddress, rootFolder){
    listeningPort = lPort;
    hostAddress = hAddress;

    var server = net.createServer(function (socket) {
        socket.setEncoding(serverSettings.ENCODING);
        //TODO:: ask if we need to check that the data is a valid HTTP request
        server.on('error', function(err) {
            if (err.code === 'EADDRINUSE') {
                console.log("port is currently in use");
                //TODO:: handle error.
            }
        });

        socket.on('data', function(dat){
            handlers.start(parser.parse(dat), rootFolder, parser, socket);
        });

    }).listen(listeningPort, hostAddress);

    isServerUp = true;
    return server;
};


