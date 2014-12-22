var parser = require('./parser/hujiparser'),
    serverSettings  = require('./settings/settings'),
    handlers = require('./handlers/requestHandlers'),
    Request = require('./request/request'),
    net = require('net'),
    debug = require('./debugging/debug');


exports.getSocket = function(lPort, hAddress, rootFolder, callback){

    try {
        var server = net.createServer(function (socket) {
            var request = new Request;
            socket.setEncoding(serverSettings.ENCODING);
            //TODO:: ask if we need to check that the data is a valid HTTP Response
            socket.once('data', function () {
                request.parseIndex = 0;
            });
            socket.on('data', function (dat) {
                request = parser.parse(dat, request);
                socket.setKeepAlive(request.isKeepAlive(), 2000);
                handlers.start(request, rootFolder, parser, socket);
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



