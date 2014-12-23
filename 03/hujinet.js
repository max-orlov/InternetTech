var parser = require('./parser/hujiparser'),
    serverSettings  = require('./settings/settings'),
    handlers = require('./handlers/requestHandlers'),
    Request = require('./request/request'),
    net = require('net'),
    debug = require('./debugging/debug');


exports.getSocket = function(lPort, hAddress, rootFolder, callback){

    try {
        var server = net.createServer(function (socket) {
            socket.setEncoding(serverSettings.encoding);
            //TODO:: ask if we need to check that the data is a valid HTTP Response
            socket.setTimeout(2000, function () {
                if(socket.connected) {
                    console.log("connection timeout");
                    socket.end();
                }
            });
            socket.on('data', function (dat) {
                handlers.start(dat, rootFolder, parser, socket);
            });
            socket.on('end', function() {
                console.log('connection closed');
            });

        }).on('error', function (err) {
            if (err.code === 'EADDRINUSE') {
                debug.devlog("port is currently in use," + " originated from EADDRINUSE by the server", debug.MESSAGE_LEVEL.clean)
                //TODO:: handle error.
            }

        }).listen(lPort, hAddress);

    }
    catch (err){
        callback(err);
    }

    return server;
};



