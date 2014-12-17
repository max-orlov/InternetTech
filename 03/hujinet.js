/**
 * Created by Maxim on 15/12/2014.
 */
var parser = require('./hujiparser');
var net = require('net');
var handlers = require('./requestHandlers');
var listening_port, host_adress, httpRequestObject;
var isServerUp = false, wasRequestMade = false;

exports.getSocket = function(lPort, hAdress, rootFolder){
    listening_port = lPort;
    host_adress = hAdress;
    var server = net.createServer(function (socket) {
        socket.setEncoding('utf8');

        socket.on('data', function(dat){
            var date = new Date();
            httpRequestObject = parser.parse(dat);
            console.log("Data was received on " + date.getHours() +":"+date.getMinutes()+":"+date.getSeconds()+":"+date.getMilliseconds());
            //console.log(httpRequestObject)

            handlers.start(httpRequestObject, rootFolder, parser, socket);
            wasRequestMade = true;
        });
    });

    server.listen(listening_port, host_adress);
    isServerUp = true;
    return server;
}

exports.getRequestContent = function() {
    if (isServerUp == true)
        if (wasRequestMade == true)
            return httpRequestObject;
        else
            console.log("No request has been made");
    else
        console.log("No server is up");
};

exports.writeToSocket = function(){

}

exports.readFromSocket = function(){

}