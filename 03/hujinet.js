/**
 * Created by Maxim on 15/12/2014.
 */
var parser = require('./hujiparser');
    serverSettings  = require('./settings');
    handlers = require('./requestHandlers');
    server = require('net');


var listeningPort;
var hostAddress;
var isServerUp = false;
var wasRequestMade = false;


exports.getSocket = function(lPort, hAddress, rootFolder){
    listeningPort = lPort;
    hostAddress = hAddress;
    var server = net.createServer(function (socket) {
        socket.setEncoding(serverSettings.ENCODING);
        socket.on('data', function(dat){
            var httpRequestObject = parser.parse(dat);
            handlers.start(httpRequestObject, rootFolder, parser, socket);
        });
    });

    net.once('error', function(err) {
        if (err.code === 'EADDRINUSE') {
            console.log("port is currently in use");
            //TODO:: handle error.
        } else {
            server.listen(listeningPort, hostAddress);
            isServerUp = true;
            return server;
        }
    });
};


