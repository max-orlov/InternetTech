/**
 * Created by Maxim on 15/12/2014.
 */
var parser = require('./hujiparser');
var net = require('net'), listening_port, host_adress, text_content;
var isServerUp = false, wasRequestMade = false;

exports.getSocket = function(lPort, hAdress){
    listening_port = lPort;
    host_adress = hAdress;
    var server = net.createServer(function (socket) {
        socket.setEncoding('utf8');
        socket.on('data', function(dat){
            text_content = parser.parse(dat);
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
            return text_content;
        else
            console.log("No request has been made");
    else
        console.log("No server is up");
}
exports.writeToSocket = function(){

}

exports.readFromSocket = function(){

}