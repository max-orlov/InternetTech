var hujiNet         = require("./hujinet"),
    serverSettings  = require("./settings/settings");

var lPort,
    server;



//TODO:: In case the server could not start it should execute the callback with a custom err object that contains the error reason.
//TODO:: Add serverID.
exports.start = function (port, rootFolder, callback) {
    lPort = port;
    server = hujiNet.getSocket(lPort, serverSettings.HOST_ADDRESS, rootFolder);
    console.log("Server is up and running");
};

//TODO:: Execute the callback once the server is down.
exports.stop = function (serverID, callback) {
    server.close();
    console.log("Stopping server");
};

