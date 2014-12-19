/**
 * Created by Maxim on 15/12/2014.
 */
var parser = require('./hujiparser');
var net = require('net');
var handlers = require('./requestHandlers');
var listening_port, host_address;
var isServerUp = false, wasRequestMade = false;
var HttpResponseObject = function(){
    this.type = {};
    this.headers = {};
    this.headers.Date = "";
    this.headers['Content-Type'] = "";
    this.headers['Content-Length'] = "";
    this.body = "";
    this.bodyEncoding = "";
};

var HttpRequestObject = function(){
    this.type = {};
    this.headers = {};
    this.body = "";
};


exports.getSocket = function(lPort, hAddress, rootFolder){
    listening_port = lPort;
    host_address = hAddress;
    var server = net.createServer(function (socket) {
        socket.setEncoding('utf8');

        socket.on('data', function(dat){
            var httpRequestObject = parser.parse(dat, HttpRequestObject);

            handlers.start(httpRequestObject, HttpResponseObject, rootFolder, parser, socket);
        });
    });

    server.listen(listening_port, host_address);
    isServerUp = true;
    return server;
};

