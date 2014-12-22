var hujiNet         = require("./hujinet"),
    serverSettings  = require("./settings/settings"),
    debug           = require('./debugging/debug');

var runningServerID = 0;

ServerShell = function(serverID, server, port, rootFolder, callbackFunction){
    this.serverID = serverID;
    this.server = server;
    this.port= port;
    this.rootFolder= rootFolder;
    this.callbackFunc= callbackFunction;
};

var serverList = [];

//TODO:: In case the server could not start it should execute the callback with a custom err object that contains the error reason.
exports.start = function (port, rootFolder, callback) {
    var server = hujiNet.getSocket(port, serverSettings.HOST_ADDRESS, rootFolder, callback);

    serverList.push(new ServerShell(runningServerID++, server, port, rootFolder, callback));
    debug.devlog("Server is up and running", debug.MESSAGE_LEVEL.clean);
    return serverList[serverList.length - 1].serverID;

};

exports.stop = function (serverID, callback) {
    debug.devlog("Stopping server", debug.MESSAGE_LEVEL.clean);
    for (var i = 0 ; i < serverList.length ; i++){
        if (serverList[i].serverID == serverID){
            var tmpServer = serverList[i];
            serverList.splice(i,1);
            tmpServer.server.close(callback);
            break;
        }
    }
};

exports.getServers = function(){
    return serverList;
};