var hujiNet         = require("./hujinet");
    hujiParser      = require("./hujiparser");
    serverSettings  = require("./settings");

var lPort, server;


exports.start = function (port, rootFolder, callback) {
    lPort = port;
    server = hujiNet.getSocket(lPort, serverSettings.HOST_ADDRESS, rootFolder);
    console.log("Server is up and listening");

};

exports.stop = function (serverID, callback) {
    console.log("Stopping server");
};

