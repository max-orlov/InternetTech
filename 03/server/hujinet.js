var parser = require('./../parser/hujiparser'),
    serverSettings  = require('./../settings/settings'),
    Request = require('./../request/request'),
    Response = require('./../response/response'),
    net = require('net'),
    util = require('util'),
    eventEmitter = require('events').EventEmitter;

var Hujinet = function (handler, callback) {
    this.server = net.createServer(listenerFunc);
    this.handler = handler;
    this.isServerOpen = true;
    var thisObj = this;

    this.server.on('error', function(e) {
       callback(e);
    });

    this.on('request', this.handler);

    function listenerFunc(socket) {
        var request = null;
        socket.setTimeout(serverSettings.maxTimeout);
        socket.setEncoding(serverSettings.encoding);

        socket.on('data', function (data) {
            parseData(data);
        });

        socket.on('timeout', function() {
            socket.end();
        });

        socket.on('error', function (e) {

        });

        function parseData(data) {
            if (!request) {
                request = new Request();
            }
            if (request.status !== request.requestStatus.errorParsing ||
                request.status !== request.requestStatus.done) {

                parser.parse(data, request);
            }
            if(request.status === request.requestStatus.done) {
                var keepAlive = request.isKeepAlive();
                var response = new Response(request.httpVersion, 200, keepAlive, request.method ,socket);
                thisObj.emit('request', request, response);
                request = null;

            } else if (request.status === request.requestStatus.errorParsing) {
                response = new Response(serverSettings.httpSupportedVersions['1.1'],
                    request.statusCode, false, request.method, socket);
                response.send();
                request = null;
            }
        }
    }
    eventEmitter.call(this);
};

util.inherits(Hujinet, eventEmitter);

Hujinet.prototype.listen = function (lPort) {
    this.server.listen(lPort);
};

Hujinet.prototype.close = function () {
    if (this.isServerOpen) {
        try {
            this.server.close();
            this.isServerOpen = false;
        } catch (e) {
            console.log("an error occurred while trying to close the server. try again later.");
        }
    }
};


module.exports = Hujinet;
