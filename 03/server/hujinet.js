var parser          = require('./../parser/hujiparser'),
    serverSettings  = require('./../settings/settings'),
    Request         = require('./../request/request'),
    Response        = require('./../response/response'),
    net             = require('net');

/**
 * The main function (class) which manages the supplied handlers set.
 * @param handler the first handler to be called once the request is parsed.
 * @param hujiEventEmitter an event emitter which helps to keep track of custom events.
 * @constructor
 */
var Hujinet = function (handler, hujiEventEmitter) {
    this.server = net.createServer(listenerFunc);
    this.handler = handler;
    this.isServerOpen = true;
    this.eventEmitter = hujiEventEmitter;

    var thisObj = this;

    this.server.on('error', function(e) {
        thisObj.eventEmitter.emit(serverSettings.hujiEvent[e.code], e);
    });

    /**
     * A function which runs right after the server is created. the function sets up different listeners
     * and parses the initial data received.
     * @param socket the socked returned from the net.createServer call.
     */
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
            thisObj.eventEmitter.emit(serverSettings.hujiEvent.socketError, e);
        });

        /**
         * The initial function which parses the request upon its arrival.
         * @param data the data received on the socked (the request).
         */
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
                thisObj.handler(request, response);
                request = null;
            } else if (request.status === request.requestStatus.errorParsing) {
                response = new Response(serverSettings.httpSupportedVersions['res.res'],
                    request.statusCode, false, request.method, socket);
                response.send(undefined);
                request = null;
            }
        }
    }
};

/**
 * A function which specified to the server which port to listen to.
 * @param lPort the port to listen to.
 */
Hujinet.prototype.listen = function (lPort) {
    this.server.listen(lPort);
};

/**
 * A function which closes the current server no new connections will be made and once all data is written,
 * the server will be terminated.
 */
Hujinet.prototype.close = function () {
    if (this.isServerOpen) {
        try {
            this.server.close();
            this.eventEmitter.emit(serverSettings.hujiEvent.serverClosed);
            this.isServerOpen = false;
        } catch (e) {
            console.log("an error occurred while trying to close the server. try again later.");
        }
    }
};
module.exports = Hujinet;